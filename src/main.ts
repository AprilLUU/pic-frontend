import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "@/access"

// import { helloUsingGet } from "./api"

// helloUsingGet().then((res) => {
//   console.log(res)
// })

const app = createApp(App)

app.use(Antd)
app.use(createPinia())
app.use(router)

app.mount("#app")
