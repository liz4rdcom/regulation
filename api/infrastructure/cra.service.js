const soap = require('soap')
const config = require('config')
const RecordError = require('../exceptions/record.error')
const genders = ['', 'მამრობითი', 'მდედრობითი']

async function callCraService(personalId) {
  let client = await soap.createClientAsync(config.get('cra.soapAddress'))

  const args = {
    piradiNomeri: personalId,
    timeOut: config.get('cra.timeout'),
    monacemebisCkaro: 'Cra',
    phototi: 'true',
    userName: config.get('cra.userName')
  }

  let result = await client.GetPersonInfoDataUsingPrivateNumber_V01Async(args)

  let information =
    result['GetPersonInfoDataUsingPrivateNumber_V01Result']['PersonInformacia']

  if (!information) {
    throw new RecordError('ადამიანი მითითებული პირადი ნომრით არ მოიძებნა')
  }

  return {
    personalId: information.PrivateNumber,
    firstname: information.FirstName,
    lastname: information.LastName,
    gender: genders[information.Gender],
    birthdate: information.BirthDate,
    photo: information.Photos.base64Binary[0]
  }
}

module.exports = {
  callCraService
}
