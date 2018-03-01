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
    <b-card
      class="mb-2"
      header="ნებართვა"
      header-bg-variant="secondary"
      header-text-variant="white"
    >
      <b-form-group label="სანებართვო მოწმობის N">
        <b-form-input class="col-md-5" type="text" v-model="permission.documentNumber"></b-form-input>
      </b-form-group>
      <b-form-group label="ნებართვის გაცემის საფუძველი">
        <b-form-input class="col-md-5" type="text" v-model="permission.issueReason"></b-form-input>
      </b-form-group>
      <b-form-group label="ნებართვის გაცემის თარიღი">
        <datepicker monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-5" v-model="permission.issueDate"></datepicker>
      </b-form-group>
      <b-form-group label="ნებართვის ბრძანების ტიპი">
        <b-form-select v-model="permission.commandType" class="mb-3 col-md-5">
          <option v-for="type in commandTypes" :key="type">{{type}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="ნებართვის რეესტრის N">
        <b-form-input class="col-md-5" type="text" v-model="permission.registerNumber"></b-form-input>
      </b-form-group>
      <b-form-group label="ნებართვის გაუქმების საფუძველი">
        <b-form-input class="col-md-5" type="text" v-model="permission.cancelReason"></b-form-input>
      </b-form-group>
      <b-form-group label="ნებართვის გაუქმების თარიღი">
        <datepicker monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-5" v-model="permission.cancelDate"></datepicker>
      </b-form-group>
      <p>
        <b>დუბლიკატი:</b>
        <b-form-checkbox class="duplicateCheckbox" v-model="permission.hasDuplicate" variant="secondary">
        </b-form-checkbox>
      </p>
      <span v-if="permission.hasDuplicate">
        <b-form-group label="ნებართვის დუბლიკატის N">
          <b-form-input class="col-md-5" type="text" v-model="permission.duplicateNumber"></b-form-input>
        </b-form-group>
        <b-form-group label="ნებ. დუბლ. გაცემის საფუძველი">
          <b-form-input class="col-md-5" type="text" v-model="permission.duplicateIssueReason"></b-form-input>
        </b-form-group>
        <b-form-group label="ნებ. დუბლ. გაცემის თარიღი">
          <datepicker monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-5" v-model="permission.duplicateIssueDate"></datepicker>
        </b-form-group>
      </span>
    </b-card>
    <clinical-managers :organization="organization" editable @add="onClinicalManagerAdd" @edit="onClinicalManagerEdit" @delete="onClinicalManagerRemove"></clinical-managers>
    <managers :organization="organization" editable @add="onManagerAdd" @edit="onManagerEdit" @delete="onManagerRemove"></managers>
    <founders :organization="organization"></founders>
    <regulations :organization="organization" editable @add="onRegulationAdd" @edit="onRegulationEdit" @delete="onRegulationRemove"></regulations>
    <businesses :organization="organization" editable @add="onBusinessAdd" @edit="onBusinessEdit" @delete="onBusinessDelete"></businesses>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import lib from '../../libs'
import locations from '../common/locations'
import clinicalManagersComponent from './clinical-managers'
import managersComponent from './managers'
import foundersComponent from './founders'
import regulationsComponent from './regulations'
import businessComponent from './businesses.vue'
import {datepickerFormat, editEntity, removeEntity} from '../../utils'
import {baseUrl, permissionType} from './organization-constants'

export default {
  name: 'organization-add',
  data: () => ({
    organization: {
      juridicalAddress: {},
      factualAddress: {},
      regulations: [],
      clinicalManagers: [],
      managers: [],
      founders: [],
      businesses: [],
      branches: []
    },
    datepickerFormat: datepickerFormat,
    statuses: [],
    naprStatuses: [],
    organizationTypes: [],
    legalForms: [],
    locations: [],
    commandTypes: [],
    permission: {
      type: permissionType
    }
  }),
  async created() {
    [
      this.statuses,
      this.naprStatuses,
      this.organizationTypes,
      this.legalForms,
      this.locations,
      this.commandTypes,
      this.permission.id
    ] = await Promise.all([
      lib.fetchStatuses(),
      lib.fetchNaprStatuses(),
      lib.fetchOrganizationTypes(),
      lib.fetchLegalForms(),
      lib.fetchLocations(),
      lib.fetchCommandTypes(),
      this.newUniqueId()
    ])
  },
  methods: {
    onJuridicalAddressChanged(location) {
      this.organization.juridicalAddress = location
    },
    onFactualAddressChanged(location) {
      this.organization.factualAddress = location
    },
    async onClinicalManagerAdd(manager) {
      manager.id = await this.newUniqueId()

      this.organization.clinicalManagers.push(manager)
    },
    onClinicalManagerEdit(manager) {
      editEntity(this.organization.clinicalManagers, manager)
    },
    onClinicalManagerRemove(manager) {
      removeEntity(this.organization.clinicalManagers, manager)
    },
    async onManagerAdd(manager) {
      manager.id = await this.newUniqueId()

      this.organization.managers.push(manager)
    },
    onManagerEdit(manager) {
      editEntity(this.organization.managers, manager)
    },
    onManagerRemove(manager) {
      removeEntity(this.organization.managers, manager)
    },
    async onRegulationAdd(regulation) {
      regulation.id = await this.newUniqueId()

      this.organization.regulations.push(regulation)
    },
    onRegulationEdit(regulation) {
      editEntity(this.organization.regulations, regulation)
    },
    onRegulationRemove(regulation) {
      removeEntity(this.organization.regulations, regulation)
    },
    async onBusinessAdd(business) {
      business.id = await this.newUniqueId()

      this.organization.businesses.push(business)
    },
    onBusinessEdit(business) {
      editEntity(this.organization.businesses, business)
    },
    onBusinessDelete(business) {
      removeEntity(this.organization.businesses, business)
    },
    async newUniqueId() {
      let response = await this.$http.get(baseUrl + '/uniqueId')

      return response.data
    },
    permissionIsFilled() {
      return !!this.permission.documentNumber &&
             !!this.permission.issueDate &&
             !!this.permission.registerNumber
    }
  },
  watch: {
    permission: {
      async handler() {
        let foundPermissionIndex = this.organization.regulations.findIndex(item => item.id === this.permission.id)

        // if permission is filled and doesn't exist in regulations list
        if (this.permissionIsFilled() && foundPermissionIndex === -1) {
          this.organization.regulations.push(this.permission)

          return
        }

        // if it is empty but added in regulations list
        if (!this.permissionIsFilled() && foundPermissionIndex > -1) {
          this.organization.regulations.splice(foundPermissionIndex, 1)

          // return
        }
      },
      deep: true
    }
  },
  components: {
    Datepicker,
    locations,
    'clinical-managers': clinicalManagersComponent,
    'managers': managersComponent,
    'founders': foundersComponent,
    'regulations': regulationsComponent,
    'businesses': businessComponent
  }
}
</script>

<style scoped>
.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}
</style>
