import React from 'react'
import { urlB64ToUint8Array } from 'helpers/utils'

type PushSubscriptionStatus =
  | 'not_initialized'
  | 'subscribed'
  | 'refused'

type PushRegistratorProps = {
  swRegistration: ServiceWorkerRegistration
}

type PushRegistratorState = {
  status: PushSubscriptionStatus
  subscription: null | PushSubscription
}

class PushRegistrator extends React.Component<PushRegistratorProps, PushRegistratorState> {
  state: PushRegistratorState = {
    status: 'not_initialized',
    subscription: null,
  }

  componentDidMount () {
    const { swRegistration } = this.props

    swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        this.setState({
          status: subscription === null ? 'not_initialized' : 'subscribed',
          subscription,
        })
      })
  }

  private askPushPermission (): Promise<NotificationPermission> {
    return new Promise((resolve, reject) => {
      // support both deprecated callback syntax and promise
      const permissionResult = Notification.requestPermission((result: NotificationPermission) => {
        resolve(result)
      })

      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    })
  }

  private subscribeToPush () {
    const PUSH_PUBLIC_KEY = process.env.PUSH_PUBLIC_KEY
    if (!PUSH_PUBLIC_KEY) {
      throw new Error(`No "process.env.PUSH_PUBLIC_KEY" provided`)
    }

    return this.props.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(PUSH_PUBLIC_KEY),
    })
    .then(this.sendSubscriptionToApi)
  }

  private sendSubscriptionToApi (subscription: PushSubscription) {
    // TODO create typed API
    return fetch(`/api/v1/push/subscribe`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Bad status code from server')
      }

      return response.json()
    })
    .then((body) => {
      if (body.data && body.data.success) {
        return subscription
      }

      throw new Error(`Bad response from server`)
    })
  }

  private handleSubscribeClick = () => {
    this.askPushPermission().then((permission) => {
      if (permission !== 'granted') {
        return
      }

      this.subscribeToPush()
        .then((subscription) => {
          this.setState({
            subscription,
            status: 'subscribed',
          })
        })
    })
  }

  private handleUnsubscribeClick = () => {
    const { subscription } = this.state
    if (!subscription) {
      console.warn(`Cannot unsubscribe when has no subscription`)
      return
    }

    subscription.unsubscribe()
      .then(() => fetch(`/api/v1/push/unsubscribe`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(subscription),
      }))
      .then((response) => {
        if (!response.ok) {
          throw new Error('Bad status code from server')
        }

        return response.json()
      })
      .then((responseBody) => {
        if (responseBody.data && responseBody.data.success) {
          this.setState({
            status: 'not_initialized',
            subscription: null,
          })
        }
      })
  }

  render () {
    const { status } = this.state

    switch (status) {
      case 'not_initialized':
        return (
          <button onClick={ this.handleSubscribeClick }>Enable push messaging</button>
        )

      case 'subscribed':
        return (
          <button onClick={ this.handleUnsubscribeClick }>Disable push messaging</button>
        )

      case 'refused':
        return `You've refused to subscribe to receive push notifications `
    }
  }
}

export default PushRegistrator
