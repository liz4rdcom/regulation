<template>
  <div>
    <div class="header">
      <b-button variant="bl" class="btn btn-primary" @click="goBack">
        უკან დაბრუნება
      </b-button>
    </div>

    <div class="org-info">
      <b-tabs card ref="tabs" v-model="tabIndex">
        <b-tab title="ძირითადი ინფორმაცია">
          <b-card class="mb-2" header="ორგანიზაცია" header-bg-variant="stone" header-text-variant="white">
            <p><b>სტატუსი:</b> {{organization.statusGeoName}}</p>
            <p><b>Napr სტატუსი:</b> {{organization.naprStatus}}</p>
            <p><b>სამმართველოს რეგისტრაციის N:</b> {{organization.managementRegistrationNumber}}</p>
            <p><b>საიდენტიფიკაციო კოდი:</b> {{organization.taxCode}}</p>
            <p><b>სახელმწიფო რეგისტრაციის N:</b> {{organization.governmentRegistrationNumber}}</p>
            <p><b>სახელმწიფო რეგისტრაციის თარიღი:</b> {{organization.governmentRegistrationDate | date}}</p>
            <p><b>სახელმწიფო რეგისტრაციის ადგილი:</b> {{organization.governmentRegistrationPlace}}</p>
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
        </b-tab>
        <b-tab title="მისამართი" v-if="organization.juridicalAddress != null || organization.factualAddress != null">
          <b-card
            class="mb-2"
            header="იურიდიული მისამართი"
            header-bg-variant="stone"
            header-text-variant="white"
            v-if="organization.juridicalAddress != null"
          >
            <p><b>მისამართი:</b> {{organization.juridicalAddress}}</p>
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
          </b-card>
        </b-tab>
        <b-tab title="ხელმძღვანელები" v-if="organization.clinicalManagers.length > 0 || organization.managers.length > 0 || organization.accounts.length > 0">
          <clinical-managers :organization="organization"></clinical-managers>
          <managers :organization="organization"></managers>
          <owners :organization="organization"></owners>
        </b-tab>
        <b-tab title="რეგულაციები" v-if="organization.regulations.length > 0">
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
          <regulations :organization="organization"></regulations>
        </b-tab>
        <b-tab title="საქმიანობები" v-if="organization.businesses.length > 0">
          <businesses :organization="organization"></businesses>
        </b-tab>
        <b-tab title="ფილიალები" v-if="organization.branches.length > 0">
          <branches :organization="organization"></branches>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import {baseUrl, permissionType} from './organization-constants'
import clinicalManagersComponent from './clinical-managers'
import managersComponent from './managers'
import ownersComponent from './owners'
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
      accounts: [],
      businesses: [],
      branches: []
    },
    tabIndex: 0
  }),
  async created () {
    let url = baseUrl + '/' + this.id
    let response = await this.$http.get(url)

    this.organization = Object.assign(this.organizationStartState, response.data)
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
    },
    organizationStartState() {
      return {
        regulations: [],
        clinicalManagers: [],
        managers: [],
        accounts: [],
        businesses: [],
        branches: []
      }
    }
  },
  components: {
    'clinical-managers': clinicalManagersComponent,
    'managers': managersComponent,
    'owners': ownersComponent,
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
