angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthService, $rootScope, Restangular) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $rootScope.appUser = {};
  
//  $rootScope.hasCordova = !!window.cordova;

  $scope.loginData = {};

  $rootScope.logout = function(){
      AuthService.doLogout();
      $timeout(function(){
          $rootScope.appUser = {};
          $rootScope.$broadcast('logoutSuccess');
      });
  };

// Serve api me per otterene i dati dell'app user 
  if(AuthService.token){
      Restangular.oneUrl('me').get()
        .then(function(data){
          $timeout(function(){
            $rootScope.appUser = data;
            $rootScope.$broadcast('loginSuccess');
          });
        });
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    return AuthService.doLogin($scope.loginData)
        .then(function(r){
            Restangular.oneUrl('me').get()
            .then(function(data){
                $timeout(function(){
                    $rootScope.appUser = data;
                    $rootScope.$broadcast('loginSuccess');
                    console.log(data);
                });
                $scope.closeLogin();
            });
        });

  };

  // Perform the login action when the user submits the login form
  $scope.doLogin2 = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
$scope.currentDate = new Date();
$scope.title = "Custom Title";

$scope.datePickerCallback = function (val) {
  if(typeof(val)==='undefined'){    
    console.log('Date not selected');
  }else{
    console.log('Selected date is : ', val);
  }
};

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('PrenotazioniBarcheCtrl', function($scope, $stateParams, Restangular, $rootScope) {

  $scope.prenotazionibarche = [];
  $scope.pagina  = 0 ;
  $scope.updatig = false;

  var updatePrenotazioniBarcheFromServer = function(page){
      $scope.updatig = true;
      var params = [];
      params.page = page;
      if(page == 1){
          $scope.prenotazionibarche = [];
      }
      Restangular.all('prenotazioni_barche').getList(params)
      .then(function(data){
          console.log(data)
          $scope.prenotazionibarche = $scope.prenotazionibarche.concat(data);
          $scope.metadata = data.metadata;
          $scope.updatig = false;          
      });
  };

  $scope.updatePrenotazioniBarche = function(){
      if($scope.updating){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
        updatePrenotazioniBarcheFromServer($scope.pagina);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  updatePrenotazioniBarcheFromServer(1);

})

.controller('PrenotazioneBarcaCtrl', function($scope, $stateParams, Restangular, $rootScope, $timeout) {

  var params = [];

  params.id = $stateParams.prenotazioneId

  Restangular.all('prenotazionebarcagiorno').getList(params)
  .then(function(prenotazionebarca){
    $timeout(function(){
      $scope.prenotazionebarca = prenotazionebarca[0];
    })
  console.log(prenotazionebarca);
  });

  $scope.valutastato = function(stato){
    if(stato=='In riparazione'){return true}
  }
  $scope.valutastatosaldo = function(saldo){
    if(parseInt(saldo)>0){return 'badge-balanced'}
    else{return 'badge-assertive'}
  }
  $scope.valutastatocaparra = function(caparra){
    if(parseInt(caparra)>0){return 'badge-balanced'}
    else{return 'badge-assertive'}
  }

})

.controller('PrenotazioniBarcheGiorniCtrl', function($scope, $stateParams, Restangular, $rootScope) {


  $scope.prenotazionibarchegiorni = [];
  $scope.pagina  = 0 ;
  $scope.updatig = false;

  var updatePrenotazioniBarcheGiorniFromServer = function(page){
      $scope.updatig = true;
      var params = [];
      params.page = page;
      if(page == 1){
          $scope.prenotazionibarchegiorni = [];
      }
      Restangular.all('conteggiobarchegiorno').getList(params)
      .then(function(data){
          console.log(data)
          $scope.prenotazionibarchegiorni = _.sortBy($scope.prenotazionibarchegiorni.concat(data), '-data');
          $scope.metadata = data.metadata;
          $scope.updatig = false;          
      });
  };

  $scope.updatePrenotazioniBarcheGiorni = function(){
      if($scope.updating){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
        updatePrenotazioniBarcheGiorniFromServer($scope.pagina);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  updatePrenotazioniBarcheGiorniFromServer(1);


})


.controller('PrenotazioniBarcheGiornoCtrl', function($scope, $stateParams, Restangular, $rootScope) {

  $scope.pagina  = 0 ;
  $scope.updatig = false;
  $scope.giorno = $stateParams.giornoId

  var updatePrenotazioniBarcheFromServer = function(page, giorno){
      $scope.updatig = true;
      var params = [];
      params.page = page;
      params.data = giorno;      
      if(page == 1){
          $scope.prenotazionibarche = [];
          $scope.barchedisponibili = [];
      }
      Restangular.all('elencobarchegiorno').getList(params)
      .then(function(data){
          console.log(data)
          $scope.prenotazionibarche = _.sortBy($scope.prenotazionibarche.concat(data), 'barca_id_ord');
          $scope.metadata = data.metadata;
          $scope.updatig = false;          
      });
  };

  var updateBarcheDisponibiliFromServer = function(page, giorno){
      $scope.updatig = true;
      var params = [];
      params.page = page;
      params.data = giorno;      
      if(page == 1){
          $scope.barchedisponibili = [];
      }
      Restangular.all('barchedisponibiligiorno').getList(params)
      .then(function(data){
          console.log(data)
          $scope.barchedisponibili = _.sortBy($scope.barchedisponibili.concat(data), 'barca_id_ord');
          //$scope.metadata = data.metadata;
          $scope.updatig = false;          
      });
  };


  $scope.updatePrenotazioniBarche = function(){
      if($scope.updating){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
        updatePrenotazioniBarcheFromServer($scope.pagina, $stateParams.giornoId);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  updatePrenotazioniBarcheFromServer(1, $stateParams.giornoId);
  updateBarcheDisponibiliFromServer(1, $stateParams.giornoId);


  $scope.valutastato = function(stato){
    if(stato=='In riparazione'){return 'ion-alert-circled assertive'}
  }
  $scope.valutastatopagamento = function(saldo, caparra){
    if(parseInt(saldo)>0){return 'ion-cash balanced'}
    if(parseInt(caparra)==0){return 'ion-cash assertive'}
    else{return 'ion-cash energized'}
  }
})




//////////////////////////////////////////////////////////////////
.controller('BarcheCtrl', function($scope,$stateParams, Restangular, $rootScope, $cordovaImagePicker) {

  $scope.barche = [];
  $scope.pagina  = 0 ;
  $scope.updatig = false;

  var updateBarcheFromServer = function(page){
      $scope.updatig = true;
      var params = [];
      params.page = page;
      if(page == 1){
          $scope.barche = [];
      }
      Restangular.all('barche').getList(params)
      .then(function(data){
          console.log(data)
          $scope.barche = $scope.barche.concat(data);
          $scope.metadata = data.metadata;
          $scope.updatig = false;          
      });
  };

  $scope.updateBarche = function(){
      if($scope.updating){ $scope.$broadcast('scroll.infiniteScrollComplete'); return;}
      if($scope.metadata && $scope.metadata.next){
        $scope.pagina = $scope.pagina + 1;
        updateBarcheFromServer($scope.pagina);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  updateBarcheFromServer(1);

  $scope.valutastato = function(stato){
    if(stato=='In riparazione'){return true}
  }
 





/// controllare che il plugin sia disponibile 
$scope.prendimmagine= function(){
$ionicPlatform.ready(function() {
  var options = {
   maximumImagesCount: 10,
   width: 800,
   height: 800,
   quality: 80
  };
  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, function(error) {
      // error getting photos
      console.log(errore);
    });
  });
};







})

.controller('BarcaCtrl', function($scope, $ionicModal, $stateParams, Restangular, $timeout) {
  
  $scope.PatchBarca={};

  Restangular.all('barche').get($stateParams.barcaId)
  .then(function(barca){
    $timeout(function(){
      $scope.barca = barca;
      $scope.PatchBarca = {
        'id': barca.id,
        'nome': barca.nome,
        'id_ord': barca.id_ord,
        'cavalli': barca.cavalli,
        'descrizione': barca.descrizione,
        'prezzo_alta_stagione': barca.prezzo_alta_stagione,
        'prezzo_alta_stagione': barca.prezzo_alta_stagione,
        'stato': barca.stato
      }
    })
 console.log(barca);
});

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/add_barca.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeAddBarca = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openAddBarca = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.EditBarca = function() {
    if(!$scope.posting){
    PostBarcaToServer();
    } 
  };

var PostBarcaToServer = function(){
      $scope.posting = true;
      console.log($scope.PatchBarca)
      Restangular.all('barche/'+$scope.barca.id).patch($scope.PatchBarca)
      .then(function(data){
          $scope.barca = angular.copy($scope.PatchBarca);
          $scope.posting = false;
          $scope.modal.hide();
      }, function(error) {
      // error getting photos
      console.log(error);
      $scope.modal.hide();
      alert('Connessione mancante');
    });
  };
})




.controller('CalendarioCtrl', function($scope, $stateParams) {
console.log('ciao');

 "use strict";
  // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
  $scope.options = {
    defaultDate: "2015-08-06",
    minDate: "2015-01-01",
    maxDate: "2025-12-31",
    disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2015-08-15"
    ],
    dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) {
      console.log(date);
    },
    dateClick: function(date) {
      console.log(date);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  $scope.events = [
    {foo: 'bar', date: "2015-08-18"},
    {foo: 'bar2', date: "2015-08-18"},
    {foo: 'bar3', date: "2015-08-18"},
    {foo: 'bar', date: "2015-08-20"}
  ];
});


