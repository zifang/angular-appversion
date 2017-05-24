'use strict';

var eartyApp = angular
  .module('eparty', [
    'ui.router',
    'ngEnvConfig'
  ])
eartyApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/index");
     $stateProvider
       .state("index", {
           url: "/index",
           templateUrl: "/views/addVersion.html",
           controller: 'IndexCtrl'
       })
       .state("detail", {
           url: "/detail/:t",
           templateUrl: "/views/detail.html",
           controller: 'verDetailCtrl'
       });
       
      $urlRouterProvider.otherwise("/index");
  });
