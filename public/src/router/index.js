import Vue from 'vue'
import Router from 'vue-router'
import Organizations from '../components/organization/organizations'
import OrganizationDetails from '../components/organization/organization-details'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'organizations',
      component: Organizations
    },
    {
      path: '/:id',
      name: 'organization-details',
      component: OrganizationDetails,
      props: true
    }
  ]
})
