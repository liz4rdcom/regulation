<template>
  <div class="org-info">
    <div class="header">
      <b-button variant="bl" class="btn btn-primary" @click="onCancelClick">
        უკან დაბრუნება
      </b-button>
    </div>
    <b-tabs id="orgs-edit-tabs" card ref="tabs" v-model="tabIndex">
      <b-tab id="orgs-edit-main-tab" title="ძირითადი ინფორმაცია">
        <b-card class="mb-2 main-info" header="ორგანიზაცია" header-bg-variant="stone" header-text-variant="white">
          <b-container>
            <b-row>
              <b-col>
                <b-form-group label="სტატუსი">
                  <b-form-select id="orgs-edit-status-select" v-model="organization.statusGeoName" class="mb-3">
                    <option v-for="status in statuses" :key="status">{{status}}</option>
                  </b-form-select>
                </b-form-group>
                <b-form-group label="Napr სტატუსი">
                  <b-form-input disabled id="orgs-edit-napr-status" v-model="organization.naprStatus">
                  </b-form-input>
                </b-form-group>
                <b-row>
                  <b-col cols="11">
                    <b-form-group  label="საიდენტიფიკაციო კოდი">
                      <b-form-input id="orgs-edit-tax-code" type="text" v-model="organization.taxCode" @keyup.enter.native="syncOrganization(organization.taxCode)"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="0.5">
                    <b-button variant="primary" class="round-button sync-button" @click="syncOrganization(organization.taxCode)">
                      <i class="fa fa-search"></i>
                    </b-button>
                  </b-col>
                </b-row>
                <b-form-group label="სახელმწიფო რეგისტრაციის N">
                  <b-form-input id="orgs-edit-government-registration-number" type="text" v-model="organization.governmentRegistrationNumber"></b-form-input>
                </b-form-group>
                <b-form-group label="სახელმწიფო რეგისტრაციის თარიღი">
                  <datepicker :highlighted="highlightToday" id="orgs-edit-government-registration-datepicker" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="organization.governmentRegistrationDate"></datepicker>
                </b-form-group>
                <b-form-group label="სახელმწიფო რეგისტრაციის ადგილი">
                  <b-form-input id="orgs-edit-government-registration-place" type="text" v-model="organization.governmentRegistrationPlace"></b-form-input>
                </b-form-group>
                <b-form-group label="ქართული დასახელება">
                  <b-form-input id="orgs-edit-georgian-name" type="text" v-model="organization.georgianName"></b-form-input>
                </b-form-group>
                <b-form-group label="ლათინური დასახელება">
                  <b-form-input id="orgs-edit-latin-name" type="text" v-model="organization.latinName"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="ორგანიზაციის ტიპი">
                  <b-form-select id="orgs-edit-org-type-select" v-model="organization.organizationType" class="mb-3">
                    <option v-for="type in organizationTypes" :key="type">{{type}}</option>
                  </b-form-select>
                </b-form-group>
                <b-form-group label="სამართლებრივი ფორმა">
                  <b-form-select id="orgs-edit-legal-form-select" v-model="organization.legalForm" class="mb-3">
                    <option v-for="form in legalForms" :key="form.name" :value="form.name">
                      {{form.name}}
                      <span v-if="form.abbrev">&nbsp;({{form.abbrev}})</span>
                    </option>
                  </b-form-select>
                </b-form-group>
                <b-form-group label="სამმართველოს რეგისტრაციის N">
                  <b-form-input id="orgs-edit-management-registration-number" type="text" v-model="organization.managementRegistrationNumber"></b-form-input>
                </b-form-group>
                <b-form-group label="საწოლთა ფონდი">
                  <b-form-input id="orgs-edit-bed-stock" type="number" v-model="organization.bedStock"></b-form-input>
                </b-form-group>
                <b-form-group label="Napr_ის ოფისის ტელეფონი">
                  <b-form-input id="orgs-edit-napr-ofice-phone" type="text" v-model="organization.naprOfficePhone"></b-form-input>
                </b-form-group>
                <b-form-group label="ოფისის ტელეფონი">
                  <b-form-input id="orgs-edit-phone" type="text" v-model="organization.phone"></b-form-input>
                </b-form-group>
                <b-form-group label="ელექტრონული ფოსტა">
                  <b-form-input id="orgs-edit-email" type="text" v-model="organization.email"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-tab>
      <b-tab id="orgs-edit-address-tab" title="მისამართი">
        <b-container>
          <b-row>
            <b-col>
              <b-card
                class="mb-2"
                header="იურიდიული მისამართი"
                header-bg-variant="stone"
                header-text-variant="white"
              >
                <b-form-group label="მისამართი">
                  <b-form-input id="orgs-edit-juridical-locations-address" class="col-md-12" type="text" v-model="organization.juridicalAddress"></b-form-input>
                </b-form-group>
              </b-card>
            </b-col>
            <b-col>
              <b-card
                class="mb-2"
                header="ფაქტიური მისამართი"
                header-bg-variant="stone"
                header-text-variant="white"
              >
                <locations
                  idPrefix="orgs-edit-factual"
                  inputClass="col-md-12"
                  :locations="locations"
                  @change="onFactualAddressChanged"
                  :currentLocationName="organization.factualAddress.region"
                  :currentLocationUnitName="organization.factualAddress.district"
                  :currentSettlementName="organization.factualAddress.settlement"
                  :currentAddress="organization.factualAddress.addressDescription">
                </locations>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>
      <b-tab id="orgs-edit-managers-tab" title="ხელმძღვანელები">
        <clinical-managers idPrefix="orgs-edit" :organization="organization" editable @add="onClinicalManagerAdd" @edit="onClinicalManagerEdit" @delete="onClinicalManagerRemove"></clinical-managers>
        <managers idPrefix="orgs-edit" :organization="organization" editable @add="onManagerAdd" @edit="onManagerEdit" @delete="onManagerRemove"></managers>
        <owners idPrefix="orgs-edit" :organization="organization"></owners>
      </b-tab>
      <b-tab id="orgs-edit-regulations-tab" title="რეგულაციები">
        <b-card
          class="mb-2"
          header="ნებართვა"
          header-bg-variant="stone"
          header-text-variant="white"
        >
          <b-container>
            <b-row>
              <b-col>
                <b-form-group label="სანებართვო მოწმობის N">
                  <b-form-input id="orgs-edit-permission-document-number" type="text" v-model="permission.documentNumber"></b-form-input>
                </b-form-group>
                <b-form-group label="ნებართვის რეესტრის N">
                  <b-form-input id="orgs-edit-permission-register-number" type="text" v-model="permission.registerNumber"></b-form-input>
                </b-form-group>
                <p>
                  <b>დუბლიკატი:</b>
                  <b-form-checkbox id="orgs-edit-permission-duplicate-checkbox" class="duplicateCheckbox" v-model="permission.hasDuplicate" variant="stone">
                  </b-form-checkbox>
                </p>
                <b-form-group label="ნებართვის დუბლიკატის N">
                  <b-form-input id="orgs-edit-permission-duplicate-number" type="text" v-model="permission.duplicateNumber" :disabled="!permission.hasDuplicate"></b-form-input>
                </b-form-group>
                <b-form-group label="ნებ. დუბლ. გაცემის საფუძველი">
                  <b-form-input id="orgs-edit-permission-duplicate-issue-reason" type="text" v-model="permission.duplicateIssueReason" :disabled="!permission.hasDuplicate"></b-form-input>
                </b-form-group>
                <b-form-group label="ნებ. დუბლ. გაცემის თარიღი">
                  <datepicker :highlighted="highlightToday" id="orgs-edit-permission-duplicate-issue-date" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="permission.duplicateIssueDate" :disabled-picker="!permission.hasDuplicate"></datepicker>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="ნებართვის ბრძანების ტიპი">
                  <b-form-select id="orgs-edit-permission-command-type-select" v-model="permission.commandType">
                    <option v-for="type in commandTypes" :key="type">{{type}}</option>
                  </b-form-select>
                </b-form-group>
                <b-form-group label="ნებართვის გაცემის საფუძველი">
                  <b-form-input id="orgs-edit-permission-issue-reason" type="text" v-model="permission.issueReason"></b-form-input>
                </b-form-group>
                <b-form-group label="ნებართვის გაცემის თარიღი">
                  <datepicker :highlighted="highlightToday" id="orgs-edit-permission-issue-datepicker" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="permission.issueDate"></datepicker>
                </b-form-group>
                <b-form-group label="ნებართვის გაუქმების საფუძველი">
                  <b-form-input id="orgs-edit-permission-cancel-reason" type="text" v-model="permission.cancelReason"></b-form-input>
                </b-form-group>
                <b-form-group label="ნებართვის გაუქმების თარიღი">
                  <datepicker :highlighted="highlightToday" id="orgs-edit-permission-cancel-datepicker" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="permission.cancelDate"></datepicker>
                </b-form-group>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
        <regulations idPrefix="orgs-edit" :organization="organization" editable @add="onRegulationAdd" @edit="onRegulationEdit" @delete="onRegulationRemove"></regulations>
      </b-tab>
      <b-tab id="orgs-edit-businesses-tab" title="საქმიანობები">
        <businesses idPrefix="orgs-edit" :organization="organization" editable @add="onBusinessAdd" @edit="onBusinessEdit" @delete="onBusinessDelete"></businesses>
      </b-tab>
      <b-tab id="orgs-edit-branches-tab" title="ფილიალები">
        <branches idPrefix="orgs-edit" :organization="organization" editable @add="onBranchesAdd" @edit="onBranchesEdit" @delete="onBranchesDelete"></branches>
      </b-tab>
    </b-tabs>
    <div class="tabsNavigation">
      <b-button variant="primary" @click="tabIndex--" :disabled="tabIndex <= 0">
        <i class="fa fa-angle-left"></i> &nbsp;
        უკან
      </b-button>
      <b-button  variant="primary" @click="tabIndex++" :disabled="tabIndex >= 5">
        შემდეგ &nbsp;
        <i class="fa fa-angle-right"></i>
      </b-button>
    </div>
    <div class="card-footer page-footer">
      <b-button variant="primary" @click="save">
        შენახვა
      </b-button>
      <b-button variant="danger" @click="onCancelClick">
        უკან დაბრუნება
      </b-button>
    </div>
    <b-modal id="orgs-edit-question-modal" ref="cancelQuestionModal" size="lg" hide-header-close ok-variant="danger" ok-title="დიახ" cancel-title="არა" @ok="onCancelYes">
      <b>უკან დაბრუნების შემთხვევაში თქვენ მიერ შეტანილი ცვლილებები დაიკარგება.</b> <br><br>
      <b>გსურთ უკან დაბრუნება?</b>
    </b-modal>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import lib from '../../libs'
