const config = require('config')
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

  let phoneContact = entityInfo.Contacts.find(item => item.ContactTypeId == 1)

  if (phoneContact) {
    result.naprOfficePhone = phoneContact.ContactValue
  }

  let emailContact = entityInfo.Contacts.find(item => item.ContactTypeId == 5)

  if (emailContact) {
    result.email = emailContact.ContactValue
  }

  if (entityInfo.Address) {
    result.juridicalAddress = {
      addressDescription: entityInfo.Address
    }
  }

  result.managers = entityInfo.DirectorAndRepresentorList.map(item => {
    return {
      personalId: item.PersonalNumber,
      firstName: item.FirstName,
      lastName: item.LastName,
      position: item.PersonType
    }
  })

  result.accounts = entityInfo.AccountList.map(item => {
    let account = {
      accountNumber: item.AccountNumber,
      share: item.ShareQty
    }

    account.owners = item.Owners.map(owner => {
      let result = {
        ownerType: owner.EntityType
      }

      // ფიზიკური პირი
      if (owner.EntityTypeId == 1) {
        result.personalId = owner.PersonalNumber
        result.firstName = owner.FirstName
        result.lastName = owner.LastName
      } else {
        result.taxCode = owner.IdNumber
        result.ownerCompanyName = owner.Name
        result.legalForm = owner.LegalForm
      }

      return result
    })

    return account
  })

  return result
}

module.exports = {
  callNaprByTaxCode
}
