import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import { store, vxm } from "./store/";
import i18n from "./i18n";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/_scss/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { sync } from "vuex-router-sync";

const appVersion = JSON.parse(
  unescape(escape(JSON.stringify(require("../package.json"))))
).version;

const isDev = process.env.NODE_ENV == "development";

Vue.use(BootstrapVue);

library.add(fas, fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

sync(store, router, { moduleName: "routeModule" });

Vue.mixin({
  methods: {
    promptAuth: async function() {
      const isAuthenticated = this.$store.getters["wallet/isAuthenticated"];
      if (isAuthenticated) return;
      const currentNetwork = this.$store.getters["bancor/currentNetwork"];
      if (currentNetwork == "eth") {
        vxm.ethWallet.connect();
      }
    }
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
