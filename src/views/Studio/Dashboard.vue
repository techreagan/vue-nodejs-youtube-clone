<template>
  <div id="dashboard" class="pa-4">
    <v-container fluid>
      <div class="d-flex justify-space-between mb-5">
        <h2>channel dashboard</h2>
        <div class="right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                @click="dialog = true"
                class="mr-4 white"
                icon
                v-on="{ ...tooltip }"
                ><v-icon size="25" class="small">mdi-upload</v-icon></v-btn
              >
            </template>
            <span>Upload video</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn class="white" icon v-on="{ ...tooltip }"
                ><v-icon size="25" class="small"
                  >mdi-access-point</v-icon
                ></v-btn
              >
            </template>
            <span>Go live</span>
          </v-tooltip>
        </div>
      </div>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>Latest video performance</v-card-title>
            <v-responsive class="mx-5">
              <v-img
                class="white--text align-en"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
              </v-img>
            </v-responsive>

            <v-card-subtitle class="pl-6 pb-0 text--primary"
              >First 8 days 20 hours:</v-card-subtitle
            >
            <v-card-text>
              <v-list flat class="pl-0 pt-0">
                <v-list-item class="pl-2 mt-1" style="min-height:30px">
                  <v-list-item-title class="caption grey--text"
                    >Views</v-list-item-title
                  >
                  <span class="caption grey--text">5</span>
                </v-list-item>
                <v-list-item class="pl-2 mt-1" style="min-height:30px">
                  <v-list-item-title class="caption grey--text"
                    >Average view duration</v-list-item-title
                  >
                  <span class="caption grey--text">5</span>
                </v-list-item>

                <v-list-item class="pl-2" style="min-height: 30px">
                  <v-list-item-title class="caption grey--text"
                    >Watch time (hours)</v-list-item-title
                  >
                  <span class="caption grey--text">0.0</span>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions class="d-block ml-2">
              <v-btn color="blue" text>
                Go to video analytics
              </v-btn>
              <br />
              <v-btn color="blue" text>
                See comments (4)
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>News</v-card-title>
            <v-responsive class="mx-5">
              <v-img
                class="white--text align-en"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
              </v-img>
            </v-responsive>

            <v-card-text class="text--primary">
              <v-card-title class="subtitle-2"
                >Your new Creator Roundup is here</v-card-title
              >
              <v-card-subtitle class="caption"
                >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
                deleniti in numquam molestias laboriosam aperiam ea, provident
                expedita mollitia
              </v-card-subtitle>
            </v-card-text>

            <v-card-actions class="d-block ml-2">
              <v-btn color="blue" text>
                Check it out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title class="pl-5">Channel analytics</v-card-title>

            <v-card-subtitle class="caption pl-5 pb-0"
              >Current Subscribers</v-card-subtitle
            >
            <h1 class="pl-5">1</h1>
            <p class="pl-5 caption grey--text">
              <span class="green--text">+1</span> in last 28 days
            </p>
            <v-divider></v-divider>
            <h5 class="pl-6 mt-4 mb-0">Summary</h5>
            <v-card-subtitle class="pl-6 pb-0 pt-0 caption"
              >Last 28 days</v-card-subtitle
            >
            <v-card-text>
              <v-list flat class="pl-0 pt-0">
                <v-list-item class="pl-2 mt-1" style="min-height:30px">
                  <v-list-item-title class="caption grey--text"
                    >Views</v-list-item-title
                  >
                  <span class="caption grey--text">5</span>
                </v-list-item>

                <v-list-item class="pl-2" style="min-height: 30px">
                  <v-list-item-title class="caption grey--text"
                    >Watch time (hours)</v-list-item-title
                  >
                  <span class="caption grey--text">0.0</span>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-divider></v-divider>
            <h5 class="pl-5 mt-4 pb-0">Total videos</h5>
            <v-card-subtitle class="pl-6 pt-0 pb-0 caption"
              >Last 48 hours views</v-card-subtitle
            >

            <v-card-actions class="d-block ml-2">
              <v-btn color="blue" text>
                Go to channel analytics
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <upload-video-modal
      :open-dialog="dialog"
      v-on:closeDialog="dialog = false"
    />
  </div>
</template>

<script>
import UploadVideoModal from '@/components/UploadVideoModal'
export default {
  data: () => ({
    loading: true,
    dialog: false
  }),
  components: {
    UploadVideoModal
  },
  mounted() {}
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
