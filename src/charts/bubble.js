module.exports = function(ngD3) {
    'use strict';

    var _format;
    var _bubble;
    var _svg;
    var _width;
    var _height;
    var _data;

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
     * Initie le chord
     *
     * @param  {Object} _options
     * @return {Object} self
     */
    function init(_options) {
        self.options = _options;
        self.container = self.options.container;

        _format = d3.format(',d');
        _bubble = d3.layout.pack()
            .sort(function(a, b) { return b.value - a.value; })
            .padding(1.5);

        _svg = d3.select(self.container).append('svg');

        self.width(self.options.width || 800);
        self.height(self.options.height || 500);
        self.fill = d3.scale.ordinal()
           .range(self.options.fill);
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

        self.render();
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        _bubble.size([_width, _height]);

        _svg = d3.select(self.container).append('svg')
            .attr('width', _width)
            .attr('height', _height)
            .attr('class', 'bubble');

        var node = _svg.selectAll('.node')
            .data(_bubble.nodes(ngD3.helpers.bubble.classes(_data))
            .filter(function(d) { return !d.children; }))
            .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        node.append('title')
            .text(function(d) { return d.className + ': ' + _format(d.value); });

        node.append('circle')
            .attr('r', function(d) { return d.r; })
            .style('fill', function(d) { return self.fill(d.packageName); });

        node.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .text(function(d) { return d.className.substring(0, d.r / 3); });
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
        _svg.attr('height', _height);

        return self;
    }
};
