const organizationRepository = require('../infrastructure/organization.repository');

async function getList() {
  return await organizationRepository.getList()
}

module.exports = {
  getList
}