import locations from '../common/locations'
import clinicalManagersComponent from './clinical-managers'
import managersComponent from './managers'
import ownersComponent from './owners'
import regulationsComponent from './regulations'
import businessComponent from './businesses'
import branchesComponent from './branches'
import {datepickerFormat, highlightToday, editEntity, removeEntity} from '../../utils'
import {baseUrl, permissionType} from './organization-constants'
import {bus} from '../common/bus'

export default {
  name: 'organization-edit',
  props: ['id'],
  data: () => ({
    organization: {
      juridicalAddress: null,
      factualAddress: {},
      regulations: [],
      clinicalManagers: [],
      managers: [],
      accounts: [],
      businesses: [],
      branches: [],
      naprStatus: null,
      taxCode: null,
      governmentRegistrationDate: null,
      governmentRegistrationPlace: null,
      georgianName: null,
      legalForm: null,
      naprOfficePhone: null,
      email: null
    },
    oldOrganization: {},
    datepickerFormat: datepickerFormat,
    highlightToday: highlightToday,
    statuses: [],
    organizationTypes: [],
    legalForms: [],
    locations: [],
    commandTypes: [],
    permission: {
      type: permissionType
    },
    tabIndex: 0
  }),
  async created() {
    [
      this.statuses,
      this.organizationTypes,
      this.legalForms,
      this.locations,
      this.commandTypes
    ] = await Promise.all([
      lib.fetchStatuses(),
      lib.fetchOrganizationTypes(),
      lib.fetchLegalForms(),
      lib.fetchLocations(),
      lib.fetchCommandTypes()
    ])

    let url = baseUrl + '/' + this.id
    let response = await this.$http.get(url)

    this.organization = Object.assign(this.organizationDefaultObject, response.data)
    this.oldOrganization = Object.assign(this.organizationDefaultObject, response.data)

    let permission = this.organization.regulations.find(item => item.type === permissionType)

    this.permission = Object.assign(this.permissionDefaultObject, permission)

    if (!this.permission.id) this.permission.id = await this.newUniqueId()
  },
  methods: {
    async syncOrganization(taxCode) {
      let url = baseUrl + '/syncOrganization/' + taxCode

      try {
        let response = await this.$http.get(url)

        Object.assign(this.organization, response.data)
      } catch (error) {
        bus.$emit('error', error)
      }
    },
    onFactualAddressChanged(location) {
      this.organization.factualAddress.region = location.locationName
      this.organization.factualAddress.district = location.locationUnitName
      this.organization.factualAddress.settlement = location.settlement
      this.organization.factualAddress.addressDescription = location.address
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
    async onBranchesAdd(branch) {
      branch.id = await this.newUniqueId()

      this.organization.branches.push(branch)
    },
    onBranchesEdit(branch) {
      editEntity(this.organization.branches, branch)
    },
    onBranchesDelete(branch) {
      removeEntity(this.organization.branches, branch)
    },
    async newUniqueId() {
      let response = await this.$http.get(baseUrl + '/uniqueId')

      return response.data
    },
    permissionIsFilled() {
      return !!this.permission.documentNumber &&
             !!this.permission.issueDate &&
             !!this.permission.registerNumber
    },
    async save() {
      try {
        let url = baseUrl + '/' + this.id
        await this.$http.put(url, this.organization)

        bus.$emit('org-edit', this.organization)

        this.$router.push('/')
      } catch (error) {
        bus.$emit('error', error)
      }
    },
    onCancelClick() {
      this.$refs.cancelQuestionModal.show()
    },
    onCancelYes() {
      this.$router.push('/')
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
        }
      },
      deep: true
    }
  },
  computed: {
    organizationDefaultObject: () => ({
      juridicalAddress: null,
      factualAddress: {},
      regulations: [],
      clinicalManagers: [],
      managers: [],
      accounts: [],
      businesses: [],
      branches: [],
      naprStatus: null,
      taxCode: null,
      governmentRegistrationDate: null,
      governmentRegistrationPlace: null,
      georgianName: null,
      legalForm: null,
      naprOfficePhone: null,
      email: null
    }),
    permissionDefaultObject: () => ({
      type: permissionType
    })
  },
  components: {
    Datepicker,
    locations,
    'clinical-managers': clinicalManagersComponent,
    'managers': managersComponent,
    'owners': ownersComponent,
    'regulations': regulationsComponent,
    'businesses': businessComponent,
    'branches': branchesComponent
  }
}
</script>

<style scoped>
.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}

.header {
  /* background-color: rgb(231, 231, 231); */
  text-align: left;
  padding: 15px;
  padding-left: 30px;
}

.container {
  max-width: 100% !important;
}

.tabsNavigation {
  width: 20%;
  margin: auto;
  margin-bottom: 1rem;
  text-align: center;
}

.tabsNavigation .btn {
  width: 47%;
}
</style>
