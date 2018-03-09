<template>
  <div>
    <div class="header">
      <b-button variant="bl" class="backButton" @click="goBack">
        უკან დაბრუნება
      </b-button>
      <!-- <i class="fa fa-arrow-left fa-2x" @click="goBack"></i> -->
    </div>

    <div class="org-info">
      <b-card class="mb-2" header="ორგანიზაცია" header-bg-variant="stone" header-text-variant="white">
        <p><b>სტატუსი:</b> {{organization.statusGeoName}}</p>
        <p><b>Napr სტატუსი:</b> {{organization.naprStatus}}</p>
        <p><b>სამმართველოს რეგისტრაციის N:</b> {{organization.managementRegistrationNumber}}</p>
        <p><b>საიდენტიფიკაციო კოდი:</b> {{organization.taxCode}}</p>
        <p><b>სახაზინო რეგისტრაციის N:</b> {{organization.treasuryRegistrationNumber}}</p>
        <p><b>სახაზინო რეგისტრაციის თარიღი:</b> {{organization.treasuryRegistrationDate | date}}</p>
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
      <b-card
        class="mb-2"
        header="იურიდიული მისამართი"
        header-bg-variant="stone"
        header-text-variant="white"
        v-if="organization.juridicalAddress != null"
      >
        <p><b>რეგიონი:</b> {{organization.juridicalAddress.region}}</p>
        <p><b>მუნიციპალიტეტი:</b> {{organization.juridicalAddress.district}}</p>
        <p><b>დასახლებული პუნქტი:</b> {{organization.juridicalAddress.settlement}}</p>
        <p><b>მისამართი:</b> {{organization.juridicalAddress.addressDescription}}</p>
        <p><b>საფოსტო ინდექსი:</b> {{organization.juridicalAddress.postalCode}}</p>
      </b-card>
      <b-card
        class="mb-2"
        header="ფაქტიური მისამართი"
        header-bg-variant="stone"
        header-text-variant="white"
        v-if="organization.factualAddress != null"
      >
        <p><b>რეგიონი:</b> {{organization.factualAddress.region}}</p>
        <p><b>მუნიციპალიტეტი:</b> {{organization.factualAddress.district}}</p>
        <p><b>დასახლებული პუნქტი:</b> {{organization.factualAddress.settlement}}</p>
        <p><b>მისამართი:</b> {{organization.factualAddress.addressDescription}}</p>
        <p><b>საფოსტო ინდექსი:</b> {{organization.factualAddress.postalCode}}</p>
      </b-card>
      <b-card
        class="mb-2"
        header="ნებართვა"
        header-bg-variant="stone"
        header-text-variant="white"
        v-if="permission != null"
      >
        <p><b>სანებართვო მოწმობის N:</b> {{permission.documentNumber}}</p>
        <p><b>ნებართვის გაცემის საფუძველი:</b> {{permission.issueReason}}</p>
        <p><b>ნებართვის გაცემის თარიღი:</b> {{permission.issueDate | date}}</p>
        <p><b>ნებართვის ბრძანების ტიპი:</b> {{permission.commandType}}</p>
        <p><b>ნებართვის რეესტრის N:</b> {{permission.registerNumber}}</p>
        <p><b>ნებართვის გაუქმების საფუძველი:</b> {{permission.cancelReason}}</p>
        <p><b>ნებართვის გაუქმების თარიღი:</b> {{permission.cancelDate | date}}</p>
        <p>
          <b>დუბლიკატი:</b>
          <b-form-checkbox class="duplicateCheckbox" v-model="permission.hasDuplicate" disabled variant="secondary">
          </b-form-checkbox>
        </p>
        <span v-if="permission.hasDuplicate">
          <p><b>ნებართვის დუბლიკატის N:</b> {{permission.duplicateNumber}}</p>
          <p><b>ნებ. დუბლ. გაცემის საფუძველი:</b> {{permission.duplicateIssueReason}}</p>
          <p><b>ნებ. დუბლ. გაცემის თარიღი:</b> {{permission.duplicateIssueDate | date}}</p>
        </span>
      </b-card>
      <clinical-managers :organization="organization"></clinical-managers>
      <managers :organization="organization"></managers>
      <regulations :organization="organization"></regulations>
      <businesses :organization="organization"></businesses>
      <branches :organization="organization"></branches>

    </div>
  </div>
</template>

<script>
import {baseUrl, permissionType} from './organization-constants'
import clinicalManagersComponent from './clinical-managers'
import managersComponent from './managers'
import foundersComponent from './founders'
import regulationsComponent from './regulations'
import businessesComponent from './businesses'
import branchesComponent from './branches'

export default {
  name: 'organization-details',
  props: ['id'],
  data: () => ({
    organization: {
      regulations: [],
      clinicalManagers: [],
      managers: [],
      founders: [],
      businesses: [],
      branches: []
    }
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
  },
  computed: {
    permission () {
      return this.organization.regulations
        .find(item => item.type === permissionType)
    }
  },
  components: {
    'clinical-managers': clinicalManagersComponent,
    'managers': managersComponent,
    'founders': foundersComponent,
    'regulations': regulationsComponent,
    'businesses': businessesComponent,
    'branches': branchesComponent
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

.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}
</style>
