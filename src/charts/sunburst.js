/* eslint-disable */
module.exports = function(ngD3) {
    'use strict';

    var _format;
    var _sunburst;
    var _radius;
    var _svg;
    var _width;
    var _height;
    var _data;
    var _arc;

    var self = {
        fill: d3.scale.category20c(),
        options: {},
        init: init,
        update: update,
        width: width,
        height: height,
        render: render,
        clear: clear
    };

    return self;

    /**
     * Initie le sunburst
     *
     * @param  {Object} _options
     * @return {Object} self
     */
    function init(_options) {
        self.options = _options;
        self.container = self.options.container;

        _svg = d3.select(self.container).append('svg');

        _sunburst = d3.layout.partition()
            .sort(null)
            .value(function(d) { return 1; });

        self.width(self.options.width || 800);
        self.height(self.options.height || 500);
        self.fill = d3.scale.ordinal()
            .range(self.options.fill);
    };

    /**
     * Met à jour le chord
     *
     * @param  {Object} data
     */
    function update(newData) {

        if (newData) {
            _data = newData;
        }

        self.render();
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        _svg = d3.select(self.container).append('svg')
            .attr('width', _width)
            .attr('height', _height)
          .append('g')
            .attr('transform', 'translate(' + _width * 0.5 + ',' + _height * 0.5 + ')');

        _sunburst.size([2 * Math.PI, _radius * _radius])

        _arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        var path = _svg.datum(_data).selectAll('path')
            .data(_sunburst.nodes)
            .enter().append('path')
                .attr('display', function(d) { return d.depth ? null : 'none'; })
                .attr('d', _arc)
                .style('stroke', '#fff')
                .style('fill', function(d) { return self.fill((d.children ? d : d.parent).name); })
                .style('fill-rule', 'evenodd')
                .each(ngD3.helpers.sunburst.stash);

        d3.selectAll('input').on('change', function change() {
            var value = this.value === 'count' ? function() { return 1; } : function(d) { return d.size; };

            path
                .data(partition.value(value).nodes)
                .transition()
                .duration(1500)
                .attrTween('d', function(a) { arcTween(a, _arc) });
        });
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
        _setRadius();
        _svg.attr('width', _width);

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
        _setRadius();
        _svg.attr('height', _height);

        return self;
    }

    function _setRadius() {
        _radius = Math.min(_width, _height) / 2;
    }
};
