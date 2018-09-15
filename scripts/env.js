const AWS = require('aws-sdk');
const { timeout, TimeoutError } = require('promise-timeout');

const getHostedZoneForDomain = (domain) => {
    const route53 = new AWS.Route53({
        region: 'eu-central-1',
    });
    const splittedDomain = domain.split('.');
    let foundId = null;
    return timeout(route53.listHostedZones({}).promise(), 5000)
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
    return timeout(acm.listCertificates({}).promise(), 5000)
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
        })
        .catch((error) => {
            console.warn('WARNING: Request for HostedZone failed!', error.message);
            return Promise.resolve('');
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
        })
        .catch((error) => {
            console.warn('WARNING: Request for Certificate failed!', error.message);
            return Promise.resolve('');
        });
};

module.exports = {
    baseDomain,
    certArn,
    hostedZone,
    stage,
};
