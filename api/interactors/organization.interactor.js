const organizationRepository = require('../infrastructure/organization.repository')

async function getList() {
  return await organizationRepository.getList()
}

async function getById(id) {
  return await organizationRepository.getById(id)
}

module.exports = {
  getList,
  getById
}
