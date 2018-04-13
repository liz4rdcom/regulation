const router = require('express').Router()

const organizationInteractor = require('../interactors/organization.interactor')
const naprService = require('../infrastructure/napr.service')

const baseUrl = '/api/organizations'

router.get('/', async (req, res, next) => {
  try {
    let result = await organizationInteractor.getList(req.query)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/uniqueId', async (req, res, next) => {
  try {
    let result = organizationInteractor.generateUniqueId()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/search', async (req, res, next) => {
  try {
    let result = await organizationInteractor.fullTextSearch(req.query.query)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/advancedSearch', async (req, res, next) => {
  try {
    let result = await organizationInteractor.advancedSearch(req.query)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/syncOrganization/:taxCode', async (req, res, next) => {
  try {
    let result = await naprService.callNaprByTaxCode(req.params.taxCode)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let result = await organizationInteractor.getById(req.params.id)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.post('/', async (req, res, next) => {
  try {
    let result = await organizationInteractor.registerOrganization(req.body)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    let result = await organizationInteractor.editOrganization(req.params.id, req.body)

    next({result})
  } catch (error) {
    next({error})
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await organizationInteractor.deleteOrganization(req.params.id)

    next({})
  } catch (error) {
    next({error})
  }
})

module.exports = {
  router,
  baseUrl
}
