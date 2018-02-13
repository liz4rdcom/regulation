const router = require('express').Router()

const organizationInteractor = require('../interactors/organization.interactor')

const baseUrl = '/api/organizations'

router.get('/', async (req, res, next) => {
  try {
    let result = await organizationInteractor.getList(req.query)

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

module.exports = {
  router,
  baseUrl
}
