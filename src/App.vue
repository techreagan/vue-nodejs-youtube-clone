<template>
  <v-app>
    <v-overlay :value="loading" style="z-index: 999" class="text-center">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
      <div style="margin-top: 20px;font-size: 20px">Connecting to a p2p network</div>
    </v-overlay>
    <div class="tips">
      <transition-group name="tip">
        <template v-for="(item,index) of getList">
          <v-alert dense :type="item.type" :key="index">
            {{ item.text }}
          </v-alert>
        </template>
      </transition-group>
    </div>
    <div v-if="!loading" class="fill-height">
      <router-view name="NavBar"></router-view>
      <router-view name="StudioNavBar"></router-view>
      <v-content class="fill-height"
                 :class="{
        'content-bg': ![
          'SignIn',
          'SignUp',
          'Dashboard',
          'Video',
          'Detail'
        ].includes(this.$route.name)
          ? true
          : false
      }"
      >
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import {websocket} from "@/utils/util";
import AuroraService from "@/services/AuroraService";

export default {
  name: 'App',
  data() {
    return {
      loading: false,
    }
  },
  async created() {
    let wsHost = sessionStorage.getItem("ws");
    let api = sessionStorage.getItem("api");
    if (wsHost && api) {
      AuroraService.observe(api).then(() => {
        this.$store.commit("SET_WS", websocket(wsHost));
      });
    }
  },
  components: {},
  mounted() {

  },
  computed: {
    ...mapGetters(['getList', "getUrl"]),
    getWs() {
      return this.$store.state.auth.ws;
    }
  },
  destroyed() {

  },
  methods: {},
  watch: {
    "$store.state.auth.ws": {
      handler: function (ws) {
        let _this = this;
        if (!ws) return;
        this.loading = true;
        ws.send({
          "id": 1,
          "jsonrpc": "2.0",
          "method": "group_subscribe",
          "params": ["peers", "web3youtube"]
        }, (err, {result}) => {
          ws.on(result, (res) => {
            console.log(res);
            _this.loading = !res.connected.length;
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
.content-bg {
  background-color: #f9f9f9;
}

.card {
  background: #f9f9f9 !important;
}

.tips {
  position: fixed;
  z-index: 999;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.tip-enter-active, .tip-leave-active {
  transition: all .5s;
}

.tip-enter, .tip-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}

</style>
