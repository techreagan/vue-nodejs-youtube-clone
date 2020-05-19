<template>
  <v-card class="transparent" flat>
    <v-list-item three-line class="pl-0">
      <v-list-item-avatar size="50">
        <v-avatar v-if="!isAuthenticated" color="primary">
          <v-icon class="white--text">mdi-account</v-icon>
        </v-avatar>
        <v-img
          v-else-if="currentUser.photoUrl !== 'no-photo.jpg'"
          :src="`${getUrl}/uploads/avatars/${currentUser.photoUrl}`"
        ></v-img>

        <v-avatar v-else color="red">
          <span class="white--text headline ">
            {{ currentUser.channelName.split('')[0].toUpperCase() }}</span
          >
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content class="align-self-auto">
        <v-text-field
          v-model="comment"
          placeholder="Add a public comment..."
          @click="clickTextField"
        >
        </v-text-field>
        <div v-if="showCommentBtns" class="d-inline-block text-right">
          <v-btn text @click="showCommentBtns = !showCommentBtns">Cancel</v-btn>
          <v-btn
            class="blue darken-3 white--text"
            depressed
            tile
            :loading="loading"
            :disabled="comment === ''"
            @click="createComment"
            >Comment</v-btn
          >
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentService from '@/services/CommentService'
export default {
  props: {
    videoId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      showCommentBtns: false,
      loading: false,
      comment: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'getUrl', 'isAuthenticated'])
  },
  methods: {
    async createComment() {
      if (this.comment === '') return

      this.loading = true
      const comment = await CommentService.createComment({
        text: this.comment,
        videoId: this.videoId
      })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })

      if (!comment) return
      this.comment = ''
      comment.data.data.replies = []
      comment.data.data.userId = this.$store.getters.currentUser

      this.$store.dispatch('addComment', comment.data.data)
      this.$emit('videoCommentLength')
    },
    clickTextField() {
      if (!this.isAuthenticated) return this.$router.push('/signin')
      this.showCommentBtns = true
    }
  }
}
</script>

<style></style>
