import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import views
import Home from './views/Home.vue'
import CountryTrends from './views/CountryTrends.vue'
import HappinessComparison from './views/HappinessComparison.vue'
import RegionalView from './views/RegionalView.vue'
import IndiaDashboard from './views/IndiaDashboard.vue'
import RegionComparison from './views/RegionComparison.vue'

// Define routes
const routes = [
  { path: '/', component: Home },
  { path: '/country-trends', component: CountryTrends },
  { path: '/happiness-comparison', component: HappinessComparison },
  { path: '/regional-view', component: RegionalView },
  { path: '/india-dashboard', component: IndiaDashboard },
  { path: '/region-comparison', component: RegionComparison }
]

// Create router
const router = createRouter({
  history: createWebHistory('/HappiLens/'),
  routes
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
