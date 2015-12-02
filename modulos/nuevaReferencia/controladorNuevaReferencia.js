app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http, $rootScope,$location,$mdDialog,$interval){
   
    // si venimos de listar referencias tendremos una referencia cargada en $rootScope para la comunicacion entre los controladores
    if($rootScope.referenciaCargada != null){
        // este codigo rellena la referencia con la informacion guardada en $rootScope
        $scope.referencia = {};
        $scope.referencia.responsableComercial = {};
        console.log($rootScope.referenciaCargada);
        
        $scope.referencia.sociedadSeleccionado = $rootScope.referenciaCargada.sociedad;
        $scope.referencia.sectorEmpresarialSeleccionado = $rootScope.referenciaCargada.sectorEmpresarial;
        $scope.referencia.tipoActividadSeleccionado = $rootScope.referenciaCargada.tipoActividad;
        $scope.referencia.tipoProyectoSeleccionado = $rootScope.referenciaCargada.tipoProyecto;
        $scope.referencia.duracionMeses = $rootScope.referenciaCargada.duracionMeses;
        
        $scope.referencia.denominacion = $rootScope.referenciaCargada.denominacion;
        $scope.referencia.resumenProyecto = $rootScope.referenciaCargada.resumenProyecto;
        $scope.referencia.problematicaCliente = $rootScope.referenciaCargada.problematicaCliente;
        $scope.referencia.solucionGfi = $rootScope.referenciaCargada.solucionGfi;
        $scope.referencia.fteTotales =$rootScope.referenciaCargada.fteTotales;
        $scope.referencia.regPedidoAsociadoReferencia = $rootScope.referenciaCargada.regPedidoAsociadoReferencia;
        $scope.referencia.responsableComercialSeleccionado = $rootScope.referenciaCargada.responsableComercial;
        $scope.referencia.responsableTecnicoSeleccionado = $rootScope.referenciaCargada.responsableTecnico;
        $scope.valorQr = true;
        $scope.referencia.codigoQr = $rootScope.referenciaCargada.codigoQr;
        recargarQR();
        $rootScope.referenciaCargada = null;
        
    }else{
        $scope.valorQr = false;
    }
    
    if($rootScope.usuarioLS.role !== "ROLE_ADMINISTRADOR" && $rootScope.usuarioLS.role !== "ROLE_MANTENIMIENTO"){
         $location.path('/bienvenida');
    }
    
    //Estos 2 IF determinan el titulo de la pagina nuevaReferencia
    if (($rootScope.usuarioLS.role==="ROLE_ADMINISTRADOR" || $rootScope.usuarioLS.role==='"ROLE_MANTENIMIENTO') && $rootScope.opcion==='nueva'){
        $scope.titulo = 'NUEVA REFERENCIA';
    }
    if ($rootScope.opcion==='validar'){
        $scope.titulo = 'PENDIENTE DE VALIDACIÓN';   
    }
    
    
    //---------PRUEBA--------
    

    
    //-----------------------
    
    $scope.catalogo={};
    $scope.title = "";
    $scope.descripcion = "";
    var self = this, j= 0, counter = 0;
    $scope.activado = self.activated;
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            cadenaClientes();
            cadenaTecnologia();         
            $scope.arrayDatos = cargarDatosClientes(); 
            $scope.arrayDatos2 = cargarDatosTecnologia();
            console.log("Catalogos Cargados");
            $rootScope.sociedades = $scope.catalogo.sociedades;               
        });
    
    $scope.uploadFile = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //Sets the Old Image to new New Image
                $('#photo-id').attr('src', e.target.result);
                //Create a canvas and draw image on Client Side to get the byte[] equivalent
                var canvas = document.createElement("canvas");
                var imageElement = document.createElement("img");

                imageElement.setAttribute('src', e.target.result);
                canvas.width = 50;
                canvas.height = 50;
                var context = canvas.getContext("2d");
                context.drawImage(imageElement, 0, 0);
                $scope.base64Image = canvas.toDataURL("image/jpeg");

                //Removes the Data Type Prefix 
                //And set the view model to the new value
                $scope.base64Image = $scope.base64Image.replace(/data:image\/jpeg;base64,/g, '');
            }

            //Renders Image on Page
            reader.readAsDataURL(input.files[0]);
        }
    }
            
        
    $scope.codigoQr='';
 
    $scope.QrChaged = function (){
       recargarQR();
    }
    
   function recargarQR(){
         console.log("ahora");
        console.log($scope.referencia.codigoQr);
         if($scope.referencia.codigoQr!=''){
            console.log("primero");
            
            $scope.qrCodeVisible=true; 
             console.log($scope.qrCodeVisible);
             //Si lo borra que vuelva a ocultar el Qr
         }else if($scope.referencia.codigoQr===''|| $scope.codigoQr===undefined || $scope.codigoQr===' ' || $scope.codigoQr===null){
            $scope.qrCodeVisible=false; 
             console.log("segundo");
             console.log($scope.qrCodeVisible);
         }
   }
    $scope.certificado = 'si';
    $scope.mensajeEstado='';
    
    
    /* Crear la referencia, puede tener estado: pendiente/borrador  */
    $scope.crearReferencia = function (estado) {
          
        var imagen = document.getElementById("botonFileReal").files[0];
        var fileReader = new FileReader();
        fileReader.readAsBinaryString(imagen);
        fileReader.onloadend = function(e){
            var objeto = e.target.result;
            objeto = btoa(objeto);
            $scope.referencia.imagenProyecto = objeto;
            console.log(objeto);
            $scope.referencia.cliente = $scope.catalogo.clientes[$scope.posicionEnArray].nombre;
            $scope.referencia.tecnologias = $scope.catalogo.tecnologia[$scope.posicionEnArray2].codigo;
            $scope.referencia.creadorReferencia = $rootScope.usuarioLS.name;
            var referencia = $scope.referencia; 
            console.log(referencia);
            servicioRest.postReferencia(referencia);
            
            if(estado='pendiente'){
                $scope.referencia.estado = "pendiente";
                $scope.mensajeEstado='Referencia creada pendiente de validar.';       
            }else if(estado='borrador'){
                $scope.referencia.estado = "borrador";  
                $scope.mensajeEstado='Referencia creada en modo borrador.';   
            }
        }  
    }
    
    
    /*-------AUTOCOMPLETE--------*/
	$scope.cadena = "";
    $scope.cadenaT = "";
	self.pos = "";
    self.posT = "";
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
    self.querySearchT = querySearchT;
	self.selectedItemChangeT = selectedItemChangeT;
    
  // lista de `state` valor/display objeto
   
    self.cancel = function($event) {
      $mdDialog.cancel();
    };

    self.finish = function($event) {
      $mdDialog.hide();
    };

	// Busca el texto
	function querySearch(text) {
		var results = text ? $scope.arrayDatos.filter(filtrar(text)) : $scope.arrayDatos, deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	};
    

    function querySearchT(text2) {
		var resultado = text2 ? $scope.arrayDatos2.filter(filtrarT(text2)) : $scope.arrayDatos2, deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(resultado);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return resultado;
		}
	};

	// Filtrar palabras según texto
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function(state) {
			$scope.texto = state.value.substring(state.value.indexOf("*"), 0);
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	};

    function filtrarT(texto2) {
		var lowercaseQuery = angular.lowercase(texto2);
		return function(ro) {
			$scope.texto2 = ro.value.substring(ro.value.indexOf("*"), 0);
			return ($scope.texto2.indexOf(lowercaseQuery) === 0 || $scope.texto2.search(lowercaseQuery) > 0);
		};
	};

	// Elemento seleccionado
	function selectedItemChange(item) {
        console.log(item);
		if (JSON.stringify(item) !== undefined) {
			var pos = item.value.substring(item.value.length, item.value.indexOf("*") + 1);
			$scope.posicionEnArray = pos;
		}
	};

    function selectedItemChangeT(item2) {
		if (JSON.stringify(item2) !== undefined) {
			var posT = item2.value.substring(item2.value.length, item2.value.indexOf("*") + 1);
			$scope.posicionEnArray2 = posT;
		}
	};


   // Carga de datos inicial
	function cargarDatosClientes() {
		// Convertimos los datos a una sola cadena
		var allStates = $scope.cadena;
		return allStates.split(/, +/g).map(function(state) {
			return {
				value: state.toLowerCase(),
				display: state.substring(state.indexOf("*"), 0)
			};
		});
	};

    function cargarDatosTecnologia() {
		// Convertimos los datos a una sola cadena
		var allStatesT = $scope.cadenaT;
		return allStatesT.split(/, +/g).map(function(ro) {
			return {
				value: ro.toLowerCase(),
				display: ro.substring(ro.indexOf("*"), 0)
			};
		});
	};

    // Convertir a una sola cadena
	function cadenaClientes() {
		for (var i = 0; i < $scope.catalogo.clientes.length; i++) {
			$scope.cadena += $scope.catalogo.clientes[i].nombre + ' (' + $scope.catalogo.clientes[i].siglas + ') ' + '*' + i + ', ';
		}
	};

    function cadenaTecnologia() {
		for (var p = 0; p < $scope.catalogo.tecnologia.length; p++) {
			$scope.cadenaT += $scope.catalogo.tecnologia[p].codigo + ' (' + $scope.catalogo.tecnologia[p].descripcion + ') ' + '*' + p + ', ';
		}
	};		

   
    

    

});