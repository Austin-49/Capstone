angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, MyService, Data, $ionicPopup) {
	function callback() {
		// $programs is the main listing of all program information
		$scope.programs = MyService.getPrograms();
		console.log($scope.programs);
		
	}
	// Start the application by requesting data from the server
	Data.getData(callback);
	
	$scope.DropIn = function() {
		var confirmPopup = $ionicPopup.confirm({
		 title: 'Redirecting to Fit-In-Fitness',
		 template: 'Drop-in Information is displayed on an external page, Do you wish to continue?'
		});
		confirmPopup.then(function(res) {
		 if(res) {
		   window.open('http://www.fitinfitness.ca/schedules.html', '_system', 'location=no'); return false;
		 } else {
		   return;
		 }
	   });
	};
})

//Responsible for all program display pages
.controller('progListInfoCtrl', function($scope, $rootScope, $stateParams, MyService, $state) {
	//category parameter is passed through as a url variable, this helps determine which age groups to display
	$scope.programCategory = $stateParams.programCategory;

	//ageGroup parameter is passed through as a url variable, this helps determine which programs to display
	$scope.programAgeGroup = $stateParams.programAgeGroup;
	//programName parameter is passed through as a url variable, this helps determine which program information to display
	$scope.programName = $stateParams.programName;

	$scope.date = window.localStorage['lastUpdate'];
	
	// Checks ahead of time to see if there is only a single age group for the given category
	// If there is we skip the agegroups page and go straight to program name listing
	$scope.ageGroups = function(category) {
		$state.go('app.progListNames', {programCategory: category, programAgeGroup: ageGroup});
	}
	
	// The button which links the info page to the google maps location page
	$scope.goMap = function (location) {
		$state.go('app.progLocation', {programLocation : location});
	}
	
	// The button which links the info page to the register information page
	$scope.goRegister = function (barcode, website) {
		$state.go('app.progRegister', {programBarcode : barcode, programWebsite: website});
	}

})

.controller('progRegisterCtrl', function(Data, $scope, $rootScope, $stateParams, MyService, $state, $ionicPopup) {
	$scope.barcode = $stateParams.programBarcode;
	$scope.website = $stateParams.programWebsite;
	
	$scope.RecOnline = function(website) {
		var confirmPopup = $ionicPopup.confirm({
		 title: 'Redirecting to RecOnline',
		 template: 'Registration requires you to go to an external page, do you wish to continue?'
		});
		confirmPopup.then(function(res) {
		 if(res) {
		   window.open(website, '_system', 'location=no'); return false;
		 } else {
		   return;
		 }
	   });
	};	
})

