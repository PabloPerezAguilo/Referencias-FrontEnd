app.controller('controladorGestionCliente', function(servicioRest,utils, config, $scope, $http,$log, $rootScope,$location,$mdDialog,$interval,$timeout,$route){
    //--------------------- Objetos del controlador (clientes)
	
	
	$scope.title = "";
   	$scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    $scope.modificarCliente = function (evento) {
        var mensaje='';
        if($scope.cliente.nombre!=undefined && $scope.cliente.siglas!=undefined && (($scope.cliente.permisoUso!= true && $scope.cliente.alias !=undefined) || $scope.cliente.permisoUso!= false) ){

            var cliente = {
                "nombre":$scope.cliente.nombre,
                "siglas":$scope.cliente.siglas,
                "publico":$scope.cliente.permisoUso,
				"alias":$scope.cliente.alias,
				"imagen":""
            };
            servicioRest.putCliente($scope.clientes.lista[$scope.posicionEnArray].value, cliente)
            .then(function(data) {
                $scope.mensaje='Cliente modificado con éxito';
                utils.popupInfo('','Cliente modificado con éxito');
				
				setTimeout(function(){ 
   				location.reload();
				}, 1000)			
				
            })
            .catch(function(err) {
                utils.popupInfo('','Cliente ya existente');
            });
        }else{
            if($scope.cliente.nombre===undefined || $scope.cliente.siglas===undefined ||($scope.cliente.permisoUso===false && $scope.cliente.alias===undefined)){
                mensaje+='-Faltan campos por rellenar </br>';
            }
            utils.popupInfo('', mensaje);
        }
    };
	
	
	$scope.borrarCliente = function (evento) {
        var mensaje='';
        if($scope.clientes.lista[$scope.posicionEnArray].value != undefined){
            servicioRest.deleteCliente($scope.clientes.lista[$scope.posicionEnArray].value)
            .then(function(data) {
                $scope.mensaje='Cliente borrado con éxito';
                utils.popupInfo('','Cliente borrado con éxito');
				
				setTimeout(function(){ 
   				location.reload();
				}, 1000)			
				
            })
            .catch(function(err) {
                utils.popupInfo('','Cliente no pudo ser borrado');
            });
        }else{
            if($scope.clientes.lista[$scope.posicionEnArray].value===undefined){
                mensaje+='-Rellenar el buscador </br>';
            }
            utils.popupInfo('', mensaje);
        }
    };
	
	
	
	

    // list of `state` value/display objects
    $scope.clientes={
        lista:[],
        texto:'',
        elemSelecionado:{}
    };
    
    $scope.activarScroll=function(){     
        $scope.scroll=true;     
    };
	
    
    
    /* ----------------------- CARGA DE CATALOGOS ------------------------*/
    $scope.catalogo={};
    $scope.title = "";
    $scope.descripcion = "";
    var j = 0, counter = 0;
    $scope.activado = $scope.activated;
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            $rootScope.clientes = $scope.catalogo.clientes;       
            cargarDatosClientes();            
        });
    
    
    
    /*-----------------------  AUTOCOMPLETE ----------------------- */
    
    //filtramos los datos del autocomplete según el texto
    $scope.filtrar = function (texto, campo) {
        var resultado;
        var array;
        // Determinamos cual es el array a filtrar y cuanl es el índice del resultado
        if(campo==='cliente'){
            
            array=$scope.clientes.lista;
            $scope.posicionEnArray=undefined;
        }
        // hacemos la búsqueda en el array
        if(texto!==""){
            //Si hay algo de texto, cogemos los elementos que tengan el texto en el nombre y/o en las siglas
            resultado=array.filter(function (cliente) {
                return (cliente.display.toLowerCase().indexOf(texto.toLowerCase()) !==-1);
            });
        }else{
            //si no hay texto, asignamos el resultado de la búsqueda al array completo para que se recarguen todos los datos
            resultado=array;
        }
        return resultado;
    }
    
    //Cuando seleccionamos un elemento de la lista de resultados del autocomplete
    $scope.selectedItemChange=function (item, campo) {		       
        if(campo==='cliente'){
            //si es el autocomplete del cliente, buscamos el índife en la lista de clientes.
            //lo asignamos a la posición del catálogo de clientes correspondiente al mismo
            $scope.posicionEnArray=$scope.clientes.lista.indexOf(item); 	
			$scope.cliente.nombre = $scope.clientes.lista[$scope.posicionEnArray].value;
			$scope.cliente.siglas = $scope.clientes.lista[$scope.posicionEnArray].siglas;			
			$scope.cliente.permisoUso = $scope.clientes.lista[$scope.posicionEnArray].publico;
			$scope.cliente.alias = $scope.clientes.lista[$scope.posicionEnArray].alias;			
        }
    }
    
    //cargamos los datos de los clientes en los datos de los autocompleter correspondientes con estas funciones 
    function cargarDatosClientes() {
         $scope.clientes.lista= $rootScope.clientes.map( function (cliente) {
            return {
                value: cliente.nombre,
                display: cliente.nombre+' ('+cliente.siglas+')',
				siglas: cliente.siglas,
				publico: cliente.publico,
				alias: cliente.alias
            };
        });
        //cargamos los datos en el autocomplete a través del controlador          
    }

    
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
            intro: 'Esta es la seccion de gestión de clientes.'
            },
            {
                element: '.md-dialog-content',
                intro: 'Debe seleccionar un cliente valido de la lista disponible. La lista se mostrara a partir de la tercera letra escrita.'
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
                element: '#modificar',
                intro: 'Al pulsar en este boton modifica el cliente seleccionado con el rol asignado en nuestra aplicacion.'
            },
            {
                element: '#borrar',
                intro: 'Al pulsar en este boton borra el cliente seleccionado de nuestra aplicacion.'
            }
            ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.ayuda;
        }, 1000)
});

