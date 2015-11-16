
app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog, $interval) {
 
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    /*self.usua = [];*/
    $scope.mensaje='';
    $scope.activado = self.activated;
    
    
   /* $scope.miUsuarioSeleccionado = null;
    servicioRest.getLDAP().then(
            function(response) {
                $scope.usuarios = response;
                self.usua = response;
                self.repos = loadAll();
                console.log("Ldap Cargado");
                $scope.activado = false;
                toggleActivation();
                
            }).catch(function(err) {
            //Debemos tratar el error mostrando un mensaje
				console.log("error");        
            //$scope.title = "ADVERTENCIA";
            $scope.descripcion = "Ldap No cargado";
            $scope.mensaje='';
            showAlert();
			});  */
    
    $scope.crear = function () {
        console.log("guardando usuario en nuestra base de datos...");
        $scope.usuario = {"name":$scope.usuarios[$scope.posicionEnArray].nick, "role": $scope.role};
        console.log($scope.usuario);
        servicioRest.postUsuario($scope.usuario)
            .then(function(data) {   
            console.log("bien");
             $scope.mensaje='Usuario creado con éxito';
            
        }).catch(function(err) {
            //Debemos tratar el error mostrando un mensaje
				console.log("error");
            	//$scope.title = "ADVERTENCIA";
            $scope.descripcion = "Usuario ya existente";
            $scope.mensaje='';
            showAlert();
			});        
    };
      
    /*Autocomplete*/ 
    $scope.miUsuarioSeleccionado = null 
    servicioRest
		.getLDAP()
		.then(function(response) {
		$scope.usuarios = response;
		cadenaUsuarios();
		$scope.arrayDatos = cargarDatos();
		console.log("Ldap Cargado");
        $scope.activado = false;
        toggleActivation();
	})
		.catch(function(err) {
		 $scope.mensaje='error de cargar ldap';
	});
	
	$scope.cadena = "";
	self.pos = "";
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;

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

	// Filtrar palabras según texto
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function(state) {
			$scope.texto = state.value.substring(state.value.indexOf("*"), 0);
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	};

	// Elemento seleccionado
	function selectedItemChange(item) {
		if (JSON.stringify(item) !== undefined) {
			var pos = item.value.substring(item.value.length, item.value.indexOf("*") + 1);
			$scope.posicionEnArray = pos;
            console.log(item);
		}
	};

	// Carga de datos inicial
	function cargarDatos() {
		// Convertimos los datos a una sola cadena
		var allStates = $scope.cadena;
		return allStates.split(/, +/g).map(function(state) {
			return {
				value: state.toLowerCase(),
				display: state.substring(state.indexOf("*"), 0)
			};
		});
	};

	// Convertir a una sola cadena
	function cadenaUsuarios() {
		for (var i = 0; i < $scope.usuarios.length; i++) {
			$scope.cadena += $scope.usuarios[i].usuario + ' (' + $scope.usuarios[i].nick + ') ' + '*' + i + ', ';
		}
	};
	
    /*self.simulateQuery = false;
    self.isDisabled    = false;  
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.buscarenTexto   = buscarenTexto;

    

    //Query que busca en repos con $timeout to simulate     
     
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
    function buscarenTexto(text) {
      $log.info('Texto seleccionado: ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item seleccionado: ' + JSON.stringify(item));
        $scope.item = item;
    }

    //construye los componentes de la lista en un valor.
    function loadAll() {
      var repos = self.usua;
      return repos.map( function (repo) {
          repo.value = repo.usuario.toLowerCase(),repo.nick.toLowerCase();              
        return repo;
      });
    }
    
    //creamos la funcion para el query
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }*/
    
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
    
    
    self.modes = [ ];
    self.activated = true;
    self.determinateValue = 100;

      //Apaga o enciende el loader
       
    function toggleActivation() {
          if ( !$scope.activated ) self.modes = [ ];
          if (  $scope.activated ) j = counter = 0; 
    }
    self.toggleActivation = function() {
          if ( !self.activated ) self.modes = [ ];
          if (  self.activated ) j = counter = 0;
      };

      // Se mueve cada 100ms sin parar.
      $interval(function() {

        // Incrementa el moviento de loader

        self.determinateValue += 1;
        if (self.determinateValue > 100) {
          self.determinateValue = 100;
        }

        // Incia la animación en 5

        if ( (j < 5) && !self.modes[j] && self.activated ) {
          self.modes[j] = 'indeterminate';
        }
        if ( counter++ % 4 == 0 ) j++;

      }, 100, 0, true);
    
 
});    
	
   
  

    
    
