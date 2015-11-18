
app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog,$location) {
 
    if($rootScope.usuarioLS.role !== "ROLE_ADMINISTRADOR"){
         $location.path('/bienvenida');
        
    }
    
    $scope.title = "";
    $scope.descripcion = "";
    var self = this;
    self.usua = [];
    $scope.mensaje='';
    
    $scope.miUsuarioSeleccionado = null;
    servicioRest.getLDAP().then(
            function(response) {
                $scope.usuarios = response;
                self.usua = response;
                self.repos = loadAll();
                console.log("Ldap Cargado");
            });
    $scope.ordenadoPor = "usuario";
    
    $scope.setValue = function (usuario) {
        $scope.miUsuarioSeleccionado = usuario;
    };
    
    $scope.crear = function () {
        console.log("guardando usuario en nuestra base de datos...");
        $scope.usuario = {"name":$scope.item.nick, "role": $scope.role};
        console.log($scope.usuario);
        servicioRest.postUsuario($scope.usuario)
            .then(function(data) {   
            console.log("bien");
             $scope.mensaje='Usuario creado con éxito';
            
        }).catch(function(err) {
            //Debemos tratar el error mostrando un mensaje
				console.log("error");
            	$scope.title = "ADVERTENCIA";
            $scope.descripcion = "Usuario ya existente";
            $scope.mensaje='';
            showAlert();
			});
        
    };
      
    /** añadido oscar*/
    
    

    self.simulateQuery = false;
    self.isDisabled    = false;
    
    //self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
        $scope.item = item;
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var repos = self.usua;
      return repos.map( function (repo) {
          repo.value = repo.usuario.toLowerCase();              
        return repo;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }
    
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

    /*$scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title($scope.title)
        .content($scope.descripcion)
        .ariaLabel('Alert Dialog Demo')
        .ok('Salir')
        .targetEvent(ev)
    );
  };*/
    
    function showAlert(ev){
        $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title($scope.title)
        .content($scope.descripcion)
        .ariaLabel('Alert Dialog Demo')
        .ok('Aceptar')
        .targetEvent(ev)
        );
    }

 
   
});    
	
   
  

    
    
