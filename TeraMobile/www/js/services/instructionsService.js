angular.module('starter').factory('InstructionsService', [ function() {

  var instructionsObj = {};

  instructionsObj.instructions = {
    newLocations : {
      text : 'CLARO',
      seen : false
    }
  };

  return instructionsObj;

}]);