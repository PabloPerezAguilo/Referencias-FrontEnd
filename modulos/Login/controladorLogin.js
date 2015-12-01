app.controller('controladorLogin', function(servicioRest, config, $scope, $http, $location, $rootScope, $mdDialog) {
    $scope.user={        
        nick:'',
        password:'' 
    };
    $rootScope.error;
    
	$scope.login = function () {
        
       if($scope.user.nick!="" && $scope.user.password!="" && $scope.user.nick!=undefined && $scope.user.password!=undefined){
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
    if(localStorage.getItem("nick")!==null){
       console.log(localStorage.getItem("nick"));
       $location.path("/bienvenida");

    }
    
    function login(){
    
        servicioRest.postLogin($scope.user)
			.then(function(data) {
                $rootScope.usuarioP = $scope.user;
                //Guardamos el usuario completo incluido el rol que nos devuelve
                $rootScope.usuarioLS={
                    nick:$scope.user.nick,
                    password:$scope.user.password,
                    role:data.role,
                    name:data.name
                };
            
                //Redireccionamos al usuario a la página de bienvenida
                $location.path('/bienvenida');
                //Mostramos el menú
                $rootScope.menu = true;
            
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($rootScope.usuarioP.nick + ':' + $rootScope.usuarioP.password);
                
                //Si el usuario ha pulsado recordar guardamos
                comprobarRecordar();

			})
			.catch(function(err) {
             //Tratamos el error.
                console.log(err);
                if(err=="Credenciales erróneas"){
                    $rootScope.error="Contraseña incorrecta.";
                    
                }else if(err=="User not found in DB"){
                    $rootScope.error="El usuario no está registrado.";
                    $rootScope.user={        
                        nick:'',
                        password:'' 
                    };
                }
			});    
    };
    
    
    function comprobarRecordar(){ 

        if($scope.recordar){
            localStorage.setItem("nick", $rootScope.usuarioLS.nick);
            // Usamos el nick del usuario como secreto
            localStorage.setItem("password", Aes.Ctr.encrypt($rootScope.usuarioLS.password, $rootScope.usuarioLS.nick, 256));
            localStorage.setItem("role", $rootScope.usuarioLS.role);
        }
    }
    
});



