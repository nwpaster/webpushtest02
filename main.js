/**
 * This JavaScript is main process executed by Browser on which index.html loaded.
 */

const main = () => {

  // {{{ Util class to output log
  const logger = new (function() {
    this.line = function() {
      console.log(...arguments);
    };
  })();
  // }}}

  // {{{ Util function from https://github.com/GoogleChrome/push-notifications/blob/master/app/scripts/main.js#L31-L44
  const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  // }}}

  // ServiceWorker Registration shared object
  var _registration = null;

  // Event handler for "Register" button clicked.
  var btnRegister = document.querySelector("button#register-sw");
  btnRegister.addEventListener("click", ev => {
    ev.preventDefault();
    window.navigator.serviceWorker.register("service-worker.js").then(registration => {
      logger.line("Register OK:", registration);
      _registration = registration;
    }).catch(err => {
      logger.line("Register Error:", err);
    });
  });

  // Event handler for "Subscribe" button clicked.
  var btnSubscribe = document.querySelector("button#start-subscribe");
  btnSubscribe.addEventListener("click", ev => {
    ev.preventDefault();
    _registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey),
    }).then(subscription => {
      logger.line("Subscribe OK:", subscription);
      return fetch("/register", {
        method: "POST",
        body: JSON.stringify(subscription.toJSON()),
      });
    }).then(() => {
      logger.line("Server Stored Subscription.");
    }).catch(err => {
      logger.line("Subscribe Error:", err);
      console.error("[main.js][Subscription]", err);
    });
  });

  // Event handler for "Send Push" button clicked.
  // This method DOES NOT know who subscribers are,
  // because only server knows and manages the target list.
  var btnSendPush = document.querySelector("button#send-push");
  btnSendPush.addEventListener("click", ev => {
    ev.preventDefault();
    fetch("/trigger");
    logger.line("Just triggered server to publish notifications.");
  });
};

// Trigger everything on loaded.
window.onload = main;
