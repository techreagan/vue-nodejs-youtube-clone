<template>
  <div class="text-center">
    <div class="h-auto">
      <v-card
          max-width="400"
          class="mx-auto card"
      >
        <h3>
          Please enter the api of the aurora node
        </h3>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <form
              @submit.prevent="handleSubmit(setting)"
          >
            <ValidationProvider
                v-slot="{ errors }"
                name="Api"
                rules="required|api"
            >
              <v-text-field
                  v-model="api"
                  :error-messages="errors"
                  label="API Endpoint"
                  class="mb-3"
              ></v-text-field>
            </ValidationProvider>
            <div class="setting">
              <v-btn
                  type="submit"
              >Setting
              </v-btn
              >
            </div>
          </form>
        </ValidationObserver>
      </v-card>
    </div>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import {websocket} from "@/utils/util";
import AuroraService from "../services/AuroraService"
import {isElectron, ipc} from "@/utils/util";

let ipcRenderer = ipc();
export default {
  name: "ApiConfig",
  data: function () {
    return {
      api: "",
      loading: true,
    }
  },
  created() {
    if (isElectron) {
      ipcRenderer.on("start", (event,{api}) => {
        console.log(api)
        this.set(api).finally(() => {
          this.loading = false;
        })
      })
    } else {
      const {origin} = window.location;
      this.set(origin).finally(() => {
        this.loading = false;
      })
    }

  },
  methods: {
    async setting() {
      if (!this.$refs.form.validate()) return;
      this.set(this.api).catch(() => {
        this.$refs.form.setErrors({
          'Api': "Connection failed"
        })
      })
    },
    async set(api) {
      let res = await AuroraService.getPort(api);
      let wsPort = res.data.rpcWsPort;
      if (!wsPort) throw new Error("ws not enabled");
      let host = `ws://${new URL(api).hostname}:${wsPort}`;
      await AuroraService.observe(api);
      sessionStorage.setItem("debugApi", `http://${new URL(api).hostname}:${res.data.debugApiPort}`);
      sessionStorage.setItem("api", api);
      sessionStorage.setItem("ws", host);
      this.$store.commit("SET_URL", api);
      this.$store.commit("SET_WS", websocket(host));
      await this.$router.push({name: 'Home'});
    }
  },
}
</script>

<style scoped>
.h-auto {
  margin-top: 50vh;
  transform: translateY(-50%);
}

.card {
  padding: 30px;
}

.setting {
  margin-top: 20px;
  text-align: right;
}
</style>
