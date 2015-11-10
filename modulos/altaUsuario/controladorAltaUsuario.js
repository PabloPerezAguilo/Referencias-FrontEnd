app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope) {
    $http.defaults.headers.common.Authorization = "Basic "+btoa($rootScope.usuarioP.name+":"+$rootScope.usuarioP.password);
    
    $scope.miUsuarioSeleccionado = null;
    
    servicioRest.getLDAP().then(
            function(response) {
                $scope.usuarios = response;
            },
        function(response){
            //error
        })
    $scope.ordenadoPor = "usuario";
    
    $scope.setValue = function (usuario) {
        $scope.miUsuarioSeleccionado = usuario;
    }
    
    $scope.crear = function () {
        console.log("guardando usuario en nuestra base de datos...");
        $scope.usuario = {"name": $scope.miUsuarioSeleccionado.nick, "role": $scope.role};
        console.log($scope.usuario);
        $http.defaults.headers.common.Authorization = "Basic "+btoa($rootScope.usuarioP.name+":"+$rootScope.usuarioP.password);
        servicioRest.postUsuario($scope.usuario);
	};
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.meals = [];

      var dishes = [
        'noodles',
        'sausage',
        'beans on toast',
        'cheeseburger',
        'battered mars bar',
        'crisp butty',
        'yorkshire pudding',
        'wiener schnitzel',
        'sauerkraut mit ei',
        'salad',
        'onion soup',
        'bak choi',
        'avacado maki'
      ];
      var sides = [
        'with chips',
        'a la king',
        'drizzled with cheese sauce',
        'with a side salad',
        'on toast',
        'with ketchup',
        'on a bed of cabbage',
        'wrapped in streaky bacon',
        'on a stick with cheese',
        'in pitta bread'
      ];
    
     for (var i = 1; i <= 100; i++) {
        var dish = dishes[Math.floor(Math.random() * dishes.length)];
        var side = sides[Math.floor(Math.random() * sides.length)];
    $scope.meals.push(' ' + i + ': ' + dish + ' ' + side);
      }

    $scope.pageChangeHandler = function(num) {
          console.log('meals page changed to ' + num);
      };
    

    function OtherController($scope) {
      $scope.pageChangeHandler = function(num) {
        console.log('going to page ' + num);
      };
    };

    /*app.controller('controladorAltaUsuarior', controladorAltaUsuario);*/
    app.controller('OtherController', OtherController);
   }); 