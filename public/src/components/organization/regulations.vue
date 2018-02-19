<template>
  <div>
    <b-card
      class="mb-2"
      header="რეგულაციები"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="regulationsWithoutPermission.length > 0"
    >
      <b-table
        responsive
        :items="regulationsWithoutPermission"
        :fields="regulationFields"
      >
        <span slot="hasDuplicate" slot-scope="data">
          <b-form-checkbox v-model="data.item.hasDuplicate" disabled>
          </b-form-checkbox>
        </span>
        <span slot="actions" slot-scope="data">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="showRegulationInfo(data.item)">
            <i class="fa fa-info"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal ref="regulationInfoModal" title="რეგულაცია" hide-footer>
        <p><b>რეგულაციის სახე/ტიპი:</b> {{currentRegulation.type}}</p>
        <p>
          <b v-if="isMessage(currentRegulation)">რეგ. ნომერი:</b>
          <b v-else>მოწმობის N:</b>
          {{currentRegulation.documentNumber}}
        </p>
        <p><b>გაცემის საფუძველი:</b> {{currentRegulation.issueReason}}</p>
        <p>
          <b v-if="isMessage(currentRegulation)">შემოსვლის თარიღი:</b>
          <b v-else>გაცემის თარიღი:</b>
          {{currentRegulation.issueDate}}
        </p>
        <p><b>ბრძანების ტიპი:</b> {{currentRegulation.commandType}}</p>
        <p><b>რეესტრის N:</b> {{currentRegulation.registerNumber}}</p>
        <p><b>გაუქმების საფუძველი:</b> {{currentRegulation.cancelReason}}</p>
        <p><b>გაუქმების თარიღი:</b> {{currentRegulation.cancelDate}}</p>
        <p>
          <b>დუბლიკატი:</b>
          <b-form-checkbox class="duplicateCheckbox" v-model="currentRegulation.hasDuplicate" disabled variant="secondary">
          </b-form-checkbox>
        </p>
        <span v-if="currentRegulation.hasDuplicate">
          <p><b>დუბლიკატის N:</b> {{currentRegulation.duplicateNumber}}</p>
          <p><b>დუბლ. გაცემის საფუძველი:</b> {{currentRegulation.duplicateIssueReason}}</p>
          <p><b>დუბლ. გაცემის თარიღი:</b> {{currentRegulation.duplicateIssueDate}}</p>
        </span>
        <p><b>შენიშვნა:</b> {{currentRegulation.comment}}</p>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import {permissionType, messageType} from './organization-constants'

export default {
  name: 'regulations',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    currentRegulation: {},
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
  methods: {
    regulationShortText (id) {
      let regulation = this.organization.regulations.find(item => item.id === id)

      if (!regulation) return null

      return regulation.type + '-' + regulation.documentNumber
    },
    showRegulationInfo (regulation) {
      this.currentRegulation = regulation

      this.$refs.regulationInfoModal.show()
    },
    isMessage (regulation) {
      return regulation.type === messageType
    }
  },
  computed: {
    regulationsWithoutPermission () {
      return this.organization.regulations
        .filter(item => item.type !== permissionType)
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
