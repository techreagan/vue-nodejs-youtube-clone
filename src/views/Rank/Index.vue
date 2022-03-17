<template>
  <div id="rank" class="fill-height pa-8">
    <v-tabs
        background-color="transparent"
        show-arrows
    >
      <v-tab
          v-for="item in items"
          :key="item.link"
          link
          :to="item.link"
      >
        {{ item.title }}
      </v-tab>
    </v-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Rank",
  data() {
    return {
      items: [
        {
          title: "Subscriptions",
          link: "/rank"
        },
        {
          title: "Likes",
          link: "/rank/likes"
        }
      ],
    }
  }
}
</script>

<style scoped lang="scss">

</style>
