<template>
  <div class="org-info">
    <b-card class="mb-2 main-info" header="ორგანიზაცია" header-bg-variant="secondary" header-text-variant="white">
      <b-form-group label="სტატუსი">
        <b-form-select v-model="organization.statusGeoName" class="mb-3 col-md-5">
          <option v-for="status in statuses" :key="status">{{status}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Napr სტატუსი">
        <b-form-select v-model="organization.naprStatus" class="mb-3 col-md-5">
          <option v-for="status in naprStatuses" :key="status">{{status}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="სამმართველოს რეგისტრაციის N">
        <b-form-input class="col-md-5" type="text" v-model="organization.managementRegistrationNumber"></b-form-input>
      </b-form-group>
      <b-form-group label="საიდენტიფიკაციო კოდი">
        <b-form-input class="col-md-5" type="text" v-model="organization.taxCode"></b-form-input>
      </b-form-group>
      <b-form-group label="სახაზინო რეგისტრაციის N">
        <b-form-input class="col-md-5" type="text" v-model="organization.treasuryRegistrationNumber"></b-form-input>
      </b-form-group>
      <b-form-group label="სახაზინო რეგისტრაციის თარიღი">
        <datepicker monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-5" v-model="organization.treasuryRegistrationDate"></datepicker>
      </b-form-group>
      <b-form-group label="სახაზინო რეგისტრაციის ადგილი">
        <b-form-input class="col-md-5" type="text" v-model="organization.treasuryRegistrationPlace"></b-form-input>
      </b-form-group>
      <b-form-group label="ქართული დასახელება">
        <b-form-input class="col-md-5" type="text" v-model="organization.georgianName"></b-form-input>
      </b-form-group>
      <b-form-group label="ლათინური დასახელება">
        <b-form-input class="col-md-5" type="text" v-model="organization.latinName"></b-form-input>
      </b-form-group>
      <b-form-group label="ორგანიზაციის ტიპი">
        <b-form-select v-model="organization.organizationType" class="mb-3 col-md-5">
          <option v-for="type in organizationTypes" :key="type">{{type}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="სამართლებრივი ფორმა">
        <b-form-select v-model="organization.legalForm" class="mb-3 col-md-5">
          <option v-for="form in legalForms" :key="form">{{form}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="საწოლთა ფონდი">
        <b-form-input class="col-md-5" type="number" v-model="organization.bedStock"></b-form-input>
      </b-form-group>
      <b-form-group label="Napr_ის ოფისის ტელეფონი">
        <b-form-input class="col-md-5" type="text" v-model="organization.naprOfficePhone"></b-form-input>
      </b-form-group>
      <b-form-group label="ოფისის ტელეფონი">
        <b-form-input class="col-md-5" type="text" v-model="organization.phone"></b-form-input>
      </b-form-group>
      <b-form-group label="ელექტრონული ფოსტა">
        <b-form-input class="col-md-5" type="text" v-model="organization.email"></b-form-input>
      </b-form-group>
      <b-form-group label="E-Health Email">
        <b-form-input class="col-md-5" type="text" v-model="organization.ehealthEmail"></b-form-input>
      </b-form-group>
    </b-card>
    <b-card
      class="mb-2"
      header="იურიდიული მისამართი"
      header-bg-variant="secondary"
      header-text-variant="white"
    >
      <locations :locations="locations" @change="onJuridicalAddressChanged"></locations>
    </b-card>
    <b-card
      class="mb-2"
      header="ფაქტიური მისამართი"
      header-bg-variant="secondary"
      header-text-variant="white"
    >
      <locations :locations="locations" @change="onFactualAddressChanged"></locations>
    </b-card>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import lib from '../../libs'
import locations from '../common/locations'

export default {
  name: 'organization-add',
  data: () => ({
    organization: {
      juridicalAddress: {},
      factualAddress: {}
    },
    datepickerFormat: 'd MMMM yyyy',
    statuses: [],
    naprStatuses: [],
    organizationTypes: [],
    legalForms: [],
    locations: []
  }),
  async created() {
    [
      this.statuses,
      this.naprStatuses,
      this.organizationTypes,
      this.legalForms,
      this.locations
    ] = await Promise.all([
      lib.fetchStatuses(),
      lib.fetchNaprStatuses(),
      lib.fetchOrganizationTypes(),
      lib.fetchLegalForms(),
      lib.fetchLocations()
    ])
  },
  methods: {
    onJuridicalAddressChanged(location) {
      this.organization.juridicalAddress = location
    },
    onFactualAddressChanged(location) {
      this.organization.factualAddress = location
    }
  },
  components: {
    Datepicker,
    locations
  }
}
</script>

<style scoped>
</style>
