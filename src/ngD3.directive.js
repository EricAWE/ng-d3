(function() {
    'use strict';

    angular
        .module('ngD3', [])
        .directive('ngD3', ngD3Directive);

    ngD3Directive.$inject = ['$document'];

    /**
     * Directive pour ng-d3
     *
     */
    function ngD3Directive() {
        var directive = {
            link: ngD3Link,
            restrict: 'E',
            scope: {
                parameters: '=parameters'
            }
        };

        return directive;

        /**
         * Logique de la directive ng-d3
         *
         * @param  {Object} scope
         * @param  {Object} element
         */
        function ngD3Link(scope, element) {
            var chart;
            var i = 0;
            var ngD3 = require('./plugin/ng-d3');
            var className = 'ngD3-container' + Math.round(Math.random() * 1000);
            var parameters = scope.parameters;

            element.addClass(className);
            element.addClass('ngD3-container');
            parameters.options.container = '.' + className;
            parameters.options.width = parameters.options.width || element.parent()[0].clientWidth;
            parameters.options.height = parameters.options.height || element.parent()[0].clientHeight;

            chart = ngD3.build(angular.copy(parameters));

            scope.$watch('parameters', function(newParams, oldParams) {


                if (newParams && i > 0) {
                    newParams.options.width = newParams.options.width || element.parent()[0].clientWidth;
                    newParams.options.height = newParams.options.height || element.parent()[0].clientHeight;

                    chart.update(angular.copy(newParams.data), newParams.options);
                    // Si le chart type change, on supprime le contenue de la div,
                    // on renitialise complétement le chart
                    if (newParams.chart !== oldParams.chart) {
                        angular.element(element[0]).empty();

                        chart = ngD3.build(angular.copy(scope.parameters));
                    }
                }

                i++;
            }, true);

            return chart;
        }
    }

})();
