/*
Saanich Parks & Rec Mobile Application
Created by: Austin Edwards & Scott Curtis, 2015
*/
angular.module('starter', ['ionic', 'starter.controllers', 'ui.utils', 'ngCordova'])
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

.factory('Data', function ($http, $filter, $rootScope, $cordovaNetwork, $ionicPlatform, $ionicPopup) {
	
	var getData = function(callback) {
		/* Store the current date to a variable so we know when we last updated the program info
		   We check to see if the user has either no data or no update timestamp. If they're missing either
		we give them a date back in 1980 so that the app will automatically give them new data on startup */ 
		if (typeof window.localStorage['lastUpdate'] === 'undefined' || typeof window.localStorage['sharedArray'] === 'undefined') {
			window.localStorage['lastUpdate'] = JSON.stringify("198001010000");
		}
		// Make a request to the server grabbing our program info, send them the timestamp of when we last updated
		$http.get('http://142.31.204.91/saanich/json2.php?' + JSON.parse(window.localStorage['lastUpdate']))
		.success(function(data) {
			/* If we get back "OK" from the server that means the timestamp we sent is in accordance with the newest
			 data the server has to offer.*/
			if (data != "OK") {
				//Store update our timestamp of our last update and store the new data on the users device
				window.localStorage['lastUpdate'] = JSON.stringify($filter('date')(new Date(), 'yyyyMMddhhmm'));
				window.localStorage['sharedArray'] = JSON.stringify(data);
				console.log(JSON.parse(window.localStorage['sharedArray']));
				// Return back to controller.js enabling the app to begin using the aquired data
				callback();
			} else {
				console.log("Data is up to date");
				// Return back to controller.js enabling the app to begin using the aquired data
				callback();
			}
		})
		.error(function(data, status, headers, config) {
			console.log(data, status, headers, config, "Could not make connection to server");
			callback();
		});	
	};
	return {getData: getData};
})


.service('MyService', ['Data', function(Data, $cordovaClipboard) {
	var programs = [];
	var queryResults = [];

    this.getPrograms = function() {
		return JSON.parse(window.localStorage['sharedArray']);
	}
	
	this.getQuery = function() {
		return queryResults;
	}
	
		
	this.advSearch = function(array, callback) {
		programs = JSON.parse(window.localStorage['sharedArray']);
		queryResults = [];
		var catMatch = false;
		//DaysWeekFound is a boolean which further down in the function is set to true if a program was found that
		//contains a day of the week that the user specified.
		daysWeekFound = false;
		//Cycle through the array sent through by controller.js, each iteration through this loop is a new query
		for(i=0;i<array.length;i++) {
			//Iterate through the programs data, each iteration through this loop is a new category 
			for(k=0;k<programs.length;k++) {
				if(array[i].category == "" || programs[k].category.toLowerCase().indexOf(array[i].category.toLowerCase())>=0) {
					catMatch = true;
				} else {
					catMatch = false;
				} 
				//If the category parameter set in the advanced search page isn't set we're forced to cycle through
				//every category, otherwise we delve into this category array and after cycling through all data we
				//break out, moving onto another query
					//We need to get the size of an object in javascript so we iterate through the values within
					//the category array with variable Y becoming the size of the nested array.
					var y = 0;
					for(var x in programs[k]) {
						y++;
					}
					//Now that we have the size we iterate through each ageGroup array, we reduce total size by two
					//due to the fact that each array holds 2 values which aren't arrays, ID and name.
					for(j=0;j<(y-2);j++) {
					//Again get the size of the nested array by iterating, M becomes the size of the array.
						var m = 0;
						for(var x in programs[k][j]) {
							m++;
						}
						//Delve into each programName array
						for(l=0;l<(m-2);l++) {
							if(array[i].category == "" || catMatch == true || programs[k][j][l].name.toLowerCase().indexOf(array[i].category.toLowerCase())>=0) {
							//Get the size of nested arrays
							var n = 0;
							for(var x in programs[k][j][l]) {
								n++;
							}
							//Finally go into the array which contains the information regarding a program
							for(t=0;t<(n-2);t++) {
								//Iterate through the daysWeek array, which holds all the days of the week
								//the user wanted their activity to fall on. If the regex matches one of those
								//values to the days in which a program is offered we set the boolean to true
								for(var p =0; p<array[i].daysWeek.length; p++) {
									var regex = new RegExp( array[i].daysWeek[p], 'i');
									if(programs[k][j][l][t].progDays.match(regex)) {
										daysWeekFound=true;
										break;
									}
								}
								//Check all other values to see if what the user inputed matches anything to due with the values in
								//the program info. If any field is left blank it will match all cases.
								if((array[i].location == "" || programs[k][j][l][t].location.toLowerCase().indexOf(array[i].location.toLowerCase()) >= 0) &&
								   (array[i].instructor == "" || programs[k][j][l][t].instructor.toLowerCase().indexOf(array[i].instructor.toLowerCase()) >= 0) &&
								   (array[i].municipality == "none" || programs[k][j][l][t].municipality.toLowerCase() == array[i].municipality.toLowerCase()) &&
								   //Age is matched by checking to see if the age the user inputed is between a max and min value which
								   //are calculated and parsed on the server side as two seperate values. If the input value is NaN,
								   //the user didn't input anything so we match
								   (isNaN(array[i].age) || (array[i].age <= programs[k][j][l][t].ageMax && array[i].age >= programs[k][j][l][t].ageMin)) &&
								   //If the program is offered daily it will match all cases so we continue
								   (programs[k][j][l][t].progDays == "Daily" || daysWeekFound == true) &&
								   (programs[k][j][l][t].startDate >= array[i].startDayMonth && programs[k][j][l][t].startDate <= array[i].endDayMonth))  
									{
									//Push relevant details involving the programs that did match into a JSON object
									//The query that matched this is added onto the end so that in the results page
									//a listing of parameters which matched a program can be seen.
									queryResults.push({name: programs[k][j][l].name,
													category: programs[k].category,
													categoryPos: k,
													ageGroupPos: j,
													namePos: l,
													query: array[i]});
									
								}
								//Reset the variable so the next program isn't immediately matched.
								daysWeekFound = false;								
							}
						}
						}
					}
			}
		}
		//return to controller.js
		callback();
	}
}])


