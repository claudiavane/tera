angular.module('starter')

.factory('MessageType', function() {
  var types = [{
    id: 0,
    name: 'Informative'
  }, {
    id: 1,
    name: 'Keyword answer'
  },{
    id: 2,
    name: 'Campaign'
  }];

  return {
    all: function() {
      return types;
    },
    get: function(typeId) {
      for (var i = 0; i < types.length; i++) {
        if (types[i].id === parseInt(typeId)) {
          return types[i];
        }
      }
      return null;
    }
  };
})

.factory('Priority', function() {  
  var priorities = [{
    id: 1,
    name: 'Maximum'
  }, {
    id: 2,
    name: 'Medium'
  },{
    id: 3,
    name: 'Low'
  }];

  return {
    all: function() {
      return priorities;
    },
    get: function(priorityId) {
      for (var i = 0; i < priorities.length; i++) {
        if (priorities[i].id === parseInt(priorityId)) {
          return priorities[i];
        }
      }
      return null;
    }
  };
})

.factory('Keeper', function($http){
   var result;
   var keepers = [];
   return {
      getKeepers: function(){
          return $http.get("http://192.168.51.61:8080/keeper/search/").then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  keepers = result.response;
               }               
               return keepers;
          }, function(error){
               // handle error
          });
      }
   }
})

.factory('Cellsite', function($http){
   var result;
   var cellsites = [];
   return {
       getCellsites: function(status, zoom, userId){
          return $http.get("http://192.168.51.61:8080/org/cellsite/searchCellsiteZoom/", {params:{"status": status, "zoom":zoom,"userId":userId}}).then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  cellsites = result.response;
               }               
               return cellsites;
          }, function(error){
               // handle error
          });
       }
   }
})

.factory('AlertMessage', function($http){
   var result;
   var response = [];
   return {
      previewSmsCircle: function(circleMessage){
          return $http.get("http://192.168.51.61:8080/keeper/search/", 
            {params:{"message": circleMessage.message, 
            "latitude": circleMessage.lat,
            "longitude": circleMessage.lng,
            "ratio": circleMessage.ratio,
            "delivery_datetime": "",
            "user_id": circleMessage.userId,
            "subdivision_id": circleMessage.subdivisionId,
            "operation_vector": circleMessage.operatorsId,
            "org_id": circleMessage.orgId,
            "message_type": circleMessage.messageType,
            "zoom": circleMessage.zoom
          }}).then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  response = result.response;
               }               
               return response;
          }, function(error){
               // handle error
          });
      },
      sendSmsCircle: function(){
          return $http.get("http://192.168.51.61:8080/org/cellsite/searchCellsiteZoom/", {params:{"status": status, "zoom":zoom,"userId":userId}}).then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  response = result.response;
               }               
               return response;
          }, function(error){
               // handle error
          });
      }
   }
})

.factory('SmsSendCircle', function($http){
   var result;
   var keepers = [];
   return {
      getKeepers: function(){
          return $http.get("http://192.168.51.61:8080/keeper/search/").then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  keepers = result.response;
               }               
               return keepers;
          }, function(error){
               // handle error
          });
      }
   }
})

.factory('Operator', function($http){
   var result;
   var operators = [];
   return {
      all: function(){
          return $http.get("http://192.168.51.61:8080/org/operation/search/").then(function(resp){
               result = resp.data;
               if (result.responseCode === 'OK'){
                  operators = result.response;
               }               
               return operators;
          }, function(error){
               // handle error
          });
      }
   }
})

.factory('MapService', function($resource) {
  
});