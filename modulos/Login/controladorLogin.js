app.controller('controladorLogin', function(servicioRest, config, $scope, $http, $location, $rootScope) {
    $scope.user={        
        name:'',
        password:'' 
    };
    $scope.error;
    
	$scope.login = function () {
        
        
       if($scope.user.name!="" && $scope.user.password!="" && $scope.user.name!=undefined && $scope.user.password!=undefined){
           
           login();
           
       }else{
            $scope.error="Debe de completar los dos campos";
       }
		
	
    
    };
    
    $scope.intro = function (pressEvent){
        //Si presiona intro para acceder
        if(pressEvent.charCode == 13){ 
            login();   
          }
    };
    
    function login(){
    
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
             //Tratamos el error. fatal tratar este error: ERR_CONNECTION_REFUSED
                console.log(err);

                if(err=="Credenciales erróneas"){
                    $scope.error="Contraseña incorrecta.";
                    
                }else if(err=="User not found in DB"){
                    $scope.error="El usuario no está registrado.";
                    $scope.user={        
                        name:'',
                        password:'' 
                    };
                }
			});    
    };
    
    function comprobarRecordar() {
		// Si el usuario ha pulsado en recordar lo guardamos en el localStorage
		if ($scope.recordar) {
			localStorage.setItem("name", $rootScope.usuarioLS.name);
			// Usamos el nick del usuario como secreto
			localStorage.setItem("password", Aes.Ctr.encrypt($rootScope.usuarioLS.password, $rootScope.usuarioLS.name, 256));
			localStorage.setItem("role", $rootScope.usuarioLS.role);
		}
	}
    
    function redireccionar() {
        console.log("Redireccionando segun rol"); 
		// Redireccionamos al usuario logeado dependiendo de su rol
		  if ($rootScope.datoRol.role==="ROLE_ADMINISTRADOR"){
                 $location.path('/bienvenida');

                }else if($rootScope.datoRol.role==="ROLE_MANTENIMIENTO"){
                    $location.path('/bienvenida');
                    
                }else if($rootScope.datoRol.role==="ROLE_VALIDADOR"){
                    $location.path('/bienvenida');
                    
                }else if($rootScope.datoRol.role==="ROLE_CONSULTOR"){
                    $location.path('/bienvenida');
                }
	}
});



