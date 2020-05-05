<template>
  <v-card class="transparent" flat>
    <v-list-item three-line class="pl-0">
      <v-list-item-avatar size="50"
        ><v-img :src="avatar"></v-img
      ></v-list-item-avatar>
      <v-list-item-content class="align-self-auto">
        <v-text-field
          v-model="comment"
          placeholder="Add a public comment..."
          @click="showCommentBtns = true"
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
      comment: '',
      avatar: `${process.env.VUE_APP_URL}/uploads/avatars/${this.$store.getters.currentUser.photoUrl}`
    }
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
      comment.data.data.userId = this.$store.getters.currentUser
      this.$store.dispatch('addComment', comment.data.data)
    }
  }
}
</script>

<style></style>
