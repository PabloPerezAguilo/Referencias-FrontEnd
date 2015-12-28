app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http,$log, $rootScope,$location,$mdDialog,$interval,$timeout){
    
    //--------------------- Objetos del controlador (clientes y tecnologias)
    var self = this;
    // list of `state` value/display objects
    self.clientes={
        lista:[],
        texto:'',
        elemSelecionado:{}
    };
    self.tecnologias={
        lista:[],
        texto:'',
        elemSelecionado:{}
    };
    
    $scope.activarScroll=function(){     
        $scope.scroll=true;     
    };
    
    // esta funcion permite cargar el menu cuando hemos recargado la pagina
    //servicioRest.cargarMenu();
      
    //Habilitar/deshabilitar los campos del formulario
    $scope.deshabilitarForm=false;
    
    //mostramos los botones de crear referencia 
    $scope.mostrarBtCrear=true;

    //Como no conocemos los datos que tendrá la refrencia pero queremos poner valores por defecto,
    //la asignamos un objeto vacío al que le metemos los valores por defecto

    $scope.referencia={}
    
    //inicializamos el valor del certificado a 'si' para que salga esa opción seleccionada por defecto
    $scope.referencia.certificado='si';
    
    //Objeto con todos los mensajes errores de validación en la entrada de datos a través de los campos
    //Se guardan en un objeto porque JS no acepta arrays asociativos
    erroresTotales={};
    //Le metemos los valores usando como clave el atributo 'name' del elemente html que lo recoge
    erroresTotales['cliente']="Cliente inválido";
    erroresTotales['sociedad']="Se debe seleccionar una sociedad";
    erroresTotales['SectorEmp']="Se debe seleccionar un sector empresarial";
    erroresTotales['tActividad']="Se debe seleccionar un tipo de actividad";
    erroresTotales['tProyecto']="Se debe seleccionar un tipo de proyecto";

    erroresTotales['fecha']="Se debe seleccionar una fecha de inicio";

    erroresTotales['duracion']="Se debe seleccionar una duración en meses mínima de 1 mes";
    erroresTotales['denominacion']="El campo denominación no puede estar vacío";

    erroresTotales['Rproyecto']="El campo resumen del proyecto no puede estar vacío";
    erroresTotales['ProblemaCliente']="El campo problemática del cliente no puede estar vacío";

    erroresTotales['solGFI']="El campo Solución GFI no puede estar vacío";
    
    erroresTotales['fteTotal']="Se debe seleccionar una cantidad de FTE totales mínima de 1 FTE";

    //$scope.errores['registroPedido']="El campo de registros asociados no puede estar vacío";

    erroresTotales['rbleComercial']="Se debe seleccionar un responsable comercial";

    erroresTotales['rbleTecnico']="Se debe seleccionar un responsable técnico";

    erroresTotales['userfile']="Se debe subir una imágen";
    erroresTotales['tecnologia']="Tecnología inválida";
    
    
    
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
            $scope.deshabilitarForm=true;
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
    
    //---------AYUDA DE LA PAGINA--------
  
    $scope.ayuda = function(){
      $scope.scroll=false
      $scope.lanzarAyuda();
        
    };
    
    $scope.introOptions = config.introOptions;
    $scope.introOptions.steps = [
            {
                element: '.md-dialog-content',
                intro: 'Debe seleccionar un cliente valido de la lista disponible. La lista se mostrara a partir de la tercera letra escrita. <br/> Para guardar en borrador no sera necesario la validez de este cliente, pero si escribe algo invalido en este campo,  al guarda como borrador el cliente se guardara vacio como si no hubiera escrito nada.'
            },
            {
                element: '#sociedad',
                intro: 'Seleccione una sociedad de la lista disponible, si no encuentra la que busca consulte con su gerente.'
            },
            {
                element: '#sectorEmpresarial',
                intro: 'Seleccione un Sector empresarial de la lista disponible, si no encuentra el que busca consulte con su gerente.'
            },
            {
                element: '#actividad',
                intro: 'Seleccione una actividad de la lista disponible, si no encuentra la que busca consulte con su gerente.'
            },
            {
                element: '#tipoProyecto',
                intro: 'Seleccione un tipo de proyecto de la lista disponible, si no encuentra el que busca consulte con su gerente.'
            },
            {
                element: '#fecha',
                intro: 'Seleccione una fecha o escribala con el siguiente formato DD/MM/AAAA.'
            },
            {
                element: '#duracion',
                intro: 'Este campo debe rellenarse con la duracion del proyeccto en meses con un minimo de un mes.'
            },
            {
                element: '#denominacion',
                intro: 'Escriba aqui un nombre que identifique y defina el proyecto.'
            }, 
            {
                element: '#resumen',
                intro: 'En este campo debe escribirse un resumen del alcance del proyecto.'
            },
            {
                element: '#problematica',
                intro: 'Debe rellenar este campo con una definicion detallada del problema que tiene el cliente.'
            },
            {
                element: '#solucion',
                intro: 'Debe rellenar este campo con la solucion optada por GFI para solucionar la problematica del cliente.'
            },
            {
                element: '#fte',
                intro: 'Numero de horas empleadas en el proyecto con un minimo de 1.'
            },
            {
                element: '#certificado',
                intro: 'Seleccione si el proyecto tiene un certificado.'
            },
            {
                element: '#comercial',
                intro: 'Gerente encargado de la parte comercial del proyecto.'
            },
            {
                element: '#tecnico',
                intro: 'Gerente encargado de la parte tecnica del proyecto.'
            },
            {
                element: '#imagen',
                intro: 'Debe pulsar aqui para subir una imagen del proyecto.'
            },
            {
                element: '#qrCode',
                intro: 'En este campo se añadira una url para ponerla en el proyecto como un codigo QR.'
            },
            {
                element: '#tecnologias',
                intro: 'Debe seleccionar una tecnologia valida de la lista disponible. La lista se mostrara a partir de la segunda letra escrita. <br/> Para guardar en borrador no sera necesario la validez de este cliente, pero si escribe algo invalido en este campo,  al guarda como borrador el cliente se guardara vacio como si no hubiera escrito nada.'
            },
            {
                element: '#borrador',
                intro: 'Al pulsar en este boton guarda la referencia en estado borrador, lo que implica que no todos los campos tienen que star rellenos y los campos invalidos simplemente no se guardaran.'
            },
            {
                element: '#terminar',
                intro: 'Si pulsa en terminar, debera tener todos los campos obligatorios (aquellos que tienen asteriscos) rellenos y de forma correcta, si esto no es asi saltara un mensaje que le indicara los errores para que pueda solucionarlos, cuando todo este correcto podra guardar la referencia para que la validen.'
            }
            ];

    setTimeout(function(){ 
        $rootScope.lanzarAyuda=$scope.ayuda;
    }, 1000);
    
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
            $rootScope.tecnologias = $scope.catalogo.tecnologia;
       
            cargarDatosClientes();
            cargarDatosTecnologias();
            
            
            console.log("Catalogos Cargados");
            $rootScope.sociedades = $scope.catalogo.sociedades;
            
            // si venimos de listar referencias tendremos una referencia cargada en $rootScope para la comunicacion entre los controladores
            if($rootScope.referenciaCargada != null){               
                cargarDatosValidarReferencia();
            }else{
                $scope.valorQr = false;
            }
        });
    
    
    
    
    /*-----------------------  AUTOCOMPLETE ----------------------- */

    

    self.filtrar =function (texto, campo) {
        var resultado;
        var array;
        if(campo==='cliente'){
            
            array=self.clientes.lista;
            $scope.posicionEnArray=undefined;
        }
        else if (campo==='tecnologia'){
            array=self.tecnologias.lista;
            $scope.posicionEnArray2=undefined;
        }
        
        if(texto!==""){
            //fil
            resultado=array.filter(function (cliente) {
                return (cliente.display.toLowerCase().indexOf(texto.toLowerCase()) !==-1);
            });
        }else{
            resultado=array;
        }
        return resultado;
    }
    
    
    self.selectedItemChange=function (item, campo) {
        if(campo==='cliente'){
            $scope.posicionEnArray=self.clientes.lista.indexOf(item);
            console.log('Cliente: '+$scope.posicionEnArray);
        }else if(campo==='tecnologia'){
            $scope.posicionEnArray2=self.tecnologias.lista.indexOf(item);
            console.log('Tecnología: '+$scope.posicionEnArray2);
        }
    }

    function cargarDatosClientes() {
         self.clientes.lista= $rootScope.clientes.map( function (cliente) {
            return {
                value: cliente.nombre,
                display: cliente.nombre+' ('+cliente.siglas+')'
            };
        });
        //cargamos los datos en el autocomplete a través del controlador          
    }
    
    function cargarDatosTecnologias() {
        self.tecnologias.lista= $rootScope.tecnologias.map( function (tec) {
            return {
                value: tec.descripcion,
                display: tec.descripcion+' ('+tec.codigo+')'
            };
        });
        //cargamos los datos en el autocomplete a través del controlador          
    }

 
    
    //-----------------------------------------------CREACIÓN---------------------------------------------------------------------
    
    $scope.uploadFile = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //Sets the Old Image to new New Image
                document.getElementById('photo-id').src= e.target.result;

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
       recargarQR();
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
    
    
//--------------- Sección de validación de campos en nueva referencia --------------------------------------------
    
    //Esta función debería estar en utils o algo parecido. determina si el objeto está vacío.
    function isEmptyObject (objeto){
        return angular.equals( {} , objeto );
    };
    
    //Por defecto, todos los campos están mal. Así que asignamos todos los errores al array
    var erroresCometidos=Object.keys(erroresTotales);
    
    //actualizamos la ista de errores
    $scope.actualizaErrores=function(elem, error){
        var indice = erroresCometidos.indexOf(elem);
        
        if(isEmptyObject(error)){//<-- Si el campo está mal
            //Si el error segue en la lista, lo eliminamos  
            if (indice >= 0) {
                erroresCometidos.splice(indice, 1);
            }
        }
        else{ //<-- Si el campo está bien
            //Si el error había sido eliminado de la lista, lo insertamos
            if (indice < 0) {
                erroresCometidos.push(elem);
            }
        }
    };
    
    function listarErrores(){
        
        console.log(erroresCometidos);
        var result="<h1>Errores en la entrada de datos</h1><br>"
        for (var i=0;i<erroresCometidos.length; i++){
            result+='<p>'+erroresTotales[erroresCometidos[i]]+'</p>';
        }
        return result;
    }
    
    $scope.forzarBlur = function () {
        console.log("sg");
        //$scope.fechaInicio.focus();
    }
    
    $scope.comprobarFecha = function () {
        console.log($scope.fechaInicio);
    }
    
    function validarCampos(){
        //Como los siguientes campos no los validar automñaticamente, los evaluamos aquí y actualizamos el array de errores
        compruebaCampo($scope.posicionEnArray, 'cliente');
        compruebaCampo($scope.posicionEnArray2, 'tecnologia');
        compruebaCampo($scope.fechaInicio, 'fecha');
        
        //Los campos serán válidos cuando no tengamos errorres en los campos obligatorios. Por lo que comparamos con la longitud del array de errores
        return 0===erroresCometidos.length;    
    }
    
    function compruebaCampo(campo, id_error){
        
        var indice=erroresCometidos.indexOf(id_error)
        //las posiciones en los arrays serán -1 en caso de que no haya error y la fecha será undefined o null
        if(undefined!=campo && -1!==campo){//<-- Si el campo está bien
            //Si el error había sido eliminado de la lista, lo insertamos
            console.log('BIEN: '+id_error+' , '+campo);
            if (indice >= 0) {
                erroresCometidos.splice(indice, 1);
            }
        }
        else{ //<-- Si el campo está mal
            //Si el error sigue en la lista, lo eliminamos
            console.log('MAL: '+id_error+' , '+campo);
            if (indice < 0) {
                erroresCometidos.push(id_error);
            }
        }
            
    }

 //--------------------------------------------------------------------------------------------------------------------------   
    /* CREAR la referencia, puede tener estado: pendiente/borrador  */
    $scope.crearReferencia = function (estado, event) {
        //console.log($scope.fechaInicio.getDate());
        console.log('FECHA'+$scope.fechaInicio);
        console.log('prueba'+$scope.referencia.duracionMeses);
        console.log('TIPO: '+typeof $scope.fechaInicio);
        if ((estado==="pendiente" && validarCampos()) || estado==="borrador")
        {
            // Crea/Guarda una referencia dependiendo de su estado
            if(undefined!=$scope.posicionEnArray){
                $scope.referencia.cliente = $scope.catalogo.clientes[$scope.posicionEnArray].nombre;
            }
                      
            var indiceTecnologia = $rootScope.tecnologias.indexOf($scope.catalogo.tecnologia[$scope.posicionEnArray2]);
            if(undefined!=$scope.posicionEnArray2){
                $scope.referencia.tecnologias = $scope.catalogo.tecnologia[$scope.posicionEnArray2].codigo;
            }
                
            if(undefined!=$scope.fechaInicio){
                $scope.referencia.fechaInicio = $scope.fechaInicio;
            }
                
            $scope.referencia.creadorReferencia = $rootScope.usuarioLS.name;
            var fileReader = new FileReader();
            
            if(undefined!=document.getElementById("botonFileReal").files[0]){
                
                var imagen = document.getElementById("botonFileReal").files[0];
                fileReader.readAsBinaryString(imagen);
                fileReader.onloadend = function(e)
                {
                    var objeto = e.target.result;
                    objeto = btoa(objeto);
                    $scope.referencia.imagenProyecto = objeto;
                    var referencia = $scope.referencia;
                    $scope.referencia.estado = estado; 
                    if(estado==="pendiente")
                    {
                        $scope.mensajeEstado='Referencia creada pendiente de validar.'; 
                    }
                    else if(estado==="borrador")
                    {
                        $scope.mensajeEstado='Referencia creada en modo borrador.'; 
                    }

                    servicioRest.postReferencia(referencia);
                    console.log('referencia guardada');
                 }
            }else
            {
                    var referencia = $scope.referencia;
                    $scope.referencia.estado = estado; 
                    if(estado==="pendiente")
                    {
                        $scope.mensajeEstado='Referencia creada pendiente de validar.'; 
                    }
                    else if(estado==="borrador")
                    {
                        $scope.mensajeEstado='Referencia creada en modo borrador.';
                    }
                    servicioRest.postReferencia(referencia);
                    console.log('referencia guardada');
            }
            
        }else{
            servicioRest.popupInfo(event,listarErrores());
            //errores(event,listarErrores());
        }
                

    }
    
    errores = function(ev, listaErr) {
        $mdDialog.show({
            locals: {
                listaErrores: listaErr
            },
            controller: 'controladorErroresReferencia',
            templateUrl: 'modulos/popUp/erroresReferencia.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };
    
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
    
    

   /*-----------------------  Cargar datos en validarReferencia ----------------------- */
    function cargarDatosValidarReferencia(){
        // este codigo rellena la referencia con la informacion guardada en $rootScope
        $scope.referencia = {};
        console.log('HOLA: '+$rootScope.referenciaCargada.cliente);
        $scope.referencia.cliente=$rootScope.referenciaCargada.cliente;
        $scope.referencia.tecnologias=$rootScope.referenciaCargada.tecnologias;
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
    }

  
});

