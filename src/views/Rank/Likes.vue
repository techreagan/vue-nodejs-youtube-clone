<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
          class="d-flex"
          cols="12"
          sm="1"
      >
        <v-select
            :items="items"
            @change="change"
            :value="currentValue"
        ></v-select>
      </v-col>
    </v-row>
    <v-simple-table fixed-header class="mt-10">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="th">
            Ranking
          </th>
          <th class="th">
            Video Name
          </th>
          <th class="th">
            Channel
          </th>
          <th class="th">
            Account
          </th>
          <th class="th">
            Likes
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item) in data"
            :key="item.name"
            :class="{'high-light':item.address === $store.state.auth.user.address}"
        >
          <td>

            {{ item.index + 1 }}
          </td>
          <td>
            <router-link :to="'/watch/'+item.videoId">
              {{ item.videoName }}
            </router-link>
          </td>
          <td>
            <router-link :to="'/channels/'+item.userId">
            {{ item.channelName }}
            </router-link>
          </td>
          <td>{{ item.address }}</td>
          <td>{{ item.count }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import FeelingService from "@/services/FeelingService";

export default {
  name: "Likes",
  data() {
    return {
      items: [],
      currentValue: 1,
      data: []
    }
  },
  async created() {
    const rank = await FeelingService.getRank();
    this.data = rank.data.data;
    this.currentValue = rank.data.round;
    for (let i = 1; i <= rank.data.round; i++) {
      this.items.push({
        text: "Round" + i,
        value: i,
      })
    }
  },
  methods: {
    async change(value) {
      this.currentValue = value;
      const rank = await FeelingService.getRank(value);
      this.data = rank.data.data;
    }
  }
}
</script>

<style scoped>

</style>
