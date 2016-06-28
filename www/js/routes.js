angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'historyCtrl'
  })

  .state('config', {
    url: '/config',
    templateUrl: 'templates/config.html',
    controller: 'configCtrl'
  })


$urlRouterProvider.otherwise('/home')



});
