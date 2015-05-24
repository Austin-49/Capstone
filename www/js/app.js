// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.utils'])

.run(function($ionicPlatform, Data) {	
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

.factory('Data', function ($http, $filter, $rootScope) {
	
	var getData = function() {
		if (typeof $rootScope.programs === 'undefined') { 
			// Store the current date to a variable so we know when we last updated the program info
			// Make a request to the server grabbing our program info
			if (typeof window.localStorage['lastUpdate'] === 'undefined') {
				window.localStorage['lastUpdate'] = JSON.stringify("198001010000");
			}
			return $http.get('http://142.31.204.91/saanich/json.php?' + JSON.parse(window.localStorage['lastUpdate']))
			.success(function(data) {
				if (data != "OK") {
					//Store the arrays of program info
					window.localStorage['lastUpdate'] = JSON.stringify($filter('date')(new Date(), 'yyyyMMddhhmm'));
					window.localStorage['sharedArray'] = JSON.stringify(data);
					console.log(JSON.parse(window.localStorage['sharedArray']));
				} else {
					console.log("Data is up to date");
					console.log(data);
				}
			})
			.error(function(data, status, headers, config) {
				console.log(data, status, headers, config, "Could not make connection to server");
			});	
		}
	};
	return {getData: getData};
})

.service('MyService', ['Data', function(Data) {
	var programs = [];
	var queryResults = [];

    this.getPrograms = function() {
		return JSON.parse(window.localStorage['sharedArray']);
	}
	
	this.getQuery = function() {
		return queryResults;
	}
		
	this.advSearch = function(array) {
		programs = JSON.parse(window.localStorage['sharedArray']);
		queryResults = [];
		for (j=0;j<array.length; j++) {
			for (i=0;i<programs.length; i++) {
				if((programs[i].category == array[j].category || array[j].category == "") && 
				   (programs[i].ageGroup == array[j].ageGroup || array[j].ageGroup == "") && 
				   (programs[i].location == array[j].location || array[j].location == "" || programs[i].location.includes(array[j].location)) &&
				   (programs[i].instructor == array[j].instructor || array[j].instructor == ""))  {
						queryResults.push({name: programs[i].name,
										   category: programs[i].category,
										   ageGroup: programs[i].ageGroup});

					}
			}
		}
	}
}])



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
        templateUrl: "templates/search.html",
		controller:'progSearchCtrl'
      }
    }
  })

  .state('app.advSearch', {
    url: "/advSearch",
    views: {
      'menuContent': {
        templateUrl: "templates/advSearch.html",
		controller: "progAdvSearchCtrl"
      }
    }
  })
    .state('app.advResults', {
    url: "/advResults",
    views: {
      'menuContent': {
        templateUrl: "templates/advResults.html",
		controller: "progAdvResultsCtrl"
      }
    }
  })
  
  //Programs
  
  .state('app.progListCategories', {
      url: "/programs",
      views: {
        'menuContent': {
          templateUrl: "templates/progListCategories.html",
          controller: 'progListInfoCtrl'
        }
      }
    })

  .state('app.progListAgeGroup', {
    url: "/programs/:programCategory",
    views: {
      'menuContent': {
        templateUrl: "templates/progListAgeGroup.html",
        controller: 'progListInfoCtrl'
      }
    }
  })
  
  .state('app.progListNames', {
    url: "/programs/:programCategory/:programAgeGroup",
    views: {
      'menuContent': {
        templateUrl: "templates/progListNames.html",
        controller: 'progListInfoCtrl'
      }
    }
  })
  
    .state('app.progListInfo', {
    url: "/programs/:programCategory/:programAgeGroup/:programName",
    views: {
      'menuContent': {
        templateUrl: "templates/progListInfo.html",
        controller: 'progListInfoCtrl'
      }
    }
  })
    .state('app.progLocation', {
    url: "/programs/:programCategory/:programAgeGroup/:programName/:programLocation",
    views: {
      'menuContent': {
        templateUrl: "templates/progLocation.html",
        controller: 'progListInfoCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/programs');
});
