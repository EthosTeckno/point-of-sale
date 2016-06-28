angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, $rootScope, ProductDB, CartDB, TransactionDB, $q, $ionicModal) {

  $scope.data = {
    items: {},
    cartItems: {},
    cartTotal: 0
  }

  // set up the cart, this is a local db so we do not need to replicate or synch it anywhere

  // adding an item to the cart
  $scope.addToCart = function(item) {
    CartDB.addItem(item);
  }

  // removing an item from the cart
  $scope.removeFromCart = function(item) {
    CartDB.removeItem(item);
  }

  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // creating an order
  $scope.createOrder = function() {
    // create an order doc from the cart
    var a = new Date();
    var doc = {
      items:$scope.data.cartItems,
      total:$scope.data.cartTotal,
      time:JSON.stringify(a)
    }

    // post order doc to transaction db
    TransactionDB.save(doc);

    // empty db cart
    CartDB.empty();

    // hide modal
    $scope.closeModal();

  }

  $scope.clearCart = function() {
    CartDB.empty();
  }


  $rootScope.$on("CartDB:change", function(event, data) {
    $scope.data.cartItems[data.doc._id] = data.doc;
    $scope.data.cartTotal = CartDB.tally($scope.data.cartItems);
    $scope.$apply();
  });

  $rootScope.$on("CartDB:delete", function(event, data) {
    delete $scope.data.cartItems[data.doc._id];
    $scope.data.cartTotal = CartDB.tally($scope.data.cartItems);
    $scope.$apply();
  });


  $rootScope.$on("ProductDB:change", function(event, data) {
    $scope.data.items[data.doc._id] = data.doc;
    $scope.$apply();
  });

  $rootScope.$on("ProductDB:delete", function(event, data) {
    delete $scope.data.items[data.doc._id];
    $scope.$apply();
  });

})

.controller('cartCtrl', function($scope) {

})

.controller('transactionHistoryCtrl', function($scope) {

})

.controller('productCtrl', function($scope) {

});
