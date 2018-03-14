const soap = require('soap')
const config = require('config')
const RecordError = require('../exceptions/record.error')

async function callNaprByTaxCode(taxCode) {
  let client = await soap.createClientAsync(config.get('napr.soapAddress'), {forceSoap12Headers: true})

  const args = {
    ObjectId: taxCode
  }

  let result = await client.GetLegalEntityAsync(args)

  console.log(result)

  let entityInfo = result['GetLegalEntityResult']

  if (!entityInfo) {
    throw new RecordError('ორგანიზაცია მითითებული საიდენტიფიკაციო კოდით არ მოიძებნა')
  }

  return entityInfo
}

module.exports = {
  callNaprByTaxCode
}
