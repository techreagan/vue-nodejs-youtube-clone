import Api from '@/services/Api'

export default {
  checkSubscription(data) {
    return Api().post('subscriptions/check', data)
  },
  createSubscription(data) {
    return Api().post('subscriptions', data)
  }
}
