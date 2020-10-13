<template>
  <b-modal
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    scrollable
    size="sm"
    centered
    v-model="show"
    hide-footer
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
    @show="update"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              <span v-if="step === 'stake'">Stake</span>
            </span>
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <div v-if="step === 'stake'">
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <span class="text-uppercase">Stake your tokens</span>
        <span class="float-right cursor" @click="() => useMax()">
          Balance: {{ currentBalance }} {{ symbol }}
        </span>
      </div>

      <div class="input-currency mt-1">
        <b-form-input
          v-model="stakeValue"
          :state="state"
          @keypress="isNumber($event)"
          :max="currentBalance"
          type="number"
          placeholder="0"
          size="lg"
          class="input-currency__input"
        />
        <div class="input-currency__append pr-3">
          <img
            class="img-avatar img-avatar32 bg-dark input-currency__img mr-2 ml-3"
            src="@/assets/media/logos/bancor-white2.png"
          />

          <span class=" font-size-14 font-w500">{{ symbol }}</span>
        </div>
      </div>

      <b-alert show variant="warning" class="my-3 p-3 font-size-14 alert-over">
        Staking {{ symbol }} enables you to vote on proposals. You will be able
        to unstake once the lock period is over (up to {{ maxLock }}h)
      </b-alert>

      <main-button
        @click="stake"
        :label="stakeLabel"
        :active="true"
        :block="true"
        :disabled="!(stakeValue > 0 && stakeValue <= currentBalance)"
        class="font-size-14 font-w400 mt-3 button-status"
        :class="{
          'button-status--empty': stakeValue.length === 0,
          'button-status--invalid': !(
            stakeValue > 0 && stakeValue <= currentBalance
          )
        }"
      />
    </div>

    <div
      v-if="step === 'staking'"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <b-spinner variant="primary"></b-spinner>
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        Waiting For Confirmation
      </h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} {{ symbol }}</div>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Confirm this transaction in your wallet
      </div>
    </div>

    <div
      v-if="step === 'staked'"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <font-awesome-icon class="text-primary" size="4x" icon="check-circle" />
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        Transaction Submitted
      </h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} {{ symbol }}</div>
      <a
        target="_blank"
        class="text-primary font-w500 cursor"
        :href="getEtherscanUrl()"
        >View on Etherscan</a
      >
      <main-button
        @click="onHide"
        label="Close"
        :large="true"
        :active="true"
        :block="true"
        class="font-size-14 font-w400 mt-3"
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { Component, Vue, Watch } from "vue-property-decorator";
import { VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import { expandToken } from "@/api/eth/helpers";
import { etherscanUrl } from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    MainButton
  }
})
export default class ModalStake extends Vue {
  @VModel({ type: Boolean }) show!: boolean;

  currentBalance: number = 0;
  stakeValue?: number = "" as any;
  step: "stake" | "staking" | "staked" = "stake";
  symbol: string = "";
  maxLock: number = 0;

  get state() {
    return (
      (String(this.stakeValue).length === 0 ||
        (this.stakeValue &&
          this.stakeValue > 0 &&
          this.stakeValue <= this.currentBalance)) &&
      undefined
    );
  }

  get stakeLabel() {
    return this.stakeValue && String(this.stakeValue).length === 0
      ? "Enter Amount"
      : this.stakeValue &&
        this.stakeValue > 0 &&
        this.stakeValue <= this.currentBalance
      ? "Stake Tokens"
      : "Insufficient Amount";
  }
  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  getEtherscanUrl() {
    return `${etherscanUrl}address/${this.isAuthenticated}#tokentxns`;
  }

  stake() {
    this.step = "staking";
    this.doStake().then(() => {
      this.step = "staked";
    });
  }

  async doStake() {
    await vxm.ethGovernance.stake({
      account: this.isAuthenticated,
      amount: expandToken(
        this.stakeValue!.toString(),
        await vxm.ethGovernance.getDecimals()
      )
    });
  }

  onHide() {
    this.show = false;
    if (this.step === "staked") {
      this.step = "stake";
      this.stakeValue = 0;
    }
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  useMax() {
    this.stakeValue = this.currentBalance;
  }

  isNumber(event: KeyboardEvent) {
    const char = event.keyCode;
    if (char > 31 && (char < 48 || char > 57) && char !== 46) {
      event.preventDefault();
    } else {
      return true;
    }
  }

  @Watch("step")
  @Watch("isAuthenticated")
  @Watch("show")
  async update() {
    this.currentBalance = await vxm.ethGovernance.getBalance({
      account: this.isAuthenticated
    });

    await this.updateMaxLock();
  }

  async updateMaxLock() {
    const [voteDuration, voteLockFraction] = await Promise.all([
      vxm.ethGovernance.getVoteLockDuration(),
      vxm.ethGovernance.getVoteLockFraction()
    ]);

    this.maxLock = voteDuration / voteLockFraction / 60 / 60;
  }

  async mounted() {
    this.symbol = await vxm.ethGovernance.getSymbol();
    await this.update();
  }
}
</script>
<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.modal-body {
  padding-top: 0 !important;
}

.input-currency {
  border-right: 0 !important;
  position: relative;

  &__append {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    height: 100%;
    right: 0;
  }

  &__img {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e6ebf2;
    padding: 4px;
  }

  &__input {
    background-image: none !important;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
}

.button-status {
  &--invalid {
    background: $text-error-light !important;
    border-color: transparent !important;
  }

  &--empty {
    background: $gray-placeholder !important;
    border-color: transparent !important;
  }
}

.alert-over {
  border: 1px solid #ffeeba !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}
</style>