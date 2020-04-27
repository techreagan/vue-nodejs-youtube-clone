import Api from '@/services/Api'

export default {
  getAll(data) {
    return Api().get(`videos/${data}`)
  },
  createUser(data) {
    return Api().post('users', data)
  },
  updateUser(data, id) {
    return Api().put(`users/${id}`, data)
  },
  deleteById(id) {
    return Api().delete(`videos/${id}`)
  }
}
