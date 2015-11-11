app.controller('controladorLogin', function(servicioRest, config, $scope, $http, $location, $rootScope) {
    $scope.user={        
        name:'',
        password: '' 
    };
    $scope.error;
    
	$scope.login = function () {
        
		servicioRest.postLogin($scope.user)
			.then(function(data) {   
            
				console.log(data); 
                $rootScope.menu = true;
                $rootScope.datoRol=data;
                //Redireccionamos al usuario según su ROL
                redireccionar();
                $rootScope.usuarioP = $scope.user;
            
                //Guardamos el usuario completo incluido el rol que nos devuelve
                $rootScope.usuarioLS={
                    name:$scope.user.name,
                    password:$scope.user.password,
                    role:data.role   
                };
            
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.usuarioP.name + ':' + $rootScope.usuarioP.password);

                //Comprobamos si ha seleccionado recordar
                comprobarRecordar();

			})
			.catch(function(err) {
            //Debemos tratar el error mostrando un mensaje
				
            if(err==="User not fund in BD"){
                
                
            }
            $scope.error="El usuario no está registrado";
            	
            
            
			});
	};
    
    function comprobarRecordar() {
		// Si el usuario ha pulsado en recordar lo guardamos en el localStorage
		if ($scope.recordar) {
			localStorage.setItem("name", $rootScope.usuarioLS.name);
			// Usamos el nombre de usuario como secreto
			localStorage.setItem("password", Aes.Ctr.encrypt($rootScope.usuarioLS.password, $rootScope.usuarioLS.name, 256));
			localStorage.setItem("role", $rootScope.usuarioLS.role);
		}
	}
    
    function redireccionar() {
        console.log("Redireccionando segun rol"); 
		// Redireccionamos al usuario logeado dependiendo de su rol
		  if ($rootScope.datoRol.role==="ROLE_ADMINISTRADOR"){
                 $location.path('/alta');

                }else if($rootScope.datoRol.role==="ROLE_MANTENIMIENTO"){
                    $location.path('/bienvenida');
                    
                }else if($rootScope.datoRol.role==="ROLE_VALIDADOR"){
                    $location.path('/nueva');
                    
                }else if($rootScope.datoRol.role==="ROLE_CONSULTOR"){
                    $location.path('/nueva');
                }
	}
});



