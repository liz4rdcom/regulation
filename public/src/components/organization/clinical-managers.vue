<template>
  <div>
    <b-card
      class="mb-2"
      header="კლინიკური მენეჯერები"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="organization.clinicalManagers.length > 0"
    >
      <b-table
        responsive
        :items="organization.clinicalManagers"
        :fields="clinicalManagerFields"
      >
      </b-table>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'clinical-managers',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    clinicalManagerFields: [
      {
        key: 'firstName',
        label: 'სახელი'
      },
      {
        key: 'lastName',
        label: 'გვარი'
      },
      {
        key: 'personalId',
        label: 'პირადი ნომერი'
      },
      {
        key: 'phone',
        label: 'ტელეფონი'
      },
      {
        key: 'email',
        label: 'ელ. ფოსტა'
      },
      {
        key: 'appointingDate',
        label: 'დანიშვნის თარიღი'
      },
      {
        key: 'firingDate',
        label: 'გათავისუფლების თარიღი'
      }
    ]
  })
}
</script>

<style scoped>
</style>
