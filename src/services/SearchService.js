import Api from '@/services/Api'

export default {
  search(page, data) {
    return Api().post(`search?page=${page}`, data)
  }
}
