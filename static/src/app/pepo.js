window.pepo = angular.module('pepo', ['ngRoute'])
  .config(function($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: './static/build/templates/login.html',
        controller: 'loginCtrl'
      })
      .when('/choose-login', {
        templateUrl: './static/build/templates/choose-login.html',
        controller: 'chooseLoginCtrl'
      })
      .otherwise({redirectTo: '/'});
  });
