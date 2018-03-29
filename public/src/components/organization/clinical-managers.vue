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
        :id="idWithPrefix(idPrefix, 'clinical-managers-table')"
        striped
        thead-tr-class="tableHeader"
        responsive
        :items="organization.clinicalManagers"
        :fields="clinicalManagerFields"
      >
        <span slot="actions" slot-scope="data">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="toggleInfoModal(data.item)" v-b-tooltip.hover title="სრული ინფორმაცია">
            <i class="fa fa-info"></i>
          </b-button>
          <b-button variant="primary" v-if="editable" class="round-button" size="sm" @click.stop="onEdit(data.item)" v-b-tooltip.hover title="რედაქტირება">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" v-if="editable" class="round-button" size="sm" @click.stop="onDelete(data.item)" v-b-tooltip.hover title="წაშლა">
            <i class="fa fa-times"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal :id="idWithPrefix(idPrefix, 'clinical-managers-info-modal')" ref="clinicalManagersInfoModal" title="კლინიკური მენეჯერი" hide-footer>
        <b-container>
          <b-row>
            <b-col cols="4.5">
              <img :src="photoSrc()" float="right">
            </b-col>
            <b-col class="infoCol">
              <p><b>პირადი ნომერი:</b> {{currentManager.personalId}}</p>
              <p><b>სახელი:</b> {{currentManager.firstName}}</p>
              <p><b>გვარი:</b> {{currentManager.lastName}}</p>
            </b-col>
          </b-row>
        </b-container>
        <p><b>ტელეფონი:</b> {{currentManager.phone}}</p>
        <p><b>ელ. ფოსტა:</b> {{currentManager.email}}</p>
        <p><b>დანიშვნის თარიღი:</b> {{currentManager.appointingDate | date}}</p>
        <p><b>გათავისუფლების თარიღი:</b> {{currentManager.firingDate | date}}</p>
      </b-modal>
      <b-modal :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal')" ref="clinicalManagersChangeModal" title="კლინიკური მენეჯერი" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel" no-close-on-backdrop>

          <b-row>
            <b-col cols="4">
              <img :src="photoSrc()" float="right">
            </b-col>
            <b-col>
              <div class="rowDirection">
                <b-form-group label="პირადი ნომერი" class="col-md-10" style="padding:0 5px 0 0; margin:0;">
                  <b-form-input :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-personal-id')" v-model="currentManager.personalId" type="text" @keyup.enter.native="callSync()"></b-form-input>
                </b-form-group>
                <b-button variant="primary" class="round-button sync-button" @click="callSync()">
                  <i class="fa fa-search"></i>
                </b-button>
              </div>
              <b-form-group label="სახელი" >
                <b-form-input :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-firstname')" v-model="currentManager.firstName" type="text"></b-form-input>
              </b-form-group>
              <b-form-group label="გვარი" >
                <b-form-input :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-lastname')" v-model="currentManager.lastName" type="text"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>

        <b-form-group label="ტელეფონი">
           <b-form-input :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-phone')" v-model="currentManager.phone" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="ელ. ფოსტა">
           <b-form-input :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-email')" v-model="currentManager.email" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
        <b-form-group label="დანიშვნის თარიღი">
          <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-appoint-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentManager.appointingDate"></datepicker>
        </b-form-group>
        <b-form-group label="გათავისუფლების თარიღი">
          <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'clinical-managers-change-modal-fire-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentManager.firingDate"></datepicker>
        </b-form-group>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {datepickerFormat, highlightToday, formatDateStrict, idWithPrefix} from '../../utils'
import lib from '../../libs'
import {bus} from '../common/bus'

export default {
  name: 'clinical-managers',
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
    currentManager: {
      firstName: '',
      lastName: ''
    },
    datepickerFormat: datepickerFormat,
    highlightToday: highlightToday
  }),
  methods: {
    idWithPrefix: idWithPrefix,
    toggleInfoModal(manager) {
      this.currentManager = Object.assign(this.managerStartState, manager)

      this.$refs.clinicalManagersInfoModal.show()
    },
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

      this.currentManager = this.managerStartState
    },
    onCancel() {
      this.currentManager = this.managerStartState
    },
    onEdit(manager) {
      this.currentManager = Object.assign({}, manager)

      this.$refs.clinicalManagersChangeModal.show()
    },
    onDelete(manager) {
      this.$emit('delete', manager)
    },
    async callSync() {
      try {
        let person = await lib.syncPerson(this.currentManager.personalId)

        this.currentManager.firstName = person.firstname
        this.currentManager.lastName = person.lastname
        this.currentManager.photo = person.photo
      } catch (error) {
        bus.$emit('error', error)
      }
    },
    photoSrc() {
      if (!this.currentManager.photo) return '/static/empty_person.jpg'

      return 'data:image/jpeg;base64,' + this.currentManager.photo
    }
  },
  computed: {
    managerStartState() {
      return {
        firstName: '',
        lastName: ''
      }
    }
  },
  components: {
    Datepicker
  }
}
</script>

<style scoped>
.imgCol img {
  margin-top: 1.7rem;
}

.infoCol {
  margin-top: 4.5%;
}
</style>
