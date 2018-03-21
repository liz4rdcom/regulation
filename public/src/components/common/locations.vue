<template>
<div>
  <b-form-group label="რეგიონი">
    <b-form-select :id="prefixForId + 'locations-region-select'" :value="selectedLocationName" :options="locations" value-field="locationName"
      text-field="locationName" @change="locationChanged" :class="inputClass">
      <option slot="first" :value="null" selected v-if="searching">ყველა</option>
    </b-form-select>
  </b-form-group>
  <b-form-group label="მუნიციპალიტეტი">
    <b-form-select :id="prefixForId + 'locations-district-select'" :value="selectedLocationUnitName" :options="selectedLocation.units"
      value-field="locationUnitName" text-field="locationUnitName" @change="locationUnitChanged"
      :class="inputClass">
      <option slot="first" :value="null" selected v-if="searching">ყველა</option>
    </b-form-select>
  </b-form-group>
  <b-form-group label="დასახლებული პუნქტი">
    <b-form-select :id="prefixForId + 'locations-settlement-select'" :value="selectedSettlementName" :options="selectedUnit.settlements"
      @change="settlementChanged" :class="inputClass">
      <option slot="first" :value="null" selected v-if="searching">ყველა</option>
    </b-form-select>
  </b-form-group>
  <b-form-group label="მისამართი" v-if="!searching">
    <b-form-input :id="prefixForId + 'locations-address'" :class="inputClass" type="text" :value="address" @change="addressChanged"></b-form-input>
  </b-form-group>
  <b-form-group label="საფოსტო ინდექსი" v-if="!searching">
    <b-form-input :id="prefixForId + 'locations-postal-code'" :class="inputClass" type="text" :value="postalCode" @change="postalCodeChanged"></b-form-input>
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
  props: {
    locations: {},
    currentLocationName: {},
    currentLocationUnitName: {},
    currentSettlementName: {},
    currentAddress: {},
    currentPostalCode: {},
    inputClass: {
      type: String,
      default: 'col-md-5'
    },
    searching: {
      type: Boolean,
      default: false
    },
    idPrefix: {
      type: String
    }
  },
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
      selectedLocationName: null,
      selectedLocationUnitName: null,
      selectedSettlementName: null,
      selectedLocation: this.locationDefaultObject,
      selectedUnit: this.unitDefaultObject,
      address: '',
      postalCode: ''
    }
  },
  created() {
    this.selectedLocationName = this.currentLocationName || null
    this.selectedLocationUnitName = this.currentLocationUnitName || null
    this.selectedSettlementName = this.currentSettlementName || null

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
    currentAddress(value) {
      this.address = value
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
        address: this.address,
        postalCode: this.postalCode
      }
    },
    prefixForId() {
      if (!this.idPrefix) return ''

      return this.idPrefix + '-'
    }
  },
  methods: {
    locationChanged(locationName) {
      this.selectedLocationName = locationName

      let location = this.locations.find(t => t.locationName === locationName)

      this.selectedLocation = location || this.locationDefaultObject
      this.selectedUnit = this.unitDefaultObject

      if (this.searching) this.$emit('change', this.locationFullObject)
    },
    locationUnitChanged(unitName) {
      this.selectedLocationUnitName = unitName

      let unit = this.selectedLocation.units.find(item => item.locationUnitName ===
        unitName)

      this.selectedUnit = unit || this.unitDefaultObject

      if (this.searching) this.$emit('change', this.locationFullObject)
    },
    settlementChanged(settlement) {
      this.selectedSettlementName = settlement

      this.$emit('change', this.locationFullObject)
    },
    addressChanged(address) {
      this.address = address

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
