
app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http, $rootScope,$location,$mdDialog,$interval,$timeout){
      
    //Habilitar/deshabilitar los campos del formulario
    $scope.habilitarForm=false;
    
    //mostramos los botones de crear referencia 
    $scope.mostrarBtCrear=true;

    //Como no conocemos los datos que tendrá la refrencia pero queremos poner valores por defecto,
    //la asignamos un objeto vacío al que le metemos los valores por defecto

    $scope.referencia={}
    //$scope.referencia.certificado='si';

    
    if($rootScope.referenciaCargada != null && $rootScope.opcion === 'validar'){
        $scope.clienteCargado = $rootScope.referenciaCargada.cliente;
        $scope.tecnologiaCargada = $rootScope.referenciaCargada.tecnologias;
        $scope.fechaInicio = new Date($rootScope.referenciaCargada.fechaInicio);
        $scope.UserPhoto = $rootScope.referenciaCargada.imagenProyecto;
    }else{
         /*Vaciamos referenciaCargada*/
        $rootScope.referenciaCargada = null;
     }
    
    
    if($rootScope.usuarioLS.role !== "ROLE_MANTENIMIENTO"){
        if($rootScope.usuarioLS.role == "ROLE_VALIDADOR" && $rootScope.referenciaCargada != null){
            //el validador verá los campos de la referencia 'disabled'
            $scope.habilitarForm=true;
            //Solo podrá validar o rechazar la referencia
            $scope.mostrarBtValidar=true;
            $scope.mostrarBtCrear=false;
            
        }else if($rootScope.usuarioLS.role == "ROLE_ADMINISTRADOR" && $rootScope.referenciaCargada != null){
            console.log("Administrador leyendo referencia pendiente de validar");
            //podrá modificar (Borrador/Terminar) validar (Rechazar/Aceptar)
            $scope.mostrarBtValidar=true;
            $scope.mostrarBtCrear=true;
        }else if($rootScope.usuarioLS.role == "ROLE_ADMINISTRADOR" && $rootScope.referenciaCargada == null){
             $scope.mostrarBtCrear=true;
            
        }else{
             $location.path('/bienvenida');
        } 
    }

    //Estos 2 IF determinan el titulo de la pagina nuevaReferencia
    if (($rootScope.usuarioLS.role==="ROLE_ADMINISTRADOR" || $rootScope.usuarioLS.role==='ROLE_MANTENIMIENTO') && $rootScope.opcion==='nueva'){
        $scope.titulo = 'NUEVA REFERENCIA';
      
    }
    if ($rootScope.opcion==='validar'){
        $scope.titulo = 'PENDIENTE DE VALIDACIÓN';
 
    }
    
    //---------PRUEBA--------
  
 

    /* ----------------------- CARGA DE CATALOGOS ------------------------*/
    $scope.catalogo={};
    $scope.title = "";
    $scope.descripcion = "";
    var self = this, j= 0, counter = 0;
    $scope.activado = self.activated;
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            /*Modificacion Ruben para cargar autocomplete en listar*/
            $rootScope.clientes = $scope.catalogo.clientes;
            $rootScope.tecnologias = $scope.catalogo.tecnologias;
            /*Modificacion Ruben para cargar autocomplete en listar*/
            cadenaClientes();
            cadenaTecnologia();         
            $scope.arrayDatos = cargarDatosClientes(); 
            $scope.arrayDatos2 = cargarDatosTecnologia();
            console.log("Catalogos Cargados");
            $rootScope.sociedades = $scope.catalogo.sociedades;
            
            // si venimos de listar referencias tendremos una referencia cargada en $rootScope para la comunicacion entre los controladores
            if($rootScope.referenciaCargada != null){               
                cargarDatosValidarReferencia();
            }else{
                $scope.valorQr = false;
            }
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
            
    /* ---------------  MOSTRAR QR CUANDO COMPLETA EL CAMPO  --------------*/    
    $scope.codigoQr='';
    $scope.QrChaged = function (){
        //console.log($scope.referencia.codigoQr);
       recargarQR();
       // console.log("traza");
    }
   function recargarQR(){
         if($scope.referencia.codigoQr!=''){
             $scope.codigoQr = $scope.referencia.codigoQr;
             $scope.qrCodeVisible=true; 
             
             //Si lo borra que vuelva a ocultar el Qr
         }else if($scope.referencia.codigoQr===''|| $scope.codigoQr===undefined || $scope.codigoQr===' ' || $scope.codigoQr===null){
            $scope.qrCodeVisible=false; 
         }
   }
    $scope.certificado = 'si';
    $scope.mensajeEstado='';
    
    
    /* CREAR la referencia, puede tener estado: pendiente/borrador  */
    $scope.crearReferencia = function (estado) {
        //$scope.referencia = {};
        if(document.getElementById("botonFileReal").files[0]==null && estado =="pendiente"){
                $scope.mensajeEstado = 'Imagen no cargada';
            }else{
                
                if($scope.referencia.cliente = $scope.catalogo.clientes[$scope.posicionEnArray] !=undefined){
                    $scope.referencia.cliente = $scope.catalogo.clientes[$scope.posicionEnArray].nombre;
                }
                if($scope.referencia.tecnologias = $scope.catalogo.tecnologia[$scope.posicionEnArray2] !=undefined){
                    $scope.referencia.tecnologias = $scope.catalogo.tecnologia[$scope.posicionEnArray2].codigo;
                }
                
                $scope.referencia.creadorReferencia = $rootScope.usuarioLS.name;
                $scope.referencia.fechaInicio = $scope.fechaInicio;
                
                var imagen = document.getElementById("botonFileReal").files[0];
                var fileReader = new FileReader();
                if(imagen != null){
                    fileReader.readAsBinaryString(imagen);
                    fileReader.onloadend = function(e){
                        var objeto = e.target.result;
                        objeto = btoa(objeto);
                        $scope.referencia.imagenProyecto = objeto;
                        console.log(objeto);
                       
                    
                        var referencia = $scope.referencia; 
                        console.log(referencia);
            
                        if(estado==='pendiente'){
                            $scope.referencia.estado = "pendiente";
                            $scope.mensajeEstado='Referencia creada pendiente de validar.';       
                        }else if(estado==='borrador'){
                            $scope.referencia.estado = "borrador";  
                            $scope.mensajeEstado='Referencia creada en modo borrador.';   
                            }
                        servicioRest.postReferencia(referencia);
                     }
                           
                }else{
                    
                    var referencia = $scope.referencia; 
                    console.log(referencia);
            
                    if(estado==='pendiente'){
                        $scope.referencia.estado = "pendiente";
                         $scope.mensajeEstado='Referencia creada pendiente de validar.';       
                    }else if(estado==='borrador'){
                        $scope.referencia.estado = "borrador";  
                        $scope.mensajeEstado='Referencia creada en modo borrador.';   
                     }
                    servicioRest.postReferencia(referencia);
                    
                    
                }
               
        }  
    }
    
    /**/
    /*$scope.limpiarCampoNoDisabled=function(texto) {
        
        if($rootScope.opcion === 'validar'){
            //nada
        }else{
            console.log(this.texto);
            switch(texto){
                case 'sociedad':
                    $scope.referencia.sociedad = "";
                    break;
                default:
            }
            
        }
    }*/
    /**/

    /* ------------------------ VALIDAR UNA REFERENCIA ------------------------------- */
    
    $scope.validarReferencia = function () {
        console.log($rootScope.referenciaCargada);
        $rootScope.referenciaCargada.estado='validada';

        //cambiamos el estado de la referencia a 'validada'
        servicioRest.updateReferencia($rootScope.referenciaCargada)
            .then(function(data) {
                servicioRest.popupInfo('', "Referencia validada con éxito.");
                 //Redireccionamos al usuario a la ventana de listar Referencias Pendientes de Validar
                $location.path('/listarReferencia');
                console.log("Referencia validada");
                /*Vaciamos referenciaCargada*/
                $rootScope.referenciaCargada = null;
            }).catch(function(err) {
                servicioRest.popupInfo('',"Error al validar la referencia.");
                console.log("Error al validar la referencia");
            });  
    }
    
    /* ------------------------ RECHAZAR UNA REFERENCIA ------------------------------- */
    
    $scope.rechazarReferencia = function () {
        console.log($rootScope.referenciaCargada);
        $rootScope.referenciaCargada.estado='borrador';

        //cambiamos el estado de la referencia a 'borrador'
        servicioRest.updateReferencia($rootScope.referenciaCargada)
            .then(function(data) {
                servicioRest.popupInfo('', "Referencia rechazada, se avisará al responsable.");
                //Redireccionamos al usuario a la ventana de listar Referencias Pendientes de Validar
                $location.path('/listarReferencia');
                console.log("Referencia rechazada");
                /*Vaciamos referenciaCargada*/
                $rootScope.referenciaCargada = null;
            }).catch(function(err) {
                servicioRest.popupInfo('',"Error al rechazar la referencia.");
                console.log("Error al rechazar la referencia");
            });  
    }
    
    /*-----------------------  AUTOCOMPLETE ----------------------- */
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

   /*-----------------------  Cargar datos en validarReferencia ----------------------- */
    function cargarDatosValidarReferencia(){
        // este codigo rellena la referencia con la informacion guardada en $rootScope
        $scope.referencia = {};
        $scope.referencia.responsableComercial = {};
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
        $scope.referencia.certificado = $rootScope.referenciaCargada.certificado;
        $scope.referencia.regPedidoAsociadoReferencia = $rootScope.referenciaCargada.regPedidoAsociadoReferencia;
        $scope.referencia.responsableComercialSeleccionado = $rootScope.referenciaCargada.responsableComercial;
        $scope.referencia.responsableTecnicoSeleccionado = $rootScope.referenciaCargada.responsableTecnico;
        $scope.valorQr = true;
        $scope.referencia.codigoQr = $rootScope.referenciaCargada.codigoQr;
        recargarQR();
        
        
        
        /*PRUEBA AUTCOMPLETE*/
        $scope.clienteCargado = "pruebaCarga";
    }

  
});

