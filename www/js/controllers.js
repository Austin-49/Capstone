angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('progListInfoCtrl', function(Data, $scope, $rootScope, $stateParams, MyService, $state) {
	if(typeof $rootScope.programs === 'undefined') {
		Data.getData().then(function(result) {
			$rootScope.programs = MyService.getPrograms();
			$scope.programs = $rootScope.programs;
		})
	}
	$scope.programCategory = $stateParams.programCategory;
	$scope.programAgeGroup = $stateParams.programAgeGroup;
	$scope.programName = $stateParams.programName;
	
	$scope.ageCheck = function(category) {
		var ageGroup = "";
		for(i = 0; i < $scope.programs.length; i++) {
			if($scope.programs[i].category == category) {
				if(ageGroup == "") {
					ageGroup = $scope.programs[i].ageGroup;
				}
				if(ageGroup != $scope.programs[i].ageGroup) {
					$state.go('app.progListAgeGroup', {programCategory: category});
					return;
				} 
			}
		}
		$state.go('app.progListNames', {programCategory: category, programAgeGroup: ageGroup});
		return;
	}
})

.controller('progAdvSearchCtrl', function($scope, $rootScope, $stateParams, $state, MyService) {
	$scope.programs = $rootScope.programs;
	$scope.query = [];
	$scope.change = function() {
		$scope.query.push({
						category: document.getElementById('searchCategory').value,
						ageGroup: document.getElementById('searchAgeGroup').value,
						location: document.getElementById('searchLocation').value,
						instructor: document.getElementById('searchInstructor').value
						});	
		MyService.advSearch($scope.query);
		$state.go('app.advResults');
	};
	
	$scope.newQuery = function() {
		document.getElementById('query').className = "ng-show";
		console.log(document.getElementById('query').className);
	}
})

.controller('progAdvResultsCtrl', function($scope, $rootScope, $stateParams, MyService) {
	$scope.results = MyService.getQuery();
})

.controller('progSearchCtrl', function($scope, $rootScope, $stateParams, $timeout, MyService) {
	$scope.programs = $rootScope.programs;
})

.controller('locationCtrl', function($scope, $rootScope, $stateParams, MyService) {
	var mapProp = {
          center:new google.maps.LatLng(48.469, -123.414),
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };
	var request = {
		location:new google.maps.LatLng(48.469, -123.414),
		radius: 25000,
		keyword: $stateParams.programLocation
	};
	console.log($stateParams.programLocation);
	var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
	
	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
		console.log(results);
			for (var i = 0; i < results.length; i++) {
			if (results[i].name.indexOf($stateParams.programLocation) > -1) {
				var place = results[i];
				createMarker(results[i]);
				}
			}
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});
		console.log(place);
		map.setCenter(place.geometry.location);
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}
	
});

