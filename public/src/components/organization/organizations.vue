<template>
<div>
  <b-button variant="primary" class="addButton" @click="goToAddPage">
    ორგანიზაციის რეგისტრაცია
  </b-button>
  <br>
  <br>
  <b-container>
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="8">
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
  <br>
  <b-table bordered responsive :items="organizations" :fields="fields">
    <span slot="region" slot-scope="data">{{data.item.factualAddress.region}}</span>
    <span slot="district" slot-scope="data">{{data.item.factualAddress.district}}</span>
    <span slot="addressDescription" slot-scope="data">{{data.item.factualAddress.addressDescription}}</span>
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
    searchString: ''
  }),
  async created () {
    let response = await this.$http.get(baseUrl)

    this.organizations = response.data

    await Promise.all([
      lib.fetchStatuses(),
      lib.fetchNaprStatuses(),
      lib.fetchOrganizationTypes(),
      lib.fetchLegalForms(),
      lib.fetchCommandTypes(),
      lib.fetchBusinessStatuses(),
      lib.fetchLocations(),
      lib.fetchRegulationTypes()
    ])
  },
  methods: {
    async search() {
      let url = baseUrl + '/search'

      let response = await this.$http.get(url, {params: {query: this.searchString}})

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
      let permission = organization.regulations
        .filter(regulation => regulation.type === permissionType)[0]

      return permission ? permission.documentNumber : null
    },
    getLicensesText (organization) {
      return organization.regulations
        .filter(regulation => regulation.type === licenseType)
        .map(license => license.documentNumber)
        .join(listTextSeparator)
    },
    getMessagesText (organization) {
      return organization.regulations
        .filter(regulation => regulation.type === messageType)
        .map(message => message.documentNumber)
        .join(listTextSeparator)
    },
    getRegisterNumbers (organization) {
      return organization.regulations
        .filter(regulation => regulation.type !== messageType)
        .map(regulation => regulation.registerNumber)
        .join(listTextSeparator)
    }
  },
  computed: {}
}
</script>

<style scoped>
.addButton {
  margin-left: 2vw;
}
</style>
