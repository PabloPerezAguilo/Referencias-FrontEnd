app.controller('controladorAltaUsuario', function(servicioRest,config,utils, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog, $interval) {
    
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    $scope.crear = function (evento) {
        var mensaje='';
        if($scope.posicionEnArray!==-1 && $scope.posicionEnArray!=undefined && $scope.role!=undefined){

            $scope.usuario = {
                "nick":$scope.usuarios[$scope.posicionEnArray].nick,
                "name":$scope.usuarios[$scope.posicionEnArray].usuario,
                "role":$scope.role
            };
            servicioRest.postUsuario($scope.usuario)
            .then(function(data) {
                $scope.mensaje='Usuario creado con éxito';
                utils.popupInfo('','Usuario creado con éxito');
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
      
    /*Autocomplete*/ 
    $scope.miUsuarioSeleccionado = null 
    servicioRest.getLDAP()
    .then(function(response) {
        $scope.usuarios = response;
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
            ///guardamos en results los usuarios cuyo nick, nombre o email incluya la cadena de carcteres
            results=$scope.arrayDatos.filter(function(usuario) {
                return  -1!==usuario.display.toLowerCase().indexOf(text.toLowerCase()) ||
                        -1!==usuario.mail.toLowerCase().indexOf(text.toLowerCase());
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
	};

	// Carga de datos inicial
	function cargarDatos() {
		return $scope.usuarios.map(function(usuario) {
			return {
				value: usuario.usuario,
                mail: usuario.mail,
				display: usuario.usuario+' ('+usuario.nick+')'
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
            intro: 'Desde esta pantalla se da el alta de los usuarios que tendrán permiso para acceder a la aplicación. Para ello se utilizarán los usuarios definidos en el LDAP de Gfi, permitiendo al Administrador asociarle uno de los diferentes perfiles'
            },
            {
                element: '#usuario',
                intro: 'Para elegir el usuario se debe empezar a escribir su nombre, apellido o login. A partir de la tercera letra escrita, el sistema mostrará una lista con las ocho primeras coincidencias que se encuentre en el LDAP de usuarios. Se deberá seleccionar un usuario de la lista mostrada (con el ratón o con los cursores) para identificar a la persona a la que se va a dar de alta. '
            },
            {
                element: '#rol',
                intro: 'Se debe escoger uno de los perfiles que el usuario tendrá en el uso de la aplicación. Los perfiles son: <br><br> &#8226 Administrador: acceso total sobre todas las opciones de la aplicación. <br> &#8226 Validador: encargado de realizar las validaciones de las referencias que se creen o que tengan modificaciones sustanciales. <br> &#8226 Consulta: usuario que sólo podrá ver las referencias que se encuentren validadas, con posibilidad de exportar a las plantillas existentes. <br> &#8226 Mantenimiento: serán los que pueden crear y editar las referencias de los proyectos de Gfi.'
            },
            {
                element: '#crear',
                intro: 'Al pulsar en este botón guarda el usuario indicado con el perfil seleccionado. A partir de ese momento podrá acceder a la misma mediante el mismo login y password que accede al resto de sistemas corporativos.'
            }
        ];

    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.lanzarAyuda;
        }, 100);
});    
	

    
    
