const elasticsearch = require('elasticsearch')
const config = require('config')

const client = elasticsearch.Client({
  host: config.get('elastic.host')
})

const utils = require('./utils')

const index = config.get('elastic.organizationIndex')
const type = config.get('elastic.organizationType')

async function getList() {
  const options = {
    index,
    type
  }

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

async function getById(id) {
  const options = {
    index,
    type,
    id: id
  }

  let result = await client.get(options)

  return utils.toObject(result)
}

async function addOrganization(organization) {
  const options = {
    index,
    type,
    body: organization
  }

  let result = await client.index(options)

  return result._id
}

module.exports = {
  getList,
  getById,
  addOrganization
}
