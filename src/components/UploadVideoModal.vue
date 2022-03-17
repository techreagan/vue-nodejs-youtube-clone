<template>
  <div>

    <v-overlay :value="uploading" z-index="9999" class="text-center">
      <v-progress-linear
          :value="value"
          v-if="value"
          color="amber"
          rounded
          height="15"
          style="border-radius: 20px;width: 50vw"
      >
      </v-progress-linear>
      <v-progress-circular
          v-else
          indeterminate
          size="64"
      ></v-progress-circular>

      <div style="margin-top: 20px;font-size: 20px ">{{ statusTip }}</div>
    </v-overlay>
    <v-dialog
        v-model="dialog"
        persistent
        transition="fab-transition"
        max-width="1000"
    >
      <v-card>
        <div class="d-flex justify-space-between mb-5" id="modal-header">
          <v-card-title class="py-3">Upload Video</v-card-title>
          <div class="mt-3 mr-2">
            <v-btn text>
              Upload With Classic
            </v-btn>
            <v-btn icon text @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <v-card-text
            v-if="!uploaded"
            class="d-flex flex-column align-center my-md-12 py-md-12 my-sm-8 py-sm-8 my-xs-0 py-xs-0 my-12 py-12"
        >
          <div class="text-center">
            <div>
              <v-btn
                  icon
                  class="grey lighten-2 mb-4"
                  style="height: 104px;width: 104px;"
                  @click="selectFile"
              >
                <v-icon x-large class="grey--text text--darken-1"
                >mdi-upload
                </v-icon
                >
              </v-btn
              >
            </div>
            <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                name="file"
                ref="provider"
            >
              <v-file-input
                  @change="uploadVideo"
                  v-model="selectedFile"
                  accept="video/mp4"
                  placeholder="Pick an video"
                  prepend-icon="mdi-video"
                  :error-messages="errors"
                  ref="fileInput"
                  :rules="rules"
              ></v-file-input>
            </ValidationProvider>
            <v-btn
                type="submit"
                depressed
                @click="$refs.fileInput.$refs.input.click()"
                class="blue darken-3 flat white--text mt-4"
            >Select File
            </v-btn
            >
          </div>
        </v-card-text>
        <v-card-text v-else>
          <h2 class="mb-6">Details</h2>
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
            >
              <ValidationObserver ref="form">
                <form
                    @submit.prevent="submit"
                    @reset.prevent>
                  <ValidationProvider
                      v-slot="{ errors }"
                      name="Title"
                      rules="required|min:3"
                  >
                    <v-text-field
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
                      rules="required|min:3"
                  >
                    <v-select
                        :items="visibilty"
                        :error-messages="errors"
                        filled
                        label="Visibilty"
                        v-model="formData.visibilty"
                    ></v-select>
                  </ValidationProvider>
                  <ValidationProvider
                      v-slot="{ errors }"
                      name="Cateogry"
                      rules="required|min:3"
                  >
                    <v-select
                        :items="categoriesTitles"
                        :error-messages="errors"
                        filled
                        label="Categories"
                        v-model="formData.category"
                        :loading="categoryLoading"
                    ></v-select>
                  </ValidationProvider>
                  <!--                  <ValidationProvider-->
                  <!--                      v-slot="{ errors }"-->
                  <!--                      name="hash"-->
                  <!--                      rules="required"-->
                  <!--                  >-->
                  <!--                    <v-text-field-->
                  <!--                        v-model="formData.hash"-->
                  <!--                        :error-messages="errors"-->
                  <!--                        label="hash (required)"-->
                  <!--                        class="mb-3"-->
                  <!--                        filled-->
                  <!--                        dense-->
                  <!--                        counter="100"-->
                  <!--                        max-length="100"-->
                  <!--                    ></v-text-field>-->
                  <!--                  </ValidationProvider>-->
                  <div class="mt-6 d-flex">
                    <v-btn
                        :loading="submitLoading"
                        type="submit"
                        class="primary"
                        depressed
                    >Submit
                    </v-btn
                    >
                    <v-btn
                        color="warning"
                        class="primary"
                        depressed
                        style="margin-left: 20px"
                        @click="deleteVideo"
                    >delete
                    </v-btn
                    >
                  </div>
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
              <v-btn text @click="toggleShow">Upload Thumbnails</v-btn>
              <my-upload
                  field="thumbnail"
                  @crop-success="cropSuccess"
                  method="PUT"
                  v-model="show"
                  :width="960"
                  :height="480"
                  :headers="headers"
                  img-format="jpg"
                  langType="en"
                  :maxSize="1024 * 5"
              ></my-upload>
              <v-responsive width="330" class="mx-auto">
                <div v-if="!imgDataUrl" class="px-12" id="image-placeholder">
                  <v-icon>mdi-image-plus</v-icon>
                </div>
                <v-img
                    v-else
                    max-width="330"
                    height="350"
                    :src="imgDataUrl"
                ></v-img>
              </v-responsive>
              <p v-if="imgDataUrl == ''" class="red--text">
                Please upload thumbnail
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-if="!uploaded">
          <p class="text-center grey--text caption px-12 px-xs-0">
            By submitting your videos to Web3Tube, you acknowledge that you agree
            to Web3Tube's Terms of Service and Community Guidelines. Please be sure
            not to violate others' copyright or privacy rights. Learn more
          </p>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import myUpload from "vue-image-crop-upload";
