app.controller ('controladorBuscarReferencias', function (servicioRest,utils, config, $scope, $http, $location, $rootScope, $mdDialog) {  
    
    setTimeout(function(){
         console.log(document.getElementsByTagName("md-chips-wrap")[0].classList.add("chipSelecTecnologias"));
    },1);
  /* angular.ready(function() {
 console.log(document.getElementsByClassName("md-input")[2]);
});*/
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'Buscar referencias';
    $scope.referencias = [];
    $scope.pop=utils.popupInfo;
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    $scope.referencia={esProducto : ""};
    
    $scope.referencia.tecnologiasSeleccionadas=[];
    
    document.getElementsByClassName("md-select-value")[0].children[0].style.width="0";
    document.getElementsByClassName("md-select-value")[1].children[0].style.width="0";
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            $scope.clientes.lista= $scope.catalogo.clientes.map( function (cliente) {
            return {
                value: cliente.nombre,
                display: cliente.nombre+' ('+cliente.siglas+')'
            };
        });
    });
    
    $scope.buscar= function(){
        if(undefined!=$scope.posicionEnArray&&$scope.clientes.texto!=null&&$scope.clientes.texto!=undefined){
                $scope.referencia.cliente = $scope.clientes.lista[$scope.posicionEnArray].display;
        }else{
             $scope.referencia.cliente="";
        }
        if($scope.referencia.esProducto!="si"){
            $scope.referencia.tipoTecnologia="";
        }
        $scope.referencia.anioLimite = moment('default', 'D/M/YYYY', true).toDate().getFullYear() - $scope.referencia.ultimosAnios
        servicioRest.buscarReferencias($scope.referencia).then(
        function (response) {           
            $scope.referencias = response;
            $scope.totalItems = $scope.referencias.length;
        });
    }
    var tecSeleccionados = {};
    tecSeleccionados.nodos = [];
    tecSeleccionados.hojas = [];
    $scope.referencia.tecnologiasSeleccionadas = [];
    $scope.seleccionarTecnologias=function (){
        tecSeleccionados.hojas=$scope.referencia.tecnologiasSeleccionadas;
        console.log(tecSeleccionados);
        $mdDialog.show({
            locals: {
                tecnologiasSelecIniciales: angular.copy(tecSeleccionados)
            },
            controller: 'controladorSeleccionarTecnologias',
            templateUrl: 'modulos/popUp/seleccionarTecnologias.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
        .then(function(tecnologiasElegidas) {
            console.log("resultado", tecnologiasElegidas);
            $scope.referencia.tecnologiasSeleccionadas = tecnologiasElegidas.hojas;
            tecSeleccionados = tecnologiasElegidas;
        })
        .catch(function(err) {
            
        });
    }
    
    $scope.filtrar = function (texto) {
        var resultado;
        var array;
        // Determinamos cual es el array a filtrar y cuanl es el índice del resultado            
        array=$scope.clientes.lista;
        $scope.posicionEnArray=undefined;
        // hacemos la búsqueda en el array
        if(texto!=undefined && texto!==""){
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
    $scope.selectedItemChange=function (item) {
        //si es el autocomplete del cliente, buscamos el índife en la lista de clientes.
        //lo asignamos a la posición del catálogo de clientes correspondiente al mismo
        $scope.posicionEnArray=$scope.clientes.lista.indexOf(item);     
    }
    
    servicioRest.getReferenciasValidadas().then(
        function (response) {           
            $scope.referencias = response;
            $scope.totalItems = $scope.referencias.length;
        });
    
    $scope.currentPage = 1;
    $scope.numPerPage = 15;

    $scope.paginate = function(value) {
    var begin, end, index;
    begin = ($scope.currentPage - 1) * $scope.numPerPage;
    end = begin + $scope.numPerPage;
    index = $scope.referencias.indexOf(value);
    return (begin <= index && index < end);
    };
    
    
    $scope.abrirReferenciaPendiente = function (index, referencias) {        
        $rootScope.referenciaCargada = referencias[index];
        $location.path('/modificarReferencia');
    }
    
    /*   AYUDA     */
    
     $scope.activarScroll=function(){     
        $scope.scroll=true;
        $scope.mostrarBAvanzada=false;
    };
    
    $scope.prueba111=function(){     
        console.log("sdads");
    };
    
    $scope.ayuda = function(){
        $scope.scroll=false
        $scope.mostrarBAvanzada=true;
        $scope.lanzarAyuda();
        
    };
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda=$scope.ayuda;
        }, 1000)
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
                element: '.cabeceraPagina',
                intro: 'Esta seccion gestiona la busqueda de las referencias.'
            },
            {
                element: '#busquedaRef',
                intro: 'Este buscador permite buscar cualquier palabra o palabras en todas las secciones de una referencia, una vez escrito algo en esta zona o en la de busqueda avanzada pulsando en la lupa lanzaremos la busqueda que queremos realizar.'
            },
            {
                element: '#cabeceraBusquedaAvanzada',
                intro: 'Desplegando esta seccion encontrara la seccion de busqueda avanzada.'
            },
            {
                element: '#clienteBusqueda',
                intro: 'Este buscador permite filtrar por los clientes de una referencia, a partir d ela tercera letra introducida podra elegir un cliente de la lista.'
            },
            {
                element: '#sociedadSelect',
                intro: 'Esta lista desplegable permite elegir una o varias sociedades para filtrar las referencias.'
            },
            {
                element: '#selectSectorEmpresarial',
                intro: 'Esta lista despegable permite elegir uno o varios sectores empresarial para filtrar las referencias.'
            },
            {
                element: '#selectActividad',
                intro: 'Esta lista desplegable permite elegir una o varias actividades para filtrar las referencias..'
            },
            {
                element: '#tipoProyectoSelect',
                intro: 'Esta lista despegable permite elegir uno o varios tipos de proyectos para filtrar las referencias.'
            },
            {
                element: '#duracionBusqueda',
                intro: 'Esta zona te permitira seleccionar desde que año quieres ver las referencias, para ello introduce un numero, este numero sera los años que hace que fue creada esa referencia'
            },
            {
                element: '#busquedaBotonTecnologias',
                intro: 'En este boton podra seleccionar las tecnologias por las que desea filtrar.'
            },
            {
                element: '#TecnologiasSelec',
                intro: 'En esta zona se iran cargando las tecnologias que ha seleccionado y tambien podra eliminarlas pulsando en la "x" que aparece en cada una.'
            },
            {
                element: '#busquedaProductoTecnologia',
                intro: 'Nos permitira decidir si buscamos un producto o no, en caso de no seleccionar ninguno o seleccionar "no aplica" sacara ambos tipos.'
            },
            {
                element: '#referenciasBusqueda',
                intro: 'Este listado permite escoger entre las referencias que hemos buscado.'
            },
            {
                element: '.pagination-sm',
                intro: 'Esta seccion de aqui permite movernos entre distintas paginas por si el numero de referencias buscadas fuera muy extenso.'
            }
            ];
}); 
