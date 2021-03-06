<template>
  <div>
    <b-card
      class="mb-2"
      header="რეგულაციები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="regulationsWithoutPermission.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal" v-b-tooltip.hover title="რეგულაციის დამატება">
        <i class="fa fa-plus"></i>
      </b-button>
      <b-table
        :id="idWithPrefix(idPrefix, 'regulations-table')"
        striped
        thead-tr-class="tableHeader"
        responsive
        :items="regulationsWithoutPermission"
        :fields="regulationFields"
      >
        <span slot="hasDuplicate" slot-scope="data">
          <b-form-checkbox v-model="data.item.hasDuplicate" disabled>
          </b-form-checkbox>
        </span>
        <span slot="actions" slot-scope="data">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="showRegulationInfo(data.item)" v-b-tooltip.hover title="სრული ინფორმაცია">
            <i class="fa fa-info"></i>
          </b-button>
          <b-button v-if="editable" variant="primary" class="round-button" size="sm" @click.stop="onEdit(data.item)" v-b-tooltip.hover title="რედაქტირება">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button v-if="editable" variant="danger" class="round-button" size="sm" @click.stop="onDelete(data.item)" v-b-tooltip.hover title="წაშლა">
            <i class="fa fa-times"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal :id="idWithPrefix(idPrefix, 'regulations-info-modal')" ref="regulationInfoModal" title="რეგულაცია" hide-footer>
        <p>
          <b>რეგულაციის სახე/ტიპი:</b> {{currentRegulation.type}}
        </p>
        <p>
          <b v-if="isMessage(currentRegulation)">რეგ. ნომერი:</b>
          <b v-else>მოწმობის N:</b>
          {{currentRegulation.documentNumber}}
        </p>
        <p>
          <b>გაცემის საფუძველი:</b> {{currentRegulation.issueReason}}
        </p>
        <p>
          <b v-if="isMessage(currentRegulation)">შემოსვლის თარიღი:</b>
          <b v-else>გაცემის თარიღი:</b>
          {{currentRegulation.issueDate | date}}
        </p>
        <p>
          <b>ბრძანების ტიპი:</b> {{currentRegulation.commandType}}
        </p>
        <p>
          <b>რეესტრის N:</b> {{currentRegulation.registerNumber}}
        </p>
        <p>
          <b>გაუქმების საფუძველი:</b> {{currentRegulation.cancelReason}}
        </p>
        <p>
          <b>გაუქმების თარიღი:</b> {{currentRegulation.cancelDate | date}}
        </p>
        <p>
          <b>დუბლიკატი:</b>
          <b-form-checkbox class="duplicateCheckbox" v-model="currentRegulation.hasDuplicate" disabled="" variant="stone">
          </b-form-checkbox>
        </p>
        <span v-if="currentRegulation.hasDuplicate">
          <p>
            <b>დუბლიკატის N:</b> {{currentRegulation.duplicateNumber}}
          </p>
          <p>
            <b>დუბლ. გაცემის საფუძველი:</b> {{currentRegulation.duplicateIssueReason}}
          </p>
          <p>
            <b>დუბლ. გაცემის თარიღი:</b> {{currentRegulation.duplicateIssueDate | date}}
          </p>
        </span>
        <p>
          <b>შენიშვნა:</b> {{currentRegulation.comment}}
        </p>
      </b-modal>
      <b-modal :id="idWithPrefix(idPrefix, 'regulations-change-modal')" ref="regulationsChangeModal" title="რეგულაცია" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel" no-close-on-backdrop>
        <b-row class="mb-1 ">
          <b-col>
            <b-form-group label="რეგულაციის სახე/ტიპი"></b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'regulations-change-modal-regulation-type-select')" v-model="currentRegulation.type" @change="onTypeChange">
              <option v-for="type in regulationTypes" :key="type">{{type}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row class="mb-1 ">
          <b-col>
            <b-form-group :label="isMessage(currentRegulation) ? 'რეგ. ნომერი' : 'მოწმობის N'" >
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-document-number')" type="text" v-model="currentRegulation.documentNumber"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-1 ">
          <b-col>
            <b-form-group label="გაცემის საფუძველი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-issue-reason')" type="text" v-model="currentRegulation.issueReason"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-1 ">
          <b-col>
            <b-form-group :label="isMessage(currentRegulation) ? 'შემოსვლის თარიღი' : 'გაცემის თარიღი'">
            </b-form-group>
          </b-col>
          <b-col>
            <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'regulations-change-modal-issue-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.issueDate"></datepicker>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="!isMessage(currentRegulation)">
          <b-col>
            <b-form-group label="ბრძანების ტიპი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'regulations-change-modal-command-type-select')" v-model="currentRegulation.commandType" class="mb-3 col-md-12">
              <option slot="first" :value="null" disabled>-- აირჩიეთ ბრძანების ტიპი --</option>
              <option v-for="type in commandTypes" :key="type">{{type}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row class="mb-1 " v-if="!isMessage(currentRegulation)">
          <b-col>
            <b-form-group label="რეესტრის N">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-register-number')" type="text" v-model="currentRegulation.registerNumber"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="!isMessage(currentRegulation)">
          <b-col>
            <b-form-group label="გაუქმების საფუძველი" >
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-cancel-reason')" type="text" v-model="currentRegulation.cancelReason"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-1 ">
          <b-col>
            <b-form-group label="გაუქმების თარიღი">
            </b-form-group>
          </b-col>
          <b-col>
            <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'regulations-change-modal-cancel-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.cancelDate"></datepicker>
          </b-col>
        </b-row>
        <b-row class="mb-1" v-if="!isMessage(currentRegulation)">
          <b-col>
            <b-form-group label="დუბლიკატი" >
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-checkbox :id="idWithPrefix(idPrefix, 'regulations-change-modal-duplicate-checkbox')" class="duplicateCheckbox" v-model="currentRegulation.hasDuplicate" @change="onDuplicateCheckboxChange"></b-form-checkbox>
          </b-col>
        </b-row>
        <span v-if="currentRegulation.hasDuplicate && !isMessage(currentRegulation)">
          <b-row class="mb-1" >
            <b-col>
              <b-form-group label="დუბლიკატის N">
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-duplicate-number')" type="text" v-model="currentRegulation.duplicateNumber"></b-form-input>
           </b-col>
          </b-row>
          <b-row class="mb-1" >
            <b-col>
              <b-form-group label="დუბლ. გაცემის საფუძველი">
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-input :id="idWithPrefix(idPrefix, 'regulations-change-modal-duplicate-issue-reason')" type="text" v-model="currentRegulation.duplicateIssueReason"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-1" >
            <b-col>
              <b-form-group label="დუბლ. გაცემის თარიღი">
              </b-form-group>
            </b-col>
            <b-col>
              <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'regulations-change-modal-duplicate-issue-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.duplicateIssueDate"></datepicker>
            </b-col>
          </b-row>
        </span>
        <b-row class="mb-1" >
          <b-col>
            <b-form-group label="შენიშვნა">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-textarea :id="idWithPrefix(idPrefix, 'regulations-change-modal-comment')" v-model="currentRegulation.comment" :rows="2" :max-rows="3">
            </b-form-textarea>
          </b-col>
        </b-row>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import {permissionType, licenseType, messageType} from './organization-constants'
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, highlightToday, formatDateStrict, idWithPrefix} from '../../utils'
import lib from '../../libs'

export default {
  name: 'regulations',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    },
    idPrefix: {
      type: String
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
        label: 'გაცემის/შემოსვლის თარიღი',
        formatter: formatDateStrict
      },
      {
        key: 'registerNumber',
        label: 'რეესტრის ნომერი'
      },
      {
        key: 'cancelDate',
        label: 'გაუქმების თარიღი',
        formatter: formatDateStrict
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
        label: 'დუბლიკატის გაცემის თარიღი',
        formatter: formatDateStrict
      },
      {
        key: 'actions',
        label: ' ',
        class: 'actions'
      }
    ],
    datepickerFormat: datepickerFormat,
    highlightToday: highlightToday,
    commandTypes: [],
    regulationTypes: [
      licenseType,
      messageType
    ]
  }),
  async created() {
    this.commandTypes = await lib.fetchCommandTypes()
  },
  methods: {
    idWithPrefix: idWithPrefix,
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
    },
    toggleAddModal() {
      this.currentRegulation = {}

      this.$refs.regulationsChangeModal.show()
    },
    onEdit(regulation) {
      this.currentRegulation = Object.assign({}, regulation)

      this.$refs.regulationsChangeModal.show()
    },
    onDelete(regulation) {
      this.$emit('delete', regulation)
    },
    onSave() {
      if (this.currentRegulation.id) {
        this.$emit('edit', this.currentRegulation)
      } else {
        this.$emit('add', this.currentRegulation)
      }

      this.currentRegulation = {}
    },
    onCancel() {
      this.currentRegulation = {}
    },
    onTypeChange(type) {
      if (type === messageType) {
        this.currentRegulation.registerNumber = null
        this.currentRegulation.commandType = null
        this.currentRegulation.cancelReason = null
        this.currentRegulation.hasDuplicate = false

        this.clearDuplicateInputs()
      }
    },
    onDuplicateCheckboxChange(value) {
      if (!value) {
        this.clearDuplicateInputs()
      }
    },
    clearDuplicateInputs() {
      this.currentRegulation.duplicateNumber = null
      this.currentRegulation.duplicateIssueReason = null
      this.currentRegulation.duplicateIssueDate = null
    }
  },
  computed: {
    regulationsWithoutPermission () {
      return this.organization.regulations
        .filter(item => item.type !== permissionType)
    }
  },
  components: {
    Datepicker
  }
}
</script>

<style scoped>
.duplicateCheckbox {
  display: inline-block;
  margin-left: 0.5rem;
}
</style>
