angular.module('starter')

.controller("ControlsDrawController", [ "$scope", "leafletData", function($scope, leafletData) {
      angular.extend($scope, {
          london: {
              lat: 51.505,
              lng: -0.09,
              zoom: 4
          },
          controls: {
              draw: {}
          },
          layers: {
              baselayers: {
                  mapbox_light: {
                      name: 'Mapbox Light',
                      url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                      type: 'xyz',
                      layerOptions: {
                          apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                          mapid: 'bufanuvols.lia22g09'
                      },
                      layerParams: {
                          showOnSelector: false
                      }
                  }
              },
              overlays: {
                  draw: {
                      name: 'draw',
                      type: 'group',
                      visible: true,
                      layerParams: {
                          showOnSelector: false
                      }
                  }
              }
          }
     });

     leafletData.getMap().then(function(map) {
         leafletData.getLayers().then(function(baselayers) {
            var drawnItems = baselayers.overlays.draw;
            map.on('draw:created', function (e) {
              var layer = e.layer;
              drawnItems.addLayer(layer);
              console.log(JSON.stringify(layer.toGeoJSON()));
            });
         });
     });
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
    'Cellsite',
    'leafletData',
    'Priority',
    'MessageType',
    'AlertMessage',
    'Operator',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      InstructionsService,
      Keeper,
      Cellsite,
      leafletData,
      Priority,
      MessageType,
      AlertMessage,
      Operator
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {
        var drawnItems = new L.FeatureGroup();
        $scope.zoom;

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
          },
          controls: {
              draw: {}
          }
        };
        $scope.goTo();
      });

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function() {
        var j=0;
        var drawnItems = new L.FeatureGroup();
        
        $scope.map.center = {
            lat : 0.0,
            lng : 0.0,
            zoom : 2
        };
        
        $scope.map.controls = {
            type: 'layers',
            draw: {
                position : 'topleft',
                polygon : false,
                polyline : false,
                rectangle : false,
                circle : {
                    drawError : {
                        color : '#b00b00',
                        timeout : 1000
                    },
                    shapeOptions : {
                        color : 'red'
                    }, 
                    stroke: false,                   
                    showArea : true
                },
                marker : false
              },
            edit: {
              featureGroup: drawnItems,
              edit: false
            }
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
                MOVISTAR: {                    
                  type: 'group',
                  name: 'MOVISTAR',
                  visible: false 
                },
                CLARO: {                    
                  type: 'group',
                  name: 'CLARO',
                  visible: false 
                },
                INIT: {                    
                  type: 'group',
                  name: 'DEPLOYMENT',
                  visible: true 
                },
                draw: {
                    name: 'draw',
                    type: 'group',
                    visible: true,
                    layerParams: {
                        showOnSelector: false
                    }
                }
            }
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
                    '</div>'+
                    '</div>'
                    ;

                $scope.map.markers[j] = {
                    layer: 'INIT',
                    lat: $scope.keepers[i].LATITUDE,
                    lng: $scope.keepers[i].LONGITUDE,
                    message: message,
                    focus: false,
                    draggable: false
                };
                j++;
            }          
        });
   
        $scope.$watch('map.center.zoom', function(newValue){
            $scope.map.layers.overlays.CLARO.visible = newValue >= 5;
            $scope.map.layers.overlays.MOVISTAR.visible = newValue >= 5;
            $scope.map.layers.overlays.INIT.visible = true;
            $scope.zoom = newValue;

            $scope.loadCellsite();
        });

        $scope.loadCellsite = function() {
            var status = 'A';
            var zoom = 7;
            var userId = 12;
            Cellsite.getCellsites(status, zoom, userId).then(function(result){
                $scope.cellsites = result;
                for (var i = 0; i < $scope.cellsites.length; i++) {

                    var lat = parseFloat($scope.cellsites[i].latitude);
                    var lng = parseFloat($scope.cellsites[i].longitude);
          
                    var message = '<div id="content">' +
                        '<h4 id="firstHeading" >'+ $scope.cellsites[i].name +'</h4>'+
                        '<div id="bodyContent">'+                               
                        '</div>'+
                        '</div>';

                    var iconMarker = [];
                    if ($scope.cellsites[i].operatorId === 1) {
                      iconMarker[i] = {
                        iconUrl: 'img/movistar.png',
                        iconSize: [25, 38]
                      };
                      layerMarker = $scope.cellsites[i].operatorName;                
                    }

                    if($scope.cellsites[i].operatorId === 2){
                      iconMarker[i] = {
                        iconUrl: 'img/claro.png',
                        iconSize: [25, 38]
                      };
                      layerMarker = $scope.cellsites[i].operatorName;                  
                    }

                    $scope.map.markers[j] = {
                        layer: $scope.cellsites[i].operatorName,
                        lat: lat,
                        lng: lng,
                        message: message,
                        focus: false,
                        draggable: false,
                        icon: iconMarker[i]
                    };
                    j++;
                }        
            });
        };
     
    };

    leafletData.getMap().then(function(map) {
        leafletData.getLayers().then(function(baselayers) {
            var drawnItems = baselayers.overlays.draw;
            map.on('draw:created', function (e) {
              var layer = e.layer;
              drawnItems.addLayer(layer);
              console.log(JSON.stringify(layer.toGeoJSON()));

              

              $scope.openModal();
            });
        });
    }); 

    $ionicModal.fromTemplateUrl('templates/sendMessage.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
    });

    $scope.messageTypes = MessageType.all();
    $scope.priorities = Priority.all();
    $scope.operators = [];

    Operator.all().then(function(result){
      var ops = result;
      for (var i = 0; i < ops.length; i++) {
        var item = ops[i];
        $scope.operators.push({"id": item.id, "name": item.name, "checked": true});
      };      
    });

    var messageTypeDefault = MessageType.get(0);
    var priorityDefault = Priority.get(2); 
    
    $scope.openModal = function() {
      $scope.circleMessage = new CircleMessage();
      $scope.circleMessage.userId = 12;
      $scope.circleMessage.subdivisionId = 1;
      $scope.circleMessage.orgId = 1;
      $scope.circleMessage.messageType = messageTypeDefault;
      $scope.circleMessage.priority = priorityDefault;
      $scope.circleMessage.lat = -9.4921875;
      $scope.circleMessage.lng = 2.10889865;  
      $scope.circleMessage.ratio = 150; 
      $scope.circleMessage.zoom = $scope.zoom;
      $scope.modal.show();
    };

    var CircleMessage = function() {
        if ( !(this instanceof CircleMessage) ) return new CircleMessage();
        this.message = "";
        this.lat  = "";
        this.lng  = "";
        this.ratio = "";
        this.deliveryDatetime = "";
        this.userId = "";
        this.subdivisionId = "";
        this.operatorsId = [];
        this.orgId = "";
        this.messageType;
        this.zoom = "";
        this.priority;
    };

    $scope.smsPreview = function() {        
        for (var i = 0; i < $scope.operators.length; i++) {
          if ($scope.operators[i].checked) {
            $scope.circleMessage.operatorsId.push($scope.operators[i].id);
          }
        };

        for (var i = 0; i < $scope.messageTypes.length; i++) {
          if ($scope.messageTypes[i].name === $scope.circleMessage.messageType.name) {
              $scope.circleMessage.messageType.id = $scope.messageTypes[i].id;
          };
        };

        for (var i = 0; i < $scope.priorities.length; i++) {
          if ($scope.priorities[i].name === $scope.circleMessage.priority.name) {
              $scope.circleMessage.priority.id = $scope.priorities[i].id;
          };
        };
        
        
        /*AlertMessage.previewSmsCircle($scope.circleMessage).then(function(result){
          $scope.resp = result;
        });*/
           
    };

        //LocationsService.savedLocations.push($scope.newLocation);
        //$scope.modal.hide();
        //$scope.goTo(LocationsService.savedLocations.length - 1);
    //};

    $scope.smsSend = function() {
        //LocationsService.savedLocations.push($scope.newLocation);
        //$scope.modal.hide();
        //$scope.goTo(LocationsService.savedLocations.length - 1);
    };



    

}]);