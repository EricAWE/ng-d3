(function(window) {
    'use strict';

    var NgD3 = function ngD3() {

        var self = this;

        /**
         * Initie ng-d3 et importe toutes les librairies necessaires
         */
        self.init = function initNgD3() {
            window.d3 = window.d3 || require('d3-jetpack');
            window.d3.chart = window.d3.chart || require('d3.chart');
            window._ = require('lodash');

            // Définitions des librairies internes
            self.helpers = require('./utils/helpers');
            self.tooltip = require('./utils/labels');
            self.legend = require('./utils/legend');

            // Import des différents charts
            d3.chart.chord = require('./charts/chord/chord');
            d3.chart.bubble = require('./charts/bubble/bubble');
            d3.chart.sunburst = require('./charts/sunburst/sunburst');
        };

        /**
         * Construit un nouveau chart
         *
         * @param  {Object} parameters
         * @return {Object} NgD3
         */
        self.build = function buildNgD3(parameters) {
            var chart = d3.chart[parameters.chart](self);

            chart.init(parameters.options);
            chart.update(parameters.data);

            return chart;
        };

    };

    window.ngD3 = new NgD3();
    window.ngD3.init();

})(window);
