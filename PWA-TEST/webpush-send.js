const webpush = require('web-push');
// 从数据库取出用户的subsciption
const pushSubscription ={
  "endpoint": "https://fcm.googleapis.com/fcm/send/eQ5zfJRtbAI:APA91bE1N-GyxfVJi7yVc7Vv2N27gIwTmUOUrXyJUH0UYtwisxthAE0s9mEUmAPN-yVFRkcVI35NGtVN2rhHIAclH_lGvwho3gxvq3s9y_vqiRXMOG9qAuzobJLmA1ixf0rv6vH5rU-H",
  "expirationTime": null,
  "keys": {
    "p256dh": "BOsXrgoZm5Tw5n8zto9_TlnNUFwGjf_RrlIywYvZQ-qwENw2iCjO4zgx5wDgrq2N8_7YaFskZuuZDTjsPL1hOSQ",
    "auth": "qpNV2xWLDYHTFhoyEExgxA"
  }
};
// push的数据
const payload = {
    title: '一篇新的文章',
    body: '点开看看吧',
    icon: '/res/img/icon-32x32.png',
    data: {url: "https://www.baidu.com"}
};

const vapidKeys = {
  publicKey:'BIEvZVXJgy3XwdmmCHvA2i6sdcrwfYkkNqMMsbdYnOLmJ9wfj6FrXB8pdVbruXulUb-bDn05AlgaTRcmn4-Hyq8',
  privateKey: 'Zl9gw87or1jxQSUe3fGkhWa-GTIpy66bJNq4cUIOY6c'
};
webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
webpush.setGCMAPIKey("AIzaSyD2C2MigeQ3L7HWp29-4PKqYMdrvAM90FQ");

webpush.sendNotification(pushSubscription, JSON.stringify(payload));