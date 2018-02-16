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
      <b-card
        class="mb-2"
        header="კლინიკური მენეჯერი"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.clinicalManagers.length > 0"
      >
        <b-table
          :items="organization.clinicalManagers"
          :fields="clinicalManagerFields"
        >
        </b-table>
      </b-card>
      <b-card
        class="mb-2"
        header="ხელმძღვანელი"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.managers.length > 0"
      >
        <b-table
          :items="organization.managers"
          :fields="managerFields"
        >
        </b-table>
      </b-card>
      <b-card
        class="mb-2"
        header="დამფუძნებელი"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.founders.length > 0"
      >
        <b-table
          :items="organization.founders"
          :fields="founderFields"
        >
        </b-table>
      </b-card>
      <b-card
        class="mb-2"
        header="რეგულაციები"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="regulationsWithoutPermission.length > 0"
      >
        <b-table
          :items="regulationsWithoutPermission"
          :fields="regulationFields"
        >
          <span slot="hasDuplicate" slot-scope="data">
            <b-form-checkbox v-model="data.item.hasDuplicate" disabled>
            </b-form-checkbox>
          </span>
          <span slot="actions" slot-scope="data">
            <b-button variant="primary" @click.stop="" class="round-button" size="sm">
              <i class="fa fa-info"></i>
            </b-button>
          </span>
        </b-table>
      </b-card>
      <!-- <b-card
        class="mb-2"
        header="დამფუძნებელი"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.founders.length > 0"
      >
        <b-table
          :items="organization.founders"
          :fields="founderFields"
        >
        </b-table>
      </b-card>
      <b-card
        class="mb-2"
        header="დამფუძნებელი"
        header-bg-variant="secondary"
        header-text-variant="white"
        v-if="organization.founders.length > 0"
      >
        <b-table
          :items="organization.founders"
          :fields="founderFields"
        >
        </b-table>
      </b-card> -->

    </div>
  </div>
</template>

<script>
import {baseUrl, permissionType} from './organization-constants'

export default {
  name: 'organization-details',
  props: ['id'],
  data: () => ({
    organization: {
      regulations: [],
      clinicalManagers: [],
      managers: [],
      founders: []
    },
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
    ],
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
    ],
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
    ],
    regulationFields: [
      {
        key: 'type',
        label: 'რეგულაციის სახე/ტიპი'
      },
      {
        key: 'documentNumber',
        label: 'მოწმობის ნომერი/რეგ. N'
      },
      {
        key: 'issueDate',
        label: 'გაცემის/შემოსვლის თარიღი'
      },
      {
        key: 'registerNumber',
        label: 'რეესტრის ნომერი'
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
    }
  },
  computed: {
    permission () {
      return this.organization.regulations
        .find(item => item.type === permissionType)
    },
    regulationsWithoutPermission () {
      return this.organization.regulations
        .filter(item => item.type !== permissionType)
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

.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}
</style>
