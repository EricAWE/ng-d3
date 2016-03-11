(function() {
    'use strict';

    var Legend = function Legend(chart, ngD3) {

        var self = this;
        var pvs = {
            width: 0
        };

        self.parameters = {
            position: 'right',
            align: 'vertical',
            enabled: true,
            itemWidth: 10,
            itemType: 'circle',
            layout: 'vertical',
            width: 0.8,
            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif'
        };

        /**
         * Initie la légend
         *
         */
        function _init() {
            // Extend les options de base avec les options users
            chart.options.legend = chart.options.legend || {};
            self.parameters = _.extend(self.parameters, chart.options.legend);

            // Si la légend n'est pas définit on stop l'initiation
            if (self.parameters.enable === false) {
                return self;
            }

            // On initie la width et la height de la légende
            self.width(self.parameters.width);
            self.height(40);

            // On rend la légende voulue
            self['render' + _.capitalize(chart.dataType)]();
        }

        /**
         * Rends la légende pour les charts matriciels
         * sous forme de tableaux
         *
         * @return {Object} self;
         */
        self.renderMatrix = function() {
            // Rajoute une classe au container
            d3.select(chart.options.container).classed('ngD3-table-chart', true);

            var tableLegend = require('./table-legend')();
            var wrapper = d3.select(chart.options.container)
                .append('div')
                .attr('class', 'ngD3-legend ngD3-legend-table')
                .style('height', self.height() + 'px')
                .style('width', self.width() + 'px');

            var table = wrapper.append('table');

            self.table = tableLegend.init(chart, self, table);

            return self;
        };

        /**
         * Rends la légende pour les charts généalogic
         *
         * @return {Object} self;
         */
        self.renderGenealogic = function() {
            var g;
            var li = { w: self.width(), r: 7 };
            var legend = d3.select(chart.options.container).append('svg:svg')
                .attr('height', self.height())
                .attr('width', self.width())
                .attr('class', 'ngD3-legend')
                .append('g');

            li.h = li.r * 4;
            pvs.horizontalW = 0;

            g = legend.selectAll('g')
                .data(d3.entries(chart.options.color))
                .enter()
                .append('svg:g');

            g.append('svg:' + self.parameters.itemType)
                .attr('cx', li.r)
                .attr('cy', li.r)
                .attr('r', li.r)
                .attr('height', li.r)
                .style('fill', function(d) { return d.value; });

            g.append('svg:text')
                .attr('x', li.r + 20)
                .attr('y', 0)
                .attr('dy', li.h / 2.5)
                .attr('text-anchor', 'left')
                .attr('font-size', li.r * 2)
                .attr('font-family', self.parameters.fontFamily)
                .text(function(d) { return _getTitle(d.key); });

            g.attr('transform', function(d, i) {
                return _getTranslateGenealogic(g, li, i);
            });

            // Centre la légende dans sa hauteur et largeur
            var alignement = _getLegendAlignement(legend);

            legend.attr('transform', function() {
                return 'translate(' + alignement.left + ',' + alignement.top + ')';
            });

            return self;
        };

        /**
         * Retourne ou modifie la taille de la légende
         *
         * @param  {Number} newWidth
         * @return {Number} width
         */
        self.width = function(newWidth) {
            if (!newWidth) {
                return pvs.width;
            }

            if (self.parameters.position === 'right' || self.parameters.position === 'left') {
                pvs.width = chart.width() * (1 - newWidth);
                chart.width(chart.width() - pvs.width);
            }
            else {
                pvs.width = chart.width();
            }

            return self;
        };

        /**
         * Retourne ou modifie la taille de la légende
         *
         * @param  {Number} newWidth
         * @return {Number} width
         */
        self.height = function(newHeight) {
            if (!newHeight) {
                return pvs.height;
            }

            if (self.parameters.position === 'right' || self.parameters.position === 'left') {
                pvs.height = chart.height();
            }
            else {
                pvs.height = newHeight;
                chart.height(chart.height() - newHeight);
            }

            return self;
        };

        /**
         * Place le chart en fonction de la
         * position de la légende
         *
         * @return {Object} svg
         */
        self.placeChart = function() {
            var svg;

            if (self.parameters.position === 'right' || self.parameters.position === 'bottom') {
                svg = d3.select(chart.container).insert('svg', ':first-child');
            }
            else {
                svg = d3.select(chart.container).append('svg');
            }

            return svg;
        };

        /**
         * @private
         * Retourne l'alignement de la légende
         * en top et left
         *
         * @param  {Object} legend
         * @return {Object} alignement
         */
        function _getLegendAlignement(legend) {
            var alignement = {
                top: (self.height() / 2) - (legend.node().getBBox().height / 2),
                left: (self.width() / 2) - (legend.node().getBBox().width / 2)
            };

            return alignement;
        }

        /**
         * @private
         * Retourne la transormation à appliqué
         * à la légende
         *
         * @param  {Number} i
         * @return {Number} translate
         */
        function _getTranslateGenealogic(g, li, i) {
            var translate;
            var hW;

            if (self.parameters.align === 'vertical') {
                translate = 'translate(0,' + (i * (li.h + li.r)) + ')';
            }
            else {
                if (pvs.horizontalW >= self.width()) {
                    hW = li.h;
                    pvs.horizontalW = 0;
                }
                else {
                    hW = 0;
                }
                translate = 'translate(' + pvs.horizontalW + ', ' + hW + ')';
            }

            pvs.horizontalW += (g[0][i].getBBox().width + 20);

            return translate;
        }

        /**
         * @private
         * Set les titles pour la légende
         *
         * @param  {String} key
         * @return {String} title
         */
        function _getTitle(key) {
            var title = key;

            if (self.parameters.titles && self.parameters.titles[key]) {
                title = self.parameters.titles[key];
            }

            return title;
        }

        _init();
        return self;
    };

    module.exports = exports = function(chart, ngD3) {
        return new Legend(chart, ngD3);
    };
})();
