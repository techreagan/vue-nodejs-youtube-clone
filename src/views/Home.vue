<template>
  <div id="home" class="pa-4">
    <v-container fluid>
      <v-alert prominent type="error" v-if="errored">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Error!</div>
            <div>
              Something went wrong, but don’t fret — let’s give it another shot.
            </div>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="getVideos">Take action</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <main v-else>
        <h3 class="headline font-weight-medium">Recommended</h3>

        <v-row>
          <v-col
            xs="6"
            sm="6"
            md="4"
            lg="3"
            v-for="(video, i) in loading ? 4 : videos.data"
            :key="i"
          >
            <v-skeleton-loader
              class="mx-auto"
              type="card-avatar"
              :loading="loading"
            >
              <v-card
                class="content-bg card mx-auto"
                max-width="350"
                flat
                tile
                v-if="!loading"
              >
                <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                  height="200px"
                ></v-img>
                <v-row no-gutters>
                  <v-col cols="2">
                    <v-list-item class="pl-0 pt-3">
                      <v-list-item-avatar color="grey darken-3">
                        <v-img
                          class="elevation-6"
                          src="https://randomuser.me/api/portraits/men/1.jpg"
                        ></v-img>
                      </v-list-item-avatar>
                    </v-list-item>
                  </v-col>
                  <v-col>
                    <v-card-title
                      class="pl-4 pt-3 subtitle-1 font-weight-bold"
                      style="line-height: 1.1"
                    >
                      {{ video.title }}
                    </v-card-title>

                    <v-card-subtitle class="pl-4 pt-2 pb-0 text-l">
                      {{ video.userId.channelName }}
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-4 pt-0">
                      {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                      >{{ dateFormatter(video.createdAt) }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </main>
    </v-container>
  </div>
</template>

<script>
import VideoService from '@/services/VideoService'
import moment from 'moment'
export default {
  name: 'Home',
  data: () => ({
    loading: true,
    errored: false,
    videos: []
  }),
  methods: {
    async getVideos() {
      this.loading = true
      const videos = await VideoService.getAll()
        .catch(err => {
          console.log(err)
          this.errored = true
        })
        .finally(() => (this.loading = false))

      if (typeof videos === 'undefined') return

      this.videos = videos.data
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.loading = false
    // }, 3000)
    this.getVideos()
  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
