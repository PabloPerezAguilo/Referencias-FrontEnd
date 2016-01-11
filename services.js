function ServicioREST( utils, config, $http,$q, $rootScope) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		//}else if(status === 400 ){ TODO tracear bien error ldap caido
          //  defered.reject("Ldap no disponible");
        }else if (data == null){
            //$rootScope.error="";
            utils.popupInfo(null,"Error. Servidor no disponible")
        } else if (data === undefined || data.message === undefined) {
			defered.reject("Error: " + status);
		} else {
			defered.reject(data.message);
		}
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
            // Por cada referencia es necesario convertir la fecha (enviada en segundos) a un formato fecha,
            // El propio constructor new Date(<Long>) lo hace por nosotros.
            for(var i=0; i<data.length;i++){
                data[i].fechaInicio=new Date(data[i].fechaInicio);            
            }
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
    
    /*
    function updateReferencia(key, estado, motivoRechazo) {
		var defered = $q.defer();
		var promise = defered.promise;
        datos = {'estado' : estado, 'motivoRechazo' : motivoRechazo}
        console.log(datos);
		$http({
			method: 'PUT',
			url: url + '/referencia/' + key,
            data: datos
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status,defered);
		});

		return promise;
	}
    */
    
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
    
    function postTecnologia(idPadre, nodo) {
		var defered = $q.defer();
		var promise = defered.promise;
        datos = {'idPadre' : idPadre, 'nodo' : nodo}
		$http({
			method: 'POST',
			url: url + '/tecnologias',
			data: datos
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
    
    function putTecnologia(idAntiguo, nodo) {
		var defered = $q.defer();
		var promise = defered.promise;
        datos = {'idAntiguo' : idAntiguo, 'nodo' : nodo}
		$http({
			method: 'PUT',
			url: url + '/tecnologias',
			data: datos
		})
		.success(function(data, status, headers, config) {
			defered.resolve(data);
		})
		.error(function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}
     
		
	return {
        postTecnologia: postTecnologia,
        putTecnologia: putTecnologia,
		getReferencias: getReferencias,
		getReferencia: getReferencia,
        getReferenciasPendientes: getReferenciasPendientes,
		postReferencia: postReferencia,
        updateReferencia : updateReferencia,
        deleteReferencia : deleteReferencia,
		getLDAP: getLDAP,
        getCatalogos: getCatalogos,
        postUsuario: postUsuario,
        postLogin : postLogin
	}
}