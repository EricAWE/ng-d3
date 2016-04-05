module.exports = function(ngD3) {
    'use strict';

    // Initialisation des variables privés
    // necessaires au chart
    var pvs = {
        svg: null,
        chord: null,
        data: null,
        width: null,
        height: null,
        innerRadius: null,
        outerRadius: null,
        comp: null,
        arcSvg: null,
        chordSvg: null,
    };

    // Construction de la class
    var self = {
        options: {},
        chart: 'chord',
        dataType: 'matrix',
        init: init,
        update: update,
        clear: clear,
        render: render,
        width: width,
        height: height,
        data: data,
        matrix: matrix
    };
    var legend = null;

    return self;

    /**
     * Initie le chord
     *
     * @param  {Object} _options
     * @return {Object} self
     */
    function init(_options) {
        self.options = _options;
        self.container = self.options.container;

        pvs.chord = d3.layout.chord()
            .padding(0.05)
            .sortSubgroups(d3.descending);

        pvs.svg = d3.select(self.container)
            .append('svg')
            .append('g');

        self.width(self.options.width || 800);
        self.height(self.options.height || 500);
        _setRadius();

        return self;
    }

    /**
     * Met à jour le chord
     *
     * @param  {Object} data
     */
    function update(newData, options) {
        var arrayValue = [];

        if (options) {
            self.options = options;
            self.width(self.options.width || 800);
            self.height(self.options.height || 500);
            legend.parameters = _.extend(legend.parameters, self.options.legend);
            _setRadius();
        }

        if (newData) {
            newData.children = ngD3.helpers.chord.completeResults(newData.children);
            pvs.data = newData;
            pvs.matrix = ngD3.helpers.chord.classes(pvs.data);

            arrayValue = _.chain(pvs.data.children)
                .map(function(d) { return _.map(d.children, function(o) { return o.size; }); })
                .flattenDeep()
                .value();
            pvs.maxResult = _.max(arrayValue);
            pvs.totalResult = _.sum(arrayValue);
        }

        self.supports = ngD3.helpers.generateSupports(self.options.supports, pvs.data, self.options.colors);
        self.supports = ngD3.helpers.chord.sortSupports(pvs.data, self.supports);

        if (!pvs.chord.matrix()) {
            pvs.chord.matrix(pvs.matrix);
            self.render();
        }
        else {
            var old = {
                groups: pvs.chord.groups(),
                chords: pvs.chord.chords()
            };

            pvs.chord.matrix(pvs.matrix);
            legend.renderMatrix();
            _transition(old);
        }
    }

    /**
     * Clear le chart
     *
     * @return {Object} self
     */
    function clear() {
        d3.select(self.container).selectAll('svg').remove();

        return self;
    }

    /**
     * @private
     * Effectue une transition lors de l'évoltuion
     * d'un chart (data, width, ...)
     *
     * @param {Object} old
     */
    function _transition(old) {
        pvs.svg
            .transition()
            .duration(500)
            .attr('transform', 'translate(' + pvs.width / 2 + ',' + pvs.height / 2 + ')');

        pvs.svg.selectAll('.ticks')
            .transition()
            .duration(0)
            .attr('opacity', 0);

        pvs.svg.selectAll('.arc')
            .data(pvs.chord.groups)
            .transition()
            .duration(1500)
            .attrTween('d', ngD3.helpers.chord.arcTween(pvs.arcSvg, old));

        pvs.svg.selectAll('.chord')
            .selectAll('path')
            .data(pvs.chord.chords)
            .transition()
            .duration(1500)
            .style('fill', function(d) { return _getColor(d.source.index); })
            .attrTween('d', ngD3.helpers.chord.chordTween(pvs.chordSvg, old));

        setTimeout(_drawTicks, 1100);

        // On initialise le tableau si la légende est autorisé
        if (legend.parameters.enable) {
            legend.table.update(self.supports[0], self.supports);
        }
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        legend = require('../../utils/legend')(self, ngD3);
        var groupIds = Math.round(Math.random() * 1000);

        pvs.svg = legend.placeChart()
            .attr('width', pvs.width)
            .attr('height', pvs.height)
            .attr('class', 'ngD3-chart-chord')
            .append('g')
            .attr('transform', 'translate(' + pvs.width / 2 + ',' + pvs.height / 2 + ')');

        var g = pvs.svg.selectAll('.group')
            .data(pvs.chord.groups)
          .enter().append('g')
            .attr('class', 'group');

        g.append('path')
            .attr('class', 'arc')
            .attr('id', function(d) { return 'group' + d.index + '-' + groupIds; })
            .style('fill', function(d) { return _getColor(d.index); })
            .style('stroke', function(d) { return _getColor(d.index); })
            .attr('d', pvs.arcSvg)
            .on('mouseover', _mouseover)
            .on('mouseout', _mouseout);

        // On vérifie que le radius soit suffisant pour pouvoir écrire
        var fontSize;
        var radius = pvs.outerRadius - pvs.innerRadius;

        if (radius > 15) {
            fontSize = (radius / 2) > 12 ? 12 : (radius / 2);
            fontSize = fontSize < 10 ? 10 : fontSize;

            g.append('text')
                .attr('x', 6)
                .attr('dy', function() { return (fontSize / 2) + (radius / 2) - 2; })
                .attr('font-size', fontSize + 'px')
                .style('pointer-events', 'none')
                .filter(_filterChordName)
                .append('textPath')
                .attr('xlink:href', function(d) { return '#group' + d.index + '-' + groupIds; })
                .text(function(d) { return self.supports[d.index].name; });
        }

        pvs.svg.append('g')
            .attr('class', 'chord')
            .selectAll('path')
            .data(pvs.chord.chords)
            .enter().append('path')
                .style('fill', function(d) { return _getColor(d.source.index); })
                .attr('d', pvs.chordSvg)
                .style('opacity', 1);

        // On initialise le tableau si la légende est autorisé
        if (legend.parameters.enable) {
            legend.table.update(self.supports[0], self.supports);
        }

        _drawTicks();
    }

    /**
     * @private
     * Filtre les categories à renvoyer
     *
     * @param  {Object} d
     * @return {Bool}   isLongEnought
     */
    function _filterChordName(d) {
        var percentOccupied = d.value / pvs.totalResult * 100;

        return self.supports[d.index].name.length < 10 && percentOccupied > 5;
    }

    /**
     * @private
     * Retourne la couleur pour le support
     *
     * @return {String} color
     *
     */
    function _getColor(source) {
        return self.supports[source] && self.supports[source].color ? self.supports[source].color : '#F0F0F0';
    }

    /**
     * @private
     * Gestion du hover
     *
     * @param  {Object} g
     * @param  {Number} i
     * @return {Object} fade
     */
    function _mouseover(g, i) {
        // Fade les chords non dépedantes
        ngD3.helpers.chord.fade(g, i, 0.1, pvs.svg);

        // Update le tableau
        legend.table.update(self.supports[i], self.supports);
    }

    /**
     * @private
     * Gestion du mouseout
     *
     * @param  {Object} g
     * @param  {Number} i
     * @return {Object} fade
     */
    function _mouseout(g, i) {
        // Affiche toutes les chords
        ngD3.helpers.chord.fade(g, i, 1, pvs.svg);

        // Update le tableau
    }

    /**
     * @private
     * Dessine les ticks pour le chord
     *
     */
    function _drawTicks() {
        pvs.svg.selectAll('.ticks').remove();

        var ticks = pvs.svg.append('g')
            .attr('class', 'ticks')
            .attr('opacity', 0.1)
            .selectAll('g')
            .data(pvs.chord.groups)
            .enter()
                .append('g')
                .selectAll('g')
                .data(function(d) { return ngD3.helpers.chord.groupTicks(d, pvs.maxResult); })
                .enter()
                    .append('g')
                    .attr('transform', function(d) { return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + pvs.outerRadius + ',0)'; });

        ticks.append('line')
            .attr('x1', 1)
            .attr('y1', 0)
            .attr('x2', 5)
            .attr('y2', 0)
            .style('stroke', '#b9b9b9');

        ticks.append('text')
            .attr('x', 8)
            .attr('dy', '.35em')
        .attr('fill', '#7f7f7f')
            .attr('text-anchor', function(d) { return d.angle > Math.PI ? 'end' : null; })
            .attr('transform', function(d) { return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null; })
            .text(function(d) { return d.label; });

        pvs.svg.selectAll('.ticks').transition()
            .duration(340)
            .attr('opacity', 1);
    }

    /**
     * Met à jour la matrix ou la renvoient
     * si aucun paramètre n'est passé
     *
     * @param  {Object} data
     * @return {Object} data || self
     */
    function matrix(newData) {
        if (!arguments.length) {
            return pvs.matrix;
        }

        pvs.matrix = newData;

        return self;
    }

    /**
     * Met à jour les data ou les renvoient
     * si aucun paramètre n'est passé
     *
     * @param  {Object} data
     * @return {Object} data || self
     */
    function data(newData) {
        if (!arguments.length) {
            return pvs.data;
        }

        pvs.data = newData;

        return self;
    }

    /**
     * Met à jour la width ou la renvoie
     * si aucun paramètre n'est passé
     *
     * @param  {Object} width
     * @return {Object} width || self
     */
    function width(newWidth) {
        if (!arguments.length) {
            return pvs.width;
        }

        pvs.width = newWidth;
        pvs.svg.attr('width', pvs.width);
        d3.select(pvs.svg.node().parentNode).attr('width', pvs.width);

        _setRadius();

        return self;
    }

    /**
     * Met à jour la height ou la renvoie
     * si aucun paramètre n'est passé
     *
     * @param  {Object} height
     * @return {Object} height || self
     */
    function height(newHeight) {
        if (!arguments.length) {
            return pvs.height;
        }

        pvs.height = newHeight;
        pvs.svg.attr('height', pvs.height);
        d3.select(pvs.svg.node().parentNode).attr('height', pvs.height);

        _setRadius();

        return self;
    }

    /**
     * @private
     * Set le radius du chord
     *
     * @param  {Number} radius
     * @return {Object} self
     */
    function _setRadius(radius) {
        if (!arguments.length) {
            radius = Math.min(self.width(), self.height()) * 0.41;
        }

        pvs.innerRadius = radius;
        pvs.outerRadius = pvs.innerRadius * 1.1;

        pvs.arcSvg = d3.svg.arc().innerRadius(pvs.innerRadius).outerRadius(pvs.outerRadius);
        pvs.chordSvg = d3.svg.chord().radius(pvs.innerRadius);

        return self;
    }
};
