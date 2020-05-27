import Api from '@/services/Api'

export default {
  getAll(params) {
    return Api().get('histories', { params: params })
  },
  createHistory(data) {
    return Api().post('histories', data)
  },
  deleteById(id) {
    return Api().delete(`users/${id}`)
  }
}
