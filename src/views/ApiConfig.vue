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
import axios from "../services/Api"
import {ipc, isElectron} from "@/utils/util";

let ipcRenderer = ipc()
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
      ipcRenderer.on("start", (event, {api}) => {
        this.observe(api).catch((err) => {
          this.$store.dispatch("showTips", {
            type: "info", text: err.message
          })
        }).finally(() => {
          this.loading = false;
        });
      })
    } else {
      const {origin} = window.location;
      this.observe(origin).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  methods: {
    setting() {
      if (!this.$refs.form.validate()) return;
      this.observe(this.api).catch(() => {
        this.$refs.form.setErrors({
          'Api': ['failure to observe']
        })
      })
    },
    observe(api) {
      return axios().post(api + "/group/observe/web3youtube", {
        nodes: "d90bff7d41323a654ccc777086f4bbf4e0ace467b019a306994ad253bacd6289",
        "keep-connected-peers": 1
      }).then(() => {
        sessionStorage.setItem("api", api);
        this.$store.commit("SET_URL", api);
        // this.$router.push({name: 'Home'})
      })
    }
  }
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
