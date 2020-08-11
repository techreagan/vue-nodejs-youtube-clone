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
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(video, i) in loading ? 12 : videos"
            :key="i"
            class="mx-xs-auto"
          >
            <v-skeleton-loader type="card-avatar" :loading="loading">
              <video-card
                :card="{ maxWidth: 350 }"
                :video="video"
                :channel="video.userId"
              ></video-card>
            </v-skeleton-loader>
          </v-col>
          <v-col class="text-center" v-if="videos.length === 0 && !loading">
            <p>No videos yet</p>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <infinite-loading @infinite="getVideos">
              <div slot="spinner">
                <v-progress-circular
                  indeterminate
                  color="red"
                ></v-progress-circular>
              </div>
              <div slot="no-results"></div>
              <span slot="no-more"></span>
              <div slot="error" slot-scope="{ trigger }">
                <v-alert prominent type="error">
                  <v-row align="center">
                    <v-col class="grow">
                      <div class="title">Error!</div>
                      <div>
                        Something went wrong, but don’t fret — let’s give it
                        another shot.
                      </div>
                    </v-col>
                    <v-col class="shrink">
                      <v-btn @click="trigger">Take action</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </div>
            </infinite-loading>
          </v-col>
        </v-row>
      </main>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'

import VideoCard from '@/components/VideoCard'
import VideoService from '@/services/VideoService'

export default {
  name: 'Home',
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    videos: [],
    page: 1
  }),
  methods: {
    async getVideos($state) {
      if (!this.loaded) {
        this.loading = true
      }

      const videos = await VideoService.getAll('public', { page: this.page })
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => {
          this.loading = false
        })

      if (typeof videos === 'undefined') return

      if (videos.data.data.length) {
        this.page += 1
        this.videos.push(...videos.data.data)
        $state.loaded()
        this.loaded = true
      } else {
        $state.complete()
      }
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  components: {
    VideoCard,
    InfiniteLoading
  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
