<template>
  <div>
    <b-card
      class="mb-2"
      header="დამფუძნებლები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.founders.length > 0"
    >
      <b-table
        responsive
        :items="organization.founders"
        :fields="founderFields"
      >
      </b-table>
    </b-card>
  </div>
</template>
<script>
export default {
  name: 'founders',
  props: {
    organization: {}
  },
  data: () => ({
    founderFields: [
      {
        key: 'fullName',
        label: 'სახელი და გვარი'
      },
      {
        key: 'personalId',
        label: 'პირადი ნომერი'
      },
      {
        key: 'founderCompanyName',
        label: 'ორგანიზაციის დასახელება'
      },
      {
        key: 'taxCode',
        label: 'საიდენტიფიკაციო კოდი'
      },
      {
        key: 'founderType',
        label: 'დამფუძნებლის ტიპი'
      },
      {
        key: 'share',
        label: 'წილობრივი თანაფარდობა'
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
