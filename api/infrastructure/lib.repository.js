const elasticsearch = require('elasticsearch')
const config = require('config')

const client = elasticsearch.Client({
  host: config.get('elastic.host')
})

const index = config.get('elastic.libIndex')
const type = config.get('elastic.libType')

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

module.exports = {
  getOrganizationStatuses,
  getNaprStatuses,
  getOrganizationTypes,
  getLegalForms,
  getCommandTypes,
  getBusinessStatuses
}
