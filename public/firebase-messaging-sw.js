/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

var firebaseConfig = {
  apiKey: "AIzaSyC2AXrzuRMfm24AgPpfK0Z1OTCQnG1hWuA",
  authDomain: "elearning-5eb65.firebaseapp.com",
  projectId: "elearning-5eb65",
  storageBucket: "elearning-5eb65.appspot.com",
  messagingSenderId: "440316162595",
  appId: "1:440316162595:web:792576b0964969b7293796",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    image: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
