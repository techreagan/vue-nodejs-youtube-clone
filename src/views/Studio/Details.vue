<template>
  <div id="video-details" class="pa-4">
    <v-container>
      <!-- <div class="d-flex justify-space-between mb-5"> -->
      <v-btn text small class="pl-0" @click="$router.go(-1)"
        ><v-icon left>mdi-arrow-left</v-icon> Channel videos</v-btn
      >
      <h2 class="mt-5">Video details</h2>
      <v-row>
        <v-col cols="8">
          <ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
            <form @submit.prevent="handleSubmit(submit)" @reset.prevent="reset">
              <ValidationProvider
                v-slot="{ errors }"
                name="Title"
                rules="required|min:3"
              >
                <v-text-field
                  :loading="inputLoading"
                  v-model="formData.title"
                  :error-messages="errors"
                  label="Title (required)"
                  class="mb-3"
                  filled
                  dense
                  counter="100"
                  max-length="100"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Description"
                rules="required|min:3"
              >
                <v-textarea
                  :loading="inputLoading"
                  filled
                  auto-grow
                  :error-messages="errors"
                  label="Description"
                  placeholder="Tell viewers about your video"
                  rows="5"
                  counter="5000"
                  max-length="5000"
                  v-model="formData.description"
                  row-height="20"
                ></v-textarea>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Visibilty"
                rules="required|oneOf:private,public"
              >
                <v-select
                  :loading="inputLoading"
                  :items="visibility"
                  :error-messages="errors"
                  filled
                  label="Visibilty"
                  :value="formData.visibility"
                  v-model="formData.visibility"
                ></v-select>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Cateogry"
                rules="required|min:3"
              >
                <v-select
                  :loading="categoryLoading"
                  :items="categoriesTitles"
                  :error-messages="errors"
                  filled
                  label="Categories"
                  v-model="formData.category"
                ></v-select>
              </ValidationProvider>

              <div class="mt-6 d-flex justify-space-between">
                <v-btn
                  :loading="submitLoading"
                  type="submit"
                  class="primary"
                  depressed
                  >Submit</v-btn
                >
              </div>
            </form>
          </ValidationObserver>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn text @click="toggleShow">Upload Thumbnails</v-btn>
          <my-upload
            field="thumbnail"
            @crop-success="cropSuccess"
            method="PUT"
            v-model="show"
            :width="1280"
            :height="720"
            :url="url"
            :headers="headers"
            img-format="jpg"
            langType="en"
          ></my-upload>
          <v-responsive style="max-width: 100%">
            <div v-if="!imgDataUrl" class="px-12" id="image-placeholder">
              <v-icon>mdi-image-plus</v-icon>
            </div>
            <v-img v-else height="350" :src="imgDataUrl"></v-img>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import VideoService from '@/services/VideoService'
import CategoryService from '@/services/CategoryService'

export default {
  name: 'Details',
  data() {
    return {
      // dialog: this.openDialog ? this.openDialog : false,
      inputLoading: false,
      submitLoading: false,
      categoryLoading: false,
      value: 0,
      show: false,
      rules: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          'Video size should be less than 5 MB!'
      ],
      categoriesTitles: [],
      categories: [],
      visibility: ['public', 'private'],
      formData: {
        title: '',
        description: '',
        category: '',
        visibility: ''
      },
      // imgDataUrl: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',

      imgDataUrl: '',
      url: '',
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
    }
  },
  methods: {
    async getVideo() {
      this.inputLoading = true
      let video = await VideoService.getById(this.$route.params.id)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.inputLoading = false
        })

      if (!video) return
      video = video.data.data
      this.url = `${process.env.VUE_APP_URL}/api/v1/videos/${video._id}/thumbnails`

      this.formData.title = video.title
      this.formData.description = video.description
      this.formData.visibility = video.status == 'draft' ? '' : video.status
      this.formData.category = video.categoryId.title
      this.imgDataUrl = `${process.env.VUE_APP_URL}/uploads/thumbnails/${video.thumbnailUrl}`
    },
    async submit() {
      // if (this.$route.name === 'Dashboard')
      this.submitLoading = true
      this.formData.category = this.categories.find(
        (category) => category.title === this.formData.category
      )._id
      const video = await VideoService.updateVideo(this.$route.params.id, {
        title: this.formData.title,
        description: this.formData.description,
        categoryId: this.formData.category,
        status: this.formData.visibility.toLowerCase()
      })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (this.submitLoading = false))

      if (!video) return

      this.$router.push('/studio/videos')
      // console.log('submittied')
    },
    async getCategories() {
      this.categoryLoading = true
      const categories = await CategoryService.getAll()
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (this.categoryLoading = false))

      this.categoriesTitles = categories.data.data.map((category) => {
        return category.title
      })
      this.categories = categories.data.data
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      console.log(field)
      this.imgDataUrl = imgDataUrl
    }
  },
  components: {
    myUpload
  },
  mounted() {
    this.getVideo()
    this.getCategories()
  }
}
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
