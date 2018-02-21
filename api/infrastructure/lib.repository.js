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

  let result = client.search(options)

  return result.hits.hits[0]._source
}

async function getOrganizationStatuses() {
  return await getLibDocument().statuses
}

async function getNaprStatuses() {
  return await getLibDocument().naprStatuses
}

async function getOrganizationTypes() {
  return await getLibDocument().organizationTypes
}

async function getLegalForms() {
  return await getLibDocument().legalForms
}

async function getCommandTypes() {
  return await getLibDocument().commandTypes
}

async function getBusinessStatuses() {
  return await getLibDocument().businessStatuses
}

module.exports = {
  getOrganizationStatuses,
  getNaprStatuses,
  getOrganizationTypes,
  getLegalForms,
  getCommandTypes,
  getBusinessStatuses
}
