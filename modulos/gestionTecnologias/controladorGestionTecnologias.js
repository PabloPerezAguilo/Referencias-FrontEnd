app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $location, $rootScope) {  
    
$scope.data = [
  {
    "id": 1,
    "nombre": "node1",
      "clase":"nodo",
    "hijos": [
      {
        "id": 11,
        "nombre": "node1.1",
          "clase":"nodo",
        "hijos": [
          {
            "id": 111,
            "nombre": "node1.1.1",
              "clase":"hoja",
            "hijos": []
          }
        ]
      },
      {
        "id": 12,
        "nombre": "node1.2",
          "clase":"hoja",
        "hijos": []
      }
    ]
  },
  {
    "id": 2,
    "nombre": "node2",
      "clase":"nodo",
    "nodrop": true,
    "hijos": [
      {
        "id": 21,
        "nombre": "node2.1",
          "clase":"hoja",
        "hijos": []
      },
      {
        "id": 22,
        "nombre": "node2.2",
      "clase":"nodo",
        "hijos": []
      }
    ]
  },
  {
    "id": 3,
    "nombre": "node3",
      "clase":"nodo",
    "hijos": [
      {
        "id": 31,
        "nombre": "node3.1",
      "clase":"hojaInvalida",
        "hijos": []
      }
    ]
  }
]
}); 