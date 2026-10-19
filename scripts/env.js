const stageDomains = require('../cdk/lib/stage-domains.json')

// Deploy workflows set STAGE; local and preview builds fall back to dev.
const stage = () => process.env.STAGE || 'dev'

const baseDomain = () => {
  const domain = stageDomains[stage()]
  if (!domain) {
    throw new Error(
      `Unknown stage: ${stage()}. Expected one of: ${Object.keys(
        stageDomains
      ).join(', ')}.`
    )
  }
  return domain
}

module.exports = {
  baseDomain,
}
