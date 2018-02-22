const elasticsearch = require('elasticsearch')
const config = require('config')

const client = elasticsearch.Client({
  host: config.get('elastic.host')
})

const index = config.get('elastic.libIndex')
const type = config.get('elastic.libType')
const locationIndex = config.get('elastic.locationIndex')
const locationType = config.get('elastic.locationType')

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

module.exports = {
  getOrganizationStatuses,
  getNaprStatuses,
  getOrganizationTypes,
  getLegalForms,
  getCommandTypes,
  getBusinessStatuses,
  getLocationsTree
}
