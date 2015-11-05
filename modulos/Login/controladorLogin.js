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
            $http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa($rootScope.usuarioP.name + ':' + $rootScope.usuarioP.password);
            data.password=$rootScope.usuarioP.password;
			$rootScope.usuarioP = data;
            
            
            
            
            
                if(data.role==="ROLE_ADMINISTRADOR"){
                 $location.path('/alta');

                }else if(data.role==="ROLE_MANTENIMIENTO"){
                    $location.path('/nueva');
                }

			})
			.catch(function(err) {
            
				console.log("Error");
            
            
            
            
			});
	};
});



