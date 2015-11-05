app.controller('controladorLogin', function(servicioRest, config, $scope, $http, $location) {
    $scope.user={        
        name:'',
        password: ''
    };
    
	$scope.login = function () {

		servicioRest.postLogin($scope.user)
			.then(function(data) {
            
				console.log(data);
            
            
            if(data.role=="ADMIN_ROLE"){
             $location.path('/inicio');
                /* Cargamos una pantalla de inicio con el menu*/
                
            }else{
  
            }

			})
			.catch(function(err) {
				console.log("Error");
			});
	};
});



