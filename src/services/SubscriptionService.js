import Api from '@/services/Api'

export default {
  getSubscripedChannels(subscriberId) {
    return Api().get('subscriptions/channels', {
      params: {
        subscriberId,
        select: 'channelId'
      }
    })
  },
  checkSubscription(data) {
    return Api().post('subscriptions/check', data)
  },
  createSubscription(data) {
    return Api().post('subscriptions', data)
  },
  getSubscripedVideos(page) {
    return Api().get('subscriptions/videos', {
      params: {
        page,
        limit: 12
      }
    })
  }
}