// Sets up all pages the app has access to as well as attach controllers to them

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Remove previous page title in back button as well as remove automatic 'back' text
  $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
  $ionicConfigProvider.backButton.previousTitleText(false);

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  //Create the advanced search page, disabling caching so that the DOM created by clicking the 'Add Query'
  //button isn't saved as well as refreshing all search parameters upon re-entering.
  .state('app.advSearch', {
	cache: false,
    url: "/advSearch",
    views: {
      'menuContent': {
        templateUrl: "templates/advSearch.html",
		controller: "progAdvSearchCtrl"
      }
    }
  })
  
	// Create the results page for displaying all advanced search results, not necessary to cache the results of
	// the search
    .state('app.advResults', {
	cache: false,
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
  
 
  
    .state('app.progRegister', {
    url: "/programs/:programBarcode/:programWebsite",
    views: {
      'menuContent': {
        templateUrl: "templates/progRegister.html",
        controller: 'progRegisterCtrl'
      }
    }
  })
  
    .state('app.progLocation', {
    url: "/programs/:programLocation",
    views: {
      'menuContent': {
        templateUrl: "templates/progLocation.html",
        controller: 'progListInfoCtrl'
      }
    }
  })
  
     .state('app.tutorial', {
    url: "/tutorial",
    views: {
      'menuContent': {
        templateUrl: "templates/tutorial.html",
        controller: 'helpCtrl'
      }
    }
  })
  
    .state('app.helpSearch', {
    url: "/tutorial/helpSearch",
    views: {
      'menuContent': {
        templateUrl: "templates/helpSearch.html",
        controller: 'helpCtrl'
      }
    }
  })
  
    .state('app.helpRegister', {
    url: "/tutorial/helpRegister",
    views: {
      'menuContent': {
        templateUrl: "templates/helpRegister.html",
        controller: 'helpCtrl'
      }
    }
  })
  
    .state('app.helpProgram', {
    url: "/tutorial/helpProgram",
    views: {
      'menuContent': {
        templateUrl: "templates/helpProgram.html",
        controller: 'helpCtrl'
      }
    }
  })
  
    .state('app.help', {
    url: "/help",
    views: {
      'menuContent': {
        templateUrl: "templates/help.html",
        controller: 'helpCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/programs');
});
