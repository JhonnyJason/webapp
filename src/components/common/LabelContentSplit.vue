<template>
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <span
        class="font-size-12 font-w500 text-uppercase"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ label }}
      </span>
      <font-awesome-icon
        v-if="tooltip"
        id="popover-target"
        icon="info-circle"
        class="ml-1"
      />
      <b-popover
        v-if="tooltip"
        target="popover-target"
        triggers="hover"
        placement="top"
      >
        {{ tooltip }}
      </b-popover>
    </div>

    <span
      v-if="value && !loading"
      class="font-size-12 font-w600"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      {{ value }}
    </span>
    <span
      v-if="value && loading"
      class="font-size-12 font-w600"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <font-awesome-icon icon="circle-notch" spin />
    </span>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class LabelContentSplit extends Vue {
  @Prop() label!: string;
  @Prop() value?: string;
  @Prop({ default: false }) loading?: boolean;
  @Prop({ default: "" }) tooltip?: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
