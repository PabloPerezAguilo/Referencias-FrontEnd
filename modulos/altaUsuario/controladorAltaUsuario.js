
app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope, $timeout, $q, $log,$mdDialog, $interval) {
 
    // esta funcion permite cargar el menu cuando hemos recargado la pagina
    servicioRest.cargarMenu();
    
   $scope.title = "";
   $scope.descripcion = "";
    var self = this,  j= 0, counter = 0;
    $scope.mensaje='';
    $scope.activado = self.activated;
    
    
    $scope.crear = function (evento) {
        console.log("guardando usuario en nuestra base de datos...");
        $scope.usuario = {"nick":$scope.usuarios[$scope.posicionEnArray].nick, "name":$scope.usuarios[$scope.posicionEnArray].usuario, "role": $scope.role};
        console.log($scope.usuario);
        servicioRest.postUsuario($scope.usuario)
            .then(function(data) {
             $scope.mensaje='Usuario creado con éxito';
        }).catch(function(err) {
            servicioRest.popupInfo(evento, 'Usuario ya existente');
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
	

    
    
