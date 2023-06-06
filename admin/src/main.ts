import 'uno.css'
import '@/assets/scss/theme.scss'
import './main.css'
import './modules/i18n'
import { createApp } from 'vue'
import App from './App.vue'
import { useInitTheme } from './hooks/useInitTheme'
const app = createApp(App)

useInitTheme()
Object.entries(import.meta.glob('./modules/*.ts', { eager: true })).forEach(([, Module]) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Module.setup?.({ app })
})

app.mount('#app')