<template>
  <div class="main-bar" :class="darkMode ? 'side-bar-dark' : ''">
    <div class="side-bar-links">
      <div
        v-for="link in data.links"
        :key="link.key"
        @click="sideLinkClicked(link.key)"
        class="side-bar-link"
        :class="
          data.selectedLink === link.key
            ? darkMode
              ? 'clicked-link-dark'
              : 'clicked-link'
            : darkMode
            ? 'side-bar-link-dark'
            : 'side-bar-link'
        "
      >
        <img
          class="side-bar-link-icon"
          :src="require(`@/assets/media/icons/${link.key}.svg`)"
        />
        <span>{{ link.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class SideBarBottom extends Vue {
  @Prop() data!: any;
  @Prop() darkMode!: boolean;

  @Emit("sideLinkClicked")
  sideLinkClicked(key: string) {
    return key;
  }
}
</script>

<style lang="scss">
.main-bar {
  position: fixed;
  overflow: hidden;
  top: calc(100vh - 56px);
  left: 0;
  width: 100%;
  height: 56px;
  background-color: white;
  border-top: 1px solid #e6ebf2;
  .side-bar-links {
    width: 100%;
    height: 56px;
    align-items: center;
    margin-top: 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
.side-bar-dark {
  background-color: #0a2540;
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
</style>
