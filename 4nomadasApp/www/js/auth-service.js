angular.module("starter")
.factory('AuthService', function ($http, $q, $rootScope, $window, Restangular) {

    var svc = {};

    svc.token = null;
    svc.installToken = function(token){
        $http.defaults.headers.common.Authorization = "Token " + token;
        //window.localStorage.setItem("airbook_loader_tk", token);
        $window.sessionStorage.nomadas_loader_tk = token;
        svc.token = token;
    };
    svc.removeToken = function(){
        //delete $http.defaults.headers.common.Authorization;
        delete $window.sessionStorage.nomadas_loader_tk;
        window.localStorage.removeItem("nomadas_loader_tk");
    }

    svc.doLogin = function(credentials){
        var deferred = $q.defer();
        //$http.post('http://localhost:8000/users/token-auth/', credentials)
        //Restangular.all('/api-token-auth').post(credentials)
        console.log(credentials)
        Restangular.all('/api-token-auth').post(credentials)
        .then(function(response){
            svc.installToken(response.token);
            deferred.resolve(response);
        })
        .catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    };
    svc.doLogout = function(){
        svc.removeToken();
    };

    //tk = window.localStorage.getItem("airbook_loader_tk");
    tk = $window.sessionStorage.nomadas_loader_tk;
    if(tk){
        svc.installToken(tk)
    }
    
    return svc;

})