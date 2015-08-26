// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 
                           'restangular', 'flexcalendar' , 
                           'pascalprecht.translate', 'ionic-datepicker', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, RestangularProvider, $translateProvider) {

  var baseServerUrl = 'http://localhost:8000/reserva/';
  RestangularProvider.setBaseUrl(baseServerUrl);

  RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
      var newResponse;
      if (operation === "getList") {
          newResponse = response.results != undefined ? response.results : response;
          newResponse.metadata = {
            count : response.count,
            next : response.next,
            previous : response.previous,
            number : response.number,
          }
      } else {
          newResponse = response;
      }
      return newResponse;
  });

  RestangularProvider.setRequestSuffix('/?');





  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


  .state('app.prenotazionibarche', {
    abstract : true,
    views: {
      'menuContent': {
        template: "<ion-nav-view name='childView'></ion-nav-view>"
      }
    }

  })

  .state('app.prenotazionibarche.dayslist', {
    url: "/prenotazionibarchegiorni",
    views: {
      'childView': {
        templateUrl: "templates/prenotazionibarchegiorni.html",
        controller : "PrenotazioniBarcheGiorniCtrl"
      }
    }
  })

  .state('app.prenotazionibarche.daylist', {
    url: "/prenotazionibarchegiorno/:giornoId",
    views: {
      'childView': {
        templateUrl: "templates/prenotazionibarchegiorno.html",
        controller : "PrenotazioniBarcheGiornoCtrl"
      }
    }
  })


  .state('app.prenotazionibarche.list', {
    url: "/prenotazionibarche",
    views: {
      'childView': {
        templateUrl: "templates/prenotazionibarche.html",
        controller : "PrenotazioniBarcheCtrl"
      }
    }
  })

  .state('app.prenotazionibarche.detail', {
    url: "/prenotazionibarche/:prenotazioneId",
    cache : false,
    views: {
      'childView': {
        templateUrl: "templates/prenotazionebarca.html",
        controller : "PrenotazioneBarcaCtrl"
      }
    }
  })

////////////// BARCOS //////////////////////
  .state('app.barche', {
    abstract : true,
    views: {
      'menuContent': {
        template: "<ion-nav-view name='childView'></ion-nav-view>"
      }
    }
  })

  .state('app.barche.list', {
    url: "/barche",
    cache : false,
    views: {
      'childView': {
        templateUrl: "templates/barche.html",
        controller : "BarcheCtrl"
      }
    }
  })

  .state('app.barche.detail', {
    url: "/barche/:barcaId",
    cache : false,
    views: {
      'childView': {
        templateUrl: "templates/barca.html",
        controller : "BarcaCtrl"
      }
    }
  })



  .state('app.search', {
    url: '/calendario',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendario.html',
        controller: 'CalendarioCtrl'        
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');



  $translateProvider.translations('en', {
    JANUARY: 'January',
    FEBRUARY: 'February',
    MARCH: 'March',
    APRIL: 'April',
    MAI: 'Mai',
    JUNE: 'June',
    JULY: 'July',
    AUGUST: 'August',
    SEPTEMBER: 'September',
    OCTOBER: 'October',
    NOVEMBER: 'November',
    DECEMBER: 'December',

    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thurday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday'
  });
  $translateProvider.translations('fr', {
      JANUARY: 'Janvier',
      FEBRUARY: 'Févier',
      MARCH: 'Mars',
      APRIL: 'Avril',
      MAI: 'Mai',
      JUNE: 'Juin',
      JULY: 'Juillet',
      AUGUST: 'Août',
      SEPTEMBER: 'Septembre',
      OCTOBER: 'Octobre',
      NOVEMBER: 'Novembre',
      DECEMBER: 'Décembre',

      SUNDAY: 'Dimanche',
      MONDAY: 'Lundi',
      TUESDAY: 'Mardi',
      WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi',
      FRIDAY: 'Vendredi',
      SATURDAY: 'Samedi'
  });
  $translateProvider.translations('it', {
      JANUARY: 'Gennaio',
      FEBRUARY: 'Febbraio',
      MARCH: 'Marzo',
      APRIL: 'Aprile',
      MAI: 'Maggio',
      JUNE: 'Giugno',
      JULY: 'Luglio',
      AUGUST: 'Agosto',
      SEPTEMBER: 'Settembre',
      OCTOBER: 'Ottobre',
      NOVEMBER: 'Novembre',
      DECEMBER: 'Dicembre',

      SUNDAY: 'Domenica',
      MONDAY: 'Lunedi',
      TUESDAY: 'Martedi',
      WEDNESDAY: 'Mercoledi',
      THURSDAY: 'Giovedi',
      FRIDAY: 'Venerdi',
      SATURDAY: 'Sabato'
  });  
  $translateProvider.translations('pt', {
      JANUARY: 'Janeiro',
      FEBRUARY: 'Fevereiro',
      MARCH: 'Março',
      APRIL: 'Abril',
      MAI: 'Maio',
      JUNE: 'Junho',
      JULY: 'Julho',
      AUGUST: 'Agosto',
      SEPTEMBER: 'Setembro',
      OCTOBER: 'Outubro',
      NOVEMBER: 'Novembro',
      DECEMBER: 'Dezembro',

      SUNDAY: 'Domingo',
      MONDAY: 'Segunda',
      TUESDAY: 'Terça',
      WEDNESDAY: 'Quarta',
      THURSDAY: 'Quinta',
      FRIDAY: 'Sexta',
      SATURDAY: 'Sábado'
  });
  $translateProvider.preferredLanguage('it');
  $translateProvider.useSanitizeValueStrategy('escape');


});




