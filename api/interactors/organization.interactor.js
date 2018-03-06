const shortid = require('shortid')
const organizationRepository = require('../infrastructure/organization.repository')
const factory = require('../domain/factory')
const domainUtils = require('../domain/domain.utils')

async function getList() {
  return await organizationRepository.getList()
}

async function getById(id) {
  return await organizationRepository.getById(id)
}

function generateUniqueId() {
  return shortid.generate()
}

async function registerOrganization(organizationObject) {
  domainUtils.generateIdsForOrganizationFields(organizationObject)

  let organization = factory.createValidOrganization(organizationObject)

  return await organizationRepository.addOrganization(organization)
}

async function editOrganization(id, organizationObject) {
  if (!organizationObject.id) organizationObject.id = id

  domainUtils.generateIdsForOrganizationFields(organizationObject)

  let organization = factory.createValidOrganization(organizationObject)

  await organizationRepository.editOrganization(organization)
}

async function fullTextSearch(queryString = '') {
  return await organizationRepository.fullTextSearch(queryString)
}

async function advancedSearch(query) {
  if (!query) return await getList()

  return await organizationRepository.advancedSearch(query)
}

module.exports = {
  getList,
  getById,
  registerOrganization,
  generateUniqueId,
  editOrganization,
  fullTextSearch,
  advancedSearch
}
