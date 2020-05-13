<template>
  <div id="channel-home">
    <v-parallax
      height="230"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    ></v-parallax>
    <div class="nav-bgcolor">
      <div id="channel-header">
        <v-container class="py-0">
          <v-row class="justify-space-between">
            <v-col cols="12" sm="5" md="5" lg="5" offset-md="1">
              <v-skeleton-loader
                type="list-item-avatar-two-line"
                :loading="loading"
                class="mr-1"
              >
                <v-card class="transparent" flat>
                  <v-list-item three-line>
                    <v-list-item-avatar size="80"
                      ><v-img
                        :src="`${url}/uploads/avatars/${channel.photoUrl}`"
                      ></v-img
                    ></v-list-item-avatar>
                    <v-list-item-content class="align-self-auto">
                      <v-list-item-title class="headline mb-1">{{
                        channel.channelName
                      }}</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ channel.subscribers }} subscribers
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-skeleton-loader>
            </v-col>
            <v-col cols="12" sm="5" md="3" lg="3">
              <v-btn class="red white--text mt-6" tile large depressed
                >Subscribed</v-btn
              >
              <v-btn icon class="ml-5 mt-6"><v-icon>mdi-bell</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-card flat class="transparent">
        <v-tabs
          v-model="tab"
          background-color="transparent"
          show-arrows
          centered
          center-active
        >
          <v-tab v-for="(item, i) in items" :key="i">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-container fluid>
          <v-tabs-items v-model="tab" class="transparent">
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <!-- <v-sheet class="mx-auto"> -->
                <v-slide-group class="pa-4" multiple show-arrows>
                  <v-slide-item
                    v-for="(video, i) in loading ? 5 : videos.data"
                    :key="i"
                  >
                    <v-skeleton-loader
                      type="card-avatar"
                      :loading="loading"
                      width="250px"
                      class="mr-1"
                    >
                      <video-card
                        :card="{ maxWidth: 250, type: 'noAvatar' }"
                        :video="video"
                        :channel="video.userId"
                      ></video-card>
                    </v-skeleton-loader>
                  </v-slide-item>
                </v-slide-group>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card class="transparent" flat>
                <v-card-title>Uploads</v-card-title>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    v-for="(video, i) in loading ? 10 : videos.data"
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
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService'
import VideoService from '@/services/VideoService'
import VideoCard from '@/components/VideoCard'
export default {
  data: () => ({
    tab: null,
    loading: false,
    errored: false,
    url: process.env.VUE_APP_URL,
    items: ['Home', 'Videos', 'Playlists', 'Community', 'Channels', 'about'],
    videos: {},
    channel: {}
  }),
  components: {
    VideoCard
  },
  methods: {
    async getChannel() {
      // console.log(this.$route.params.id)
      this.loading = true
      this.errored = false

      const channel = await UserService.getById(this.$route.params.id)
        .catch((err) => {
          this.errored = true
          console.log(err)
        })
        .finally(() => (this.loading = false))

      if (!channel) return
      this.channel = channel.data.data
      this.getVideos()
      // console.log(channel)
    },
    async getVideos() {
      // this.getChannel()
      this.loading = true

      const videos = await VideoService.getAll(
        `public/?userId=${this.channel._id}`
      )
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => (this.loading = false))

      if (typeof videos === 'undefined') return

      this.videos = videos.data
    }
  },
  mounted() {
    this.getChannel()
  }
}
</script>

<style>
.nav-bgcolor {
  background: #f9f9f9;
}

.card {
  background: #f9f9f9 !important;
}

.v-tab {
  margin-right: 4em;
}

#channel-home .v-list-item--link:before {
  background-color: transparent;
}
</style>
