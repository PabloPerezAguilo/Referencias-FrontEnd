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
app.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return date ? moment(date).format('D/M/YYYY') : '';
  };
  
  $mdDateLocaleProvider.parseDate = function(dateString) {
    var m = moment(dateString, 'D/M/YYYY', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };
});