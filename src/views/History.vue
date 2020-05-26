<template>
  <div id="history" class="fill-height">
    <v-container fluid class="pt-0 pb-0 fill-height">
      <v-row class="fill-height">
        <v-col
          cols="12"
          sm="12"
          order="2"
          order-sm="2"
          order-md="1"
          order-lg="1"
          md="7"
          lg="7"
          class="pt-8 pl-8"
        >
          <h1 class="title font-weight-medium pb-5">{{ historyType }}</h1>
          <template v-if="historyType == 'Watch History'">
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
                          class="pl-2 pt-0 subtitle-1 font-weight-bold d-flex justify-space-between"
                          style="line-height: 1"
                        >
                          Top western road trips

                          <v-btn text>
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-card-title>

                        <v-card-subtitle
                          class="pl-2 pt-2 pb-0"
                          style="line-height: 1"
                        >
                          Tech Reagan<v-icon>mdi-circle-small</v-icon>9.6k views
                        </v-card-subtitle>
                        <v-card-subtitle class="pl-2 pt-2 pb-0">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Fugiat consequatur rerum id nulla, iure beatae
                          atque
                        </v-card-subtitle>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-skeleton-loader>
            </div>
          </template>
          <template v-else>
            <div v-for="i in 10" :key="i">
              <v-skeleton-loader
                class="mx-auto"
                type="list-item-two-line"
                :loading="searchTextsLoading"
                tile
                large
              >
                <v-card class="card d-flex pl-0" flat>
                  <v-card-text class="pl-0 py-0">
                    <v-card-title
                      class="pl-0 black--text text--lighten-5 subtitle-1 font-weight-medium"
                      >Adobe xd tutorial</v-card-title
                    >
                    <v-card-subtitle class="pl-0 pb-0"
                      >18 hours ago</v-card-subtitle
                    >
                  </v-card-text>
                  <v-card-actions
                    ><v-btn text class="grey--text" fab>
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-card-actions
                  >
                </v-card>
              </v-skeleton-loader>
            </div>
          </template>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          order="1"
          order-sm="1"
          order-md="2"
          order-lg="2"
          md="5"
          lg="5"
          :class="[
            'pa-0',
            { 'fill-height': $vuetify.breakpoint.name.smAndDown ? true : false }
          ]"
        >
          <v-card
            flat
            id="card-radiobox"
            class="fill-height grey lighten-4 pa-10"
          >
            <v-radio-group v-model="historyType">
              <p class="title font-weight-regular pl-5 mb-2">History Type</p>
              <v-list class=" grey lighten-4">
                <v-list-item-group>
                  <template v-for="(item, i) in items">
                    <v-divider :key="i"></v-divider>
                    <v-list-item
                      active-class="grey lighten-4"
                      :key="`item-${i}`"
                      class="py-2"
                      @click="clickItem(item)"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="item"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-radio :key="item" :value="item"></v-radio>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
              <div>
                <v-btn text>Clear all {{ historyType }}</v-btn>
                <v-btn text>Pause {{ historyType }}</v-btn>
                <v-btn text>Manage all activity</v-btn>
              </div>
            </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    searchTextsLoading: true,
    items: [
      'Watch History',
      'Search History',
      'Community',
      'Comments',
      'Live Chat'
    ],
    historyType: 'Watch History'
  }),

  methods: {
    clickItem(item) {
      console.log(item)
      this.historyType = item
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
      this.searchTextsLoading = false
    }, 2000)
  }
}
</script>

<style lang="scss" scoped></style>
