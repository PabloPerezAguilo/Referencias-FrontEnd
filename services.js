function ServicioREST( utils, config, $http,$q, $rootScope) {
	
	var url = config.url;
    /*          LLamada general           */
    
    function llamadaHTTP(conf){
        
	   var defered = $q.defer();
	   var promise = defered.promise;
	   $http(conf)
	   .success(function(data, status, headers, config) {
		defered.resolve(data);
	   })
	   .error(function(data, status, headers, config) {
           tratarError(data, status, defered);
	   });

	   return promise;
    }
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS ---------- */
	function tratarError(data, status, defered) {
		if (status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		//}else if(status === 400 ){ TODO tracear bien error ldap caido
          //  defered.reject("Ldap no disponible");
        }else if (data == null){
            //$rootScope.error="";
            utils.popupInfo('',"Error. Servidor no disponible")
        } else if (data === undefined || data.message === undefined) {
			defered.reject("Error: " + status);
		} else {
			defered.reject(data.message);
		}
	}
    
    /* ---------- SERVICIOS LOGIN ---------- */
    
    function postLogin(usuario) {
        
		return llamadaHTTP({
           method: 'POST',
			url: url + '/login ',
			data: usuario
	   });
	}
    

	/* ---------- SERVICIOS REFERENCIA ---------- */
    
    
    function exportarReferencia(listaId,tipoDocumento) {
        
        window.URL = window.URL || window.webkitURL;  // Take care of vendor prefixes. encodeURIComponent(listaId)

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + '/referencia/plantillas'+'?listaId=' + listaId+'&tipoDocumento=' + encodeURIComponent(tipoDocumento), true);
        xhr.responseType = 'blob';
        xhr.setRequestHeader("Authorization", 'Basic ' + btoa($rootScope.usuarioLS.nick + ':' + $rootScope.usuarioLS.password));
        xhr.onload = function(e) {
            if (this.status == 200) {
                if(tipoDocumento=="Excel"){
                    var blob = this.response;
                    saveAs(blob, "SharonReport.xlsx");
                }else if(tipoDocumento=="Word"){
                    var blob = this.response;
                    saveAs(blob, "SharonReport.docx"); 
                }
            }
        };
        
        xhr.send()
        
        xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200){
            utils.popupInfo('', "Referencia exportada a :"+tipoDocumento);
        }else if(xhr.readyState == 4 && xhr.status != 200){
            utils.popupInfo('',"Error al exportar la referencia.");
        }}
        
		llamadaHTTP({
			method: 'DELETE',
			url: url + '/referencia/plantillas',
			params: { tipoDocumento: tipoDocumento}
		});

	}
    
	function postReferencia(objetoAEnviar) {
        
		return llamadaHTTP({
			method: 'POST',
			url: url + '/referencia',
			data: objetoAEnviar
		});

	}

	function getReferencias() {

		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia'
		});

	}
    
    function buscarReferencias(busqueda) {
/*?bGeneral=' + busqueda.busqueda + '&bCliente=' + busqueda.cliente + '&bSociedad='+ busqueda.sociedad + '&bSector=' + busqueda.sectorEmpresarial + '&bActividad=' + busqueda.tipoActividad + '&bProyecto=' + busqueda.tipoProyecto + '&bAnios=' + busqueda.anioLimite + '&bTipoTecnologia=' + busqueda.tipoTecnologia + '&bEsProducto=' + busqueda.esProducto*/
		
        // muy importante!!! se necesita mandar undefined si no hay listado seleccionado o la consulta volvera vacia
        if(busqueda.tipoTecnologia==""||busqueda.tipoTecnologia==null){
            busqueda.tipoTecnologia=undefined;
        }
        return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/filtro',
            params: {bGeneral: busqueda.busqueda, bCliente: busqueda.cliente, bSociedad: busqueda.sociedad, bSector: busqueda.sectorEmpresarial, bActividad: busqueda.tipoActividad, bProyecto: busqueda.tipoProyecto, bAnios: busqueda.anioLimite, bTipoTecnologia: busqueda.tipoTecnologia,bTecnologias: busqueda.tecnologiasSeleccionadas, bEsProducto: busqueda.esProducto}
		});

	}
    
    function getReferenciasValidadas() {

		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/validadas'
		});

	}
    
    function getReferenciasAsociadasAUsuario() {

		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/asociadas'
		});

	}

	function getReferencia(key) {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/' + key
		});

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
        
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/referencia/',
            data: nuevo
		});

	}
    
    function updateEstadoReferencia(id, estado, motivoRechazo) {
        datos = {id : id, estado : estado, motivoRechazo : motivoRechazo};
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/referencia/estado',
            data: datos
		});

	}
    
    /*
    function updateReferencia(key, estado, motivoRechazo) {
		var defered = $q.defer();
		var promise = defered.promise;
        datos = {'estado' : estado, 'motivoRechazo' : motivoRechazo}
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
        
		return llamadaHTTP({
			method: 'DELETE',
			url: url + '/referencia/' + key,
            data: key
		});

	}

	function getLDAP(){

		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuariosldap/'
		});

	}
	function getLDAPGerentes(){

		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuariosldap/gerentes'
		});

	}
	
	
	function getUsuarios(){

		return llamadaHTTP({
			method: 'GET',
			url: url + '/usuarios/'
		});

	}
    
    function getCatalogos() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/catalogo'
		});

	}
    
    function getTecnologiasFinales() {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/tecnologias/finales'
		});

	}
    
    function postUsuario(usuario){
        
       return llamadaHTTP({
			method: 'POST',
			url: url + '/usuarios',
			data: usuario
		});

    }
	
    function postGerente(gerente){
        
       return llamadaHTTP({
			method: 'POST',
			url: url + '/catalogo/gerentes',
			data: gerente
		});

    }
	
    function putGerente(gerente){
        
       return llamadaHTTP({
			method: 'PUT',
			url: url + '/catalogo/gerentes',
			data: gerente
		});

    }
	
    function getGerentes(){
        
       return llamadaHTTP({
			method: 'GET',
			url: url + '/catalogo/gerentes'
		});

    }
	
    function deleteGerente(gerente){
        
       return llamadaHTTP({
			method: 'DELETE',
			url: url + '/catalogo/gerentes',
			data: gerente
		});

    }
	
	function postCliente(cliente){
        
       return llamadaHTTP({
			method: 'POST',
			url: url + '/catalogo/clientes',
			data: cliente
		});

    }
	
	function getClientes(){
        
       return llamadaHTTP({
			method: 'GET',
			url: url + '/catalogo/clientes'			
		});

    }
	
	function deleteCliente(cliente){
        
       return llamadaHTTP({
			method: 'DELETE',
			url: url + '/catalogo/clientes',
			data: cliente
		});

    }
	
	function putCliente(value, cliente){
        datos = {value: value, cliente: cliente};
       return llamadaHTTP({
			method: 'PUT',
			url: url + '/catalogo/clientes',
		   data: datos
		});

    }
	
	 function putUsuario(usuario){
        
       return llamadaHTTP({
			method: 'PUT',
			url: url + '/usuarios',
			data: usuario
		});

    }
	
	 function deleteUsuario(usuario){
        
       return llamadaHTTP({
			method: 'DELETE',
			url: url + '/usuarios/' + usuario
		});

    }
    
    
    
    function getTecnologias() {
        
	   return llamadaHTTP({
			method: 'GET',
			url: url + '/tecnologias'
		});

	}
    
    function postTecnologia(idPadre, nodo) {

        datos = {idPadre : idPadre, nodo : nodo};
        return llamadaHTTP({
			method: 'POST',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function postTecnologiaPValidar(nodo) {

        datos = nodo;
        return llamadaHTTP({
			method: 'POST',
			url: url + '/tecnologias/pendientesValidar',
			data: datos
		});

	}
    
    function putTecnologia(idAnterior, nodo) {

        datos = {idAnterior : idAnterior, nodo : nodo}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function putMoverTecnologia(idDestino, nodo) {

        datos = {idDestino : idDestino, nodo : nodo}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/tecnologias',
			data: datos
		});

	}
    
    function deleteTecnologia(id) {
        
        return llamadaHTTP({
			method: 'DELETE',
			url: url + '/tecnologias/' + id
		});

	}
    
    function rechazarTecnologia(anterior, nueva) {
		
        datos = {anterior : anterior, nueva : nueva}
		return llamadaHTTP({
			method: 'PUT',
			url: url + '/referencia/tecnologias',
			data: datos
		});

	}
    
    function getCopiaReferencia(idRef) {
        
		return llamadaHTTP({
			method: 'GET',
			url: url + '/referencia/copia/' + idRef
		});

	}
    
    function getReferenciasAsociadas(tecnologia) {
		var defered = $q.defer();
		var promise = defered.promise;
        
		$http({
			method: 'GET',
			url: url + '/referencia/asociadas/' + tecnologia
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
        getTecnologiasFinales: getTecnologiasFinales,
        postTecnologia: postTecnologia,
        postTecnologiaPValidar: postTecnologiaPValidar,
        putTecnologia: putTecnologia,
        putMoverTecnologia: putMoverTecnologia,
        deleteTecnologia: deleteTecnologia,
		getReferencias: getReferencias,
        buscarReferencias: buscarReferencias,
		getReferencia: getReferencia,
        getReferenciasPendientes: getReferenciasPendientes,
        getReferenciasAsociadasAUsuario: getReferenciasAsociadasAUsuario,
		postReferencia: postReferencia,
        getCopiaReferencia: getCopiaReferencia,
        updateReferencia : updateReferencia,
        deleteReferencia : deleteReferencia,
		getLDAP: getLDAP,
        getCatalogos: getCatalogos,
        getTecnologias: getTecnologias,
        postUsuario: postUsuario,
		postGerente:postGerente,
		putGerente:putGerente,
		getGerentes:getGerentes,
		deleteGerente:deleteGerente,
		postCliente:postCliente,
		getClientes:getClientes,
		putCliente:putCliente,
		deleteCliente:deleteCliente,
		putUsuario: putUsuario,
		deleteUsuario:deleteUsuario,
        getUsuarios: getUsuarios,
        postLogin : postLogin,
        rechazarTecnologia: rechazarTecnologia,
        getReferenciasAsociadas: getReferenciasAsociadas,
        updateEstadoReferencia: updateEstadoReferencia,
        getReferenciasValidadas: getReferenciasValidadas,
        exportarReferencia:exportarReferencia,
		getLDAPGerentes:getLDAPGerentes
	}
}