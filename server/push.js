const bodyParser = require('body-parser')
const webPush = require('web-push')

const PUSH_KEYS = require('../configs/push-keys.json')

webPush.setVapidDetails(
  'mailto:ar.lipatov93@yandex.ru',
  PUSH_KEYS.publicKey,
  PUSH_KEYS.privateKey,
)

let NEXT_MESSAGE_ID = 1
const PUSH_MESSAGES_MAP = new Map()

// TODO save subscriptions to DB
let SUBSCRIPTIONS = []

function validateSubscribeRequest (req, res, next) {
  if (
    !req.body
    || !req.body.endpoint
    || !req.body.keys
    || !req.body.keys.p256dh
    || !req.body.keys.auth
  ) {
    // send error
    res.status(400).send({
      error: 'invalid request format',
    })
    return
  }

  next()
}

// returns ID
function createPushMessage ({ title, body, icon, tag, data }) {
  const messageId = NEXT_MESSAGE_ID++

  PUSH_MESSAGES_MAP.set(messageId, {
    title,
    body,
    icon,
    tag,
    data,
  })

  return messageId
}

function getPushMessage (id) {
  return PUSH_MESSAGES_MAP.get(id)
}

function sendPushMessageToAll (id) {
  const promiseChain = Promise.resolve()

  const currentSubscriptions = [...SUBSCRIPTIONS]
  currentSubscriptions.forEach((subscription) => {
    promiseChain.then(() => {
      sendPushMessage(subscription, id)
    })
  })
}

function sendPushMessage (subscription, id) {
  console.log('TRYING TO SEND MESSAGE TO', subscription.endpoint)

  return webPush.sendNotification(subscription, String(id))
    .then((result) => {
      console.log('MESSAGE HAS BEEN SENT TO', subscription.endpoint)
      return result
    })
    .catch((err) => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // delete gone subscriptions
        SUBSCRIPTIONS = SUBSCRIPTIONS.filter((item) => item !== subscription)
        console.log('Subscription has been deleted: ', subscription)
      } else {
        console.log('Subscription is no longer valid: ', err, subscription)
      }
    })
}

module.exports = function pushApp (router) {
  router.use(bodyParser.json())

  router.post('/subscribe', validateSubscribeRequest, (req, res) => {
    // validate
    /*
      {
        endpoint: string,
        keys: {
          p256dh: string,
          auth: string,
        },
      }
    */

   SUBSCRIPTIONS.push(req.body)
   console.log('SUBSCRIBED:', req.body)

   res.status(200).send({
     data: { success: true },
   })
  })

  router.get('/message/:id', (req, res) => {
    const messageId = Number(req.params.id)
    const message = getPushMessage(messageId)

    if (!message) {
      res.status(404).send({
        error: 'Not found',
      })
      return
    }

    res.status(200).send({
      data: message,
    })
  })

  // send notifications every 30 seconds
  // setInterval(() => {
  //   const messageId = createPushMessage({
  //     title: 'Time is updated',
  //     body: `Now is ${ (new Date()).toTimeString() }`,
  //     icon: '/images/pwa/icons/icon192.png',
  //     tag: 'group-1',
  //     data: {
  //       url: '/',
  //     },
  //   })
  //   sendPushMessageToAll(messageId)

  //   // const secondMessageId = createPushMessage({
  //   //   title: 'Second group',
  //   //   body: 'This is second group message',
  //   //   tag: 'group-2',
  //   // })
  //   // sendPushMessageToAll(secondMessageId)

  //   // setTimeout(() => {
  //   //   const thirdMessageId = createPushMessage({
  //   //     title: 'First group again',
  //   //     body: 'This should hide message about time',
  //   //     tag: 'group-1',
  //   //   })
  //   //   sendPushMessageToAll(thirdMessageId)
  //   // }, 2000)

  // }, 30 * 1000)

  setInterval(() => {
    if (SUBSCRIPTIONS.length === 0) {
      return
    }

    const messageId = createPushMessage({
      title: 'New message from Ivan',
      body: `Hello ${ NEXT_MESSAGE_ID }`,
      tag: 'new-message-Ivan',
      data: {
        userName: 'Ivan',
        userMessage: `Hello ${ NEXT_MESSAGE_ID }`,
        messageCount: 1,
      },
    })

    sendPushMessageToAll(messageId)
  }, 5 * 1000)

  // TODO add endpoint POST "/send" with admin permissions instead of intervalled notifications
}
