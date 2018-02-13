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

module.exports = {
  getList
}
