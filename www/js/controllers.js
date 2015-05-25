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

.controller('progAdvSearchCtrl', function($scope, $rootScope, $stateParams, $state, MyService, $ionicScrollDelegate) {
	$scope.programs = $rootScope.programs;
	$scope.query = [];
	$scope.submit = function() {
		var divs = document.getElementById('main').getElementsByTagName('ion-item');
		console.log(divs);
		console.log(divs[0].children[0].value);
		for (var i=0; i<divs.length; i++) {
			if (divs[i].children[1].value == "") {
				divs[i].children[2].value = "";
			}
			$scope.query.push({
							category: divs[i].children[0].value,
							age: divs[i].children[1].value,
							ageGranularity: divs[i].children[2].value,
							municipality: divs[i].children[4].value,
							location: divs[i].children[5].value,
							instructor: divs[i].children[6].value,
							});	
		}
		console.log($scope.query);
		MyService.advSearch($scope.query);
		$state.go('app.advResults');
	};
	
	$scope.newQuery = function() {

		var button = document.getElementById("query");
		
		var main = document.getElementById('main').getElementsByClassName('list');
		console.log(main[0].children);
		var container = document.createElement('ion-item');
		container.className = ("item");
		
		var category = document.createElement('input');
		category.type = "search";
		category.placeholder="Category...";
		category.id="searchCategory";
		
		var age = document.createElement('input');
		age.type = "search";
		age.placeholder="Age...";
		age.id="searchAge";
		age.style.display = "inline-block";
		
		var ageGranularity = document.createElement('SELECT');
		ageGranularity.id="searchAgeGranularity";
		ageGranularity.style.display = "inline-block";
		
		var year = document.createElement('option');
		year.text = "Years";
		ageGranularity.add(year);
		
		var month = document.createElement('option');
		month.text = "Months";
		ageGranularity.add(month);
		
		var daysWeek = document.createElement('SELECT');
		daysWeek.id="daysWeek";
		
		var sunday = document.createElement('option');
		sunday.text = "Sunday";
		daysWeek.add(sunday);
		
		var monday = document.createElement('option');
		monday.text = "Monday";
		daysWeek.add(monday);
		
		var tuesday = document.createElement('option');
		tuesday.text = "Tuesday";
		daysWeek.add(tuesday);
		
		var wednesday = document.createElement('option');
		wednesday.text = "Wednesday";
		daysWeek.add(wednesday);
		
		var thursday = document.createElement('option');
		thursday.text = "Thursday";
		daysWeek.add(thursday);
		
		var friday = document.createElement('option');
		friday.text = "Friday";
		daysWeek.add(friday);
		
		var saturday = document.createElement('option');
		saturday.text = "Saturday";
		daysWeek.add(saturday);
		
		
		var municipality = document.createElement('input');
		municipality.type = "search";
		municipality.placeholder="Municipality...";
		municipality.id="searchCategory";
		
		var location = document.createElement('input');
		location.type = "search";
		location.placeholder="Location...";
		location.id="searchLocation";
		
		var instructor = document.createElement('input');
		instructor.type = "search";
		instructor.placeholder="Instructor...";
		instructor.id="searchInstructor";
		instructor.style.display = "inline-block";

		container.appendChild(category);
		container.appendChild(age);
		container.appendChild(ageGranularity);
		container.appendChild(document.createElement("br"));
		container.appendChild(daysWeek);
		container.appendChild(municipality);
		container.appendChild(location);
		container.appendChild(instructor);
		container.appendChild(button);
		
		main[0].appendChild(container);
		
		console.log(document.getElementById('main'));
		
		$ionicScrollDelegate.scrollBottom();
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

