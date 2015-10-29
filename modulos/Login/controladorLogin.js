app.controller('controladorLogin', function(servicioRest, config, $scope, $http) {
    $scope.user={        
        name:'',
        password: ''
    };   
	$scope.login = function () {

		servicioRest.postUsuario($scope.user)
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log("Error");
			});
	};
});



