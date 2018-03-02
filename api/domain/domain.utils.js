const shortid = require('shortid')

function generateIdsForOrganizationFields(organizationObject) {
  organizationObject.regulations.forEach(setId)

  organizationObject.businesses.forEach(setId)

  organizationObject.branches.forEach(setId)
}

function setId(record) {
  if (!record.id) record.id = shortid.generate()
}

module.exports = {
  generateIdsForOrganizationFields
}
