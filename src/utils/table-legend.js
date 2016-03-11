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
        self.update = function(supports) {
            self.clear();

            var supportData = _.find(pvs.data.children, {name: supports.key});
            var columns = pvs.parent.parameters.columns;

            self.element.append('tbody')
                .selectAll('tr')
                .data(supportData.children)
                .enter()
                    .append('tr')
                    .selectAll('td')
                    .data(function(row) {
                        return _.map(columns, function(column) {
                            var cell = {};
                            var funcName = 'call' + _.upperFirst(column.name);

                            cell.html = self[funcName] ? self[funcName](row, supportData.name) : 'salut';

                            return cell;
                        });
                    }).enter()
                    .append('td')
                    .html(function(d) { return d.html; });

            return self;
        };

        /**
         * Créer le chemin entre les deux entités
         *
         * @param  {Object} data
         * @param  {String} parent
         * @return {String} html
         */
        self.callRelation = function(data, parent) {
            var html = '';

            html += '<span class="ngD3-legend-table-label">' + parent + '</label>';
            html += '•••';
            html += '<span class="ngD3-legend-table-label">' + data.name + '</label>';

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
                    .text(ƒ('head'));
        }
    };


    module.exports = exports = function(chart, ngD3) {
        return new LegendTable(chart, ngD3);
    };
})();
