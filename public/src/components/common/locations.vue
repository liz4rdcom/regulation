<template>
<div>
  <b-form-group label="რეგიონი">
    <b-form-select :value="selectedLocationName" :options="locations" value-field="locationName"
      text-field="locationName" @change="locationChanged" class="mb-3 col-md-5">
    </b-form-select>
  </b-form-group>
  <b-form-group label="მუნიციპალიტეტი">
    <b-form-select :value="selectedLocationUnitName" :options="selectedLocation.units"
      value-field="locationUnitName" text-field="locationUnitName" @change="locationUnitChanged"
      class="mb-3 col-md-5">
    </b-form-select>
  </b-form-group>
  <b-form-group label="დასახლებული პუნქტი">
    <b-form-select :value="selectedSettlementName" :options="selectedUnit.settlements"
      @change="settlementChanged" class="mb-3 col-md-5">
    </b-form-select>
  </b-form-group>
  <b-form-group label="საფოსტო ინდექსი">
    <b-form-input class="col-md-5" type="text" :value="postalCode" @change="postalCodeChanged"></b-form-input>
  </b-form-group>
</div>
</template>

<script>
/**
   * კომპონენტი მისამართისთვის (რეგიონი & რაიონი & დასახლებული პუნქტი) location , unit , settlement
   * გადაწოდებულ მისამართების მასივს (locations) უნდა ქონდეს შემდეგი სტრუქტურა
   * locationsList: [
          {
            locationName: 'თბილისი',
            units: [
              {
                locationUnitName: 'ვაკე',
                settlements: ['ვაკე']
              },
              {
                locationUnitName: 'ისანი',
                settlements: ['ისანი']
              },
              {
                locationUnitName: 'დიდგორი',
                settlements: ['დიდგორი', 'კოჯორი']
              }
            ]
          }
        ]
  */
export default {
  name: 'locations',
  props: ['locations', 'currentLocationName', 'currentLocationUnitName',
    'currentSettlementName', 'currentPostalCode'
  ],
  data() {
    return {
      locationDefaultObject: Object.freeze({
        locationName: '',
        units: []
      }),
      unitDefaultObject: Object.freeze({
        locationUnitName: '',
        settlements: []
      }),
      selectedLocationName: '',
      selectedLocationUnitName: '',
      selectedSettlementName: '',
      selectedLocation: this.locationDefaultObject,
      selectedUnit: this.unitDefaultObject,
      postalCode: ''
    }
  },
  created() {
    this.selectedLocationName = this.currentLocationName
    this.selectedLocationUnitName = this.currentLocationUnitName
    this.selectedSettlementName = this.currentSettlementName

    this.selectedLocation = this.locationDefaultObject
    this.selectedUnit = this.unitDefaultObject

    this.loadOptions()
  },
  watch: {
    currentLocationName(value) {
      this.selectedLocationName = value

      this.loadOptions()
    },
    currentLocationUnitName(value) {
      this.selectedLocationUnitName = value

      this.loadOptions()
    },
    currentSettlementName(value) {
      this.selectedSettlementName = value
    },
    currentPostalCode(value) {
      this.postalCode = value
    }
  },
  computed: {
    locationFullObject() {
      return {
        locationName: this.selectedLocationName,
        locationUnitName: this.selectedLocationUnitName,
        settlement: this.selectedSettlementName,
        postalCode: this.postalCode
      }
    }
  },
  methods: {
    locationChanged(locationName) {
      this.selectedLocationName = locationName

      let location = this.locations.find(t => t.locationName === locationName)

      this.selectedLocation = location || this.locationDefaultObject
      this.selectedUnit = this.unitDefaultObject
    },
    locationUnitChanged(unitName) {
      this.selectedLocationUnitName = unitName

      let unit = this.selectedLocation.units.find(item => item.locationUnitName ===
        unitName)

      this.selectedUnit = unit || this.unitDefaultObject
    },
    settlementChanged(settlement) {
      this.selectedSettlementName = settlement

      this.$emit('change', this.locationFullObject)
    },
    postalCodeChanged(code) {
      this.postalCode = code

      this.$emit('change', this.locationFullObject)
    },
    loadOptions() {
      if (this.selectedLocation.locationName !== this.selectedLocationName) {
        let location = this.locations.find(item => item.locationName === this.selectedLocationName)

        this.selectedLocation = location || this.locationDefaultObject
      }

      if (this.selectedUnit.locationUnitName !== this.selectedLocationUnitName) {
        let unit = this.selectedLocation.units.find(item => item.locationUnitName ===
          this.selectedLocationUnitName)

        this.selectedUnit = unit || this.unitDefaultObject
      }
    }
  }
}
</script>

<style scoped>
</style>
