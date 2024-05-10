import BudgetMonitoring from './views/BudgetMonitoring.vue'
import ConfigPage from './views/ConfigPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

export default new createRouter({
    history: createWebHistory(0),
    routes: [
        {
            path: `/`,
            component: BudgetMonitoring
        },
        {
            path: `/config`,
            component: ConfigPage
        }
    ]
})
