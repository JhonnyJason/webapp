<template>
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
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class SideBarBottom extends Vue {
  @Prop() data!: any;

  @Emit("sideLinkClicked")
  sideLinkClicked(key: string) {
    return key;
  }
}
</script>

<style lang="scss"></style>
