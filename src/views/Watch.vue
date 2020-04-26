<template>
  <div id="watch">
    <v-container fluid>
      <v-row>
        <v-col cols="11" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="12" md="8" lg="8">
              <v-skeleton-loader
                type="card-avatar, article, actions"
                :loading="videoLoading"
                tile
                large
              >
                <v-responsive>
                  <video controls>
                    <source :src="video.videoUrl" type="video/mp4" />
                  </video>
                </v-responsive>
                <v-card flat tile class="card">
                  <v-card-title class="pl-0 pb-0">{{
                    video.title
                  }}</v-card-title>
                  <div class="d-flex flex-wrap justify-space-between" id="btns">
                    <v-card-subtitle
                      class="pl-0 pt-0 pb-0 subtitle-1"
                      style="line-height: 2.4em;"
                    >
                      {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                      >{{ video.createdAt }}
                    </v-card-subtitle>
                    <v-card-actions class="pt-0 pl-0 grey--text">
                      <v-btn text
                        ><v-icon class="pr-2">mdi-thumb-up</v-icon> 1.5k</v-btn
                      >
                      <v-btn text
                        ><v-icon class="pr-2">mdi-thumb-down</v-icon>
                        1.5k</v-btn
                      >
                      <v-btn text><v-icon>mdi-share</v-icon> Share</v-btn>
                      <v-btn text
                        ><v-icon>mdi-playlist-plus</v-icon> Save</v-btn
                      >
                    </v-card-actions>
                  </div>
                </v-card>

                <v-row class="justify-space-between">
                  <v-col cols="6" sm="6" md="5" lg="5">
                    <v-card class="transparent" flat>
                      <v-list-item three-line>
                        <v-list-item-avatar size="50"
                          ><v-img
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                          ></v-img
                        ></v-list-item-avatar>
                        <v-list-item-content class="align-self-auto">
                          <v-list-item-title class="font-weight-medium mb-1"
                            >Tech Reagan</v-list-item-title
                          >
                          <v-list-item-subtitle
                            >{{ video.subscribers }} subscribers
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                  <v-col cols="6" sm="6" md="4" lg="4">
                    <div class="d-flex justify-end align-center">
                      <v-btn class="red white--text mt-6" tile large depressed
                        >Subscribed</v-btn
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
                  <v-col>
                    <p class="mb-0">148 Comments</p>
                    <input type="text" ref="hello" />
                    <v-card class="transparent" flat>
                      <v-list-item three-line class="pl-0">
                        <v-list-item-avatar size="50"
                          ><v-img
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                          ></v-img
                        ></v-list-item-avatar>
                        <v-list-item-content class="align-self-auto">
                          <v-text-field
                            v-model="comment"
                            placeholder="Add a public comment..."
                            @click="showCommentBtns = true"
                          >
                          </v-text-field>
                          <div
                            v-if="showCommentBtns"
                            class="d-inline-block text-right"
                          >
                            <v-btn
                              text
                              @click="showCommentBtns = !showCommentBtns"
                              >Cancel</v-btn
                            >
                            <v-btn
                              class="blue darken-3 white--text"
                              depressed
                              tile
                              :disabled="comment === ''"
                              >Comment</v-btn
                            >
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>

                    <v-card class="transparent" flat v-for="i in 5" :key="i">
                      <v-list-item three-line class="pl-0 mt-2">
                        <v-list-item-avatar size="50"
                          ><v-img
                            src="https://randomuser.me/api/portraits/men/1.jpg"
                          ></v-img
                        ></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="font-weight-medium caption mb-1"
                            >Tech Reagan
                            <span class="font-weight-light grey--text">
                              1 day ago</span
                            ></v-list-item-title
                          >
                          <v-list-item-subtitle
                            class="black--text text--darken-4 caption"
                            >Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Tempore deleniti aspernatur nostrum eius
                            dignissimos repellendus. Fugiat, aspernatur deserunt
                            iusto natus consectetur voluptatem voluptate
                            laboriosam pariatur qui animi repudiandae quae
                            dolorem.</v-list-item-subtitle
                          >
                          <!-- <v-list-item-action> -->
                          <div>
                            <!-- <button
                              class="caption font-weight-bold d-inline-block pa-2 grey--text text--darken-3"
                              style="cursor: pointer; outline: none"
                              @click.stop.prevent="showReply"
                            >
                              REPLY
                            </button> -->
                            <v-btn
                              text
                              small
                              :ripple="false"
                              @click.stop="showReply(`${'reply' + i}`)"
                              >Reply</v-btn
                            >
                          </div>
                          <div class="d-none" :ref="`${'reply' + i}`">
                            <v-list-item three-line class="pl-0">
                              <v-list-item-avatar class="mt-0" size="40"
                                ><v-img
                                  src="https://randomuser.me/api/portraits/men/1.jpg"
                                ></v-img
                              ></v-list-item-avatar>
                              <v-list-item-content
                                class="align-self-auto mt-0 pt-0"
                              >
                                <v-form :ref="`form${i}`">
                                  <v-text-field
                                    :ref="`${'input' + i}`"
                                    class="pt-0 mt-0 body-2"
                                    placeholder="Add a public comment..."
                                    :value="repliesInput[`input${i}`]"
                                  >
                                  </v-text-field>
                                </v-form>
                                <div
                                  :ref="i + 'btns'"
                                  class="d-inline-block text-right"
                                >
                                  <v-btn text @click="hideReply(i)" small
                                    >Cancel</v-btn
                                  >
                                  <v-btn
                                    class="blue darken-3 white--text"
                                    depressed
                                    tile
                                    small
                                    @click="addReply(i)"
                                    >Reply</v-btn
                                  >
                                </div>
                              </v-list-item-content>
                            </v-list-item>
                            <!-- </v-list-item-action> -->
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-skeleton-loader>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4">
              <hr class="grey--text" />
              <h4 class="mb-3 mt-3">Up next</h4>
              <div v-for="i in 10" :key="i" class="mb-5">
                <v-skeleton-loader
                  class="mx-auto"
                  type="list-item-avatar-three-line"
                  :loading="loading"
                  tile
                  large
                >
                  <v-card class="card" tile flat>
                    <v-row no-gutters>
                      <v-col class="mx-auto" cols="3" sm="3" md="5" lg="5">
                        <!-- <v-responsive max-height="100%"> -->
                        <v-img
                          class="align-center"
                          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
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
                            Top western road trips
                          </v-card-title>

                          <v-card-subtitle
                            class="pl-2 pt-2 pb-0"
                            style="line-height: 1"
                          >
                            Tech Reagan<br />
                            9.6k views<v-icon>mdi-circle-small</v-icon>6 hours
                            ago
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
export default {
  data: () => ({
    loading: true,
    videoLoading: true,
    video: [],
    truncate: true,
    comment: '',
    showCommentBtns: false,
    repliesInput: {}
  }),

  methods: {
    getVideos() {
      this.video = {
        channelName: 'Tech Reagan',
        subscribers: '100k',
        createdAt: '6 hours ago',
        views: '200,459',
        videoUrl: '/video.mp4',
        title: 'Attendance Management System',
        description:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa vel inventore voluptatum reiciendis delectus quibusdam incidunt consequuntur, nostrum aperiam, natus quidem qui corrupti reprehenderit quaerat neque voluptatibus? Ullam, maiores temporibus!'
      }
    },
    showReply(id) {
      this.$refs[id][0].classList.toggle('d-none')
    },
    hideReply(id) {
      this.$refs[`form${id}`][0].reset()
      this.$refs['reply' + id][0].classList.toggle('d-none')
    },
    addReply(id) {
      this.$refs[`form${id}`][0].reset()
      console.log(this.$refs[`input${id}`][0].$refs.input.value)
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
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
      this.videoLoading = false
      this.getVideos()
    }, 400)
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

#btns {
  border-bottom: 1px solid #e0d8d8;
  button {
    color: #7f7f7f;
  }
}

button.v-btn.remove-hover-bg {
  background-color: initial !important;
  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
