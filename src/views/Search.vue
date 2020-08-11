<template>
  <div id="search" class="pl-6">
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
              <v-btn @click="get">Take action</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-col v-else cols="12" sm="12" md="10" lg="11">
          <template v-if="results.length === 0">
            <p class="text-center">Ops! No search results</p>
          </template>
          <div
            v-else
            v-for="(result, i) in loading ? 5 : results"
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
              <v-card
                :to="`/channels/${result._id}`"
                class="card mb-10"
                v-if="typeof result.channelName !== 'undefined'"
                tile
                flat
              >
                <v-row no-gutters justify="center">
                  <v-col cols="10" sm="10" md="3" lg="3" class="d-flex">
                    <!-- <v-responsive max-height="100%"> -->

                    <v-avatar size="120" max-width="150" class="mx-auto red">
                      <img
                        v-if="result.photoUrl !== 'no-photo.jpg'"
                        :src="`${getUrl}/uploads/avatars/${result.photoUrl}`"
                        :alt="`${result.channelName} avatar`"
                      />
                      <template v-else color="red">
                        <span class="white--text display-1">
                          {{
                            result.channelName.split('')[0].toUpperCase()
                          }}</span
                        >
                      </template>
                    </v-avatar>
                    <!-- </v-responsive> -->
                  </v-col>
                  <v-col cols="10" sm="10" md="6" lg="6" class="justify-center">
                    <!-- <div class="ml-2"> -->
                    <v-card-title
                      class="pl-2 pt-0 subtitle-1 font-weight-bold align-center"
                    >
                      {{ result.channelName }}
                    </v-card-title>

                    <v-card-subtitle
                      class="pl-2 pt-2 pb-0"
                      style="line-height: 1.2"
                    >
                      {{ result.subscribers }}
                      subscribers<v-icon>mdi-circle-small</v-icon
                      >{{ result.videos }} videos
                    </v-card-subtitle>
                    <v-card-subtitle class="pl-2 pt-2 pb-0">
                      {{ result.description }}
                    </v-card-subtitle>
                    <!-- </div> -->
                  </v-col>

                  <!-- <v-col cols="10" sm="10" md="3" lg="3">
                    <v-btn class="red white--text mt-6" tile depressed
                      >Subscribed</v-btn
                    >
                    <v-btn icon class="ml-5 mt-6"
                      ><v-icon>mdi-bell</v-icon></v-btn
                    >
                  </v-col> -->
                </v-row>
              </v-card>
              <v-card
                :to="`/watch/${result._id}`"
                class="card mb-10"
                tile
                flat
                v-else
              >
                <v-row no-gutters v-if="result.userId">
                  <v-col cols="5" sm="3" md="3" lg="3">
                    <v-img
                      class="align-center"
                      :src="
                        `${getUrl}/uploads/thumbnails/${result.thumbnailUrl}`
                      "
                      :alt="`${result.userId.channelName} avatar`"
                    >
                    </v-img>
                  </v-col>
                  <v-col cols="7" sm="7" md="8" lg="8">
                    <div class="ml-2">
                      <v-card-title
                        class="pl-2 pt-0 subtitle-1 font-weight-bold"
                      >
                        {{ result.title }}
                      </v-card-title>

                      <v-card-subtitle
                        class="pl-2 pt-2 pb-0"
                        style="line-height: 1.2"
                      >
                        {{ result.userId.channelName }}<br />
                        {{ result.views }}
                        views<v-icon>mdi-circle-small</v-icon>6 hours ago
                      </v-card-subtitle>
                      <v-card-subtitle class="pl-2 pt-2 pb-0">
                        {{ result.description }}
                      </v-card-subtitle>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-skeleton-loader>
          </div>
          <infinite-loading
            :identifier="infiniteId"
            @infinite="getSearchResults"
          >
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
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { mapGetters } from 'vuex'
import SearchService from '@/services/SearchService'

export default {
  data: () => ({
    errored: false,
    loading: true,
    loaded: false,
    page: 1,
    results: [],
    text: '',
    infiniteId: +new Date()
  }),
  computed: {
    ...mapGetters(['getUrl'])
  },
  methods: {
    async getSearchResults($state) {
      this.errored = false
      if (!this.loaded) {
        this.loading = true
      }
      const results = await SearchService.search(this.page, {
        text: this.text
      })
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => {
          this.loading = false
        })

      if (!results) return
      // console.log(results)
      if (results.data.data.length) {
        this.page += 1

        this.results.push(...results.data.data)
        if ($state) {
          $state.loaded()
        }

        this.loaded = true
      } else {
        if ($state) {
          $state.complete()
        }
      }
    }
  },
  components: {
    InfiniteLoading
  },
  beforeRouteUpdate(to, from, next) {
    // console.log(to.query['search-query'])
    if (to.query['search-query'] === '') return
    this.text = to.query['search-query']
    this.page = 1
    this.results = []
    this.infiniteId += 1

    next()
  },
  mounted() {
    this.text = this.$route.query['search-query']
  }
}
</script>

<style></style>
