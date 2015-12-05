angular.module('starter')


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
               console.log("service responseCode.. " + result.responseCode);
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

.factory('MapService', function($resource) {
  
});