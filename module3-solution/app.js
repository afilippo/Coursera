(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service("MenuSearchService", MenuSearchService)
  .directive("foundItems", FoundItemsDirective)
  .constant('APIBaseURL', "https://davids-restaurant.herokuapp.com");

  // Main Controllers area
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var nitControl = this;
    nitControl.searchTerm = "";

    // getMenuItems()
    nitControl.getMenuItems = function(searchTerm){
      console.log("getMenuItems(): IN");
      searchTerm = searchTerm.trim().toLowerCase();
      if (searchTerm !== "") {
        MenuSearchService.getMatchedMenuItems(searchTerm)
        .then(function(result){
          nitControl.found = result;
        });
      }
    }

    // removeItem()
    nitControl.removeItem  = function(index) {
      MenuSearchService.removeItem(index);
    };
  }

  // Services area
  MenuSearchService.$inject = ['$http', 'APIBaseURL'];
  function MenuSearchService($http, APIBaseURL) {
    var service = this;
    var foundItems = [];

    // getMatchedMenuItems(searchTerm)
    service.getMatchedMenuItems = function(searchTerm) {
      searchTerm = searchTerm.trim().toLowerCase();

      return $http({
        method: 'GET',
        url: (APIBaseURL + '/menu_items.json')
      })
      .then(function(result) {
        var items = result.data.menu_items;
        // var foundItems = [];

        if (!searchTerm)
          return foundItems;

        for (var i=0; i < items.length; i++) {
          if (items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
            foundItems.push(items[i]);
          }
        }
        return foundItems;
      })
      .catch(function(error) {
        return error.data;
      });
    };

    service.removeItem = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
    };

  }

  // Directives area
  // FoundItemsDirective()
  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'templates/foundItemsTemplate.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'foundItemsControl',
      bindToController: true
    }
    return ddo;
  }

  function FoundItemsDirectiveController() {
    var foundItemsControl = this;

    // isItemsExist()
    foundItemsControl.isItemsExist = function() {
      if ((foundItemsControl.items && foundItemsControl.items.length > 0 )) {
        return true;
      }
      return false;
    }

    // itemsFound()
    foundItemsControl.isItemsFound = function() {
      if ((foundItemsControl.items && foundItemsControl.items.length === 0 )) {
        return false;
      }
      return true;
    }
  }

})();
