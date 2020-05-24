import Api from '@/services/Api'

export default {
  getSubscribedChannels(subscriberId) {
    return Api().get('subscriptions/channels', {
      params: {
        subscriberId,
        select: 'channelId'
      }
    })
  },
  getSubscribers(limit) {
    return Api().get('subscriptions/subscribers', {
      params: {
        limit
      }
    })
  },
  checkSubscription(data) {
    return Api().post('subscriptions/check', data)
  },
  createSubscription(data) {
    return Api().post('subscriptions', data)
  },
  getSubscribedVideos(page) {
    return Api().get('subscriptions/videos', {
      params: {
        page,
        limit: 12
      }
    })
  }
}
