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

    // function getMatchedMenuItems(searchTerm)
    service.getMatchedMenuItems = function(searchTerm) {
      searchTerm = searchTerm.trim().toLowerCase();

      var menuItemsResponse = service.getMenuItems();

      var result = menuItemsResponse.then(function(httpResponse) {
        var menuItems = httpResponse.data.menu_items;
        foundItems = [];

        for (var i=0; i < menuItems.length; i++) {
          if (menuItems[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
            foundItems.push(menuItems[i]);
          }
        }
        return foundItems;
      })
      .catch(function(error) {
        return error.data;
      });

      return result;
    };

    // function getMenuItems()
    service.getMenuItems = function() {
      var menuItemsResponse =
        $http({
          method: 'GET',
          url: (APIBaseURL + '/menu_items.json')
        });

      return menuItemsResponse;
    }

    // function removeItem(itemIndex)
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
