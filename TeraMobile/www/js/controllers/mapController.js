angular.module('starter')

.controller('EarlyAlertController',
  [ '$scope',
    '$rootScope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    'Cellsite',
    function(
      $scope,
      $rootScope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      InstructionsService,
      Cellsite
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 12,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.goTo();

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
      });
      
      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function() {

        var status = 'A';
        var operationId = 1;
        var operationName = 'Valex';
        var zoom = 7;
        var userId = 12;

        $scope.map.center = {
                  lat : -2.841078966315069, // recibir del deploment
                  lng : -78.65564818108,
                  zoom : 6
                };

         $scope.map.layers = {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays: {
                        red: {
                            type: 'group',
                            name: 'red',
                            visible: false
                        },

                        blue: {
                            type: 'group',
                            name: 'blue',
                            visible: false
                        }
                    }
                };

        Cellsite.getCellsites(status, zoom, userId).then(function(result){

            $scope.cellsites = result;

            for (var i = 0; i < $scope.cellsites.length; i++) {

                var lat = parseFloat($scope.cellsites[i].latitude);
                var lng = parseFloat($scope.cellsites[i].longitude);
      
                var message = '<div id="content">' +
                    '<h4 id="firstHeading" >'+ $scope.cellsites[i].name +'</h4>'+
                    '<div id="bodyContent">'+                               
                    '</div>'+
                    '</div>'
                    ;

                var layer;
                if ($scope.cellsites[i].operatorId === 1) { layer = 'blue'} else {layer = 'red'};

               $scope.map.markers[i] = {
                layer: 'blue',
                lat: lat,
                lng: lng,
                message: message,
                focus: false,
                draggable: false
                };
                
                /*
                * load operatorsIds
                */
                var j = 0;
                if (i === 0) {                  
                  $rootScope.operatorIds[j] = $scope.cellsites[i].operatorId;
                  j++;                  
                }else{
                  if ($scope.cellsites[i].operatorId !== $rootScope.operatorIds[j]) {
                    $rootScope.operatorIds[j] = $scope.cellsites[i].operatorId;                   
                    j++;
                  };
                };
            }        
        });

        
        
        for (var j = 0; j < $rootScope.operatorIds.length; j++) {
          console.log(" operatorIds " + $rootScope.operatorIds[j]);
        }

        var overlays = [];

        /*for (var j = 0; j < $rootScope.operatorIds.length; j++) {
          console.log(" operatorIds " + $rootScope.operatorIds[j]);
          var obj={};
                      overlays[j]= {
                          red: {
                            type: 'group',
                            name: $rootScope.operatorIds[j],
                            visible: false
                          } 
                      };

                    };*/


        /*$scope.map.layers = {
                    baselayers: {
                        openStreetMap: {
                            name: 'Overlays',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                    overlays
                };*/


      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });
      };
  }])

.controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    'Keeper',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      InstructionsService,
      Keeper
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 14,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.goTo();

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
      });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(LocationsService.savedLocations.length - 1);
      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function() {

        $scope.map.center = {
                  lat : 0.0,
                  lng : 0.0,
                  zoom : 2
                };

        Keeper.getKeepers().then(function(result){
          $scope.keepers = result;

          var isWorking = 'is Working';
          var isNotWorking = 'is not Working';

          for (var i = 0; i < $scope.keepers.length; i++) {
              var statusAppServer='';
              var statusDBServer='';
              var statusScreenServer='';
              var statusExtraAppServer='';
              var statusExtraDBServer='';
              var statusExtraScreenServer='';

              if ($scope.keepers[i].APPSERVER_WORKING === 0) {
                statusAppServer = '<p>App server: '+ isNotWorking + '</p>';
              }else{
                statusAppServer = '<p>App server: '+ isWorking + '</p>';
              };
              if ($scope.keepers[i].DATABASE_WORKING === 0) {
                statusDBServer = '<p>DB server: '+ isNotWorking + '</p>';
              }else{
                statusDBServer = '<p>DB server: '+ isWorking + '</p>';
              };
              if ($scope.keepers[i].SCREEN_WORKING === 0) {
                statusScreenServer = '<p>Screen server: '+ isNotWorking + '</p>';
              }else{
                statusScreenServer = '<p>Screen server: '+ isWorking + '</p>';
              };

              if ($scope.keepers[i].EXTRA_TELCO_APPSERVER_WORKING){
                if ($scope.keepers[i].EXTRA_TELCO_APPSERVER_WORKING === 0) {
                  statusExtraAppServer = '<p>App Extra server: '+ isNotWorking + '</p>';
                }else{
                  statusExtraAppServer = '<p>App Extra server: '+ isWorking + '</p>';
                };  
              }

              if ($scope.keepers[i].EXTRA_TELCO_DATABASE_WORKING) {
                if ($scope.keepers[i].EXTRA_TELCO_DATABASE_WORKING === 0) {
                  statusExtraDBServer = '<p>DB Extra server: '+ isNotWorking + '</p>';
                }else{
                   statusExtraDBServer = '<p>DB Extra server: '+ isWorking + '</p>';
                };  
              }

              if ($scope.keepers[i].EXTRA_TELCO_SCREEN_WORKING) {
                if ($scope.keepers[i].EXTRA_TELCO_SCREEN_WORKING === 0) {
                  statusExtraScreenServer = '<p>Screen Extra server: '+ isNotWorking + '</p>';
                }else{
                  statusExtraScreenServer = '<p>Screen Extra server: '+ isWorking + '</p>';
                };
              }

              var queuedMessage = '<p>Queued Messages: '+ $scope.keepers[i].QUANTITY_SUBSCRIBER_QUEUED + '</p>';
              
              var message = '<div id="content">' +
                  '<h4 id="firstHeading" >'+ $scope.keepers[i].DESCRIPTION +'</h4>'+
                  '<div id="bodyContent">'+ 
                  statusAppServer +
                  statusDBServer +
                  statusScreenServer +
                  statusExtraAppServer +
                  statusExtraDBServer +
                  statusExtraScreenServer +
                  queuedMessage +                  
                  '<a href="#/app/browse">' + 
                     '<img src="img/sms-24.png" />' + 
                  '</a>' +               
                  '</div>'+
                  '</div>'
                  ;

             $scope.map.markers[i] = {
              lat: $scope.keepers[i].LATITUDE,
              lng: $scope.keepers[i].LONGITUDE,
              message: message,
              focus: false,
              draggable: false
            };
          }
          
        });

        /*var location = LocationsService.savedLocations[locationKey];

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };

        $scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: location.name,
          focus: true,
          draggable: false
        };*/

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

    }]);