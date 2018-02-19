<template>
  <div>
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
  </div>
</template>

<script>
import {messageType} from './organization-constants'

export default {
  name: 'businesses',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    currentBusiness: {},
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
    ]
  }),
  methods: {
    regulationShortText (id) {
      let regulation = this.organization.regulations.find(item => item.id === id)

      if (!regulation) return null

      return regulation.type + '-' + regulation.documentNumber
    },
    showBusinessInfo (business) {
      this.currentBusiness = business

      this.$refs.businessInfoModal.show()
    },
    isMessageBusiness (business) {
      let regulation = this.organization.regulations.find(item => item.id === business.regulationId)

      if (!regulation) return false

      return regulation.type === messageType
    }
  }
}
</script>

<style scoped>
.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}
</style>
