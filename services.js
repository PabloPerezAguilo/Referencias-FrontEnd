function ServicioREST($http, $q, $rootScope, config, $mdDialog) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		//}else if(status === 400 ){ TODO tracear bien error ldap caido
          //  defered.reject("Ldap no disponible");
        }else if (data == null){
            //$rootScope.error="";
            popupInfo(null,"Error. Servidor no disponible")
        } else if (data === undefined || data.message === undefined) {
			defered.reject("Error: " + status);
		} else {
			defered.reject(data.message);
		}
	}
    

    
    function popupInfo(ev,descripcion){    
        
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("")
            .content(descripcion)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
            .targetEvent(ev)
        );
    }
    /* ---------- SERVICIOS LOGIN ---------- */
    
    function postLogin(usuario) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/login ',
			data: usuario
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
    

	/* ---------- SERVICIOS REFERENCIA ---------- */
    
	function postReferencia(objetoAEnviar) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/referencia',
			data: objetoAEnviar
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}

	function getReferencias() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/referencia'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}

	function getReferencia(key) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/referencia/' + key
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    
    function getReferenciasPendientes(){
        
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
            method: 'GET',
            url: url + '/referencia/pendientes'
        })
        .success(function(data,status,headers,config){
                 defered.resolve(data);
        })
        .error(function(data,status,headers,config){
               tratarError(data,status,defered);
        });
        return promise;
    }
    
    function updateReferencia(nuevo) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'PUT',
			url: url + '/referencia/',
            data: nuevo
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    
    function deleteReferencia(key) {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'DELETE',
			url: url + '/referencia/' + key,
            data: key
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}

	function getLDAP(){
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/usuariosldap/'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
    
    function getCatalogos() {
		var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'GET',
			url: url + '/catalogo'
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    
    function postUsuario(usuario){
        var defered = $q.defer();
		var promise = defered.promise;
		$http({
			method: 'POST',
			url: url + '/usuarios',
			data: usuario
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
    }
    
    function cargarMenu(prueba){
        if(localStorage.getItem("role") !== null || prueba === 1){
            if( $rootScope.usuarioLS.role === "ROLE_ADMINISTRADOR"){
                $rootScope.menuUsuarios = true;
                $rootScope.menuUsuariosAlta = true;
                $rootScope.menuUsuariosGestion = true;
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasNueva = true;
                $rootScope.menuReferenciasListar = true;
            }else if($rootScope.usuarioLS.role === "ROLE_VALIDADOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
            }else if($rootScope.usuarioLS.role === "ROLE_CONSULTOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasListar = true;
            }else if($rootScope.usuarioLS.role === "ROLE_MANTENIMIENTO"){ 
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
                $rootScope.menuReferenciasNueva = true;
            }
        }else{
            console.log("No hay credenciales de usuario. No se hace recarga de contexto.")
        }
            
    }
	
		
	return {
		getReferencias: getReferencias,
		getReferencia: getReferencia,
        getReferenciasPendientes: getReferenciasPendientes,
		postReferencia: postReferencia,
        updateReferencia : updateReferencia,
        deleteReferencia : deleteReferencia,
		getLDAP: getLDAP,
        getCatalogos: getCatalogos,
        postUsuario: postUsuario,
        postLogin : postLogin,
        popupInfo : popupInfo,
        cargarMenu : cargarMenu
	}
}