const elasticsearch = require('elasticsearch')
const config = require('config')
const _ = require('lodash')

const libRepository = require('./lib.repository')

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
    body: {
      query: {
        bool: {
          should: [
            {
              'query_string': {
                query: '*' + queryString + '*'
              }
            },
            {
              nested: {
                path: 'businesses',
                query: {
                  'query_string': {
                    query: '*' + queryString + '*'
                  }
                }
              }
            }
          ]
        }
      }
    }
  }

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

async function advancedSearch(query) {
  let fieldMap = new Map([
    ['regulationType', 'regulations.type.keyword'],
    ['commandType', 'regulations.commandType.keyword'],
    ['region', 'factualAddress.region.keyword'],
    ['district', 'factualAddress.district.keyword'],
    ['settlement', 'factualAddress.settlement.keyword'],
    ['statusGeoName', 'statusGeoName.keyword'],
    ['naprStatus', 'naprStatus.keyword'],
    ['organizationType', 'organizationType.keyword'],
    ['legalForm', 'legalForm.keyword']
  ])

  let businessFields = [
    'businessType',
    'businessWithInvasiveAnesthesia',
    'businessStartDate',
    'businessEndDate',
    'businessAssignStartDate',
    'businessAssignEndDate'
  ]

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

  let businessesWithInvasiveAnesthesia = await libRepository.getBusinessesWithInvasiveAnesthesia()

  let businessPart = businessAdvancedSearchQueryPart(query, businessesWithInvasiveAnesthesia)

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

  let result = await client.search(options)

  return result.hits.hits.map(utils.toObject)
}

function businessAdvancedSearchQueryPart(query, businessesWithInvasiveAnesthesia) {
  if (!query.businessType) return null

  let mustPart = []
  let mustNotPart = []

  mustPart.push({
    match: {
      'businesses.businessType.keyword': query.businessType
    }
  })

  if (query.businessWithInvasiveAnesthesia) {
    if (query.businessWithInvasiveAnesthesia !== 'სხვა') {
      mustPart.push({
        match: {
          'businesses.additionalBusinessInformation.keyword': query.businessWithInvasiveAnesthesia
        }
      })
    } else {
      mustNotPart.push({
        terms: {
          'businesses.additionalBusinessInformation.keyword': businessesWithInvasiveAnesthesia
        }
      })
    }
  }

  if (query.businessAssignStartDate && query.businessAssignEndDate) {
    let assignPart = {
      range: {
        'businesses.issueDate': {
          'gte': query.businessAssignStartDate,
          'lte': query.businessAssignEndDate
        }
      }
    }

    mustPart.push(assignPart)
  }

  if (!(query.businessStartDate && query.businessEndDate)) {
    return {
      nested: {
        path: 'businesses',
        query: {
          bool: {
            must: mustPart,
            'must_not': mustNotPart
          }
        }
      }
    }
  }

  let issueDatePart = {
    range: {
      'businesses.issueDate': {
        'lte': query.businessStartDate
      }
    }
  }

  let cancelDatePart = {
    range: {
      'businesses.cancelDate': {
        'gte': query.businessEndDate
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
        ].concat(mustPart),
        'must_not': mustNotPart
      }
    },
    {
      bool: {
        must: [
          issueDatePart
        ].concat(mustPart),
        'must_not': [cancelDateNullPart].concat(mustNotPart)
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
