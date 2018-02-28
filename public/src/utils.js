import * as moment from 'moment'

export const datepickerFormat = 'd MMMM yyyy'

export function formatDate(date) {
  if (!date || typeof date === 'string') return date

  return moment(date).format()
}

export function formatDateStrict(date) {
  if (!date) return date

  return moment(date).format('YYYY-MM-DD')
}

export function editEntity(list, entity) {
  let found = list.find(item => item.id === entity.id)

  Object.assign(found, entity)
}

export function removeEntity(list, entity) {
  let index = list.findIndex(item => item.id === entity.id)

  list.splice(index)
}
