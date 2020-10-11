import Vue from "vue";
import App from "./App.vue";
import NavBar from "@/cpns/nav-bar/index.vue";
import NavBarSimple from "@/cpns/nav-bar/simple/index.vue";

Vue.config.productionTip = false;

Vue.component("nav-bar", NavBar);
Vue.component("nav-bar-simple", NavBarSimple);

new App().$mount();
