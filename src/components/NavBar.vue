<template>
  <nav>
    <v-app-bar class="white" flat app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">VueTube</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        flat
        hide-details
        append-icon="mdi-magnify"
        placeholder="Search"
        outlined
        dense
        @click:append="search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <!-- <v-toolbar-title>Page title</v-toolbar-title> -->

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon size="25">mdi-video-plus</v-icon>
      </v-btn>
      <v-btn icon :class="{ 'mr-7': !$store.getters.isAuthenticated }">
        <v-icon size="25">mdi-apps</v-icon>
      </v-btn>
      <v-btn icon class="mr-7" v-if="$store.getters.isAuthenticated">
        <v-icon size="25">mdi-bell</v-icon>
      </v-btn>
      <v-btn
        tile
        outlined
        color="blue"
        class="font-weight-bold"
        v-if="!$store.getters.isAuthenticated"
        router
        to="/signin"
      >
        <v-icon left size="26">mdi-account-circle</v-icon> Sign in
      </v-btn>

      <v-menu offset-y left v-else>
        <template v-slot:activator="{ on }">
          <v-btn small color="red" depressed fab v-on="on" class="white--text">
            T
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="`https://randomuser.me/api/portraits/men/4.jpg`" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text-capitalize">{{
                  $store.getters.currentUser.channelName
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  $store.getters.currentUser.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item router to="/logout">
              <v-list-item-icon>
                <v-icon>mdi-account-box</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Your channel</v-list-item-title>
            </v-list-item>
            <v-list-item router to="/logout">
              <v-list-item-icon>
                <v-icon>mdi-youtube-studio</v-icon>
              </v-list-item-icon>
              <v-list-item-title>VueTube Studio</v-list-item-title>
            </v-list-item>
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-login-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- <v-list>
          <v-list-item router to="/logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list> -->
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" clipped app id="nav">
      <div tag="div" class="v-navigation-drawer__content" v-bar>
        <v-list dense nav class="py-0" tag="div">
          <v-list-item class="hidden-lg-and-up">
            <v-app-bar-nav-icon
              @click="drawer = !drawer"
              class="mr-5"
            ></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">VueTube</v-toolbar-title>
            <!-- <h2 class="py-5 font-weight-bold">
              VueTube
            </h2> -->
          </v-list-item>
          <v-divider class="hidden-lg-and-up"></v-divider>
          <div v-for="parentItem in items" :key="parentItem.header">
            <v-subheader
              v-if="parentItem.header"
              class="pl-3 py-4 subtitle-1 font-weight-bold text-uppercase"
              >{{ parentItem.header }}</v-subheader
            >
            <v-list-item
              v-for="(item, i) in parentItem.pages"
              :key="item.title"
              link
              class="mb-0"
              router
              :to="item.link"
              exact
              active-class="active-item"
            >
              <v-list-item-icon v-if="parentItem.header !== 'Subscriptions'">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-avatar v-else class="mr-5">
                <img
                  :src="`https://randomuser.me/api/portraits/men/${i}.jpg`"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class=" font-weight-medium subtitle-2">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2 mb-2"></v-divider>
          </div>
          <!-- <v-list-item-content> -->
          <!-- <v-list-item-title class="font-weight-regular"> -->
          <span v-for="link in links" :key="link.text">
            <span v-if="link.text === 'Terms'" class="mb-2 d-block"> </span>
            <v-btn
              href
              router
              :to="link.link"
              text
              class="text-capitalize px-1"
              small
              >{{ link.text }}</v-btn
            >
          </span>
          <!-- </v-list-item-title> -->
          <!-- </v-list-item-content> -->
        </v-list>
      </div>
      <!-- <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary">Logout</v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    items: [
      {
        header: null,
        pages: [
          { title: 'Home', link: '/', icon: 'mdi-home' },
          { title: 'Trending', link: '/trending', icon: 'mdi-fire' },
          {
            title: 'Subscriptions',
            link: '/subscriptions',
            icon: 'mdi-youtube-subscription'
          }
        ]
      },
      {
        header: null,
        pages: [
          {
            title: 'Library',
            link: '/library',
            icon: 'mdi-play-box-multiple'
          },
          {
            title: 'History',
            link: '/history',
            icon: 'mdi-history'
          },
          {
            title: 'Your videos',
            link: '/your-videos',
            icon: 'mdi-play-box-outline'
          },

          {
            title: 'Watch later',
            link: '/watch-later',
            icon: 'mdi-clock'
          },

          {
            title: 'Liked videos',
            link: '/liked-videos',
            icon: 'mdi-thumb-up'
          }
        ]
      },
      {
        header: 'Subscriptions',
        pages: [
          {
            title: 'Traversy Media',
            link: '/channels/traversy-media',
            icon: 'mdi-badge-account'
          },
          {
            title: 'The New Boston',
            link: '/channels/the-new-boston',
            icon: 'mdi-badge-account'
          },
          {
            title: 'Net Ninija',
            link: '/channels/net-ninija',
            icon: 'mdi-badge-account'
          },
          {
            title: 'Chris Hawks',
            link: '/channels/chris-hawks',
            icon: 'mdi-badge-account'
          }
        ]
      },
      {
        header: 'MORE FROM VUETUBE',
        pages: [
          {
            title: 'VueTube Premium',
            link: '/more/vuetube-premium',
            icon: 'mdi-youtube'
          },
          {
            title: 'Gaming',
            link: '/more/gaming',
            icon: 'mdi-youtube-gaming'
          },
          {
            title: 'Live',
            link: '/more/live',
            icon: 'mdi-access-point'
          }
        ]
      },
      {
        header: null,
        pages: [
          {
            title: 'Setting',
            link: '/settings',
            icon: 'mdi-cog'
          },
          {
            title: 'Report history',
            link: '/report-history',
            icon: 'mdi-flag'
          },
          {
            title: 'Help',
            link: '/help',
            icon: 'mdi-help-circle'
          },
          {
            title: 'Send feedback',
            link: '/send-feedback',
            icon: 'mdi-message-alert'
          }
        ]
      }
    ],
    links: [
      { text: 'About', link: '#' },
      { text: 'Press', link: '#' },
      { text: 'Copyrignt', link: '#' },
      { text: 'Contact us', link: '#' },
      { text: 'Creators', link: '#' },
      { text: 'Advertise', link: '#' },
      { text: 'Developers', link: '#' },
      { text: 'Terms', link: '#' },
      { text: 'Privacy', link: '#' },
      { text: 'Policy & Safety', link: '#' },
      { text: 'Test new features', link: '#' }
    ]
  }),
  methods: {
    search() {
      console.log('hello')
    },
    signOut() {
      this.$store.dispatch('signOut')
      // this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.active-item {
  .v-list-item__icon {
    color: red !important;
  }
}
.v-navigation-drawer__border {
  width: 0 !important;
}

.vuebar-element {
  height: 250px;
  width: 100%;
  max-width: 500px;
  background: #dfe9fe;
}

.vb > .vb-dragger {
  z-index: 5;
  width: 10px;
  right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: rotate3d(0, 0, 0, 0);
  transform: rotate3d(0, 0, 0, 0);
  -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;

  margin: 5px 5px 5px 0;
  border-radius: 20px;
  height: calc(100% - 10px);
  display: block;
}

.v-navigation-drawer__content:hover .vb > .vb-dragger > .vb-dragger-styler {
  width: 10px;
  background-color: #e0e0e0;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.3);
  background-color: rgba(255, 255, 255, 0.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
  margin: 0px;
  width: 10px;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.5);
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(48, 121, 244, 0.5);
}
</style>
