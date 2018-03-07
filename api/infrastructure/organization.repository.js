const elasticsearch = require('elasticsearch')
const config = require('config')
const _ = require('lodash')

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
    ['commandType', 'regulations.commandType'],
    ['region', 'factualAddress.region'],
    ['district', 'factualAddress.district'],
    ['settlement', 'factualAddress.settlement']
  ])

  let businessFields = ['businessType', 'businessWithInvasiveAnesthesia', 'businessStartDate', 'businessEndDate']

  let boolQuery = Object.keys(_.omit(query, businessFields))
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

  let businessPart = businessAdvancedSearchQueryPart(query)

  if (businessPart) {
    boolQuery.push(businessPart)
  }

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

  console.dir(options, {depth: null})

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

function businessAdvancedSearchQueryPart(query) {
  if (!query.businessType) return null

  let mustPart = []

  if (query.businessType) {
    mustPart.push({
      match: {
        'businesses.businessType': query.businessType
      }
    })
  }

  if (query.businessWithInvasiveAnesthesia) {
    mustPart.push({
      match: {
        'businesses.additionalBusinessInformation': query.businessWithInvasiveAnesthesia
      }
    })
  }

  if (!query.businessStartDate || !query.businessEndDate) {
    return {
      nested: {
        path: 'businesses',
        query: {
          bool: {
            must: mustPart
          }
        }
      }
    }
  }

  let issueDatePart = {
    range: {
      'businesses.issueDate': {
        'lte': query.businessEndDate
      }
    }
  }

  let cancelDatePart = {
    range: {
      'businesses.cancelDate': {
        'gte': query.businessStartDate
      }
    }
  }

  let cancelDateNullPart = {
    nested: {
      path: 'businesses',
      query: {
        exists: {
          field: 'businesses.cancelDate'
        }
      }
    }
  }

  let shouldPart = [
    {
      bool: {
        must: [
          issueDatePart,
          cancelDatePart
        ].concat(mustPart)
      }
    },
    {
      bool: {
        must: [
          issueDatePart
        ].concat(mustPart),
        'must_not': cancelDateNullPart
      }
    }
  ]

  return {
    nested: {
      path: 'businesses',
      query: {
        bool: {
          should: shouldPart
        }
      }
    }
  }
}

module.exports = {
  getList,
  getById,
  addOrganization,
  editOrganization,
  fullTextSearch,
  advancedSearch
}
