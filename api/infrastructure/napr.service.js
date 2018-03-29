const config = require('config')
const RecordError = require('../exceptions/record.error')
const rp = require('request-promise')
const moment = require('moment')

async function callNaprByTaxCode(taxCode) {
  let url = config.get('napr.address') + '/legalEntities/' + taxCode

  const options = {
    uri: url,
    method: 'GET',
    json: true
  }

  let entityInfo = await rp(options)

  let result = {}

  result.naprStatus = entityInfo.Status
  // result.managementRegistrationNumber = entityInfo.RegistrationMunicipalityID
  result.taxCode = entityInfo.IdNumber
  // result.treasuryRegistrationNumber = entityInfo.TaxAuthorityCode
  result.treasuryRegistrationDate = entityInfo.GovRegDate ? moment(entityInfo.GovRegDate, 'YYYY-MM-DDZZ').toDate() : null
  result.treasuryRegistrationPlace = entityInfo.RegistrationMunicipality
  result.georgianName = entityInfo.Name
  result.legalForm = entityInfo.LegalForm

  if (entityInfo.Contacts) {
    let phoneContact = entityInfo.Contacts.find(item => item.ContactTypeId == 1)

    if (phoneContact) {
      result.naprOfficePhone = phoneContact.ContactValue
    }

    let emailContact = entityInfo.Contacts.find(item => item.ContactTypeId == 5)

    if (emailContact) {
      result.email = emailContact.ContactValue
    }
  }

  if (entityInfo.Address) {
    result.juridicalAddress = {
      addressDescription: entityInfo.Address
    }
  }

  return result
}

module.exports = {
  callNaprByTaxCode
}
