app.controller('controladorAltaGerente', function(servicioRest,config,utils, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog, $interval) {
    
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    $scope.crearGerente = function (evento) {
        var mensaje='';
        if($scope.posicionEnArray!==-1 && $scope.posicionEnArray!=undefined && $scope.tipoGerente!=undefined){

            $scope.gerente = {
                "login":$scope.gerentes[$scope.posicionEnArray].login,
                "nombre":$scope.gerentes[$scope.posicionEnArray].nombre,
				"apellidos":$scope.gerentes[$scope.posicionEnArray].apellidos,
				"tipoGerente":$scope.tipoGerente
            };
            servicioRest.postGerente($scope.gerente)
            .then(function(data) {
                $scope.mensaje='Gerente creado con éxito';
                utils.popupInfo('','Gerente creado con éxito');
            })
            .catch(function(err) {
                utils.popupInfo('','Gerente ya existente');
            });
        }else{
            if($scope.posicionEnArray===-1|| $scope.posicionEnArray==undefined){
                mensaje+='-Gerente inválido </br>';
            }
            if($scope.tipoGerente==undefined){
                
                mensaje+='-Tipo de gerente inválido';
                
            }
            utils.popupInfo('', mensaje);
        }
    };
    
      
    /*Autocomplete*/ 
    $scope.miUsuarioSeleccionado = null 
    servicioRest.getLDAPGerentes()
    .then(function(response) {
        $scope.gerentes = response;
        $scope.arrayDatos = cargarDatos();
        $scope.activado = false;
        toggleActivation();
    })
    .catch(function(err) {
        $scope.mensaje='error de cargar ldap';
    });
	self.pos = "";
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;

	// Busca el texto
	function querySearch(text) {
        var results;
        $scope.posicionEnArray= undefined;
        if(''!==text){
            ///guardamos en results los gerentes cuyo nick, nombre o email incluya la cadena de carcteres
            results=$scope.arrayDatos.filter(function(gerente) {
                return  -1!==gerente.display.toLowerCase().indexOf(text.toLowerCase());
            });
        }else{
            //en cuanto el texto a buscar esté vacío reiniciamos los resultados a todos los gerentes. Si no buscaríamos sólo sobre el resultado de la última búsqueda
            results= $scope.arrayDatos;
        }
        return results;
	};
	
	

	// Elemento seleccionado
	function selectedItemChange(item) {
        $scope.posicionEnArray = $scope.arrayDatos.indexOf(item);
	};

	// Carga de datos inicial
	function cargarDatos() {
		return $scope.gerentes.map(function(gerente) {
			return {
				value: gerente.nombre,
				display: gerente.nombre+ ' '+gerente.apellidos+ ' ('+gerente.login+')'
			};
		});
	};
    $scope.data = {
      group1 : 'Administrador',
      group2 : '2',
      group3 : 'avatar-1'
    };
    $scope.radioData = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: '3', isDisabled: true },
      { label: '4', value: '4' }
    ];
    $scope.submit = function() {
      alert('submit');
    };
    $scope.addItem = function() {
      var r = Math.ceil(Math.random() * 1000);
      $scope.radioData.push({ label: r, value: r });
    };
    $scope.removeItem = function() {
      $scope.radioData.pop();
    };
    
    /* ayuda de nuevo gerente*/
    

    $scope.introOptions = config.introOptions;
    $scope.introOptions.steps = [
            {
            element: '.cabeceraPagina',
            intro: 'Esta es la seccion para dar de alta gerentes.'
            },
            {
                element: '#gerente',
                intro: 'Debe seleccionar un gerente valido de la lista disponible. La lista se mostrara a partir de la tercera letra escrita. Si esta lista no aparece espere a que se carge la base de datos, esta estara completamente cargada cuando la imagen de debajo desaparezca '
            },
            {
                element: '#tipoGerente',
                intro: 'Debe escoger un tipo para asignar al gerente seleccionado..'
            },
            {
                element: '#crear',
                intro: 'Al pulsar en este boton guarda el gerente seleccionado con el tipo asignado en nuestra aplicacion.'
            }
        ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.lanzarAyuda;
        }, 100);
});    
	

    
    
