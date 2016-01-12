function utils($rootScope, $mdDialog){
    
    function actualizaAyuda(funcAyuda){
        setTimeout(function(){ 
            //rootScope.lanzarAyuda funcion vacia del boton del menu, inutil hasta igualarlo a la funcion de cada vista
            //funcAyuda el scope.lanzarAyuda de cada vista con sus tutoriales especificos, se igualan al lanzar
            //ayuda del boton del menu al cargar el controlador de cada pagina
            $rootScope.lanzarAyuda=funcAyuda;
        }, 1000);
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
    
    function cargarMenu(rol){
        console.log("utils.cargarMeu: "+rol);
            if( rol === "ROLE_ADMINISTRADOR"){
                $rootScope.menuTecnologias = true;
                $rootScope.menuGestionTecnologias = true;
                $rootScope.menuUsuarios = true;
                $rootScope.menuUsuariosAlta = true;
                $rootScope.menuUsuariosGestion = true;
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasNueva = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_VALIDADOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_CONSULTOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasListar = true;
            }else if(rol === "ROLE_MANTENIMIENTO"){ 
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasGestion = true;
                $rootScope.menuReferenciasListar = true;
                $rootScope.menuReferenciasNueva = true;
            }

            
    }
    
    function isEmptyObject (objeto){
        return angular.equals( {} , objeto );
    };
    
     return {
         actualizaAyuda: actualizaAyuda,
         popupInfo: popupInfo,
         cargarMenu: cargarMenu,
         isEmptyObject: isEmptyObject
    }
}