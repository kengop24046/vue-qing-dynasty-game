import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/theme.css'
import './assets/style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

window.addEventListener('keydown', (e) => {
  if (
    e.key === 'F5' || 
    (e.ctrlKey && e.key === 'r') || 
    (e.ctrlKey && e.key === 'R')
  ) {
    e.preventDefault()
    return false
  }
})