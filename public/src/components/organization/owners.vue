<template>
  <div>
    <b-card
      class="mb-2"
      header="მფლობელები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.accounts.length > 0"
    >
      <b-list-group>
        <b-list-group-item v-for="account in organization.accounts" :key="account.accountNumber">
          <span @click="account._showOwners = !account._showOwners">
            <i v-if="!account._showOwners" class="fa fa-plus-square"></i>
            <i v-if="account._showOwners" class="fa fa-minus-square"></i>
          </span>
          <span>{{account.share}}</span>
          <b-collapse v-model="account._showOwners" :id="'account_' + account.accountNumber">
            ragac
          </b-collapse>
        </b-list-group-item>
      </b-list-group>
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

  })
}
</script>
<style scoped>
</style>
