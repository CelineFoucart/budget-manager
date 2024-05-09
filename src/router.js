import BudgetMonitoring from './views/BudgetMonitoring.vue'
import HomePage from './views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

export default new createRouter({
    history: createWebHistory(0),
    routes: [
        {
            path: `/suivi`,
            component: BudgetMonitoring
        },
        {
            path: `/`,
            component: HomePage
        }
    ]
})
