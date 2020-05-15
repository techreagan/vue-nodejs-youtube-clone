<template>
  <div id="watch">
    <v-container fluid>
      <v-row>
        <v-alert prominent class="mx-auto" type="error" v-if="errored">
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Error!</div>
              <div>
                Something went wrong, but don’t fret — let’s give it another
                shot.
              </div>
            </v-col>
            <v-col class="shrink">
              <v-btn @click="actions">Take action</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-col v-else cols="11" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="8">
              <v-skeleton-loader
                type="card-avatar, article, actions"
                :loading="videoLoading"
                tile
                large
              >
                <div>
                  <v-responsive max-height="450">
                    <video controls style="height: 100%; width: 100%">
                      <source
                        :src="`${url}/uploads/videos/${video.url}`"
                        type="video/mp4"
                      />
                    </video>
                  </v-responsive>

                  <v-card flat tile class="card">
                    <v-card-title class="pl-0 pb-0">{{
                      video.title
                    }}</v-card-title>
                    <div
                      class="d-flex flex-wrap justify-space-between"
                      id="btns"
                    >
                      <v-card-subtitle
                        class="pl-0 pt-0 pb-0 subtitle-1"
                        style="line-height: 2.4em;"
                      >
                        {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                        >{{ dateFormatter(video.createdAt) }}
                      </v-card-subtitle>
                      <v-card-actions class="pt-0 pl-0">
                        <v-btn text @click="createFeeling('like')"
                          ><v-icon
                            :class="
                              `pr-2${
                                feeling !== 'like'
                                  ? ' grey--text text--darken-1'
                                  : ''
                              }`
                            "
                            >mdi-thumb-up</v-icon
                          >{{ video.likes }}</v-btn
                        >

                        <v-btn text @click="createFeeling('dislike')"
                          ><v-icon
                            :class="
                              `pr-2${
                                feeling !== 'dislike'
                                  ? ' grey--text text--darken-1'
                                  : ''
                              }`
                            "
                            >mdi-thumb-down</v-icon
                          >
                          {{ video.dislikes }}</v-btn
                        >
                        <v-btn text class="grey--text text--darken-1"
                          ><v-icon>mdi-share</v-icon> Share</v-btn
                        >
                        <v-btn text class="grey--text text--darken-1"
                          ><v-icon>mdi-playlist-plus</v-icon> Save</v-btn
                        >
                      </v-card-actions>
                    </div>
                  </v-card>

                  <v-row class="justify-space-between">
                    <v-col cols="6" sm="6" md="5" lg="5">
                      <v-card class="transparent" flat>
                        <v-list-item three-line>
                          <v-list-item-avatar
                            v-if="typeof video.userId !== 'undefined'"
                            size="50"
                          >
                            <!-- <v-img :src="video.userId.photoUrl"></v-img> -->
                            <v-img
                              :src="
                                `${url}/uploads/avatars/${video.userId.photoUrl}`
                              "
                            ></v-img>
                            <!-- src="https://randomuser.me/api/portraits/men/1.jpg" -->
                          </v-list-item-avatar>
                          <v-list-item-content
                            v-if="video.userId"
                            class="align-self-auto"
                          >
                            <v-list-item-title
                              class="font-weight-medium mb-1"
                              >{{ video.userId.channelName }}</v-list-item-title
                            >
                            <v-list-item-subtitle
                              >{{ video.userId.subscribers }} subscribers
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-col>
                    <v-col cols="6" sm="6" md="4" lg="4">
                      <div class="d-flex justify-end align-center">
                        <v-btn
                          :class="[
                            { 'red white--text': !subscribed },
                            {
                              'grey grey--text lighten-3 text--darken-3': subscribed
                            },
                            'mt-6'
                          ]"
                          tile
                          large
                          depressed
                          :loading="subscribeLoading"
                          @click="subscribe"
                          >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                        >
                        <v-btn icon class="ml-5 mt-6"
                          ><v-icon>mdi-bell</v-icon></v-btn
                        >
                      </div>
                    </v-col>
                    <v-col class="pl-11" offset="1" cols="11" md="11">
                      <p>
                        {{
                          truncate
                            ? truncateText(video.description, 150)
                            : video.description
                        }}
                      </p>
                      <v-btn text @click="show" class="remove-hover-bg"
                        >Show More</v-btn
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-skeleton-loader>

              <v-row>
                <v-col v-if="video && video.status === 'public'">
                  <p class="mb-0">{{ video.comments }} Comments</p>

                  <AddComment
                    @videoCommentLength="video.comments++"
                    :videoId="video._id"
                  />
                  <CommentList
                    @videoCommentLength="video.comments--"
                    :videoId="video._id"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4">
              <hr class="grey--text" />
              <h4 class="mb-3 mt-3">Up next</h4>
              <div
                v-for="(video, i) in loading ? 5 : videos.data"
                :key="i"
                class="mb-5"
              >
                <v-skeleton-loader
                  class="mx-auto"
                  type="list-item-avatar-three-line"
                  :loading="loading"
                  tile
                  large
                >
                  <v-card class="card" tile flat v-if="!loading">
                    <v-row no-gutters>
                      <v-col class="mx-auto" cols="3" sm="3" md="5" lg="5">
                        <!-- <v-responsive max-height="100%"> -->
                        <v-img
                          class="align-center"
                          height="110"
                          :src="
                            `${url}/uploads/thumbnails/${video.thumbnailUrl}`
                          "
                        >
                        </v-img>
                        <!-- </v-responsive> -->
                      </v-col>
                      <v-col>
                        <div class="ml-2">
                          <v-card-title
                            class="pl-2 pt-0 subtitle-1 font-weight-bold"
                            style="line-height: 1"
                          >
                            {{ video.title }}
                          </v-card-title>

                          <v-card-subtitle
                            class="pl-2 pt-2 pb-0"
                            style="line-height: 1"
                          >
                            {{ video.userId.channelName }}<br />
                            {{ video.views }} views<v-icon
                              >mdi-circle-small</v-icon
                            >
                            {{ dateFormatter(video.createdAt) }}
                          </v-card-subtitle>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-skeleton-loader>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'

