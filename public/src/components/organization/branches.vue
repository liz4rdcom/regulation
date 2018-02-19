<template>
  <div>
    <b-card
      class="mb-2"
      header="ფილიალები"
      header-bg-variant="secondary"
      header-text-variant="white"
      v-if="organization.branches.length > 0"
    >
      <b-table
        responsive
        :items="organization.branches"
        :fields="branchFields"
      >
        <span slot="actions" slot-scope="data">
          <b-button variant="primary" class="round-button" size="sm" @click.stop="showBranchInfo(data.item)">
            <i class="fa fa-info"></i>
          </b-button>
        </span>
      </b-table>
      <b-modal ref="branchInfoModal" title="ფილიალი" hide-footer>
        <p><b>დასახელება:</b> {{currentBranch.name}}</p>
        <p><b>ფილიალის სტატუსი:</b> {{currentBranch.status}}</p>
        <p><b>რეგისტრაციის N:</b> {{currentBranch.registrationNumber}}</p>
        <p><b>ფილ. ფუნქციონ. საფუძველი:</b> {{currentBranch.functioningReason}}</p>
        <p><b>დაწყების თარიღი:</b> {{currentBranch.startDate}}</p>
        <p><b>გაუქმების თარიღი:</b> {{currentBranch.cancelDate}}</p>
        <p><b>რეგიონი:</b> {{currentBranch.region}}</p>
        <p><b>მუნიციპალიტეტი:</b> {{currentBranch.district}}</p>
        <p><b>დასახლებული პუნქტი:</b> {{currentBranch.settlement}}</p>
        <p><b>მისამართი:</b> {{currentBranch.addressDescription}}</p>
        <p><b>საფოსტო ინდექსი:</b> {{currentBranch.postalCode}}</p>
        <p>
          <b>საქმიანობები: <br /></b>
          <ul>
            <li v-for="businessType in getBranchBusinessTypes(currentBranch)" :key="businessType">
              {{businessType}}
            </li>
          </ul>
        </p>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'branches',
  props: {
    organization: {},
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    currentBranch: {},
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
        label: 'დაწყების თარიღი'
      },
      {
        key: 'cancelDate',
        label: 'გაუქმების თარიღი'
      },
      {
        key: 'actions',
        label: ' '
      }
    ]
  }),
  methods: {
    showBranchInfo (branch) {
      this.currentBranch = branch

      this.$refs.branchInfoModal.show()
    },
    getBranchBusinessTypes (branch) {
      if (!branch.businessIds) return []

      let businessPairs = this.organization.businesses.map(item => [item.id, item])
      let businessesMap = new Map(businessPairs)

      return branch.businessIds.map(id => businessesMap.get(id).businessType)
    }
  }
}
</script>

<style scoped>
</style>
