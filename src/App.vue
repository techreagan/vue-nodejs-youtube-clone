<template>
  <v-app>
    <NavBar v-if="!['SignIn', 'SignUp'].includes(this.$route.name)" />

    <v-content
      :class="{
        'content-bg': !['SignIn', 'SignUp'].includes(this.$route.name)
          ? true
          : false
      }"
    >
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'App',

  data: () => ({
    // hideNav: false
  }),
  components: {
    NavBar
  }
}
</script>

<style lang="scss">
.content-bg {
  background-color: #f9f9f9;
}
</style>
