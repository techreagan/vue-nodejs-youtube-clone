<template>
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
            >Sign up
            </v-btn
            >
          </div>
        </form>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
import axios from "../services/Api"

export default {
  name: "ApiConfig",
  data: function () {
    return {
      api: "",
    }
  },
  created() {
    const {origin} = window.location;
    this.observe(origin).catch((err) => {
      console.log(err);
    });
  },
  methods: {
    setting() {
      if (!this.$refs.form.validate()) return;
      this.observe(this.api).catch(() => {
        this.$refs.form.setErrors({
          'Api': ['Api invalid']
        })
      })
    },
    observe(api) {
      return axios().post(api + "/group/observe/web3youtube").then(() => {
        sessionStorage.setItem("api", api);
        this.$store.commit("SET_URL", api);
        this.$router.push({name: 'Home'})
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
