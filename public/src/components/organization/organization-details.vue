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
      <b-card
        class="mb-2"
        header="ნებართვა"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="permission != null"
      >
        <p><b>სანებართვო მოწმობის N:</b> {{permission.documentNumber}}</p>
        <p><b>ნებართვის გაცემის საფუძველი:</b> {{permission.issueReason}}</p>
        <p><b>ნებართვის გაცემის თარიღი:</b> {{permission.issueDate}}</p>
        <p><b>ნებართვის ბრძანების ტიპი:</b> {{permission.commandType}}</p>
        <p><b>ნებართვის რეესტრის N:</b> {{permission.registerNumber}}</p>
        <p><b>ნებართვის გაუქმების საფუძველი:</b> {{permission.cancelReason}}</p>
        <p><b>ნებართვის გაუქმების თარიღი:</b> {{permission.cancelDate}}</p>
        <p>
          <b>დუბლიკატი:</b>
          <b-form-checkbox class="duplicateCheckbox" v-model="permission.hasDuplicate" disabled variant="secondary">
          </b-form-checkbox>
        </p>
        <span v-if="permission.hasDuplicate">
          <p><b>ნებართვის დუბლიკატის N:</b> {{permission.duplicateNumber}}</p>
          <p><b>ნებ. დუბლ. გაცემის საფუძველი:</b> {{permission.duplicateIssueReason}}</p>
          <p><b>ნებ. დუბლ. გაცემის თარიღი:</b> {{permission.duplicateIssueDate}}</p>
        </span>
      </b-card>
      <b-card
        class="mb-2"
        header="იურიდიული მისამართი"
        header-bg-variant="secondary"
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
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.factualAddress != null"
      >
        <p><b>რეგიონი:</b> {{organization.factualAddress.region}}</p>
        <p><b>მუნიციპალიტეტი:</b> {{organization.factualAddress.district}}</p>
        <p><b>დასახლებული პუნქტი:</b> {{organization.factualAddress.settlement}}</p>
        <p><b>მისამართი:</b> {{organization.factualAddress.addressDescription}}</p>
        <p><b>საფოსტო ინდექსი:</b> {{organization.factualAddress.postalCode}}</p>
      </b-card>
      <clinical-managers :organization="organization"></clinical-managers>
      <managers :organization="organization"></managers>
      <founders :organization="organization"></founders>
      <regulations :organization="organization"></regulations>
      <b-card
        class="mb-2"
        header="საქმიანობები"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.businesses.length > 0"
      >
        <b-table
          responsive
          :items="organization.businesses"
          :fields="businessFields"
        >
          <span slot="regulation" slot-scope="data">
            {{regulationShortText(data.item.regulationId)}}
          </span>
          <span slot="hasDuplicate" slot-scope="data">
            <b-form-checkbox v-model="data.item.hasDuplicate" disabled>
            </b-form-checkbox>
          </span>
          <span slot="actions" slot-scope="data">
            <b-button variant="primary" class="round-button" size="sm" @click.stop="showBusinessInfo(data.item)">
              <i class="fa fa-info"></i>
            </b-button>
          </span>
        </b-table>
        <b-modal ref="businessInfoModal" title="საქმიანობა" hide-footer>
          <p><b>რეგულაცია:</b> {{regulationShortText(currentBusiness.regulationId)}}</p>
          <p><b>საქმიანობის სახე/ტიპი:</b> {{currentBusiness.businessType}}</p>
          <p><b>საქმ. ინვაზ. გაუტკივარებით (სხვა):</b> {{currentBusiness.additionalBusinessInformation}}</p>
          <p>
            <b v-if="isMessageBusiness(currentBusiness)">რეგ. ნომერი:</b>
            <b v-else>მოწმობის N:</b>
            {{currentBusiness.documentNumber}}
          </p>
          <p><b>გაცემის საფუძველი:</b> {{currentBusiness.issueReason}}</p>
          <p>
            <b v-if="isMessageBusiness(currentBusiness)">შემოსვლის თარიღი:</b>
            <b v-else>გაცემის თარიღი:</b>
            {{currentBusiness.issueDate}}
          </p>
          <p><b>გაუქმების საფუძველი:</b> {{currentBusiness.cancelReason}}</p>
          <p><b>გაუქმების თარიღი:</b> {{currentBusiness.cancelDate}}</p>
          <p>
            <b>დუბლიკატი:</b>
            <b-form-checkbox class="duplicateCheckbox" v-model="currentBusiness.hasDuplicate" disabled variant="secondary">
            </b-form-checkbox>
          </p>
          <span v-if="currentBusiness.hasDuplicate">
            <p><b>დუბლიკატის N:</b> {{currentBusiness.duplicateNumber}}</p>
            <p><b>დუბლ. გაცემის საფუძველი:</b> {{currentBusiness.duplicateIssueReason}}</p>
            <p><b>დუბლ. გაცემის თარიღი:</b> {{currentBusiness.duplicateIssueDate}}</p>
          </span>
        </b-modal>
      </b-card>
      <b-card
        class="mb-2"
        header="ფილიალები"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.branches.length > 0"
      >
        <b-table
          responsive
          :items="organization.branches"
          :fields="branchFields"
        >
          <span slot="actions" slot-scope="data">
            <b-button variant="primary" class="round-button" size="sm" @click.stop="showBranchInfo(data.item)">
              <i class="fa fa-info"></i>
            </b-button>
          </span>
        </b-table>
        <b-modal ref="branchInfoModal" title="ფილიალი" hide-footer>
          <p><b>დასახელება:</b> {{currentBranch.name}}</p>
          <p><b>ფილიალის სტატუსი:</b> {{currentBranch.status}}</p>
          <p><b>რეგისტრაციის N:</b> {{currentBranch.registrationNumber}}</p>
          <p><b>ფილ. ფუნქციონ. საფუძველი:</b> {{currentBranch.functioningReason}}</p>
          <p><b>დაწყების თარიღი:</b> {{currentBranch.startDate}}</p>
          <p><b>გაუქმების თარიღი:</b> {{currentBranch.cancelDate}}</p>
          <p><b>რეგიონი:</b> {{currentBranch.region}}</p>
          <p><b>მუნიციპალიტეტი:</b> {{currentBranch.district}}</p>
          <p><b>დასახლებული პუნქტი:</b> {{currentBranch.settlement}}</p>
          <p><b>მისამართი:</b> {{currentBranch.addressDescription}}</p>
          <p><b>საფოსტო ინდექსი:</b> {{currentBranch.postalCode}}</p>
          <p>
            <b>საქმიანობები: <br /></b>
            <ul>
              <li v-for="businessType in getBranchBusinessTypes(currentBranch)" :key="businessType">
                {{businessType}}
              </li>
            </ul>
          </p>
        </b-modal>
      </b-card>

    </div>
  </div>
