app.controller('controladorGestionUsuario', function(servicioRest,config,utils, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog, $interval) {
	
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    $scope.modificarUsuario = function (evento) {
        var mensaje='';
        if($scope.posicionEnArray!==-1 && $scope.posicionEnArray!=undefined && $scope.role!=undefined){

            $scope.usuario = {
                "nick":$scope.usuarios[$scope.posicionEnArray].nick,
                "name":$scope.usuarios[$scope.posicionEnArray].name,
                "role":$scope.role
            };
            servicioRest.putUsuario($scope.usuario)
            .then(function(data) {
                $scope.mensaje='Usuario modificado con éxito';
                utils.popupInfo('','Usuario modificado con éxito');	
				
				if(localStorage.getItem("nick")!==null && $rootScope.usuarioLS.nick ===
				$scope.usuarios[$scope.posicionEnArray].nick){
					localStorage.clear();					
				}				
				if(sessionStorage.getItem("nick")!==null && $rootScope.usuarioLS.nick === $scope.usuarios[$scope.posicionEnArray].nick){
					sessionStorage.clear();					
				}				
				setTimeout(function(){ 
   				location.reload();
				}, 1000)			
				
            })
            .catch(function(err) {
                utils.popupInfo('','Usuario ya existente');
            });
        }else{
            if($scope.posicionEnArray===-1|| $scope.posicionEnArray==undefined){
                mensaje+='-Usuario inválido </br>';
            }
            if($scope.role==undefined){
                
                mensaje+='-Rol inválido';
                
            }
            utils.popupInfo('', mensaje);
        }
    };
	
    $scope.borrarUsuario = function (evento) {
        var mensaje='';
        if($scope.posicionEnArray!==-1 && $scope.posicionEnArray!=undefined && $scope.usuarios[$scope.posicionEnArray].nick!=undefined){
			
            servicioRest.deleteUsuario($scope.usuarios[$scope.posicionEnArray].nick)
            .then(function(data) {
                $scope.mensaje='Usuario borrado con éxito';
                utils.popupInfo('','Usuario borrado con éxito');	
				
				if(localStorage.getItem("nick")!==null && $rootScope.usuarioLS.nick ===
				$scope.usuarios[$scope.posicionEnArray].nick){
					localStorage.clear();					
				}				
				if(sessionStorage.getItem("nick")!==null && $rootScope.usuarioLS.nick === $scope.usuarios[$scope.posicionEnArray].nick){
					sessionStorage.clear();					
				}				
				setTimeout(function(){ 
   				location.reload();
				}, 1000)			
				
            })
            .catch(function(err) {
                utils.popupInfo('','No se ha podido borrar el usuario');
            });
        }else{
            if($scope.posicionEnArray===-1|| $scope.posicionEnArray==undefined){
                mensaje+='-Usuario inválido </br>';
            }
            utils.popupInfo('', mensaje);
        }
    };
      
    /*Autocomplete*/ 
    $scope.miUsuarioSeleccionado = null 
    servicioRest.getUsuarios()
    .then(function(response) {
        $scope.usuarios = response;
        $scope.arrayDatos = cargarDatos();
        $scope.activado = false;
    })
    .catch(function(err) {
        $scope.mensaje='error al cargar los usuarios';
    });
	self.pos = "";
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;

	// Busca el texto
	function querySearch(text) {
        var results;
        $scope.posicionEnArray= undefined;
        if(''!==text){
            ///guardamos en results los usuarios cuyo nick, nombre o role incluya la cadena de caracteres
            results=$scope.arrayDatos.filter(function(usuario) {
                return  -1!==usuario.display.toLowerCase().indexOf(text.toLowerCase());
            });
        }else{
            //en cuanto el texto a buscar esté vacío reiniciamos los resultados a todos los usuarios. Si no buscaríamos sólo sobre el resultado de la última búsqueda
            results= $scope.arrayDatos;
        }
        return results;
	};

	// Elemento seleccionado
	function selectedItemChange(item) {
        $scope.posicionEnArray = $scope.arrayDatos.indexOf(item);
		switch($scope.usuarios[$scope.posicionEnArray].role){
			case "ROLE_ADMINISTRADOR":$scope.role="administrador";
				break;
			case "ROLE_VALIDADOR":$scope.role="validador";
				break;
			case "ROLE_CONSULTOR":$scope.role="consultor";
				break;
			case "ROLE_MANTENIMIENTO":$scope.role="mantenimiento";
				break;
		}
	};

	// Carga de datos inicial
	function cargarDatos() {
		return $scope.usuarios.map(function(usuario) {
			return {
				value: usuario.usuario,
                role: usuario.role,
				display: usuario.name+' ('+usuario.nick+')'
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
    //Alerta del dialogo//
    $scope.status = '  ';  
    self.modes = [ ];
    self.activated = true;
    self.determinateValue = 100;
   
    
    /* ayuda de nuevo usuario*/
    

    $scope.introOptions = config.introOptions;
    $scope.introOptions.steps = [
            {
            element: '.cabeceraPagina',
            intro: 'Esta es la seccion para modificar usuarios.'
            },
            {
                element: '#usuario',
                intro: 'Debe seleccionar un usuario valido de la lista disponible. La lista se mostrara a partir de la tercera letra escrita. Si esta lista no aparece espere a que se carge la base de datos, esta estara completamente cargada cuando la imagen de debajo desaparezca '
            },
            {
                element: '#rol',
                intro: 'Debe escoger un rol para asignar al usuario seleccionado..'
            },
            {
                element: '#modificar',
                intro: 'Al pulsar en este boton modifica el usuario seleccionado con el rol asignado en nuestra aplicacion.'
            },
            {
                element: '#borrar',
                intro: 'Al pulsar en este boton borra el usuario seleccionado de nuestra aplicacion.'
            }
        ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.lanzarAyuda;
        }, 100);
}); 