<template>
  <div name="side-bar">
    <div class="d-none d-md-block">
      <side-bar-left
        :darkMode="darkMode"
        :data="data"
        @sideLinkClicked="sideLinkClicked"
      />
    </div>
    <div class="d-block d-md-none">
      <side-bar-bottom
        :darkMode="darkMode"
        :data="data"
        @sideLinkClicked="sideLinkClicked"
      />
    </div>
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
  get darkMode() {
    return vxm.general.darkMode;
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
  }
}
</script>

<style lang="scss">
</style>
