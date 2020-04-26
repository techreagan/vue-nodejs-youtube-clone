<template>
  <div id="video" class="pa-4 pl-0">
    <!-- <v-container fluid> -->
    <h2>channel videos</h2>

    <!-- <v-row> -->
    <v-tabs v-model="tab" id="tab" class="mt-5">
      <v-tab>
        Uploads
      </v-tab>
      <v-tab>
        Live
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <template>
          <v-card flat>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Filter"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              no-data-text="No videos available, please upload video."
              :headers="headers"
              :items="videos"
              :search="search"
              :loading="loading"
              loading-text="Loading... Please wait"
            >
              <template v-slot:top>
                <v-dialog v-model="dialogDelete" persistent max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline"
                        >Permanently delete this video?</span
                      >
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-card class="card" tile flat>
                          <v-row no-gutters>
                            <v-col cols="3" sm="2" md="5" lg="5">
                              <v-img
                                class="align-center"
                                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                              >
                              </v-img>
                            </v-col>
                            <v-col>
                              <div class="ml-2">
                                <v-card-title
                                  class="pl-2 subtitle-1 font-weight-bold"
                                  style="line-height: 1"
                                >
                                  {{ itemToDelete.name }}
                                </v-card-title>

                                <v-card-subtitle
                                  class="pl-2 pt-2 pb-0"
                                  style="line-height: 1"
                                >
                                  Published Apr 20, 2020 <br />
                                  {{ itemToDelete.views }} views
                                </v-card-subtitle>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="dialogDelete = !dialogDelete"
                        >Cancel</v-btn
                      >

                      <v-btn color="blue darken-1" text @click="deleteItem"
                        >Delete Forever</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon href text class="mr-2">
                  <v-icon @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn icon href text class="mr-2" router to="/watch/123">
                  <v-icon>
                    mdi-youtube
                  </v-icon>
                </v-btn>
                <v-btn icon text @click.stop="deleteBtn(item)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </v-tab-item>
      <v-tab-item>
        live
      </v-tab-item>
    </v-tabs-items>
    <!-- </v-row> -->
    <!-- </v-container> -->
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    dialogDelete: false,
    tab: null,
    search: '',
    headers: [
      {
        text: 'Video',
        align: 'start',
        value: 'name'
      },
      { text: 'Visibility', value: 'visibility' },
      { text: 'Restrictions', value: 'restrictions' },
      { text: 'Views', value: 'views' },
      { text: 'Comments', value: 'comments' },
      { text: 'Likes (vs. dislikes)', value: 'likes (vs. dislikes)' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    videos: [],
    itemToDelete: {}
  }),
  methods: {
    editItem(item) {
      this.$router.push({ name: `Detail`, params: { id: item.id } })
    },
    deleteBtn(item) {
      this.dialogDelete = true
      this.itemToDelete = item
    },
    deleteItem() {
      this.dialogDelete = false
      this.videos = this.videos.filter(
        (video) => this.itemToDelete.id !== video.id
      )
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
      this.videos = [
        {
          'name': 'Day 44',
          'visibility': 'public',
          'restrictions': 'none',
          'views': 10,
          'comments': 5,
          'likes (vs. dislikes)': 10,
          'id': 12233
        },
        {
          'name': 'Day 45',
          'visibility': 'public',
          'restrictions': 'none',
          'views': 13,
          'comments': 15,
          'likes (vs. dislikes)': 20,
          'id': 12234
        },
        {
          'name': 'Day 46',
          'visibility': 'public',
          'restrictions': 'none',
          'views': 10,
          'comments': 45,
          'likes (vs. dislikes)': 60,
          'id': 122133
        }
      ]
    }, 2000)
  }
}
</script>

<style lang="scss">
// .card,
// #tab .v-tabs-bar {
//   background: #f9f9f9 !important;
// }
</style>
