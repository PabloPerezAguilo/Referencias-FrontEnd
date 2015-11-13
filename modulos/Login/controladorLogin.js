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
    
    //Comprobamos que el LocalStorage tenga datos
    if(localStorage.getItem("name")!==null){
       console.log(localStorage.getItem("name"));
       $location.path("/bienvenida");

    }
    
    function login(){
    
        servicioRest.postLogin($scope.user)
			.then(function(data) {
                $rootScope.usuarioP = $scope.user;
                //Guardamos el usuario completo incluido el rol que nos devuelve
                $rootScope.usuarioLS={
                    name:$scope.user.name,
                    password:$scope.user.password,
                    role:data.role   
                };
            
                //Redireccionamos al usuario a la página de bienvenida
                $location.path('/bienvenida');
                //Mostramos el menú
                $rootScope.menu = true;
            
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.usuarioP.name + ':' + $rootScope.usuarioP.password);
                
                //Si el usuario ha pulsado recordar guardamos
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
    
    
    function comprobarRecordar(){ 

        if($scope.recordar){
            localStorage.setItem("name", $rootScope.usuarioLS.name);
            // Usamos el nick del usuario como secreto
            localStorage.setItem("password", Aes.Ctr.encrypt($rootScope.usuarioLS.password, $rootScope.usuarioLS.name, 256));
            localStorage.setItem("role", $rootScope.usuarioLS.role);
        }
    }
    
});



