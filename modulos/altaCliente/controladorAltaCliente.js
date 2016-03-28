app.controller('controladorAltaCliente', function(servicioRest,utils, config, $scope, $http,$log, $rootScope,$location,$mdDialog,$interval,$timeout,$route){
    //--------------------- Objetos del controlador (clientes)
	
	$scope.cliente={};
	
	$scope.crearCliente = function (evento) {
        var mensaje='';
        if($scope.cliente.nombre!=undefined && (($scope.cliente.permisoUso!= true && $scope.cliente.alias !=undefined) || $scope.cliente.permisoUso!= false) ){				
            var cliente = {
                "nombre":$scope.cliente.nombre,
                "siglas":$scope.cliente.siglas,
                "publico":$scope.cliente.permisoUso,
				"alias":$scope.cliente.alias
            };
            servicioRest.postCliente(cliente)
            .then(function(data) {
                $scope.mensaje='Cliente creado con éxito';
                utils.popupInfo('','Cliente creado con éxito');
            })
            .catch(function(err) {
                utils.popupInfo('','Cliente ya existente');
            });
        }else{
            if($scope.cliente.nombre===undefined ||($scope.cliente.permisoUso===false && $scope.cliente.alias===undefined)){
                mensaje+='-Faltan campos por rellenar </br>';
            }
            utils.popupInfo('', mensaje);
        }
    };
    	  		
	
	$scope.message = 'false';
	
	$scope.onChange = function(cbState) {
  	$scope.message = cbState;
  };
	
	$scope.data = {
    
  };
	
    
     //---------AYUDA DE LA PAGINA--------
	
	 $scope.activarScroll=function(){       
       $scope.cliente.permisoUso=true;
    };
  
    $scope.ayuda = function(){		
	  $scope.cliente.permisoUso=false;
      $scope.lanzarAyuda();
        
    };
    
    $scope.introOptions = config.introOptions;
    

    $scope.introOptions.steps = [
            {
            
            element: '.cabeceraPagina',
            intro: 'Esta es la seccion de crear clientes.'
            },
            {
                element: '#nombre',
                intro: 'Escriba aqui un nombre que identifique al cliente.'
            }, 
            {
                element: '#siglas',
                intro: 'En este campo debe escribirse las siglas del cliente.'
            }, 
            {
                element: '#permisoUso',
                intro: 'Seleccione este boton si permite el uso de su nombre.'
            }, 
            {
                element: '#alias',
                intro: 'Escriba aqui un nombre alternativo que identifique al cliente.'
            },
            {
                element: '#crear',
                intro: 'Al pulsar en este boton guarda el cliente seleccionado en nuestra aplicacion.'
            }
            ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.ayuda;
        }, 1000)
});

