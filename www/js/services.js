angular.module('app.services', [])


  .factory("ProductDB", ["$rootScope", "$q", function ($rootScope, $q) {

    var database;
    var changeListener;

    return {
      initialize: function (account, databaseName) {
        database = new PouchDB(databaseName);
        var options = {
          live: true,
          retry: true
        }
        database.replicate.from("https://"+account+".cloudant.com/"+databaseName, options);
      },
      startListening: function () {
        changeListener = database.changes({
          live: true,
          include_docs: true
        }).on("change", function (change) {
          if (!change.deleted) {
            $rootScope.$broadcast("ProductDB:change", change);
          } else {
            $rootScope.$broadcast("ProductDB:delete", change);
          }
        });
      },
      stopListening: function () {
        changeListener.cancel();
      },
      syncFrom: function (remoteDatabase) {
        database.replicate.from(remoteDatabase, {live: true, retry: true});
      },
      save: function (jsonDocument) {
        var deferred = $q.defer();
        if (!jsonDocument._id) {
          database.post(jsonDocument).then(function (response) {
            deferred.resolve(response);
          }).catch(function (error) {
            deferred.reject(error);
          });
        } else {
          database.put(jsonDocument).then(function (response) {
            deferred.resolve(response);
          }).catch(function (error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      delete: function (documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
      },
      get: function (documentId) {
        return database.get(documentId);
      },
      destroy: function () {
        database.destroy();
      }
    }
  }])

  .factory("CartDB", ["$rootScope", "$q", function ($rootScope, $q) {

    var database;
    var changeListener;
    var _db;
    var _items;
    var _total = 0;

    return {
      initialize:       initialize,
      addItem:          addItem,
      removeItem:       removeItem,
      tally:            tally,
      empty:            empty,
      destroy:          destroy,
      findIndex:        findIndex,
      startListening:   startListening,
      stopListening:    stopListening
    };

    function initialize(name) {
      database = new PouchDB(name);
    }

    function startListening() {
      changeListener = database.changes({
        live: true,
        include_docs: true
      }).on("change", function (change) {
        if (!change.deleted) {
          $rootScope.$broadcast("CartDB:change", change);
        } else {
          $rootScope.$broadcast("CartDB:delete", change);
        }
      });
    }

    function stopListening() {
      changeListener.cancel();
    }

    function tally(items) {
      // go through the cart items and get a total
      total = 0;

      for (var item in items) {

        if (items.hasOwnProperty(item)) {

          total += parseFloat(items[item].price) * parseInt(items[item].quantity);
        }
      }

      return total.toFixed(2);
    }

    function findIndex(array, id) {
      // binary search
      var low = 0, high = array.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
    }

    function empty() {
      // clear the cart of all entries
      var rows = [];
      database.allDocs()
        .then(function(result){

          for(var i=0; i<result.rows.length; i++) {
            $q.when(database.remove(result.rows[i].id, result.rows[i].value.rev));
          }

        }).catch(function(err){

        });

    }

    function removeItem(product) {

      database.get(product._id).then(function (doc) {

        // success, decrease quantity by 1
        doc.quantity -= 1;

        if (doc.quantity <= 0) {
          $q.when(database.remove(doc));
        } else {
          $q.when(database.put(doc));
        }

      }).catch(function (err) {

      });

    }

    function addItem(product) {

      database
        .get(product._id)
        .then(function (doc) {
          // success, increment the quantity and put the doc via a promise
          doc.quantity += 1;
          $q.when(database.put(doc));
        })
        .catch(function (err) {

          // failure, ie doc does not exist yet
          $q.when(
            database
              .put({
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1
              })
              .then(function (response) {

              })
              .catch(function (err) {

              })
          );
      })

    }

    function destroy() {
      database.destroy();
    }

  }])

  .factory("TransactionDB", ["$rootScope", "$q", function ($rootScope, $q) {

    var database;
    var changeListener;

    return {
      initialize: function (account, apiKey, apiPass, databaseName) {

        database = new PouchDB(databaseName);

        // initialize one way replication to master transaction db in Cloudant
        database.replicate.to("https://"+account+".cloudant.com/"+databaseName, {
          auth: {
            username: apiKey,
            password: apiPass,
          },
          live: true,
          retry: true
        }).on('change', function(info) {
          console.log('TransactionDB change', info);
          $rootScope.$broadcast("TransactionDB:replicationOK", info);


        }).on('paused', function(info) {
          console.log('TransactionDB paused', info);
        }).on('active', function(info) {
          console.log('TransactionDB active', info);
        }).on('denied', function(info) {
          console.log('TransactionDB denied', info);
        }).on('complete', function(info) {
          console.log('TransactionDB complete', info);
        }).on('error', function(info) {
          console.log('TransactionDB error', info);
        });

      },

      startListening: function () {
        changeListener = database.changes({
          live: true,
          include_docs: true
        }).on("change", function (change) {
          if (!change.deleted) {
            $rootScope.$broadcast("TransactionDB:change", change);
          } else {
            $rootScope.$broadcast("TransactionDB:delete", change);
          }
        });
      },
      stopListening: function () {
        changeListener.cancel();
      },
      empty: function() {

        var rows = [];
        database.allDocs()
          .then(function(result){

            for(var i=0; i<result.rows.length; i++) {
              $q.when(database.remove(result.rows[i].id, result.rows[i].value.rev));
            }

          }).catch(function(err){

        });

      },

      sync: function (remoteDatabase) {
        database.sync(remoteDatabase, {live: true, retry: true});
      },

      save: function (jsonDocument) {
        var deferred = $q.defer();
        if (!jsonDocument._id) {
          database.post(jsonDocument).then(function (response) {
            deferred.resolve(response);
          }).catch(function (error) {
            deferred.reject(error);
          });
        } else {
          database.put(jsonDocument).then(function (response) {
            deferred.resolve(response);
          }).catch(function (error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      delete: function (documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
      },
      get: function (documentId) {
        return database.get(documentId);
      },
      getAll: function() {
        database.allDocs({include_docs: true}).then(function(response){
          console.log(response);
          var arr = [];
          for(vari=0; i<response.rows.length; i++) {
            arr.push(response.rows[i].doc);
          }
          return arr;

        });
      },
      destroy: function () {
        database.destroy();
      }
    }
  }])

  .factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork) {

    return {
      isOnline: function () {
        if (ionic.Platform.isWebView()) {
          return $cordovaNetwork.isOnline();
        } else {
          return navigator.onLine;
        }
      },
      isOffline: function () {
        if (ionic.Platform.isWebView()) {
          return !$cordovaNetwork.isOnline();
        } else {
          return !navigator.onLine;
        }
      },
      startWatching: function () {
        if (ionic.Platform.isWebView()) {

          $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
            console.log("went online");
          });

          $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            console.log("went offline");
          });

        }
        else {

          window.addEventListener("online", function (e) {
            console.log("went online");
          }, false);

          window.addEventListener("offline", function (e) {
            console.log("went offline");
          }, false);
        }
      }
    }
  })

  .factory('BlankFactory', [function () {

  }])

  .service('BlankService', [function () {

  }]);


