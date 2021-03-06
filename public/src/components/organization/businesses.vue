<template>
  <div>
    <b-card
      class="mb-2"
      header="საქმიანობები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.businesses.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal" v-b-tooltip.hover title="საქმიანობის დამატება">
        <i class="fa fa-plus"></i>
      </b-button>
      <b-table
        :id="idWithPrefix(idPrefix, 'businesses-table')"
        striped
        thead-tr-class="tableHeader"
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
          <b-button variant="primary" class="round-button" size="sm" @click.stop="showBusinessInfo(data.item)" v-b-tooltip.hover title="სრული ინფორმაცია">
            <i class="fa fa-info"></i>
          </b-button>
          <b-button v-if="editable" variant="primary" class="round-button" size="sm" @click.stop="onEdit(data.item, data.index)" v-b-tooltip.hover title="რედაქტირება">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button v-if="editable" variant="danger" class="round-button" size="sm" @click.stop="onDelete(data.item, data.index)" v-b-tooltip.hover title="წაშლა">
            <i class="fa fa-times"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal :id="idWithPrefix(idPrefix, 'businesses-info-modal')" ref="businessInfoModal" title="საქმიანობა" hide-footer>

        <p>
          <b>რეგულაცია:</b> {{regulationShortText(currentBusiness.regulationId)}}
        </p>

        <p>
          <b>საქმიანობის სახე/ტიპი:</b> {{currentBusiness.businessType}}
        </p>
        <p>
          <b>საქმ. ინვაზ. გაუტკივარებით (სხვა):</b> {{currentBusiness.additionalBusinessInformation}}
        </p>
        <p>
          <b v-if="isMessageBusiness(currentBusiness)">რეგ. ნომერი:</b>
          <b v-else>მოწმობის N:</b>
          {{currentBusiness.documentNumber}}
        </p>
        <p>
          <b>გაცემის საფუძველი:</b> {{currentBusiness.issueReason}}
        </p>
        <p>
          <b v-if="isMessageBusiness(currentBusiness)">შემოსვლის თარიღი:</b>
          <b v-else>გაცემის თარიღი:</b>
          {{currentBusiness.issueDate | date}}
        </p>
        <p>
          <b>გაუქმების საფუძველი:</b> {{currentBusiness.cancelReason}}
        </p>
        <p>
          <b>გაუქმების თარიღი:</b> {{currentBusiness.cancelDate | date}}
        </p>
        <p>
          <b>დუბლიკატი:</b>
          <b-form-checkbox class="duplicateCheckbox" v-model="currentBusiness.hasDuplicate" disabled variant="stone">
          </b-form-checkbox>
        </p>
        <span v-if="currentBusiness.hasDuplicate">
          <p>
            <b>დუბლიკატის N:</b> {{currentBusiness.duplicateNumber}}
          </p>
          <p>
            <b>დუბლ. გაცემის საფუძველი:</b> {{currentBusiness.duplicateIssueReason}}
          </p>
          <p>
            <b>დუბლ. გაცემის თარიღი:</b> {{currentBusiness.duplicateIssueDate | date}}
          </p>
        </span>
      </b-modal>
      <b-modal :id="idWithPrefix(idPrefix, 'businesses-change-modal')" ref="businessChangeModal" title="საქმიანობა" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel" no-close-on-backdrop>

        <b-row class="mb-1" >
          <b-col>
            <b-form-group label="რეგულაცია">

            </b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'businesses-change-modal-regulation-select')" v-model="currentBusiness.regulationId" @change="onRegulationChange" class="mb-1 col-md-12">
              <option v-for="regulation in organization.regulations" :key="regulation.id" :value="regulation.id">{{regulation.type}}-{{regulation.documentNumber}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row >
          <b-col>
            <b-form-group label="საქმიანობის სახე/ტიპი">

            </b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'businesses-change-modal-business-type-select')" v-model="currentBusiness.businessType" class="mb-1 col-md-12">
              <option v-for="type in businessTypes" :key="type">{{type}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row  v-if="currentBusiness.businessType === businessTypeWithInvasiveAnesthesia.type">
          <b-col>
            <b-form-group label="საქმ. ინვაზ. გაუტკივარებით">

            </b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'businesses-change-modal-anesthesia-business-select')" v-model="currentBusinessWithInvasiveAnesthesia" @change="onBusinessWithInvasiveAnesthesiaChange" class="mb-3 col-md-12">
              <option v-for="type in businessTypeWithInvasiveAnesthesia.businessesWithInvasiveAnesthesia" :key="type">{{type}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row v-if="isOtherBusiness()" >
          <b-col>
            <b-form-group label="სხვა">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'businesses-change-modal-business-other')" type="text" v-model="currentBusiness.additionalBusinessInformation"></b-form-input>
          </b-col>
        </b-row>
        <b-row  class="mb-1" >
          <b-col>
            <b-form-group :label="isMessageBusiness(currentBusiness) ? 'რეგ. ნომერი' : 'მოწმობის N'" >

            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input
              :id="idWithPrefix(idPrefix, 'businesses-change-modal-document-number')"
              type="text"
              v-model="currentBusiness.documentNumber"
              :disabled="isMessageBusiness(currentBusiness)">
            </b-form-input>
          </b-col>
        </b-row>
        <b-row   class="mb-1">
          <b-col>
            <b-form-group label="გაცემის საფუძველი" >

            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input
              :id="idWithPrefix(idPrefix, 'businesses-change-modal-issue-reason')"
              type="text"
              v-model="currentBusiness.issueReason"
              :disabled="isMessageBusiness(currentBusiness)">
            </b-form-input>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group :label="isMessageBusiness(currentBusiness) ? 'შემოსვლის თარიღი' : 'გაცემის თარიღი'">

            </b-form-group>
          </b-col>
          <b-col>
            <datepicker
            :highlighted="highlightToday"
            :id="idWithPrefix(idPrefix, 'businesses-change-modal-issue-datepicker')"
            :clear-button="!isMessageBusiness(currentBusiness)"
            monday-first
            language="ge"
            :format="datepickerFormat"
            input-class="picker-input col-md-12"
            v-model="currentBusiness.issueDate"
            :disabled-picker="isMessageBusiness(currentBusiness)">
            </datepicker>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="გაუქმების საფუძველი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'businesses-change-modal-cancel-reason')" type="text" v-model="currentBusiness.cancelReason"></b-form-input>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="გაუქმების თარიღი">
            </b-form-group>
          </b-col>
          <b-col>
            <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'businesses-change-modal-cancel-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentBusiness.cancelDate"></datepicker>
          </b-col>
        </b-row>
        <b-row  class="mb-1" v-if="!isMessageBusiness(currentBusiness)">
          <b-col>
            <b-form-group label="დუბლიკატი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-checkbox :id="idWithPrefix(idPrefix, 'businesses-change-modal-duplicate-checkbox')" class="duplicateCheckbox" v-model="currentBusiness.hasDuplicate" @change="onDuplicateCheckboxChange"></b-form-checkbox>
          </b-col>
        </b-row>
        <span v-if="currentBusiness.hasDuplicate && !isMessageBusiness(currentBusiness)">
          <b-row  class="mb-1">
            <b-col>
              <b-form-group label="დუბლიკატის N">
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-input :id="idWithPrefix(idPrefix, 'businesses-change-modal-duplicate-number')" type="text" v-model="currentBusiness.duplicateNumber"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-1" >
            <b-col>
              <b-form-group label="დუბლ. გაცემის საფუძველი">
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-input :id="idWithPrefix(idPrefix, 'businesses-change-modal-duplicate-issue-reason')" type="text" v-model="currentBusiness.duplicateIssueReason"></b-form-input>
            </b-col>
          </b-row>
          <b-row  class="mb-1">
            <b-col>
              <b-form-group label="დუბლ. გაცემის თარიღი">
              </b-form-group>
            </b-col>
            <b-col>
              <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'businesses-change-modal-duplicate-issue-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentBusiness.duplicateIssueDate"></datepicker>
            </b-col>
          </b-row>

        </span>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import {messageType, businessOther} from './organization-constants'
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, highlightToday, formatDateStrict, idWithPrefix} from '../../utils'
import lib from '../../libs'

