const router = require('express').Router()

const baseUrl = '/api/libs'

const libRepository = require('../infrastructure/lib.repository')

router.get('/statuses', async (req, res, next) => {
  try {
    let result = libRepository.getOrganizationStatuses()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/naprStatuses', async (req, res, next) => {
  try {
    let result = libRepository.getNaprStatuses()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/organizationTypes', async (req, res, next) => {
  try {
    let result = libRepository.getOrganizationTypes()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/legalForms', async (req, res, next) => {
  try {
    let result = libRepository.getLegalForms()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/commandTypes', async (req, res, next) => {
  try {
    let result = libRepository.getCommandTypes()

    next({result})
  } catch (error) {
    next({error})
  }
})

router.get('/businessStatuses', async (req, res, next) => {
  try {
    let result = libRepository.getBusinessStatuses()

    next({result})
  } catch (error) {
    next({error})
  }
})

module.exports = {
  baseUrl,
  router
}
