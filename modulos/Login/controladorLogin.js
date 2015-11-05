app.controller('controladorLogin', function(servicioRest, config, $scope, $http, $location, $rootScope) {
    $scope.user={        
        name:'',
        password: ''
       
    };
    
    
	$scope.login = function () {
        
		servicioRest.postLogin($scope.user)
			.then(function(data) {          
				console.log(data);
                $rootScope.menu = true;
                $rootScope.usuarioP = $scope.user;
            
                if(data.role==="ROLE_ADMINISTRADOR"){
                 $location.path('/alta');

                }else if(data.role==="ROLE_MANTENIMIENTO"){
                    $location.path('/nueva');
                    
                }else if(data.role==="ROLE_VALIDADOR"){
                    $location.path('/nueva');
                    
                }else if(data.role==="ROLE_CONSULTOR"){
                    $location.path('/nueva');
                }
            

			})
			.catch(function(err) {
            
				console.log("Error");
            
            
            
            
			});
	};
});



