import Api from '@/services/Api'

export default {
  getAll(params) {
    return Api().get('histories', { params: params })
  },
  createHistory(data) {
    return Api().post('histories', data)
  },
  deleteById(id) {
    return Api().delete(`histories/${id}`)
  },
  deleteAll(type) {
    return Api().delete(`histories/${type}/all`)
  }
}
