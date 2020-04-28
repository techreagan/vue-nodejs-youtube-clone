import Api from '@/services/Api'

export default {
  getAll(data) {
    return Api().get(`videos/${data}`)
  },
  uploadVideo(data, optional) {
    return Api().post('videos', data, optional)
  },
  updateVideo(id, data) {
    return Api().put(`videos/${id}`, data)
  },
  deleteById(id) {
    return Api().delete(`videos/${id}`)
  }
}
