(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('APIBaseURL', "https://davids-restaurant.herokuapp.com");

  // ##### Controllers area #####
  // NarrowItDownController
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var nitControl = this;
    nitControl.searchTerm = "";

    // getMenuItems()
    nitControl.getMenuItems = function(searchTerm){
      searchTerm = searchTerm.trim().toLowerCase();

      if (searchTerm !== "") {
        if (nitControl.found && nitControl.found.length > 0)
          nitControl.found.splice(0, nitControl.found.length);
        MenuSearchService.getMatchedMenuItems(searchTerm)
        .then(function(response) {
          nitControl.found = response;
        });
      }
    }

    // removeItem()
    nitControl.removeItem  = function(index) {
      MenuSearchService.removeItem(index);
    };
  } // NarrowItDownController

  // ##### Services area #####
  // MenuSearchService
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
      .then(function(response) {
        var items = response.data.menu_items;
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

      // var httpPromise =
      //   $http({
      //     method: 'GET',
      //     url: (APIBaseURL + '/menu_items.json')
      //   })
      //   .then(function(response) {
      //     var items = response.data.menu_items;
      //     // var foundItems = [];
      //
      //     if (!searchTerm)
      //       return foundItems;
      //
      //     for (var i=0; i < items.length; i++) {
      //       if (items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
      //         foundItems.push(items[i]);
      //       }
      //     }
      //     return foundItems;
      //   })
      //   .catch(function(error) {
      //     return error.data;
      //   });
      //
      // return httpPromise

    };

    // removeItem(itemIndex)
    service.removeItem = function(itemIndex) {
      foundItems.splice(itemIndex, 1);
    };

  } // MenuSearchService

  // ##### Directives area #####
  // FoundItemsDirective
  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'templates/foundItemsTemplate.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      restricted: 'E',
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
        //console.log("isItemsExist TRUE - items.length", foundItemsControl.items.length);
        return true;
      }
      //console.log("isItemsExist FALSE - items.length", foundItemsControl.items.length);
      return false;
    }

    // itemsFound()
    foundItemsControl.isItemsFound = function() {
      if ((foundItemsControl.items && foundItemsControl.items.length === 0 )) {
        //console.log("isItemsFound FALSE - items.length", foundItemsControl.items.length);
        return false;
      }
      //console.log("isItemsFound TRUE - items.length", foundItemsControl.items.length);
      return true;
    }
  }

})();