.controller('progAdvSearchCtrl', function($scope, $compile, $rootScope, $stateParams, $state, MyService, $ionicScrollDelegate, $ionicHistory) {
	function callback() {
		$scope.query = [];	
		$state.go('app.advResults', {}, { reload: true });
	}	
	$scope.query = [];
	$scope.queryNum = 1;
	
	$scope.showList = function(id) {
		if(document.getElementById("daysWeek" + id).className == "ng-hide") {
			document.getElementById("daysWeek" + id).className = "ng-show";
		} else {
			document.getElementById("daysWeek" + id).className = "ng-hide";
		}
	};
	
	$scope.submit = function() {
		var divs = document.getElementById('main').getElementsByTagName('ion-item');
		var daysWeek = [];
		for (var i=0; i<divs.length; i++) {
			if (divs[i].children[1].value == "") {
				divs[i].children[2].value = "";
			}
			
			if (divs[i].children[2].value == "Months") {
				divs[i].children[1].value = (divs[i].children[1].value/12);
			}
			console.log(divs[i].children);
			for(var j=0; j<divs[i].children[8].children.length; j++) {
				if(divs[i].children[8].children[j].type == "checkbox") {
					if(divs[i].children[8].children[j].checked) {
						daysWeek.push(divs[i].children[8].children[j].value);
					}
				}
			}
			var Index1 = divs[i].children[8].children[17].selectedIndex;
			var Index2 = divs[i].children[8].children[18].selectedIndex;
			var Index3 = divs[i].children[8].children[21].selectedIndex;
			var Index4 = divs[i].children[8].children[22].selectedIndex;
			
			var TextString = divs[i].children[8].children[17].children[Index1].outerText;
			TextString = TextString + " " + divs[i].children[8].children[18].children[Index2].outerText;
			TextString = TextString + " - " + divs[i].children[8].children[21].children[Index3].outerText;
			TextString = TextString + " " + divs[i].children[8].children[22].children[Index4].outerText;
			console.log(TextString);
			
			var startDayMonth = divs[i].children[8].children[17].value + divs[i].children[8].children[18].value;
			startDayMonth = parseInt(startDayMonth);
			var endDayMonth = divs[i].children[8].children[21].value + divs[i].children[8].children[22].value;
			endDayMonth = parseInt(endDayMonth);
			
			$scope.query.push({
							category: divs[i].children[0].value,
							age: parseInt(divs[i].children[1].value),
							ageGranularity: divs[i].children[2].value,
							municipality: divs[i].children[3].value,
							location: divs[i].children[4].value,
							instructor: divs[i].children[5].value,
							daysWeek: daysWeek,
							startDayMonth: startDayMonth,
							endDayMonth: endDayMonth,
							scheduleText: TextString
							});	
			console.log($scope.query);
			daysWeek = [];
		}
		MyService.advSearch($scope.query, callback);
		
	};
	
	$scope.newQuery = function() {

		var button = document.getElementById("query");
		
		var main = document.getElementById('main').getElementsByClassName('list');
		var container = document.createElement('ion-item');
		container.className = ("item");
		
		var category = document.createElement('input');
		category.type = "search";
		category.placeholder="Activity...";
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
		
		var schedule = document.createElement('div');
		schedule.id = "daysWeek" + $scope.queryNum;
		schedule.className = "ng-hide";
		
		
		var daysButton = document.createElement('button');
		daysButton.className = "button button-block button-positive";
		daysButton.style.width = "180px";
		daysButton.appendChild(document.createTextNode("Schedule Options"));
		daysButton.setAttribute('ng-click', 'showList({{queryNum}})');
		$compile(daysButton)($scope);
		$scope.queryNum++;
		
		schedule.appendChild(document.createTextNode(" Available on the following days"));
		schedule.appendChild(document.createElement('br'));
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "Su";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Sunday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "M";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Monday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "Tu";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Tuesday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "W";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Wednesday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "Th";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Thursday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "F";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Friday"));
		schedule.appendChild(document.createElement('br'));
		
		var day = document.createElement('input');
		day.type = "checkbox";
		day.checked = "checked";
		day.value = "Sa";
		schedule.appendChild(day);
		schedule.appendChild(document.createTextNode(" Saturday"));
		
		schedule.appendChild(document.createElement('br'));
		schedule.appendChild(document.createElement('br'));
		
		var startMonth = document.getElementById('startMonth');
		var clnSMonth = startMonth.cloneNode(true);
		schedule.appendChild(document.createTextNode(" Available between"));
		schedule.appendChild(document.createElement('br'));
		schedule.appendChild(clnSMonth);
		
		var startDay = document.getElementById('startDay');
		var clnSDay = startDay.cloneNode(true);
		schedule.appendChild(clnSDay);
		
		schedule.appendChild(document.createElement('br'));
		schedule.appendChild(document.createTextNode(" and "));
		schedule.appendChild(document.createElement('br'));
		var endMonth = document.getElementById('endMonth');
		var clnEMonth = endMonth.cloneNode(true);
		schedule.appendChild(clnEMonth);
		
		var endDay = document.getElementById('endDay');
		var clnEDay = endDay.cloneNode(true);
		schedule.appendChild(clnEDay);
		
		var municipality = document.createElement('input');
		municipality.type = "search";
		municipality.placeholder="Municipality...";
		municipality.id="searchCategory";
		
		var location = document.createElement('input');
		location.type = "search";
		location.placeholder="Facility...";
		location.id="searchLocation";
		
		var instructor = document.createElement('input');
		instructor.type = "search";
		instructor.placeholder="Instructor...";
		instructor.id="searchInstructor";
		instructor.style.display = "inline-block";


		container.appendChild(category);
		container.appendChild(age);
		container.appendChild(ageGranularity);
		container.appendChild(municipality);
		container.appendChild(location);
		container.appendChild(instructor);
		container.appendChild(document.createElement('br'));
		container.appendChild(daysButton);
		container.appendChild(schedule);
		container.appendChild(button);
		
	
		main[0].appendChild(container);
		
		$ionicScrollDelegate.scrollBottom();
	}
})

.controller('progAdvResultsCtrl', function($scope, MyService) {
	$scope.results = MyService.getQuery();
	console.log($scope.results);
})

.controller('progSearchCtrl', function($scope, MyService) {
	// Nothing required, remove?
})

.controller('helpCtrl', function($scope, MyService) {
	// Nothing required, remove?
})

.controller('locationCtrl', function($scope, $rootScope, $stateParams, MyService) {
// api does all this its magic

	// Create a map prop with default settings to be located roughly around Wilkonson/Interurban intersection,
	// zoomed in to 16 will properly display most locations names and neighbouring street names, Maptype sets
	// to default road map
	var mapProp = {
          center:new google.maps.LatLng(48.469, -123.414),
          zoom:16,
          mapTypeId:google.maps.MapTypeId.ROADMAP
        };
	// Request is what is being sent to the google maps API so it can figure out where you are trying to look,
	// We set a radius of 2500 which covers all of Victoria and neighbouring municipalities, keyword is set
	// as by url parameter which is the 'location' variable within our data store
	var request = {
		location:new google.maps.LatLng(48.469, -123.414),
		radius: 25000,
		keyword: $stateParams.programLocation
	};
	// Create a new google map with the specifications detailed within mapProp
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	service = new google.maps.places.PlacesService(map);
	// Send the request using our map
	service.nearbySearch(request, callback);
	
	// Done after google responds to our request
	function callback(results, status) {
		// If the response from google was successful
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
			// If any of the results we got back from google relate to our 'location' variable
			// we found a location that matches
			if (results[i].name.indexOf($stateParams.programLocation) > -1) {
				// Create a marker at the location at this proper location
				var place = results[i];
				createMarker(results[i]);
				}
			}
		}
	}

	// Creates a marker on the map at the proper location
	function createMarker(place) {
		// create a marker at the proper location
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});
		// Center our map on this newly found marker
		map.setCenter(place.geometry.location);
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}
	
});

