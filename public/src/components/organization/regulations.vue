<template>
  <div>
    <b-card
      class="mb-2"
      header="რეგულაციები"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="regulationsWithoutPermission.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal">
        <i class="fa fa-plus"></i>
      </b-button>
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
          <b-button v-if="editable" variant="primary" class="round-button" size="sm" @click.stop="onEdit(data.item)">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button v-if="editable" variant="danger" class="round-button" size="sm" @click.stop="onDelete(data.item)">
            <i class="fa fa-times"></i>
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
      <b-modal ref="regulationsChangeModal" title="რეგულაცია" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel">
        <b-form-group label="რეგულაციის სახე/ტიპი">
          <b-form-select v-model="currentRegulation.type" class="mb-3 col-md-12">
            <option v-for="type in regulationTypes" :key="type">{{type}}</option>
          </b-form-select>
        </b-form-group>
        <b-form-group :label="isMessage(currentRegulation) ? 'რეგ. ნომერი' : 'მოწმობის N'">
          <b-form-input type="text" v-model="currentRegulation.documentNumber"></b-form-input>
        </b-form-group>
        <b-form-group label="გაცემის საფუძველი">
          <b-form-input type="text" v-model="currentRegulation.issueReason"></b-form-input>
        </b-form-group>
        <b-form-group :label="isMessage(currentRegulation) ? 'შემოსვლის თარიღი' : 'გაცემის თარიღი'">
          <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.issueDate"></datepicker>
        </b-form-group>
        <b-form-group label="ბრძანების ტიპი" v-if="!isMessage(currentRegulation)">
          <b-form-select v-model="currentRegulation.commandType" class="mb-3 col-md-12">
            <option v-for="type in commandTypes" :key="type">{{type}}</option>
          </b-form-select>
        </b-form-group>
        <b-form-group label="რეესტრის N" v-if="!isMessage(currentRegulation)">
          <b-form-input type="text" v-model="currentRegulation.registerNumber"></b-form-input>
        </b-form-group>
        <b-form-group label="გაუქმების საფუძველი" v-if="!isMessage(currentRegulation)">
          <b-form-input type="text" v-model="currentRegulation.cancelReason"></b-form-input>
        </b-form-group>
        <b-form-group label="გაუქმების თარიღი">
          <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.cancelDate"></datepicker>
        </b-form-group>
        <b-form-group label="დუბლიკატი" v-if="!isMessage(currentRegulation)">
          <b-form-checkbox class="duplicateCheckbox" v-model="currentRegulation.hasDuplicate" variant="secondary"></b-form-checkbox>
        </b-form-group>
        <span v-if="currentRegulation.hasDuplicate && !isMessage(currentRegulation)">
          <b-form-group label="დუბლიკატის N">
            <b-form-input type="text" v-model="currentRegulation.duplicateNumber"></b-form-input>
          </b-form-group>
          <b-form-group label="დუბლ. გაცემის საფუძველი">
            <b-form-input type="text" v-model="currentRegulation.duplicateIssueReason"></b-form-input>
          </b-form-group>
          <b-form-group label="დუბლ. გაცემის თარიღი">
            <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentRegulation.duplicateIssueDate"></datepicker>
          </b-form-group>
        </span>
        <b-form-group label="შენიშვნა">
          <b-form-input type="text" v-model="currentRegulation.comment"></b-form-input>
        </b-form-group>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import {permissionType, licenseType, messageType} from './organization-constants'
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, formatDateStrict} from '../../utils'
import lib from '../../libs'

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
        label: ' '
      }
    ],
    datepickerFormat: datepickerFormat,
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
