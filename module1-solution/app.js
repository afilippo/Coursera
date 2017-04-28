(function () {
'use strict';

angular.module('LunchCheck', [])

.controller('LunchCheckController', LunchCheckController);

LunchCheckController.$inject = ['$scope'];
function LunchCheckController($scope) {
  $scope.lunchMenu = "";
  $scope.message = "";

  $scope.checkLunch = function () {

    if ($scope.lunchMenu == "") {
      $scope.message = "Please enter data first";
    } else {
      var separator = /[\s*,+\s*]+/;
      var lunchItemsSplitted = splitMenu($scope.lunchMenu, separator);
      $scope.message = getLunchMessage(lunchItemsSplitted, 3);
    }
  };
  // Split the Menu items. This function DO eliminate empty items at The
  // begining, middle and end of the input
  function splitMenu(menuItems, separator) {
    menuItems = menuItems.replace(
      new RegExp(/^[\s*,*/]*/),"").replace(new RegExp(/[\s*,*/]*$/),"");
    menuItems = menuItems.split(separator);

    return menuItems;
  };

  function getLunchMessage(lunchItems, numberMaxItems) {
    var message = "";
    if (lunchItems.length <= numberMaxItems) {
      message = "Enjoy!";
    } else {
      message = "Too much!";
    }
    return message;
  }
}


})();
