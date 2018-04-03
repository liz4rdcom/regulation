<template>
  <div>
    <b-card
      class="mb-2"
      header="მფლობელები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.accounts.length > 0"
    >
      <b-card no-body class="mb-1" v-for="account in organization.accounts" :key="account.accountNumber">
        <b-card-header class="percent" role="tab">
          <b-row>
            <b-col>
              <span @click="account._showOwners = !account._showOwners">
                <i v-if="!account._showOwners" class="fa fa-plus"></i>
                <i v-if="account._showOwners" class="fa fa-minus"></i>
              </span>
            </b-col>
            <b-col cols="2">
              {{account.accountNumber}}
            </b-col>
            <b-col cols="9" style="text-align: center;">
              <span>{{account.share}}%</span>
            </b-col>
          </b-row>
        </b-card-header>
        <b-collapse role="tabpanel" v-model="account._showOwners" :id="'account_' + account.accountNumber">
          <b-card-body>
            <b-table
                   :fields="ownerFields"
                   :items="account.owners"
            >
              <span slot="fullName" slot-scope="data">{{data.item.firstName}} {{data.item.lastName}}</span>
            </b-table>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-card>
  </div>
</template>
<script>
export default {
  name: 'owners',
  props: {
    organization: {}
  },
  data: () => ({
    ownerFields: [
      {
        key: 'personalId',
        label: 'პირადი ნომერი'
      },
      {
        key: 'fullName',
        label: 'სახელი და გვარი'
      },
      {
        key: 'ownerCompanyName',
        label: 'დასახელება'
      },
      {
        key: 'taxCode',
        label: 'საიდენტიფიკაციო კოდი'
      },
      {
        key: 'ownerType',
        label: 'მფლობელის ტიპი'
      },
      {
        key: 'legalForm',
        label: 'სამართლებრივი ფორმა'
      }
    ]
  })
}
</script>
<style scoped>
</style>
