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
              <template v-slot:item.feelings="{ item }">
                <span class="mr-3"
                  ><v-icon small class="pr-1">mdi-thumb-up</v-icon
                  >{{ item.likes }}</span
                >
                <span
                  ><v-icon small class="pr-1">mdi-thumb-down</v-icon
                  >{{ item.dislikes }}</span
                >
              </template>
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
                                :src="`${url}/uploads/thumbnails/${itemToDelete.thumbnailUrl}`"
                              >
                              </v-img>
                            </v-col>
                            <v-col>
                              <div class="ml-2">
                                <v-card-title
                                  class="pl-2 subtitle-1 font-weight-bold"
                                  style="line-height: 1"
                                >
                                  {{ itemToDelete.title }}
                                </v-card-title>

                                <v-card-subtitle
                                  class="pl-2 pt-2 pb-0"
                                  style="line-height: 1"
                                >

                                  Published
                                  {{ dateFormatter(itemToDelete.createdAt) }}
                                  <br />
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

                      <v-btn
                        :loading="deleteBtnLoading"
                        color="blue darken-1"
                        text
                        @click="deleteItem"
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
                <v-btn
                  icon
                  href
                  text
                  class="mr-2"
                  router
                  :to="`/watch/${item._id}`"
                >
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
    <v-snackbar v-model="snackbar">
      Video deleted successfully
      <v-btn color="white" text @click="snackbar = false" icon>
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import VideoService from "@/services/VideoService";
import moment from "moment";
export default {
  data: () => ({
    loading: false,
    deleteBtnLoading: false,
    snackbar: false,
    dialogDelete: false,
    tab: null,
    search: "",
    url: process.env.VUE_APP_URL,
    headers: [
      {
        text: "Video",
        align: "start",
        value: "title",
      },
      { text: "Visibility", value: "status" },
      { text: "Views", value: "views" },
      { text: "Comments", value: "comments" },
      { text: "Likes (vs. dislikes)", value: "feelings" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    videos: [],
    itemToDelete: {},
  }),
  methods: {
    async getVideos() {
      this.loading = true;

      const videos = await VideoService.getAll("private", { limit: 0 })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.loading = false));

      if (!videos) return;
      // console.log(videos)
      this.videos = videos.data.data;
    },
    editItem(item) {
      this.$router.push({ name: `Detail`, params: { id: item.id } });
    },
    deleteBtn(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    async deleteItem() {
      this.deleteBtnLoading = true;
      await VideoService.deleteById(this.itemToDelete._id)
        .catch((err) => console.log(err))
        .finally(() => {
          this.videos = this.videos.filter(
            (video) => this.itemToDelete.id !== video.id
          );
          this.deleteBtnLoading = false;
          this.dialogDelete = false;
          this.itemToDelete = {};
          this.snackbar = true;
        });
    },
    dateFormatter(date) {
      return moment(date).fromNow();
    },
  },
  mounted() {
    this.getVideos();
  },
  beforeRouteUpdate(to, from, next) {
    this.getVideos();
    next();
  },
};
</script>

<style lang="scss">
// .card,
// #tab .v-tabs-bar {
//   background: #f9f9f9 !important;
// }
</style>