export default {
  name: 'businesses',
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
    currentBusiness: {},
    currentBusinessWithInvasiveAnesthesia: null,
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
        label: 'მინიჭების/შემოსვლის თარიღი',
        formatter: formatDateStrict
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
    regulationTypes: [],
    businessTypeWithInvasiveAnesthesia: {},
    datepickerFormat: datepickerFormat,
    highlightToday: highlightToday
  }),
  async created() {
    this.regulationTypes = await lib.fetchRegulationTypes()

    let messageRegulationType = this.regulationTypes.find(item => item.regulationType === messageType)

    this.businessTypeWithInvasiveAnesthesia = messageRegulationType.businessTypes.find(item => !!item.businessesWithInvasiveAnesthesia)
  },
  methods: {
    idWithPrefix: idWithPrefix,
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
    },
    toggleAddModal() {
      this.currentBusiness = {}
      this.currentBusinessWithInvasiveAnesthesia = null

      this.$refs.businessChangeModal.show()
    },
    onEdit(business, index) {
      this.currentBusiness = Object.assign({}, business)
      this.initCurrentBusinessWithInvasiveAnesthesia()

      this.$refs.businessChangeModal.show()
    },
    onDelete(business, index) {
      this.$emit('delete', business, index)
    },
    onSave() {
      if (this.currentBusiness.id) {
        this.$emit('edit', this.currentBusiness)
      } else {
        this.$emit('add', this.currentBusiness)
      }

      this.currentBusiness = {}
      this.currentBusinessWithInvasiveAnesthesia = null
    },
    onCancel() {
      this.currentBusiness = {}
      this.currentBusinessWithInvasiveAnesthesia = null
    },
    isOtherBusiness() {
      return this.isMessageBusiness(this.currentBusiness) &&
             this.currentBusinessWithInvasiveAnesthesia === businessOther
    },
    onBusinessWithInvasiveAnesthesiaChange(value) {
      if (value !== businessOther) {
        this.currentBusiness.additionalBusinessInformation = value

        return
      }

      this.currentBusiness.additionalBusinessInformation = null
    },
    initCurrentBusinessWithInvasiveAnesthesia() {
      if (!this.isMessageBusiness(this.currentBusiness) || !this.currentBusiness.additionalBusinessInformation) return

      if (
        this.businessTypeWithInvasiveAnesthesia.businessesWithInvasiveAnesthesia.includes(
          this.currentBusiness.additionalBusinessInformation
        )
      ) {
        this.currentBusinessWithInvasiveAnesthesia = this.currentBusiness.additionalBusinessInformation

        return
      }

      this.currentBusinessWithInvasiveAnesthesia = businessOther
    },
    onRegulationChange(regulationId) {
      let regulation = this.organization.regulations.find(item => item.id === regulationId)

      if (regulation.type === messageType) {
        this.currentBusiness.documentNumber = regulation.documentNumber
        this.currentBusiness.issueReason = regulation.issueReason
        this.currentBusiness.issueDate = regulation.issueDate

        this.currentBusiness.hasDuplicate = false
      }
    },
    onDuplicateCheckboxChange(value) {
      if (!value) {
        this.clearDuplicateInputs()
      }
    },
    clearDuplicateInputs() {
      this.currentBusiness.duplicateNumber = null
      this.currentBusiness.duplicateIssueReason = null
      this.currentBusiness.duplicateIssueDate = null
    }
  },
  computed: {
    businessTypes() {
      let regulation = this.organization.regulations.find(item => item.id === this.currentBusiness.regulationId)
      if (!regulation) return []

      let regulationType = this.regulationTypes.find(type => type.regulationType === regulation.type)
      if (!regulationType) return []

      return regulationType.businessTypes.map(item => item.type)
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
