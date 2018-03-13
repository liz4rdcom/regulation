<template>
<div class="organizations">
  <div>
    <b-container class="searchArea">
      <b-row>
        <b-col>
          <b-form-input v-model="searchString" type="text" @keyup.enter.native="search">
          </b-form-input>
        </b-col>
        <b-col cols="0.5">
          <b-button variant="primary" @click="search" v-b-tooltip.hover title="ძებნა">
            <i class="fa fa-search"></i>
          </b-button>
        </b-col>
        <b-col cols="0.5">
          <b-button variant="primary" class="addButton" @click="goToAddPage" v-b-tooltip.hover title="ორგანიზაციის დამატება">
            <i class="fa fa-plus"></i>
          </b-button>
        </b-col>
        <b-col cols="4">
          <b-button variant="primary" :class="showAdvancedSearch ? 'advancedSearchToggleFocused': 'advancedSearchToggleInactive'" @click="showAdvancedSearch = !showAdvancedSearch">
            გაფართოებული ძებნა
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="showAdvancedSearch" class="advancedSearchArea">
      <b-container>
        <b-row>
          <b-col>
            <b-form-group label="რეგულირების სახე">
              <b-form-select v-model="searchParams.regulationType" @change="searchParams.businessType=null" class="col-md-12">
                <template slot="first">
                  <option :value="null" selected>ყველა</option>
                </template>
                <option v-for="type in regulationTypes" :key="type.regulationType">{{type.regulationType}}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group label="საქმიანობის სახე">
              <b-form-select v-model="searchParams.businessType" @change="searchParams.businessWithInvasiveAnesthesia = null" class="col-md-12">
                <template slot="first">
                  <option :value="null" selected>ყველა</option>
                </template>
                <option v-for="type in getBusinessTypes(searchParams.regulationType)" :key="type">{{type}}</option>
              </b-form-select>
            </b-form-group>
            <b-form-group label="საქმ. ინვაზ. გაუტკივარებით">
              <b-form-select
              v-model="searchParams.businessWithInvasiveAnesthesia"
              :disabled="!hasBusinessesWithInvasiveAnesthesia(searchParams.regulationType, searchParams.businessType)"
              class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="business in getBusinessesWithInvasiveAnesthesia(searchParams.regulationType, searchParams.businessType)" :key="business">{{business}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="ბრძანების ტიპი">
            <b-form-select v-model="searchParams.commandType" class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="type in commandTypes" :key="type">{{type}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="საქმიანობის წარმოების პერიოდი">
            <b-container>
              <b-row>
                <b-col xl="6" class="leftCol">
                  <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessStartDate"></datepicker>
                </b-col>
                <b-col xl="6" class="rightCol">
                  <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessEndDate"></datepicker>
                </b-col>
              </b-row>
            </b-container>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="სტატუსი">
            <b-form-select v-model="searchParams.statusGeoName" class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="status in statuses" :key="status">{{status}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="Napr სტატუსი">
            <b-form-select v-model="searchParams.naprStatus" class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="status in naprStatuses" :key="status">{{status}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="ორგანიზაციის ტიპი">
            <b-form-select v-model="searchParams.organizationType" class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="type in organizationTypes" :key="type">{{type}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="სამართლებრივი ფორმა">
            <b-form-select v-model="searchParams.legalForm" class="col-md-12">
              <template slot="first">
                <option :value="null" selected>ყველა</option>
              </template>
              <option v-for="form in legalForms" :key="form">{{form}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group label="საქმიანობის მინიჭების პერიოდი">
            <b-container>
              <b-row>
                <b-col xl="6" class="leftCol">
                  <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessAssignStartDate"></datepicker>
                </b-col>
                <b-col xl="6" class="rightCol">
                  <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessAssignEndDate"></datepicker>
                </b-col>
              </b-row>
            </b-container>
          </b-form-group>
        </b-col>
        <b-col>
          <locations :locations="locations" input-class="col-md-12" searching @change="addressChanged"></locations>
        </b-col>
      </b-row>
      <b-row>
        <b-button variant="primary" class="advancedSearchButton" @click="advancedSearch" v-b-tooltip.hover title="გაფართოებული ძებნა">
          <i class="fa fa-search"></i>
        </b-button>
      </b-row>
    </b-container>
  </div>
  </div>

  <br>
  <b-table bordered responsive :items="organizations" :fields="fields">
    <span slot="region" slot-scope="data">{{data.item.factualAddress ? data.item.factualAddress.region: ''}}</span>
    <span slot="district" slot-scope="data">{{data.item.factualAddress ? data.item.factualAddress.district: ''}}</span>
    <span slot="addressDescription" slot-scope="data">{{data.item.factualAddress ? data.item.factualAddress.addressDescription: ''}}</span>
    <span slot="permissionNumber" slot-scope="data">{{getPermissionNumber(data.item)}}</span>
    <span slot="licenseNumbers" slot-scope="data">{{getLicensesText(data.item)}}</span>
    <span slot="messageNumbers" slot-scope="data">{{getMessagesText(data.item)}}</span>
    <span slot="registerNumbers" slot-scope="data">{{getRegisterNumbers(data.item)}}</span>
    <div slot="actions" slot-scope="data">
      <b-button variant="primary" @click.stop="goToDetails(data.item)" class="round-button" v-b-tooltip.hover title="სრული ინფორმაცია">
        <i class="fa fa-info"></i>
      </b-button>
      <b-button variant="primary" @click.stop="goToEditPage(data.item)" class="round-button" v-b-tooltip.hover title="რედაქტირება">
        <i class="fa fa-pencil"></i>
      </b-button>
      <b-button variant="danger" class="round-button" @click.stop="deleteOrganization(data.item)" v-b-tooltip.hover title="ორგანიზაციის წაშლა">
        <i class="fa fa-times"></i>
      </b-button>
    </div>
  </b-table>
</div>
</template>

<script>
import lib from '../../libs'
import {baseUrl, permissionType, licenseType, messageType} from './organization-constants'
import locationsComponent from '../common/locations'
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, removeEntity} from '../../utils'

const listTextSeparator = ', '

export default {
  name: 'organizations',
  data: () => ({
    fields: [
      {
        key: 'taxCode',
        label: 'საიდენტიფიკაციო კოდი'
      },
      {
        key: 'georgianName',
        label: 'სახელწოდება'
      },
      {
        key: 'phone',
        label: 'ტელეფონი'
      },
      {
        key: 'region',
        label: 'რეგიონი'
      },
      {
        key: 'district',
        label: 'რაიონი'
      },
      {
        key: 'addressDescription',
        label: 'მისამართი'
      },
      {
        key: 'statusGeoName',
        label: 'სტატუსი'
      },
      {
        key: 'permissionNumber',
        label: 'სანებართვო მოწმობის N'
      },
      {
        key: 'licenseNumbers',
        label: 'სალიცენზიო მოწმობის N'
      },
      {
        key: 'messageNumbers',
        label: 'შეტყობინების რეგ. N'
      },
      {
        key: 'registerNumbers',
        label: 'ნებართვის/ლიცენზიის რეესტრის N'
      },
      {
        key: 'actions',
        label: ' ',
        class: 'actions'
      }
    ],
    organizations: [],
    datepickerFormat: datepickerFormat,
    searchString: '',
    showAdvancedSearch: false,
    searchParams: {
      statusGeoName: null,
      naprStatus: null,
      organizationType: null,
      legalForm: null,
      regulationType: null,
      businessType: null,
      businessWithInvasiveAnesthesia: null,
      commandType: null
    },
    statuses: [],
    naprStatuses: [],
    organizationTypes: [],
    legalForms: [],
    commandTypes: [],
    businessStatuses: [],
    locations: [],
    regulationTypes: []
  }),
  async created () {
    let response

    [
      response,
      this.statuses,
      this.naprStatuses,
      this.organizationTypes,
      this.legalForms,
      this.commandTypes,
      this.businessStatuses,
      this.locations,
      this.regulationTypes
    ] = await Promise.all([
      this.$http.get(baseUrl),
      lib.fetchStatuses(),
      lib.fetchNaprStatuses(),
      lib.fetchOrganizationTypes(),
      lib.fetchLegalForms(),
      lib.fetchCommandTypes(),
      lib.fetchBusinessStatuses(),
      lib.fetchLocations(),
      lib.fetchRegulationTypes()
    ])

    this.organizations = response.data
  },
  methods: {
    async search() {
      let url = baseUrl + '/search'

      let response = await this.$http.get(url, {params: {query: this.searchString}})

      this.organizations = response.data
    },
    async advancedSearch() {
      let url = baseUrl + '/advancedSearch'

      let response = await this.$http.get(url, {params: this.searchParams})

      this.organizations = response.data
    },
    goToDetails (organization) {
      this.$router.push('/' + organization.id)
    },
    goToAddPage () {
      this.$router.push('/add')
    },
    goToEditPage(organization) {
      this.$router.push('/edit/' + organization.id)
    },
    getPermissionNumber (organization) {
      if (!organization.regulations) return null

      let permission = organization.regulations
        .filter(regulation => regulation.type === permissionType)[0]

      return permission ? permission.documentNumber : null
    },
    getLicensesText (organization) {
      if (!organization.regulations) return null

      return organization.regulations
        .filter(regulation => regulation.type === licenseType)
        .map(license => license.documentNumber)
        .join(listTextSeparator)
    },
    getMessagesText (organization) {
      if (!organization.regulations) return null

      return organization.regulations
        .filter(regulation => regulation.type === messageType)
        .map(message => message.documentNumber)
        .join(listTextSeparator)
    },
    getRegisterNumbers (organization) {
      if (!organization.regulations) return null

      return organization.regulations
        .filter(regulation => regulation.type !== messageType)
        .map(regulation => regulation.registerNumber)
        .join(listTextSeparator)
    },
    getBusinessTypes(regulationTypeText) {
      if (!regulationTypeText) return []

      let regulationType = this.regulationTypes.find(item => item.regulationType === regulationTypeText)

      return regulationType.businessTypes.map(item => item.type)
    },
    hasBusinessesWithInvasiveAnesthesia(regulationTypeText, businessTypeText) {
      if (!regulationTypeText || !businessTypeText) return false

      let regulationType = this.regulationTypes.find(item => item.regulationType === regulationTypeText)

      let businessType = regulationType.businessTypes.find(item => item.type === businessTypeText)

      return !!businessType.businessesWithInvasiveAnesthesia
    },
    getBusinessesWithInvasiveAnesthesia(regulationTypeText, businessTypeText) {
      if (!regulationTypeText || !businessTypeText) return []

      let regulationType = this.regulationTypes.find(item => item.regulationType === regulationTypeText)

      let businessType = regulationType.businessTypes.find(item => item.type === businessTypeText)

      return businessType.businessesWithInvasiveAnesthesia || []
    },
    addressChanged(location) {
      this.searchParams.region = location.locationName
      this.searchParams.district = location.locationUnitName
      this.searchParams.settlement = location.settlement
    },
    async deleteOrganization(organization) {
      let url = baseUrl + '/' + organization.id

      await this.$http.delete(url)

      removeEntity(this.organizations, organization)
    }
  },
  computed: { },
  components: {
    'locations': locationsComponent,
    Datepicker
  }
}
</script>

<style scoped>
.organizations {
  margin-top: 55px;
}

.addButton {
  margin-left: 10px;
}

.searchArea {
  width: 70%;
  margin: auto;
  margin-bottom: 25px;
}

.advancedSearchToggleFocused {
  background-color: #0069d9;
  border-color: #0062cc;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
}

.advancedSearchToggleInactive:focus {
  box-shadow: 0 0 0 0;
}

.advancedSearchArea {
  width: 85%;
  margin: auto;
}

.advancedSearchButton {
  margin-left: 15px;
}

.leftCol {
  padding-left: 0px;
  padding-right: 7px;
}

.rightCol {
  padding-right: 0px;
  padding-left: 7px;
}

</style>