</template>

<script>
import {baseUrl, permissionType, messageType} from './organization-constants'
import clinicalManagersComponent from './clinical-managers'
import managersComponent from './managers'
import foundersComponent from './founders'
import regulationsComponent from './regulations'

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
    },
    currentBusiness: {},
    currentBranch: {},
    businessFields: [
      {
        key: 'regulation',
        label: 'რეგულაცია'
      },
      {
        key: 'businessType',
        label: 'საქმიანობის სახე/ტიპი'
      },
      {
        key: 'additionalBusinessInformation',
        label: 'სხვა (შეტყობინების შემთხვევაში)'
      },
      {
        key: 'documentNumber',
        label: 'მოწმობის ნომერი/რეგ. N'
      },
      {
        key: 'issueDate',
        label: 'მინიჭების/შემოსვლის თარიღი'
      },
      {
        key: 'cancelDate',
        label: 'გაუქმების თარიღი'
      },
      {
        key: 'hasDuplicate',
        label: 'დუბლიკატი'
      },
      {
        key: 'duplicateNumber',
        label: 'დუბლიკატის N'
      },
      {
        key: 'duplicateIssueReason',
        label: 'დუბლიკატის გაცემის საფუძველი'
      },
      {
        key: 'duplicateIssueDate',
        label: 'დუბლიკატის გაცემის თარიღი'
      },
      {
        key: 'actions',
        label: ' '
      }
    ],
    branchFields: [
      {
        key: 'name',
        label: 'დასახელება'
      },
      {
        key: 'region',
        label: 'რეგიონი'
      },
      {
        key: 'district',
        label: 'მუნიციპალიტეტი'
      },
      {
        key: 'settlement',
        label: 'დასახლებული პუნქტი'
      },
      {
        key: 'addressDescription',
        label: 'მისამართი'
      },
      {
        key: 'status',
        label: 'სტატუსი'
      },
      {
        key: 'startDate',
        label: 'დაწყების თარიღი'
      },
      {
        key: 'cancelDate',
        label: 'გაუქმების თარიღი'
      },
      {
        key: 'actions',
        label: ' '
      }
    ]
  }),
  async created () {
    let url = baseUrl + '/' + this.id
    let response = await this.$http.get(url)

    this.organization = response.data
  },
  methods: {
    goBack () {
      this.$router.push('/')
    },
    regulationShortText (id) {
      let regulation = this.organization.regulations.find(item => item.id === id)

      if (!regulation) return null

      return regulation.type + '-' + regulation.documentNumber
    },
    showBusinessInfo (business) {
      this.currentBusiness = business

      this.$refs.businessInfoModal.show()
    },
    showBranchInfo (branch) {
      this.currentBranch = branch

      this.$refs.branchInfoModal.show()
    },
    isMessageBusiness (business) {
      let regulation = this.organization.regulations.find(item => item.id === business.regulationId)

      if (!regulation) return false

      return regulation.type === messageType
    },
    getBranchBusinessTypes (branch) {
      if (!branch.businessIds) return []

      let businessPairs = this.organization.businesses.map(item => [item.id, item])
      let businessesMap = new Map(businessPairs)

      return branch.businessIds.map(id => businessesMap.get(id).businessType)
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
    'regulations': regulationsComponent
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