import VideoService from '@/services/VideoService'
import SubscriptionService from '@/services/SubscriptionService'
import FeelingService from '@/services/FeelingService'

import AddComment from '@/components/comments/AddComment'
import CommentList from '@/components/comments/CommentList'

export default {
  data: () => ({
    loading: false,
    errored: false,
    videoLoading: true,
    subscribed: false,
    subscribeLoading: false,
    feeling: '',
    video: {},
    videos: [],
    truncate: true,
    url: process.env.VUE_APP_URL
  }),

  methods: {
    async getVideo() {
      this.errored = false
      this.videoLoading = true
      try {
        const video = await VideoService.getById(this.$route.params.id)

        if (!video) return this.$router.push('/')
        this.video = video.data.data
      } catch (err) {
        this.errored = true
        console.log(err)
      } finally {
        this.videoLoading = false
        this.checkSubscription(this.video.userId._id)
        this.checkFeeling(this.video._id)
      }

      if (
        this.video.userId._id.toString() !==
          this.$store.getters.currentUser._id.toString() &&
        this.video.status !== 'public'
      )
        return this.$router.push('/')
    },
    async getVideos() {
      this.errored = false
      this.loading = true
      const videos = await VideoService.getAll('public')
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => (this.loading = false))

      if (typeof videos === 'undefined') return

      this.videos = videos.data
    },
    async checkSubscription(id) {
      this.loading = true
      const sub = await SubscriptionService.checkSubscription({ channelId: id })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })

      if (!sub) return

      if (!sub.data.data._id) this.subscribed = false
      else this.subscribed = true
    },
    async checkFeeling(id) {
      this.loading = true
      const feeling = await FeelingService.checkFeeling({ videoId: id })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })

      if (!feeling) return

      if (feeling.data.data.feeling === 'like') this.feeling = 'like'
      else if (feeling.data.data.feeling === 'dislike') this.feeling = 'dislike'
    },
    async createFeeling(type) {
      switch (true) {
        case type === 'like' && this.feeling === '':
          this.feeling = 'like'
          this.video.likes++
          // console.log('new like')
          break
        case type === 'like' && this.feeling === type:
          this.feeling = ''
          this.video.likes--
          // console.log('remove like')
          break
        case type === 'like' && this.feeling === 'dislike':
          this.feeling = 'like'
          this.video.dislikes--
          this.video.likes++
          // console.log('change to like')
          break
        case type === 'dislike' && this.feeling === '':
          this.feeling = 'dislike'
          this.video.dislikes++
          // console.log('new dislike')
          break
        case type === 'dislike' && this.feeling === type:
          this.feeling = ''
          this.video.dislikes--
          // console.log('remove dislike')
          break
        case type === 'dislike' && this.feeling === 'like':
          this.feeling = 'dislike'
          this.video.likes--
          this.video.dislikes++
        // console.log('change to dislike')
      }

      const feeling = await FeelingService.createFeeling({
        videoId: this.video._id,
        type
      }).catch((err) => {
        console.log(err)
      })

      if (!feeling) return
    },
    async subscribe() {
      this.subscribeLoading = true
      const sub = await SubscriptionService.createSubscription({
        channelId: this.video.userId._id
      })
        .catch((err) => console.log(err))
        .finally(() => {
          this.subscribeLoading = false
        })

      if (!sub) return

      if (!sub.data.data._id) {
        this.subscribed = false
        // console.log(this.video.userId)
        this.video.userId.subscribers--
      } else {
        this.subscribed = true
        this.video.userId.subscribers++
      }
    },
    actions() {
      this.getVideo()
      this.getVideos()
    },
    show(event) {
      if (event.target.innerText === 'SHOW MORE') {
        this.truncate = false
        event.target.innerText = 'SHOW LESS'
      } else {
        this.truncate = true
        event.target.innerText = 'SHOW MORE'
      }
    },
    truncateText(string = '', num) {
      if (string.length <= num) {
        return string
      }
      return string.slice(0, num)
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  components: {
    AddComment,
    CommentList
  },
  mounted() {
    this.actions()
  }
}
</script>

<style lang="scss">
video {
  max-width: 100%;
  /* min-height: 360px; */
  /* width: 640px;
  height: 360px; */
}

.grey-color {
  color: #7f7f7f !important;
}

#btns {
  border-bottom: 1px solid #e0d8d8;
  // button {
  //   color: #7f7f7f;
  // }
}

button.v-btn.remove-hover-bg {
  background-color: initial !important;
  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
