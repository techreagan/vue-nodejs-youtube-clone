<template>
  <div>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="th">
            Ranking
          </th>
          <th class="th">
            Channel
          </th>
          <th class="th">
            Account
          </th>
          <th class="th">
            Subscriptions
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item,index) in data"
            :key="item.name"
            :class="{'high-light':item.address === $store.state.auth.user.address}"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.channelName }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.count }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import SubscriptionService from "@/services/SubscriptionService";

export default {
  name: "Subscriptions",
  data() {
    return {
      data: [],
    }
  },
  async created() {
    const rank = await SubscriptionService.getRank();
    this.data = rank.data.data;
    console.log(this.data)
  }
}
</script>

<style scoped lang="scss">
.th {
  font-size: 16px;
  text-align: left;
}

.high-light {
  background-color: #eeeeee;
}
</style>
