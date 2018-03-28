const config = require('config')
const RecordError = require('../exceptions/record.error')
const rp = require('request-promise')

async function callNaprByTaxCode(taxCode) {
  let url = config.get('napr.address') + '/legalEntities/' + taxCode

  const options = {
    uri: url,
    method: 'GET',
    json: true
  }

  let entityInfo = await rp(options)

  return entityInfo
}

module.exports = {
  callNaprByTaxCode
}
