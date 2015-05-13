// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ui.utils'])

.run(function($ionicPlatform, $http, $filter, $rootScope, MyService) {
    // Store the current date to a variable so we know when we last updated the program info
	// Make a request to the server grabbing our program info
	if (typeof window.localStorage['lastUpdate'] === 'undefined') {
		window.localStorage['lastUpdate'] = JSON.stringify("010100001980");
		console.log(window.localStorage['lastUpdate']);
	}
	$http.get('http://142.31.204.91/saanich/getCSV-1csv.php?' + JSON.parse(window.localStorage['lastUpdate']))
		.success(function(data) {
			console.log(data);
			if (data != "OK") {
				//Store the arrays of program info
				window.localStorage['sharedArray'] = JSON.stringify(data);
				window.localStorage['lastUpdate'] = JSON.stringify($filter('date')(new Date(), 'MMddhhmmyyyy'));
				console.log(window.localStorage['lastUpdate']);
				MyService.createData();
			} else {
				console.log("Data is up to date");
				MyService.createData();
			}
		})
		.error(function() {
			console.log("Could not make connection to server");
	});
		
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

.service('MyService', function($rootScope) {

	var programs = [];
	var queryResults = [];
	
	this.createData = function() {
		var array = JSON.parse(window.localStorage['sharedArray']);
		for (i=0;i<array.length; i++) {
			if (array[i][1] != "" ) {
			programs.push({ category: array[i][1],
							ageGroup: array[i][0],
							name: array[i][3],
							startTime: array[i][5],
							memberRegDate: array[i][8],
							age: array[i][15],
							schedule: array[i][17],
							location: array[i][18],
							instructor: array[i][19],
							cost: array[i][20]});
			}
		}
	}


    this.getPrograms = function() {
		return programs;
    }
	
	this.getQuery = function () {
		return queryResults;
	}
		
	this.advSearch = function(category,age,agegroup,location,instructor) {
		for (i=0;i<programs.length; i++) {
			if(programs[i].ageGroup == agegroup && programs[i].category == category && (programs[i].age.indexOf(age) > -1 || programs[i].age == "All Ages"))  {
					queryResults.push({name: programs[i].name,
									   category: programs[i].category,
									   ageGroup: programs[i].ageGroup});

				}
		}
		return queryResults;
	}
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
    url: "/advSearch/:results",
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
