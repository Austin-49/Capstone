// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.utils'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
 
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.service('sharedArray', function($http, $filter) {
  window.localStorage['lastUpdate'] = JSON.stringify($filter('date')(new Date(), 'MM-dd-yyyy'));
  this.getArray = function() {
	return $http({
		method: 'GET',
		url: 'http://generalgoodsvendor.tk/saanich/getCSV.php?'
		})
		.success(function(data) {
			console.log(data);
			window.localStorage['sharedArray'] = JSON.stringify(data);
		})
		.error(function() {
			console.log("error");
		});
	};
})


.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.programs', {
      url: "/programs",
      views: {
        'menuContent': {
          templateUrl: "templates/programs.html",
          controller: 'ProgramsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/programs/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/programs');
});
