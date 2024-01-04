/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyC2AXrzuRMfm24AgPpfK0Z1OTCQnG1hWuA",
  authDomain: "elearning-5eb65.firebaseapp.com",
  projectId: "elearning-5eb65",
  storageBucket: "elearning-5eb65.appspot.com",
  messagingSenderId: "440316162595",
  appId: "1:440316162595:web:792576b0964969b7293796",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
