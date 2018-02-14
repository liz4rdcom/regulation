<template>
<div>
  <b-table bordered :items="organizations" :fields="fields">
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
    </div>
  </b-table>
</div>
</template>

<script>
const baseUrl = '/api/organizations'
const permissionType = 'ნებართვა'
const licenseType = 'ლიცენზია'
const messageType = 'შეტყობინება'
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
    organizations: []
  }),
  async created () {
    let response = await this.$http.get(baseUrl)

    this.organizations = response.data
  },
  methods: {
    goToDetails (organization) {
      this.$router.push('/' + organization.id)
    },
    getPermissionNumber (organization) {
      return organization.regulations
        .filter(regulation => regulation.type === permissionType)[0].documentNumber
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
</style>
