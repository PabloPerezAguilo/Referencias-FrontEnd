'use strict';

var app = angular.module('ref', ['ngRoute','ngMaterial','ngMdIcons','ngMessages']);
app.run(function(servicioRest, $rootScope, $http, $location) {

    
   $rootScope.menu=false;
    
	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    
    
    
    // Comprobamos si el usuario guardó información en el localStorage. Si es asi la cargamos
	if (localStorage.getItem("name") != null) {
                $rootScope.usuarioLS = {
                    name: localStorage.getItem("name"),
                    password: Aes.Ctr.decrypt(localStorage.getItem("password"), localStorage.getItem("name"), 256),
                    role: localStorage.getItem("role")
                };
        
                //volvemos a cargar el menú
                $rootScope.menu = true;
        
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.usuarioLS.name + ':' + $rootScope.usuarioLS.password);

                // Hacemos la llamada al servicioRest pidiendole los datos del usuario
                servicioRest.postLogin({name:$rootScope.usuarioLS.name,password: $rootScope.usuarioLS.password})
                .then(function(data) {
                    data.role=$rootScope.usuarioLS.role;
     
                })
                .catch(function(err) {
                    // Debemos tratar el error   
	               console.log("Error");

                });
	};
    
    
    $rootScope.irA = function(cadena) {
        switch(cadena) {
            case 'nueva':
                $location.path('/nueva')
                break;
            case 'listar':
                $location.path('/listar')
                break;
            case 'modificar':
                $location.path('/modificar')
                break;
            case 'eliminar':
                $location.path('/eliminar')
                break;
            case 'alta':
                $location.path('/alta')
                break;
            case 'eliminarUsu':
                $location.path('/eliminarUsu')
                break;
            default:
                limpiarLocalStorage();
                $location.path('/');
                // Ocultamos el menú
                $rootScope.menu=false;
        }
	}
    
    function limpiarLocalStorage() {
		// Limpiamos el localStorage
		localStorage.clear();
		localStorage.removeItem("name");
		localStorage.removeItem("password");
		localStorage.removeItem("role");
		// Limpiamos las cabeceras de autenticación
		$http.defaults.headers.common.Authorization = 'Basic ';
	}
    
    // Redirige a la pagina de Login si no estas logeado
   $rootScope.$on('$locationChangeStart', function(event, next, current) {
		
		if ($rootScope.usuarioLS===undefined || $rootScope.usuarioLS === {}) {
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
    .when('/alta', {
        templateUrl: 'modulos/altaUsuario/altaUsuario.html',
        controller: 'controladorAltaUsuario as ctrl'
    })
    .when('/nueva', {
        templateUrl: 'modulos/nuevaReferencia/nuevaReferencia.html',
        controller: 'controladorNuevaReferencia'
    })
    .when('/bienvenida', {
        templateUrl: 'modulos/bienvenida/bienvenida.html',
        controller: 'controladorBienvenida'
    })
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});

app.service('servicioRest', ServicioREST);

