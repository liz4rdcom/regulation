<template>
  <div>
    <b-card
      class="mb-2"
      header="ხელმძღვანელები"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="organization.managers.length > 0 || editable"
    >
      <b-button variant="primary" class="addButton round-button" size="sm" v-if="editable" @click="toggleAddModal" v-b-tooltip.hover title="ხელმძღვანელის დამატება">
        <i class="fa fa-plus"></i>
      </b-button>
      <b-table
        responsive
        :items="organization.managers"
        :fields="managerFields"
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
      <b-modal ref="managersChangeModal" title="მენეჯერი" ok-title="შენახვა" cancel-title="გაუქმება" @ok="onSave" @cancel="onCancel">
        <b-form-group label="თანამდებობა">
           <b-form-input v-model="currentManager.position" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
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
        <b-form-group label="სხვა">
           <b-form-input v-model="currentManager.other" type="text" class="col-md-12"></b-form-input>
        </b-form-group>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'managers',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
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
      },
      {
        key: 'actions',
        label: ' ',
        class: 'actions'
      }
    ],
    currentManager: {}
  }),
  methods: {
    toggleAddModal() {
      this.currentManager = {}

      this.$refs.managersChangeModal.show()
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

      this.$refs.managersChangeModal.show()
    },
    onDelete(manager) {
      this.$emit('delete', manager)
    }
  }
}
</script>

<style scoped>
</style>
