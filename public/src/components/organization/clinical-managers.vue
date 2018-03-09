<template>
  <div>
    <b-card
      class="mb-2"
      header="კლინიკური მენეჯერები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.clinicalManagers.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal" v-b-tooltip.hover title="კლინიკური მენეჯერის დამატება">
        <i class="fa fa-plus"></i>
      </b-button>
      <b-table
        responsive
        :items="organization.clinicalManagers"
        :fields="clinicalManagerFields"
      >
        <span slot="actions" slot-scope="data" v-if="editable">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="onEdit(data.item)" v-b-tooltip.hover title="რედაქტირება">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" class="round-button" size="sm" @click.stop="onDelete(data.item)" v-b-tooltip.hover title="წაშლა">
            <i class="fa fa-times"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal ref="clinicalManagersChangeModal" title="კლინიკური მენეჯერი" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel">
        <b-form-group label="სახელი">
           <b-form-input v-model="currentManager.firstName" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="გვარი">
           <b-form-input v-model="currentManager.lastName" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="პირადი ნომერი">
           <b-form-input v-model="currentManager.personalId" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="ტელეფონი">
           <b-form-input v-model="currentManager.phone" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="ელ. ფოსტა">
           <b-form-input v-model="currentManager.email" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="დანიშვნის თარიღი">
          <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentManager.appointingDate"></datepicker>
        </b-form-group>
        <b-form-group label="გათავისუფლების თარიღი">
          <datepicker clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentManager.firingDate"></datepicker>
        </b-form-group>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, formatDateStrict} from '../../utils'

export default {
  name: 'clinical-managers',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
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
        label: 'დანიშვნის თარიღი',
        formatter: formatDateStrict
      },
      {
        key: 'firingDate',
        label: 'გათავისუფლების თარიღი',
        formatter: formatDateStrict
      },
      {
        key: 'actions',
        label: ' ',
        class: 'actions'
      }
    ],
    currentManager: {},
    datepickerFormat: datepickerFormat
  }),
  methods: {
    toggleAddModal() {
      this.currentManager = {}

      this.$refs.clinicalManagersChangeModal.show()
    },
    onSave() {
      if (this.currentManager.id) {
        this.$emit('edit', this.currentManager)
      } else {
        this.$emit('add', this.currentManager)
      }

      this.currentManager = {}
    },
    onCancel() {
      this.currentManager = {}
    },
    onEdit(manager) {
      this.currentManager = Object.assign({}, manager)

      this.$refs.clinicalManagersChangeModal.show()
    },
    onDelete(manager) {
      this.$emit('delete', manager)
    }
  },
  components: {
    Datepicker
  }
}
</script>

<style scoped>
</style>
