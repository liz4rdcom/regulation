<template>
  <div>
    <b-card
      class="mb-2"
      header="ხელმძღვანელი"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="organization.managers.length > 0"
    >
      <b-table
        responsive
        :items="organization.managers"
        :fields="managerFields"
      >
      </b-table>
    </b-card>
  </div>
</template>
<script>
export default {
  name: 'managers',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    managerFields: [
      {
        key: 'position',
        label: 'თანამდებობა'
      },
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
        key: 'other',
        label: 'სხვა'
      }
    ]
  })
}
</script>
<style scoped>
</style>
