(function () {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService) {
  var toBuy = this;

  toBuy.items = ShoppingListCheckOffService.getToBuyItems();

  toBuy.removeItem = function (itemIndex) {
    ShoppingListCheckOffService.removeItem(itemIndex);
  };
}

AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService) {
  var alreadyBought = this;
  alreadyBought.items = ShoppingListCheckOffService.getAlreadyBoughtItems();
}

function ShoppingListCheckOffService() {
  var service = this;

  // List of shopping items
  var toBuyItems = [
    {name: "Cookies", quantity: "10"},
    {name: "Chips", quantity: "8"},
    {name: "Oranges", quantity: "6"},
    {name: "Sodas", quantity: "4"},
    {name: "Apples", quantity: "2"}
  ];
  var alreadyBoughtItems = [];

  service.getToBuyItems = function () {
    console.log(toBuyItems);
    return toBuyItems;
 };

  service.getAlreadyBoughtItems = function () {
    return alreadyBoughtItems;
  }
  // Remove the selected item from ToBuy list and put it in the AlreadyBought list
  service.removeItem = function (itemIndex) {
    alreadyBoughtItems.push(toBuyItems[itemIndex]);
    toBuyItems.splice(itemIndex, 1)
  };
}

})();
