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

.controller('progListInfoCtrl', function($scope, $rootScope, $stateParams, MyService) {
	$scope.programCategory = $stateParams.programCategory;
	$scope.programAgeGroup = $stateParams.programAgeGroup;
	$scope.programName = $stateParams.programName;
	$scope.programs = MyService.getPrograms();
})

.controller('progSearchCtrl', function($scope, $rootScope, $stateParams, $timeout, MyService) {
	$scope.searchProg = MyService.getSearch();
	    // This is what you will bind the filter to

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
	var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
	
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
	
	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				createMarker(results[i]);
			}
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}
});
