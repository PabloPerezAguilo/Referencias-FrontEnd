'use strict';

var app = angular.module('ref', ['ngRoute','ngMaterial']);
app.run(function(servicioRest, $rootScope, $http, $location) {

    
    
	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
		// Redirige a la pagina si no estas logeado
		if ($rootScope.usuarioP===undefined || $rootScope.usuarioP === {}) {
			$location.path('/');
		}
	});
	
});

app.config(function($routeProvider) {

	$routeProvider
    .when('/', {
		templateUrl: 'modulos/login/login.html',
		controller: 'controladorLogin'
	})
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
    .when('/alta', {
        templateUrl: 'modulos/altaUsuario/altaUsuario.html',
        controller: 'controladorAltaUsuario'
    })
    .when('/nueva', {
        templateUrl: 'modulos/nuevaReferencia/nuevaReferencia.html',
        controller: 'controladorNuevaReferencia'
    })
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});

app.service('servicioRest', ServicioREST);

