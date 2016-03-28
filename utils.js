function utils($rootScope, $mdDialog){
    
    function popupInfo(ev,descripcion){    
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title("")
            .htmlContent(descripcion)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
            .targetEvent(ev)
        );
    }
    
    function cargarMenu(rol){
            if( rol === "ROLE_ADMINISTRADOR"){
                $rootScope.menuTecnologias = true;
                $rootScope.menuGestionTecnologias = true;
                $rootScope.menuUsuarios = true;
                $rootScope.menuUsuariosAlta = true;
                $rootScope.menuUsuariosGestion = true;
				$rootScope.menuClientesAlta = true;
				$rootScope.menuClientesGestion = true;
				$rootScope.menuGerentesAlta = true;
				$rootScope.menuGerentesGestion = true;
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasBuscar = true;
                $rootScope.menuReferenciasNueva = true;
                $rootScope.menuReferenciasListarVal = true;
                $rootScope.menuReferenciasListarNoVal = true;
            }else if(rol === "ROLE_VALIDADOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasListarVal = true;
            }else if(rol === "ROLE_CONSULTOR"){
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasBuscar = true;
            }else if(rol === "ROLE_MANTENIMIENTO"){ 
                $rootScope.menuReferencias = true;
                $rootScope.menuReferenciasBuscar = true;
                $rootScope.menuReferenciasListarNoVal = true;
                $rootScope.menuReferenciasNueva = true;
            }

            
    }
    
    function isEmptyObject (objeto){
        return angular.equals( {} , objeto );
    };
    
    
    
     return {
         popupInfo: popupInfo,
         cargarMenu: cargarMenu,
         isEmptyObject: isEmptyObject
    }
}