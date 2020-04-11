import Api from '@/services/Api'

export default {
  getAll(filters) {
    return Api().get(`users/?${filters}`)
  },
  createUser(data) {
    return Api().post('users', data)
  },
  updateUser(data, id) {
    return Api().put(`users/${id}`, data)
  },
  deleteById(id) {
    return Api().delete(`users/${id}`)
  }
}
