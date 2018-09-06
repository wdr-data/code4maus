const stage = () => process.env.SLS_STAGE || 'dev';

const baseDomain = () => stage() === 'prod'
    ? 'programmieren.wdrmaus.de'
    : `${stage()}.code4maus.wt.wdr.cloud`;

module.exports = {
    baseDomain,
    stage,
};
