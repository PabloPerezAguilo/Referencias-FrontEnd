app.controller('controladorLogin', function(servicioRest, config, $scope) {
    $scope.user={        
        usuario:'',
        password: ''
    }   
	$scope.login = function () {

		servicioRest.postUsuario(user)
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log("Error");
			});
	}
});



