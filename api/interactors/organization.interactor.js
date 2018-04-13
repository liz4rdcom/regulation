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

  organization.createDate = new Date()

  return await organizationRepository.addOrganization(organization)
}

async function editOrganization(id, organizationObject) {
  if (!organizationObject.id) organizationObject.id = id

  domainUtils.generateIdsForOrganizationFields(organizationObject)

  let organization = factory.createValidOrganization(organizationObject)

  organization.updateDate = new Date()

  await organizationRepository.editOrganization(organization)
}

async function fullTextSearch(queryString = '') {
  return await organizationRepository.fullTextSearch(queryString)
}

async function advancedSearch(queryObject = {}) {
  let query = Object.keys(queryObject)
    .filter(key => !!queryObject[key])
    .reduce((acc, key) => {
      acc[key] = queryObject[key]

      return acc
    }, {})

  if (Object.keys(query) === 0) return await getList()

  return await organizationRepository.advancedSearch(query)
}

async function deleteOrganization(id) {
  await organizationRepository.deleteOrganizationById(id)
}

module.exports = {
  getList,
  getById,
  registerOrganization,
  generateUniqueId,
  editOrganization,
  fullTextSearch,
  advancedSearch,
  deleteOrganization
}
