(function() {
    'use strict';

    var LegendTable = function LegendTable() {
        var chart;
        var self = this;
        var pvs = {};

        /**
         * Initie le tableau
         *
         * @return {Object} self
         */
        self.init = function(_chart, legend, table) {
            chart = _chart;
            pvs.parent = legend;
            pvs.data = chart.data();
            pvs.total = self.getSumMatrix(chart.matrix());

            _drawTable(table);

            return self;
        };

        /**
         * Reset le tableau
         *
         */
        self.clear = function() {
            self.element.selectAll('tbody').remove();
        };

        /**
         * Update le contenue du tableau
         *
         * @param  {Object} path
         * @return {Object} self
         */
        self.update = function(support, supports) {
            self.clear();

            var supportData = _.find(pvs.data.children, {name: support.key});
            var columns = pvs.parent.parameters.columns;

            // On sort les data pour le rendu dans le tableau
            var data = _.orderBy(supportData.children, ['size'], ['desc']);

            self.element.append('tbody')
                .selectAll('tr')
                .data(data)
                .enter()
                    .append('tr')
                    .selectAll('td')
                    .data(function(row) {
                        return _.map(columns, function(column) {
                            var cell = {};
                            var funcName = 'call' + _.upperFirst(column.name);

                            cell.html = self[funcName] ? self[funcName](row, supportData.name, supports) : '-';
                            cell['text-align'] = column['text-align'] || 'center';

                            return cell;
                        });
                    }).enter()
                    .append('td')
                    .style('text-align', ƒ('text-align'))
                    .html(ƒ('html'));

            return self;
        };

        /**
         * Créer le chemin entre les deux entités
         *
         * @param  {Object} data
         * @param  {String} parent
         * @return {String} html
         */
        self.callRelation = function(data, parent, supports) {
            var html = '';
            var endingSupport = _.find(supports, { key: data.name });
            var startingSupport = _.find(supports, { key: parent });

            html += self.createHtmlLabel(startingSupport.name, startingSupport.color, true);
            html += '<span class="ngD3-legend-table-label-separator">•••</span>';
            html += self.createHtmlLabel(endingSupport.name, endingSupport.color);

            return html;
        };

        /**
         * Retourne la value de la transaction
         *
         * @param  {Object} data
         * @return {String} html
         */
        self.callValue = function(data) {
            return data.size;
        };

        /**
         * Retourne la value de la transaction
         *
         * @param  {Object} data
         * @return {String} html
         */
        self.callRelativeValue = function(data) {
            return (Math.round(data.size / pvs.total * 1000) / 100) + '%';
        };

        /**
         * Créer un label html
         *
         * @param  {String} text
         * @param  {Bool}   isArrow
         * @return {String} html
         */
        self.createHtmlLabel = function(text, color, isArrow) {
            var html = '';
            var lighten = ngD3.helpers.lighten(color, 0.80);

            html += '<span class="ngD3-legend-table-label" style="border: 1px solid ' + color + '; background-color: ' + lighten + '; color: ' + color + '">';

            if (isArrow) {
                html += '<span class="ngD3-legend-table-label-arrow" style="border-color: transparent transparent transparent ' + color + ';">';
                html += '<span style="border-color: transparent transparent transparent ' + lighten + ';"></span>';
                html += '</span>';
            }

            html += text + '</span>';

            return html;
        };

        /**
         * Retourne le total des data
         * pour une matrice donnée
         *
         * @param  {Array} matrix
         * @return {Number} total
         */
        self.getSumMatrix = function(matrix) {
            var pretotal = _.map(matrix, function(entry) {
                return _.sum(entry);
            });

            return _.sum(pretotal);
        };

        /**
         * @private
         * Déssine les bases du tableaux
         *
         * @param  {Object} table
         */
        function _drawTable(table) {
            self.element = table;
            var columns = pvs.parent.parameters.columns;

            self.element.append('thead').append('tr')
                .selectAll('th')
                .data(columns)
                .enter()
                    .append('th')
                    .style('text-align', function(d) { return d['text-align'] || 'left'; })
                    .text(ƒ('head'));

            d3.select(self.element.node().parentNode)
                .transition()
                .duration(1000)
                .style('opacity', 1);
        }
    };


    module.exports = exports = function(chart, ngD3) {
        return new LegendTable(chart, ngD3);
    };
})();
