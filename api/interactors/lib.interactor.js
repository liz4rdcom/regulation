const libRepository = require('../infrastructure/lib.repository')

async function getLocationsToShow() {
  let locationsTree = await libRepository.getLocationsTree()

  let result = locationsTree.map(regionToShow)

  return result
}

function regionToShow(region) {
  let unitsToShow = region.units.map(districtToShow)

  return {
    locationName: region.locationName,
    units: unitsToShow
  }
}

function districtToShow(district) {
  let settlements = district.settlements || []

  settlements.push(district.locationUnitName) // to select district itself

  return {
    locationUnitName: district.locationUnitName,
    settlements: settlements
  }
}

module.exports = {
  getLocationsToShow
}
