<template>
  <div>
    <b-card
      class="mb-2"
      header="ფილიალები"
      header-bg-variant="stone"
      header-text-variant="white"
      v-if="organization.branches.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal" v-b-tooltip.hover title="ფილიალის დამატება">
        <i class="fa fa-plus"></i>
      </b-button>
      <b-table
        :id="idWithPrefix(idPrefix, 'branches-table')"
        striped
        thead-tr-class="tableHeader"
        responsive
        :items="organization.branches"
        :fields="branchFields"
      >
        <span slot="actions" slot-scope="data">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="showBranchInfo(data.item)" v-b-tooltip.hover title="სრული ინფორმაცია">
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
      <b-modal :id="idWithPrefix(idPrefix, 'branches-info-modal')" ref="branchInfoModal" title="ფილიალი" hide-footer>
        <p>
          <b>დასახელება:</b> {{currentBranch.name}}
        </p>
        <p>
          <b>ფილიალის სტატუსი:</b> {{currentBranch.status}}
        </p>
        <p>
          <b>რეგისტრაციის N:</b> {{currentBranch.registrationNumber}}
        </p>
        <p>
          <b>ფილ. ფუნქციონ. საფუძველი:</b> {{currentBranch.functioningReason}}
        </p>
        <p>
          <b>დაწყების თარიღი:</b> {{currentBranch.startDate | date}}
        </p>
        <p>
          <b>გაუქმების თარიღი:</b> {{currentBranch.cancelDate | date}}
        </p>
        <p>
          <b>რეგიონი:</b> {{currentBranch.region}}
        </p>
        <p>
          <b>მუნიციპალიტეტი:</b> {{currentBranch.district}}
        </p>
        <p>
          <b>დასახლებული პუნქტი:</b> {{currentBranch.settlement}}
        </p>
        <p>
          <b>მისამართი:</b> {{currentBranch.addressDescription}}
        </p>
        <p>
          <b>საფოსტო ინდექსი:</b> {{currentBranch.postalCode}}
        </p>
        <p>
          <b>
            საქმიანობები: <br />
          </b>
          <ul>
            <li v-for="businessType in getBranchBusinessTypes(currentBranch)" :key="businessType">
              {{businessType}}
            </li>
          </ul>
        </p>
      </b-modal>
      <b-modal :id="idWithPrefix(idPrefix, 'branches-change-modal')" ref="branchesChangeModal" title="ფილიალი" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel" no-close-on-backdrop>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="დასახელება">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'branches-change-modal-name')" type="text" v-model="currentBranch.name"></b-form-input>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="ფილიალის სტატუსი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-select :id="idWithPrefix(idPrefix, 'branches-change-modal-status-select')" v-model="currentBranch.status" class="mb-3 col-md-12">
              <option v-for="status in statuses" :key="status">{{status}}</option>
            </b-form-select>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="რეგისტრაციის N">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'branches-change-modal-registration-number')" type="text" v-model="currentBranch.registrationNumber"></b-form-input>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="ფილ. ფუნქციონ. საფუძველი">
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-input :id="idWithPrefix(idPrefix, 'branches-change-modal-functioning-reason')" type="text" v-model="currentBranch.functioningReason"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col>
            <b-form-group label="დაწყების თარიღი">
            </b-form-group>
          </b-col>
          <b-col>
            <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'branches-change-modal-start-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentBranch.startDate"></datepicker>
          </b-col>
        </b-row>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="გაუქმების თარიღი">
            </b-form-group>
          </b-col>
          <b-col>
            <datepicker :highlighted="highlightToday" :id="idWithPrefix(idPrefix, 'branches-change-modal-cancel-datepicker')" clear-button monday-first language="ge" :format="datepickerFormat" input-class="picker-input col-md-12" v-model="currentBranch.cancelDate"></datepicker>
          </b-col>
        </b-row>
        <locations
          :idPrefix="idWithPrefix(idPrefix, 'branches-modal')"
          :locations="locations"
          :currentLocationName="currentBranch.region"
          :currentLocationUnitName="currentBranch.district"
          :currentSettlementName="currentBranch.settlement"
          :currentAddress="currentBranch.addressDescription"
          :currentPostalCode="currentBranch.postalCode"
          stacked
          inputClass="col-md-12"
          @change="onAddressChanged">
        </locations>
        <b-row  class="mb-1">
          <b-col>
            <b-form-group label="საქმიანობები">
            </b-form-group>
          </b-col>
          <b-col cols="9">
            <ul class="checkboxes-list">
              <li v-for="pair in getBusinessCheckboxPairs()" :key="pair[1].id" >
                <b-form-checkbox :id="idWithPrefix(idPrefix, 'branches-modal-checkbox-' + pair[1].id)" :checked="pair[0]" @change="addBusinessToBranch($event, pair[1])">
                  {{pair[1].businessType}}
                </b-form-checkbox>
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker'
  import {datepickerFormat, highlightToday, formatDateStrict, idWithPrefix} from '../../utils'
  import lib from '../../libs'
  import locationsComponent from '../common/locations'

  export default {
  name: 'branches',
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
    currentBranch: {
      businessIds: []
    },
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
        label: 'დაწყების თარიღი',
        formatter: formatDateStrict
      },
      {
        key: 'cancelDate',
        label: 'გაუქმების თარიღი',
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
    statuses: [],
    locations: []
  }),
  async created() {
    [
      this.statuses,
      this.locations
    ] = await Promise.all([
      lib.fetchStatuses(),
      lib.fetchLocations()
    ])
  },
  methods: {
    idWithPrefix: idWithPrefix,
    branchStartState() {
      return {
        businessIds: []
      }
    },
    showBranchInfo (branch) {
      this.currentBranch = branch

      this.$refs.branchInfoModal.show()
    },
    getBranchBusinessTypes (branch) {
      if (!branch.businessIds) return []

      let businessPairs = this.organization.businesses.map(item => [item.id, item])
      let businessesMap = new Map(businessPairs)

      return branch.businessIds.map(id => businessesMap.get(id).businessType)
    },
    getBusinessCheckboxPairs() {
      return this.organization.businesses
        .map(item => {
          let includes = this.currentBranch.businessIds.includes(item.id)
          return [includes, item]
        })
    },
    addBusinessToBranch(value, business) {
      if (value) {
        this.currentBranch.businessIds.push(business.id)

        return
      }

      let index = this.currentBranch.businessIds.findIndex(id => id === business.id)

      this.currentBranch.businessIds.splice(index, 1)
    },
    toggleAddModal() {
      this.currentBranch = this.branchStartState()

      this.$refs.branchesChangeModal.show()
    },
    onEdit(branch) {
      this.currentBranch = Object.assign(this.branchStartState(), branch)

      this.$refs.branchesChangeModal.show()
    },
    onDelete(branch) {
      this.$emit('delete', branch)
    },
    onSave() {
      if (this.currentBranch.id) {
        this.$emit('edit', this.currentBranch)
      } else {
        this.$emit('add', this.currentBranch)
      }

      this.currentBranch = this.branchStartState()
    },
    onCancel() {
      this.currentBranch = this.branchStartState()
    },
    onAddressChanged(location) {
      this.currentBranch.region = location.locationName
      this.currentBranch.district = location.locationUnitName
      this.currentBranch.settlement = location.settlement
      this.currentBranch.addressDescription = location.address
      this.currentBranch.postalCode = location.postalCode
    }
  },
  components: {
    Datepicker,
    'locations': locationsComponent
  }
}
</script>

<style scoped>
.checkboxes-list {
  list-style-type: none;
}
</style>
