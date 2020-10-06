<template>
  <div
    name="side-bar"
    class="side-bar"
    :class="darkMode ? 'side-bar-dark' : ''"
  >
    <b-navbar-brand class="pb-1 brand-icon">
      <router-link :to="{ name: 'Swap', params: { service: selectedNetwork } }">
        <img
          v-if="darkMode"
          src="@/assets/media/logos/bancor-white.png"
          height="35px"
          class="mb-1"
        />
        <img
          v-else
          src="@/assets/media/logos/bancor-black.png"
          height="35px"
          class="mb-1"
        />
      </router-link>
    </b-navbar-brand>
    <div class="d-none d-md-block">
      <side-bar-left :data="data" @sideLinkClicked="sideLinkClicked" />
    </div>
    <div class="d-block d-md-none">
      <side-bar-bottom :data="data" @sideLinkClicked="sideLinkClicked" />
    </div>
    <div class="middle-space" />
    <p class="tm-text">© Bancor 2020</p>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { vxm } from "@/store";
import SideBarLeft from "@/components/common/SideBarLeft.vue";
import SideBarBottom from "@/components/common/SideBarBottom.vue";
@Component({
  components: { SideBarBottom, SideBarLeft }
})
export default class SideBar extends Vue {
  selectedLink = "swap";
  links = [
    { route: "Data", key: "data", label: "Data" },
    { route: "Swap", key: "swap", label: "Swap" },
    // { route: "swap", key: "governance", label: "Governance" },
    // { route: "LiqProtection", key: "liquidity", label: "Liquidity" },
    { route: "swap", key: "bancorx", label: "BancorX" }
  ];

  get data() {
    return {
      selectedLink: this.selectedLink,
      links: this.links
    };
  }

  detectSubdomain() {
    const hostname = window.location.hostname;
    const splitted = hostname.split(".");
    const withoutStaging = splitted.length == 4 ? splitted.slice(1) : splitted;
    console.log(withoutStaging, "is without staging");
    const subDomain = withoutStaging[0];
    if (subDomain == "localhost") return;
    if (subDomain == "data") {
      this.selectedLink = "data";
    } else if (subDomain == "swap") {
      this.selectedLink = "swap";
    }
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }

  sideLinkClicked(newSelected: string) {
    if (this.selectedLink == newSelected) return;
    const currentService = this.$route.params.service;
    const path =
      window.location.protocol +
      "//" +
      window.location.hostname +
      `:${window.location.port}` +
      `/${currentService}`;
    if (newSelected == "swap") {
      this.openUrl(`${path}/swap`);
    } else if (newSelected == "bancorx") {
      this.openUrl("https://x.bancor.network/");
    } else {
      this.openUrl(`${path}/data`);
    }
    return;
    // const linkSelected = this.links.find(link => link.key == newSelected)!;
    // this.$router.push({
    // name: linkSelected.route,
    // params: { service: this.$route.params.service }
    // });
    // this.selectedLink = newSelected;
  }
}
</script>

<style lang="scss"></style>
