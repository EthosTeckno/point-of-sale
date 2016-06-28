// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

//var localDB = new PouchDB("pos-products");
//var remoteDB = new PouchDB("https://ryanporter.cloudant.com/pos-products");

angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform, ProductDB, CartDB, TransactionDB) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // change to your cloudant account name
    var cloudantAccount = 'ryanporter',
      apiKey = 'adarearaceliveryinkingst',
      apiPass = '3e9fdf6f78adaad466947aaffc7ae232fc7a6f1d';

    // replicate remote products db to local client
    ProductDB.initialize(cloudantAccount, "pos-products");
    ProductDB.startListening();

    // set up the cart db
    CartDB.initialize("cart");
    CartDB.startListening();

    // set up the transactions db
    TransactionDB.initialize(cloudantAccount, apiKey, apiPass, "pos-transactions");
    TransactionDB.startListening();


  });
})
