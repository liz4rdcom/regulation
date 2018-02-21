const organizationRepository = require('../infrastructure/organization.repository')
const factory = require('../domain/factory')
const domainUtils = require('../domain/domain.utils')

async function getList() {
  return await organizationRepository.getList()
}

async function getById(id) {
  return await organizationRepository.getById(id)
}

async function registerOrganization(organizationObject) {
  domainUtils.generateIdsForOrganizationFields(organizationObject)

  let organization = factory.createValidOrganization(organizationObject)

  return await organizationRepository.addOrganization(organization)
}

module.exports = {
  getList,
  getById,
  registerOrganization
}
