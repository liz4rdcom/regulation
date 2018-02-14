<template>
  <div>
    details {{id}}
  </div>
</template>

<script>
const baseUrl = '/api/organizations'

export default {
  name: 'organization-details',
  props: ['id'],
  data: () => ({
    organization: {}
  }),
  created() {
    let response = this.$http.get(baseUrl + '/' + this.id)

    this.organization = response.data
  }
}
</script>

<style scoped>
</style>
