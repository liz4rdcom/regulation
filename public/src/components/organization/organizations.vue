<template>
<div>
  <b-button variant="primary" class="addButton" @click="goToAddPage">
    ორგანიზაციის რეგისტრაცია
  </b-button>
  <br>
  <br>
  <div class="searchArea">
    <b-form-checkbox v-model="showAdvancedSearch" class="mb-5 searchCheckbox">
      გაფართოებული ძებნა
    </b-form-checkbox>
    <br>
    <b-container v-if="!showAdvancedSearch">
      <b-row>
        <b-col>
          <b-form-input v-model="searchString" type="text" @keyup.enter.native="search">
          </b-form-input>
        </b-col>
        <b-col cols="1">
          <b-button variant="primary" @click="search">
            <i class="fa fa-search"></i>
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="showAdvancedSearch">
      <b-form-group label="რეგულირების სახე">
        <b-form-select v-model="searchParams.regulationType" @change="searchParams.businessType=null" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="type in regulationTypes" :key="type.regulationType">{{type.regulationType}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="საქმიანობის სახე">
        <b-form-select v-model="searchParams.businessType" @change="searchParams.businessWithInvasiveAnesthesia = null" class="col-md-5">
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
          class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="business in getBusinessesWithInvasiveAnesthesia(searchParams.regulationType, searchParams.businessType)" :key="business">{{business}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="ბრძანების ტიპი">
        <b-form-select v-model="searchParams.commandType" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="type in commandTypes" :key="type">{{type}}</option>
        </b-form-select>
      </b-form-group>
      <locations :locations="locations" searching @change="addressChanged"></locations>
      <b-form-group label="სტატუსი">
        <b-form-select v-model="searchParams.statusGeoName" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="status in statuses" :key="status">{{status}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Napr სტატუსი">
        <b-form-select v-model="searchParams.naprStatus" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="status in naprStatuses" :key="status">{{status}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="ორგანიზაციის ტიპი">
        <b-form-select v-model="searchParams.organizationType" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="type in organizationTypes" :key="type">{{type}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="სამართლებრივი ფორმა">
        <b-form-select v-model="searchParams.legalForm" class="col-md-5">
          <template slot="first">
            <option :value="null" selected>ყველა</option>
          </template>
          <option v-for="form in legalForms" :key="form">{{form}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="საქმიანობის წარმოების პერიოდი">
        <b-container>
          <b-row>
            <b-col cols="3" class="leftCol">
              <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessStartDate"></datepicker>
            </b-col>
            <b-col cols="0.5">
              -
            </b-col>
            <b-col cols="3" class="rightCol">
              <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input" v-model="searchParams.businessEndDate"></datepicker>
            </b-col>
          </b-row>
        </b-container>
      </b-form-group>
      <b-button variant="primary" @click="advancedSearch">
        <i class="fa fa-search"></i>
      </b-button>
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
      <b-button variant="primary" @click.stop="goToDetails(data.item)" class="round-button">
        <i class="fa fa-info"></i>
      </b-button>
      <b-button variant="primary" @click.stop="goToEditPage(data.item)" class="round-button">
        <i class="fa fa-pencil"></i>
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
import {datepickerFormat} from '../../utils'

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
        label: ' '
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
.addButton {
  margin-left: 2vw;
}

.searchCheckbox {
  margin-left: 15px;
}

.searchArea {
  width: 50%;
  margin: auto;
}

.leftCol {
  padding-left: 0px;
}

.rightCol {
  padding-right: 0px;
}

</style>
