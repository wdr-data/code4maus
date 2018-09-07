const AWS = require('aws-sdk');

const getHostedZoneForDomain = (domain) => {
    const route53 = new AWS.Route53({
        region: 'eu-central-1',
    });
    const splittedDomain = domain.split('.');
    let foundId = null;
    return route53.listHostedZones({}).promise()
        .then((data) => {
            return splittedDomain.every((part, i) => {
                const domain = splittedDomain.slice(i).join('.') + '.';
                const result = data.HostedZones.find((zone) => zone.Name === domain);
                if (result === undefined) {
                    return true;
                }
                foundId = result.Id;
                return false; // break
            });
        })
        .then((notFound) => !notFound ? foundId : null);
};

const getCertArnForDomain = (domain) => {
    const acm = new AWS.ACM({
        region: 'us-east-1',
    });
    const wildCardDomain = '*.' + domain.split('.').slice(1).join('.');
    return acm.listCertificates({}).promise()
        .then((data) => data.CertificateSummaryList
            .find((cert) => cert.DomainName === domain || cert.DomainName === wildCardDomain)
        )
        .then((cert) => cert && cert.CertificateArn);
};

const stage = () => process.env.SLS_STAGE || 'dev';

const baseDomain = () => stage() === 'prod'
    ? 'programmieren.wdrmaus.de'
    : `${stage()}.code4maus.wt.wdr.cloud`;

const hostedZone = () => {
    const domain = baseDomain();
    return getHostedZoneForDomain(domain)
        .then((zone) => {
            if (zone === null) {
                return Promise.reject(new Error(`Zone for domain "${domain}" not found.`));
            }
            return zone;
        });
};

const certArn = () => {
    const domain = baseDomain();
    return getCertArnForDomain(domain)
        .then((cert) => {
            if (!cert) {
                return Promise.reject(new Error(`Cert for domain "${domain}" not found.`));
            }
            return cert;
        });
};

module.exports = {
    baseDomain,
    certArn,
    hostedZone,
    stage,
};
