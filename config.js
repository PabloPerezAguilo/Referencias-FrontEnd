app.constant('config', {
	url: "http://localhost:8080/Xonger/api",
	atributoConstante: "esto es una constante",
    introOptions: {
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Siguiente</strong>',
        prevLabel: '<span>Anterior</span>',
        skipLabel: 'Cerrar',
        doneLabel: 'Fin'
    }
});
//Configuracion necesaria para la fecha del DatePicker
app.config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.shortDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      $mdDateLocaleProvider.formatDate = function(date) {
          console.log("aaa");
        return date ? moment(date).format('D/M/YYYY') : '';
      };

      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'D/M/YYYY', true);
          console.log("bbb");
        return m.isValid() ? m.toDate() : moment('undefined', 'D/M/YYYY', true).toDate();
      };
});/*

 app.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });

app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        elem.off(attr.eventFocus);
      });
    };
  });*/