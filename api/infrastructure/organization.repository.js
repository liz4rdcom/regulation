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

async function editOrganization(organization) {
  const options = {
    index,
    type,
    body: organization,
    id: organization.id
  }

  await client.index(options)
}

async function fullTextSearch(queryString) {
  const options = {
    index,
    type,
    q: '*' + queryString + '*'
  }

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

async function advancedSearch(query) {
  let fieldMap = new Map([
    ['regulationType', 'regulations.type'],
    ['businessType', 'businesses.businessType'],
    ['businessWithInvasiveAnesthesia', 'businesses.additionalBusinessInformation'],
    ['commandType', 'regulations.commandType'],
    ['region', 'factualAddress.region'],
    ['district', 'factualAddress.district'],
    ['settlement', 'factualAddress.settlement']
  ])

  let boolQuery = Object.keys(query)
    .reduce((acc, key) => {
      let body = {}

      if (fieldMap.has(key)) {
        body[fieldMap.get(key)] = query[key]
      } else {
        body[key] = query[key]
      }

      acc.push(body)

      return acc
    }, [])
    .map(item => ({match: item}))

  let options = {
    index,
    type,
    body: {
      query: {
        bool: {
          must: boolQuery
        }
      }
    }
  }

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

module.exports = {
  getList,
  getById,
  addOrganization,
  editOrganization,
  fullTextSearch,
  advancedSearch
}
