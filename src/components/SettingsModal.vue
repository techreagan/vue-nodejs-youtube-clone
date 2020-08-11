<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="fab-transition"
    max-width="800"
    id="settings"
  >
    <v-card tile>
      <div class="d-flex justify-space-between mb-5" id="modal-header">
        <v-card-title class="py-3">Settings</v-card-title>

        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text>
        <v-row>
          <v-col
            order="last"
            order-sm="last"
            order-md="first"
            order-lg="first"
            order-xl="first"
            cols="12"
            sm="12"
            md="8"
            lg="8"
            class="pt-0"
          >
            <h3 class="mb-6 mt-0 pt-0">Personal Information</h3>
            <ValidationObserver
              ref="personalInfoForm"
              v-slot="{ handleSubmit, reset }"
            >
              <form
                @submit.prevent="handleSubmit(submit)"
                @reset.prevent="reset"
              >
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Channel Name"
                  rules="required|min:3"
                >
                  <v-text-field
                    v-model="formData.channelName"
                    :error-messages="errors"
                    label="Channel Name"
                    filled
                    dense
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="formData.email"
                    :error-messages="errors"
                    label="Email"
                    filled
                    dense
                  ></v-text-field>
                </ValidationProvider>

                <v-btn
                  :loading="loading.personalInfo"
                  type="submit"
                  class="primary "
                  depressed
                  >Submit</v-btn
                >
              </form>
            </ValidationObserver>

            <h3 class="mb-6 mt-6">Change Password</h3>
            <ValidationObserver
              ref="passwordForm"
              v-slot="{ handleSubmit, reset }"
            >
              <form
                @submit.prevent="handleSubmit(submitPassword)"
                @reset.prevent="reset"
              >
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Current password"
                  rules="required|min:5"
                >
                  <v-text-field
                    v-model="formData.currentPassword"
                    :append-icon="
                      showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :error-messages="errors"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    name="Current password"
                    label="Current Password"
                    filled
                    dense
                    hint="At least 5 characters"
                    class="input-group--focused"
                    @click:append="showCurrentPassword = !showCurrentPassword"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="New password"
                  rules="required|min:5"
                >
                  <v-text-field
                    v-model="formData.newPassword"
                    :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    :type="showNewPassword ? 'text' : 'password'"
                    name="New password"
                    label="New Password"
                    filled
                    dense
                    hint="At least 5 characters"
                    class="input-group--focused"
                    @click:append="showNewPassword = !showNewPassword"
                  ></v-text-field>
                </ValidationProvider>

                <v-btn
                  :loading="loading.password"
                  type="submit"
                  class="primary"
                  depressed
                  >Submit</v-btn
                >
              </form>
            </ValidationObserver>
          </v-col>
          <v-col
            order-sm="1"
            cols="12"
            sm="12"
            md="4"
            lg="4"
            class="text-center"
          >
            <v-btn text @click="toggleShow">Upload Avatar</v-btn>
            <my-upload
              field="avatar"
              method="PUT"
              :headers="headers"
              @crop-success="cropSuccess"
              @crop-upload-success="cropUploadSuccess"
              @crop-upload-fail="cropUploadFail"
              v-model="show"
              :url="url"
              :width="200"
              :height="200"
              :noRotate="false"
              img-format="jpg"
              langType="en"
            ></my-upload>
            <v-responsive
              width="230"
              class="mx-auto"
              style="border-radius: 50%;"
            >
              <div
                v-if="$store.getters.currentUser.photoUrl == 'no-photo.jpg'"
                class="px-12"
                id="settings-image-placeholder"
              >
                <v-icon>mdi-image-plus</v-icon>
              </div>
              <v-img v-else height="220" :src="imgDataUrl"></v-img>
            </v-responsive>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import myUpload from 'vue-image-crop-upload'

