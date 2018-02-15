<template>
  <div>
    <div class="header">
      <i class="fa fa-arrow-left fa-2x" @click="goBack"></i>
      <!-- <b-button  variant="link">
      </b-button> -->
    </div>

    <div class="org-info">
      <b-card class="mb-2" header="ორგანიზაცია" header-bg-variant="secondary" header-text-variant="white">
        <p><b>სტატუსი:</b> {{organization.status}}</p>
        <p><b>Napr სტატუსი:</b> {{organization.naprStatus}}</p>
        <p><b>სამმართველოს რეგისტრაციის N:</b> {{organization.managementRegistrationNumber}}</p>
        <p><b>საიდენტიფიკაციო კოდი:</b> {{organization.taxCode}}</p>
        <p><b>სახაზინო რეგისტრაციის N:</b> {{organization.treasuryRegistrationNumber}}</p>
        <p><b>სახაზინო რეგისტრაციის თარიღი:</b> {{organization.treasuryRegistrationDate}}</p>
        <p><b>სახაზინო რეგისტრაციის ადგილი:</b> {{organization.treasuryRegistrationPlace}}</p>
        <p><b>ქართული დასახელება:</b> {{organization.georgianName}}</p>
        <p><b>ლათინური დასახელება:</b> {{organization.latinName}}</p>
        <p><b>ორგანიზაციის ტიპი:</b> {{organization.organizationType}}</p>
        <p><b>სამართლებრივი ფორმა:</b> {{organization.legalForm}}</p>
        <p><b>საწოლთა ფონდი:</b> {{organization.bedStock || 0}}</p>
        <p><b>Napr_ის ოფისის ტელეფონი:</b> {{organization.naprOfficePhone}}</p>
        <p><b>ოფისის ტელეფონი:</b> {{organization.phone}}</p>
        <p><b>ელექტრონული ფოსტა:</b> {{organization.email}}</p>
        <p><b>E-Health Email:</b> {{organization.ehealthEmail}}</p>
      </b-card>

    </div>
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
  async created () {
    let url = baseUrl + '/' + this.id
    let response = await this.$http.get(url)

    this.organization = response.data
  },
  methods: {
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.header {
  /* background-color: rgb(231, 231, 231); */
  text-align: left;
  padding: 15px;
  padding-left: 30px;
}

.org-info {
  text-align: left;

}
</style>
