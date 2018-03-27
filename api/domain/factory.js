const Organization = require('./organization')
const _ = require('lodash')

function createValidOrganization(organizationObject) {
  let mainInfo = _.pick(organizationObject, [
    'id',
    'taxCode',
    'georgianName',
    'latinName',
    'phone',
    'naprOfficePhone',
    'email',
    'statusId',
    'status',
    'statusGeoName',
    'naprStatus',
    'managementRegistrationNumber',
    'treasuryRegistrationNumber',
    'treasuryRegistrationDate',
    'treasuryRegistrationPlace',
    'juridicalAddress',
    'factualAddress',
    'organizationType',
    'legalForm',
    'bedStock',
    'clinicalManagers',
    'managers',
    'founders',
    'createDate',
    'updateDate'
  ])

  let organization = new Organization(mainInfo)

  organizationObject.regulations.forEach((regulation) => {
    organization.addRegulation(regulation)
  })

  organizationObject.businesses.forEach((business) => {
    organization.addBusiness(business)
  })

  organizationObject.branches.forEach((branch) => {
    organization.addBranch(branch)
  })

  return organization
}

module.exports = {
  createValidOrganization
}