export default {
  name: 'SettingsModal',
  props: ['openDialog'],
  data: function() {
    return {
      showCurrentPassword: false,
      showNewPassword: false,
      valid: false,
      interval: {},
      value: 0,
      show: false,
      rules: [
        (value) =>
          !value ||
          value.size < 5000000 ||
          'Video size should be less than 5 MB!'
      ],
      categories: ['People', 'Technology', 'Fashion'],
      visibilty: ['Public', 'Private'],
      formData: {
        channelName: this.$store.getters.currentUser.channelName,
        email: this.$store.getters.currentUser.email,
        currentPassword: '',
        newPassword: ''
      },
      loading: {
        personalInfo: false,
        password: false
      },
      imgDataUrl: `${process.env.VUE_APP_URL}/uploads/avatars/${this.$store.getters.currentUser.photoUrl}`,
      url: `${process.env.VUE_APP_URL}/api/v1/auth/avatar`,
      headers: { Authorization: `Bearer ${this.$store.getters.getToken}` }
    }
  },
  computed: {
    dialog() {
      return this.openDialog
    }
  },
  methods: {
    async submit() {
      if (this.loading.personalInfo) return
      this.loading.personalInfo = true

      const user = await AuthenticationService.updateUserDetails({
        channelName: this.formData.channelName,
        email: this.formData.email
      })
        .catch((err) => {
          this.loading.personalInfo = false
          const errors = err.response.data.error

          this.$refs.personalInfoForm.setErrors({
            'email': errors.find((error) => {
              return error.field === 'email'
            })
              ? ['This email is already taken']
              : null,
            'Channel Name': errors.find((error) => {
              return error.field === 'channelName'
            })
              ? ['This channel name is already taken']
              : null
          })
        })
        .finally(() => (this.loading.personalInfo = false))

      if (!user) return
      if (
        this.formData.channelName !==
          this.$store.getters.currentUser.channelName ||
        this.formData.email !== this.$store.getters.currentUser.email
      ) {
        this.$store.dispatch('signOut')
        this.$router.push('/signin')
      }

      this.closeModal()
    },
    async submitPassword() {
      if (this.loading.password) return

      this.loading.password = true

      const user = await AuthenticationService.updatePassword({
        currentPassword: this.formData.currentPassword,
        newPassword: this.formData.newPassword
      })
        .catch((err) => {
          this.loading.password = false
          const errors = err.response.data.error

          this.$refs.passwordForm.setErrors({
            'Current password': errors.find((error) => {
              return error.field === 'currentPassword'
            })
              ? ['Current password is incorrect']
              : null,
            'New password': errors.find((error) => {
              return error.field === 'newPassword'
            })
              ? errors.find((error) => {
                  return error.field === 'newPassword'
                }).message
              : null
          })
        })
        .finally(() => (this.loading.password = false))
      if (!user) return

      this.formData.currentPassword = ''
      this.formData.newPassword = ''
      this.closeModal()

      this.$store.dispatch('signOut')
      this.$router.push('/signin')
    },
    closeModal() {
      this.$emit('closeDialog')
    },

    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      // console.log('-------- crop success --------')
      console.log(field)
      // console.log(imgDataUrl)
      this.imgDataUrl = imgDataUrl
      // console.log(this.imgDataUrl)
      // console.log(field)
    },
    cropUploadSuccess(jsonData, field) {
      // console.log('-------- upload success --------')
      const user = this.$store.getters.currentUser
      user.photoUrl = jsonData.data
      this.$store.dispatch('signin', user)
      console.log('field: ' + field)
    },

    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  },
  components: {
    myUpload
  }
}
</script>

<style lang="scss">
#modal-header {
  border-bottom: 1px solid rgb(238, 232, 232);
}

#settings-image-placeholder {
  padding-top: 7em;
  padding-bottom: 7em;
  border: 2px dashed rgb(209, 209, 209);
  border-radius: 50%;
}

@media (max-width: 700px) {
  .vue-image-crop-upload {
    .vicp-wrap {
      width: 95%;
      height: 550px;
      .vicp-step2 .vicp-crop {
        .vicp-crop-left {
          float: none;

          .vicp-range {
            margin: auto;
            margin-top: 30px;
          }

          & * {
            margin-left: auto;
            margin-right: auto;
          }
        }
        .vicp-crop-right {
          float: none;
          margin-top: 30px;
          .vicp-preview .vicp-preview-item {
            display: inline-block;
            float: none;
          }
          & * {
            // margin-left: auto;
            // margin-right: auto;
          }
        }
      }
    }
  }
}
</style>
