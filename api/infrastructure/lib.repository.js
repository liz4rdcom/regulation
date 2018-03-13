const elasticsearch = require('elasticsearch')
const config = require('config')

const client = elasticsearch.Client({
  host: config.get('elastic.host')
})

const utils = require('./utils')

const index = config.get('elastic.libIndex')
const type = config.get('elastic.libType')
const locationIndex = config.get('elastic.locationIndex')
const locationType = config.get('elastic.locationType')
const regulationTypesIndex = config.get('elastic.regulationTypesIndex')
const regulationTypesType = config.get('elastic.regulationTypesType')

const messageType = 'შეტყობინება'

async function getLibDocument() {
  const options = {
    index,
    type
  }

  let result = await client.search(options)

  return result.hits.hits[0]._source
}

async function getOrganizationStatuses() {
  let result = await getLibDocument()
  return result.statuses
}

async function getNaprStatuses() {
  let result = await getLibDocument()
  return result.naprStatuses
}

async function getOrganizationTypes() {
  let result = await getLibDocument()
  return result.organizationTypes
}

async function getLegalForms() {
  let result = await getLibDocument()
  return result.legalForms
}

async function getCommandTypes() {
  let result = await getLibDocument()
  return result.commandTypes
}

async function getBusinessStatuses() {
  let result = await getLibDocument()
  return result.businessStatuses
}

async function getLocationsTree() {
  const options = {
    index: locationIndex,
    type: locationType
  }

  let result = await client.search(options)

  return result.hits.hits[0]._source.locationsInGeorgia
}

async function getRegulationTypes() {
  const options = {
    index: regulationTypesIndex,
    type: regulationTypesType
  }

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

async function getBusinessesWithInvasiveAnesthesia() {
  let regulationTypes = await getRegulationTypes()

  let type = regulationTypes.find(item => item.regulationType === messageType)

  let businessType = type.businessTypes.find(item => !!item.businessesWithInvasiveAnesthesia)

  return businessType.businessesWithInvasiveAnesthesia
}

module.exports = {
  getOrganizationStatuses,
  getNaprStatuses,
  getOrganizationTypes,
  getLegalForms,
  getCommandTypes,
  getBusinessStatuses,
  getLocationsTree,
  getRegulationTypes,
  getBusinessesWithInvasiveAnesthesia
}
