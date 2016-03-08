module.exports = function(ngD3) {
    'use strict';

    // Initialisation des variables privés
    // necessaires au chart
    var _svg;
    var _chord;
    var _data;
    var _width;
    var _height;
    var _innerRadius;
    var _outerRadius;
    var _comp;
    var _arcSvg;
    var _chordSvg;
    var _coloring = 'bigger';

    // Construction de la class
    var self = {
        fill: d3.scale.category20c,
        options: {},
        init: init,
        update: update,
        clear: clear,
        render: render,
        width: width,
        height: height,
        data: data
    };

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

        _comp = {
            bigger: function(a, b) { return a.value > b.value ? a : b; },
            smaller: function(a, b) { return a.value < b.value ? a : b; }
        };

        _chord = d3.layout.chord()
            .padding(0.05)
            .sortSubgroups(d3.descending);

        _svg = d3.select(self.container)
            .append('svg');

        self.width(self.options.width || 800);
        self.height(self.options.height || 500);
        _setRadius();

        self.fill = d3.scale.ordinal()
            .range(self.options.fill);

        return self;
    }

    /**
     * Met à jour le chord
     *
     * @param  {Object} data
     */
    function update(newData) {

        if (newData) {
            _data = newData;
        }

        if (!_chord.matrix()) {
            _chord.matrix(_data);
            self.render();
        }
        else {
            var old = {
                groups: _chord.groups(),
                chords: _chord.chords()
            };

            _chord.matrix(_data);
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
        _svg.selectAll('.ticks')
            .transition()
            .duration(0)
            .attr('opacity', 0);

        _svg.selectAll('.arc')
            .data(_chord.groups)
            .transition()
            .duration(1500)
            .attrTween('d', ngD3.helpers.chord.arcTween(_arcSvg, old));

        _svg.selectAll('.chord')
            .selectAll('path')
            .data(_chord.chords)
            .transition()
            .duration(1500)
            .style('fill', function(d) { return self.fill(_comp[_coloring](d.source, d.target).index); })
            .attrTween('d', ngD3.helpers.chord.chordTween(_chordSvg, old));

        setTimeout(_drawTicks, 1100);
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        _svg = d3.select(self.container)
            .append('svg')
            .attr('width', _width)
            .attr('height', _height)
            .append('g')
            .attr('transform', 'translate(' + _width / 2 + ',' + _height / 2 + ')');

        _svg.append('g')
            .selectAll('path')
            .data(_chord.groups)
            .enter().append('path')
                .attr('class', 'arc')
                .style('fill', function(d) { return self.fill(d.index); })
                .style('stroke', function(d) { return self.fill(d.index); })
                .attr('d', _arcSvg)
                .on('mouseover', ngD3.helpers.chord.fade(0.1, _svg))
                .on('mouseout', ngD3.helpers.chord.fade(1, _svg));

        _svg.append('g')
            .attr('class', 'chord')
            .selectAll('path')
            .data(_chord.chords)
            .enter().append('path')
                .style('fill', function(d) { return self.fill(_comp[_coloring](d.source, d.target).index); })
                .attr('d', _chordSvg)
                .style('opacity', 1);

        _drawTicks();
    }

    /**
     * @private
     * Dessigne les ticks pour le chord
     *
     */
    function _drawTicks() {
        _svg.selectAll('.ticks').remove();

        var ticks = _svg.append('g')
            .attr('class', 'ticks')
            .attr('opacity', 0.1)
            .selectAll('g')
            .data(_chord.groups)
            .enter()
                .append('g')
                .selectAll('g')
                .data(ngD3.helpers.chord.groupTicks)
                .enter()
                    .append('g')
                    .attr('transform', function(d) { return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + _outerRadius + ',0)'; });

        ticks.append('line')
            .attr('x1', 1)
            .attr('y1', 0)
            .attr('x2', 5)
            .attr('y2', 0)
            .style('stroke', '#000');

        ticks.append('text')
            .attr('x', 8)
            .attr('dy', '.35em')
            .attr('text-anchor', function(d) { return d.angle > Math.PI ? 'end' : null; })
            .attr('transform', function(d) { return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null; })
            .text(function(d) { return d.label; });

        _svg.selectAll('.ticks').transition()
            .duration(340)
            .attr('opacity', 1);
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
            return _data;
        }

        _data = newData;

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
            return _width;
        }

        _width = newWidth;
        _svg.attr('width', _width);
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
            return _height;
        }

        _height = newHeight;
        _svg.attr('height', _height);
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

        _innerRadius = radius;
        _outerRadius = _innerRadius * 1.1;

        _arcSvg = d3.svg.arc().innerRadius(_innerRadius).outerRadius(_outerRadius);
        _chordSvg = d3.svg.chord().radius(_innerRadius);

        return self;
    }
};
