import axios from 'axios'

async function fetchStatuses () {
  if (this.statuses) return this.statuses

  let response = await axios.get('/api/libs/statuses')
  this.statuses = response.data

  return this.statuses
}

async function fetchNaprStatuses () {
  if (this.naprStatuses) return this.naprStatuses

  let response = await axios.get('/api/libs/naprStatuses')
  this.naprStatuses = response.data

  return this.naprStatuses
}

async function fetchOrganizationTypes () {
  if (this.organizationTypes) return this.organizationTypes

  let response = await axios.get('/api/libs/organizationTypes')
  this.organizationTypes = response.data

  return this.organizationTypes
}

async function fetchLegalForms () {
  if (this.legalForms) return this.legalForms

  let response = await axios.get('/api/libs/legalForms')
  this.legalForms = response.data

  return this.legalForms
}

async function fetchCommandTypes () {
  if (this.commandTypes) return this.commandTypes

  let response = await axios.get('/api/libs/commandTypes')
  this.commandTypes = response.data

  return this.commandTypes
}

async function fetchBusinessStatuses () {
  if (this.businessStatuses) return this.businessStatuses

  let response = await axios.get('/api/libs/businessStatuses')
  this.businessStatuses = response.data

  return this.businessStatuses
}

async function fetchLocations() {
  if (this.locations) return this.locations

  let response = await axios.get('/api/libs/locations')
  this.locations = response.data

  return this.locations
}

async function fetchRegulationTypes() {
  if (this.regulationTypes) return this.regulationTypes

  let response = await axios.get('/api/libs/regulationTypes')
  this.regulationTypes = response.data

  return this.regulationTypes
}

export default {
  statuses: null,
  naprStatuses: null,
  organizationTypes: null,
  legalForms: null,
  commandTypes: null,
  businessStatuses: null,
  locations: null,
  regulationTypes: null,
  fetchStatuses,
  fetchNaprStatuses,
  fetchOrganizationTypes,
  fetchLegalForms,
  fetchCommandTypes,
  fetchBusinessStatuses,
  fetchLocations,
  fetchRegulationTypes
}
