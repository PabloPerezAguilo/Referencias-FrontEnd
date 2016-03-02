app.controller('controladorBienvenida', function(servicioRest, utils, $scope, config, $location, $rootScope) {  
    
    // cargamos menu segun role
    utils.cargarMenu($rootScope.usuarioLS.role);
    $scope.nombre=$rootScope.usuarioLS.name;
    
     $scope.introOptions = config.introOptions;
        
    $scope.introOptions.steps = [
        {
            element: '.cabeceraPagina',
            intro: 'Bienvenido a la aplicacion de gestion de referencias.'
        }
     ];
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.lanzarAyuda;
        }, 100);
});