import VideoService from "@/services/VideoService";
import CategoryService from "@/services/CategoryService";
import data2blob from "vue-image-crop-upload/utils/data2blob";
import {mapGetters} from "vuex";
import AuroraService from "@/services/AuroraService";
import {splicingBit, stringToBinary, getProgress, random} from "@/utils/util";
import {storeGroup} from "@/store/modules/auth";

export default {
  name: "UploadModal",
  props: {
    openDialog: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      statusTip: "",
      valid: false,
      uploaded: false,
      uploading: false,
      submitLoading: false,
      categoryLoading: false,
      // interval: {},
      value: 0,
      show: false,
      rules: [
        (value) => {
          console.log(value)
          return value.size > 300 * 1024 * 1024 &&
              `Video size cannot exceed 300M!`
        }
        ,
      ],
      categoriesTitles: [],
      categories: [],
      visibilty: ["Public", "Private"],
      selectedFile: null,
      formData: {
        id: "",
        title: "",
        description: "",
        category: "",
        visibilty: "",
        url: "",
      },
      imgDataUrl: "",
      // url: "",
      headers: {Authorization: `Bearer ${this.$store.getters.getToken}`},
    };
  },
  computed: {
    ...mapGetters(["getApi"]),
    dialog() {
      return this.openDialog;
    },
  },
  methods: {
    async test(hash) {
      let _this = this;
      let ws = this.$store.state.auth.ws;
      const subStorage = await new Promise((s, f) => {
        ws.send({
          "id": 1,
          "jsonrpc": "2.0",
          "method": "group_subscribe",
          "params": ["peers", storeGroup]
        }, (err, res) => {
          if (err) f(err);
          if (res.error) f(res.error.message);
          s(res);
        })
      });

      const {overlay, data} = await new Promise((s, f) => {
        let timer = setTimeout(() => {
          ws.send({
            "id": 1,
            "jsonrpc": "2.0",
            "method": "group_unsubscribe",
            "params": [subStorage.result]
          });
          f("Failed to connect to the P2P network");
        }, 3000 * 10)
        let state = true;
        let connected = [];
        ws.on(subStorage.result, async (res) => {
          console.log(res)
          connected = res.connected;
          if (connected.length && state) {
            clearTimeout(timer);
            let n = random(0, connected.length - 1);
            console.log(n)
            let sendOverlay = connected[n];
            AuroraService.sendMessage(_this.getApi, sendOverlay, hash).then((res) => {
              let data = JSON.parse(window.atob(res.data.data))
              console.log(data);
              s({overlay: sendOverlay, data})
            }).catch(e => {
              f(e)
            }).finally(() => {
              ws.send({
                "id": 2,
                "jsonrpc": "2.0",
                "method": "group_unsubscribe",
                "params": [subStorage.result]
              })
            })
          }
        })
      });

      if (data.code) {
        if (data.code === 1001) return data.message;
        throw new Error(data.message);
      }

      const subDownload = await new Promise((s, f) => {
        ws.send({
          "id": 3,
          "jsonrpc": "2.0",
          "method": "chunkInfo_subscribe",
          "params": ["retrievalProgress", hash]
        }, (err, res) => {
          console.log(res)
          if (err) f(err)
          if (res.error) f(res.error.message);
          s(res);
        })
      })

      let sourceInfo = await AuroraService.sourceInfo(hash);
      console.log(sourceInfo);
      sourceInfo = sourceInfo?.data.find(item => item.overlay === overlay);
      if (sourceInfo) {
        let p = getProgress(stringToBinary(sourceInfo.bit.b, sourceInfo.bit.len))
        _this.value = p;
        if (p === 100) {
          return "Video uploaded successfully";
        }
      }


      return new Promise((s, f) => {
        let timer = setTimeout(() => {
          f("Upload failed");
        }, 1000 * 30)
        let p = 0;
        _this.statusTip = "Uploading the file to the P2P storage node";
        ws.on(subDownload.result, async (res) => {
          console.log(res)
          let downloadData = res.find(item => item.Overlay === overlay);
          if (!downloadData) return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            f("Upload failed");
          }, 1000 * 30)
          if (data.vector) {
            p = getProgress(splicingBit(data.vector.b, downloadData.Bitvector.b, downloadData.Bitvector.len))
          } else {
            p = getProgress(stringToBinary(downloadData.Bitvector.b, downloadData.Bitvector.len))
          }
          console.log(p);
          _this.value = p;
          if (p === 100) {
            ws.send({
              "id": 4,
              "jsonrpc": "2.0",
              "method": "chunkInfo_unsubscribe",
              "params": [subDownload.result]
            });
            s("Upload successful");
          }
        })
      })
    },
    async uploadVideo(e) {
      const {valid} = await this.$refs.provider.validate(e);
      if (!valid) return;
      try {
        this.uploading = true;
        this.statusTip = "Uploading the file to local node";
        await AuroraService.observeStorage(this.getApi);
        let data = await AuroraService.uploadFile(this.getApi, this.selectedFile);
        let hash = data.data.reference;
        console.log(hash);
        let message = await this.test(hash)
        await this.$store.dispatch("showTips", {
          type: "success",
          text: message
        })
        let video = await VideoService.uploadVideo({
          url: hash
        });
        this.formData.url = hash;
        video = video.data.data
        this.formData.id = video._id;
        this.uploaded = true;
      } catch (e) {
        console.log(e.message)
        await this.$store.dispatch("showTips", {
          type: "error",
          text: e.message || e
        })
      } finally {
        this.uploading = false;
      }
    },
    async submit() {
      if (this.imgDataUrl === "") return;
      this.submitLoading = true;
      this.formData.category = this.categories.find(
          (category) => category.title === this.formData.category
      )._id;

      const video = await VideoService.updateVideo(this.formData.id, {
        title: this.formData.title,
        description: this.formData.description,
        categoryId: this.formData.category,
        status: this.formData.visibilty.toLowerCase(),
      })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.submitLoading = false;
            this.uploaded = false;
          });
      if (!video) return;
      await this.updateImg(video.data.data.id).catch((err) => {
        console.log(err);
      });
      // this.$nextTick(() => {
      //   this.$refs.form.reset()
      // })
      this.formData.visibilty = "";
      this.imgDataUrl = "";
      this.selectedFile = [];
      this.closeModal();

      await this.$router.push(`/studio/videos?${new Date()}`);
      // console.log('submittied')
    },
    async getCategories() {
      this.categoryLoading = true;
      const categories = await CategoryService.getAll()
          .catch((err) => {
            console.log(err);
          })
          .finally(() => (this.categoryLoading = false));

      this.categoriesTitles = categories.data.data.map((category) => {
        return category.title;
      });
      this.categories = categories.data.data;
    },
    async deleteVideo() {
      await VideoService.deleteById(this.formData.id).catch((err) => {
        this.$store.dispatch("showTips", {
          type: "error",
          text: err.message
        })
      }).finally(() => {
        this.closeModal()
      });
      await this.$router.push(`/studio/videos?${new Date()}`);
    },
    closeModal() {
      this.$emit("closeDialog");
    },
    selectFile() {
      this.$refs.fileInput.$refs.input.click();
    },
    toggleShow() {
      this.show = !this.show;
    },
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
      console.log(field);
      this.imgDataUrl = imgDataUrl;
    },
    async updateImg(id) {
      if (this.imgDataUrl === "") return;
      let fmData = new FormData();
      fmData.append("thumbnail", data2blob(this.imgDataUrl, ["image/jpeg"]), "thumbnail.jpg");
      let img = await VideoService.uploadThumbnail(id, fmData);
      console.log(img);
    }
  },
  components: {
    myUpload,
  },
  async mounted() {
    VideoService.getUndone().then((data) => {
      if (data.data.data) {
        this.uploaded = true;
        this.formData.id = data.data.data._id;
      }
    });
    this.getCategories();

  },
};
</script>

<style lang="scss">
#modal-header {
  border-bottom: 1px solid rgb(238, 232, 232);
}

#image-placeholder {
  padding-top: 8em;
  padding-bottom: 8em;
  border: 2px dashed rgb(209, 209, 209);
}
</style>
