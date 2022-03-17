<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto">
        <v-card outlined :loading="loading">
          <div class="px-8 pt-6 pb-12">
            <v-card-title class="text-center">Web3Tube</v-card-title>
            <v-card-subtitle class="mb-5">Sign in</v-card-subtitle>
            <v-card-text>
              <ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
                <form
                    @submit.prevent="handleSubmit(signin)"
                    @reset.prevent="reset"
                >
                  <!--                  <ValidationProvider-->
                  <!--                      v-slot="{ errors }"-->
                  <!--                      name="Email"-->
                  <!--                      rules="required|email"-->
                  <!--                  >-->
                  <!--                    <v-text-field-->
                  <!--                        v-model="email"-->
                  <!--                        :error-messages="errors"-->
                  <!--                        label="Email"-->
                  <!--                        outlined-->
                  <!--                    ></v-text-field>-->
                  <!--                  </ValidationProvider>-->
                  <v-row>
                    <v-col cols="12" v-if="$store.state.tips.isMobile">
                      <v-btn @click="connectMetaMask">
                        MetaMask
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-row>
                        <v-col offset="-1">
                          <v-btn @click="connectWalletConnect">
                            WalletConnect
                          </v-btn>
                        </v-col>
                        <v-col v-if="connectType === 'walletConnect'">
                          <v-btn @click="disconnectWalletConnect">
                            Disconnect
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row v-if="address">
                    <v-col cols="12">
                      {{ address }}
                    </v-col>
                  </v-row>
                  <!--password-->
                  <!--                  <ValidationProvider-->
                  <!--                    v-slot="{ errors }"-->
                  <!--                    name="Password"-->
                  <!--                    rules="required"-->
                  <!--                  >-->
                  <!--                    <p class="ma-0 text-right">-->
                  <!--                      <v-btn-->
                  <!--                        text-->
                  <!--                        small-->
                  <!--                        class="pl-0 text-capitalize"-->
                  <!--                        color="primary"-->
                  <!--                        href="true"-->
                  <!--                        >Forget Password?</v-btn-->
                  <!--                      >-->
                  <!--                    </p>-->
                  <!--                    <v-text-field-->
                  <!--                      v-model="password"-->
                  <!--                      type="password"-->
                  <!--                      :error-messages="errors"-->
                  <!--                      label="Password"-->
                  <!--                      outlined-->
                  <!--                    ></v-text-field>-->
                  <!--                  </ValidationProvider>-->
                  <div class="mt-6 d-flex justify-space-between">
                    <v-btn
                        text
                        class="pl-0 text-capitalize"
                        color="primary"
                        router
                        to="signup"
                    >Create account
                    </v-btn
                    >
                    <v-btn
                        type="submit"
                        class="primary"
                        :loading="loading"
                        depressed
                    >Sign in
                    </v-btn
                    >
                  </div>
                </form>
              </ValidationObserver>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Web3 from "web3";
import moment from "moment";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
  name: 'SignIn',
  data: () => ({
    // email: '',
    // password: '',
    loading: false,
    address: "",
    connectType: "",
  }),
  methods: {
    disconnectWalletConnect() {
      this.web3?.currentProvider.disconnect();
      this.address = "";
      this.connectType = "";
    },
    async signin() {
      if (!this.address) {
        this.$store.dispatch("showTips", {
          type: "info", text: "Please connect your wallet"
        })
        return;
      }
      if (this.loading) return
      this.loading = true;

      const timespan = moment().format('x');

      let msg = this.web3.utils.sha3(this.address + timespan)
      console.log(msg)
      const signature = await this.web3.eth.personal.sign(msg, this.address).catch(err => {
        this.loading = false;
        this.$store.dispatch("showTips", {
          type: "info", text: err.message
        })
      });

      if (!signature) return;

      const data = await this.$store
          .dispatch('signIn', {timespan, signature, address: this.address})
          .catch((err) => {
            this.loading = false
            this.$store.dispatch("showTips", {
              type: "info", text: err.response.data.error
            })
          })

      if (!data) return
      const user = await this.$store
          .dispatch('getCurrentUser', data.token)
          .catch((err) => console.log(err))

      if (!user) return

      this.loading = false
      this.$router.push({name: 'Home'})
    },
    async connectMetaMask() {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
          this.$store.dispatch("showTips", {
            type: "success", text: "Connection successful"
          })
          this.address = accounts[0];
          this.web3 = new Web3(window.ethereum);
        } else {
          throw new Error("Please install MetaMask first");
        }
      } catch (e) {
        this.$store.dispatch("showTips", {
          type: "info", text: e.message
        })
      }
    },
    async connectWalletConnect() {
      try {
        const provider = new WalletConnectProvider({
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
          rpc: {
            97: "https://data-seed-prebsc-2-s2.binance.org:8545",
            56: "https://bsc-dataseed1.binance.org/",
          }
        });
        await provider.enable();
        this.connectType = "walletConnect";
        this.$store.dispatch("showTips", {
          type: "success", text: "Connection successful"
        })
        const {accounts} = provider;
        this.address = accounts[0];
        this.web3 = new Web3(provider);
      } catch (e) {
        this.$store.dispatch("showTips", {
          type: "info", text: e.message
        })
      }
    },
  }
}
</script>

<style></style>
