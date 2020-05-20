<template>
  <v-dialog v-model="dialog" @click:outside="closeModal" width="400">
    <v-card class="pt-8">
      <v-card-text>
        <h2 class="mb-3">{{ details.title }}</h2>
        <p>{{ details.text }}</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/signin">
          Sign in
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    openModal: {
      type: Boolean,
      required: true
    },
    details: {
      type: Object,
      required: true
    }
  },
  computed: {
    dialog() {
      return this.openModal
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    }
  }
}
</script>
