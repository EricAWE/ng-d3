module.exports = function(ngD3) {
    'use strict';

    var pvs = {
        format: null,
        bubble: null,
        svg: null,
        width: null,
        height: null,
        data: null
    };

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

        pvs.format = d3.format(',d');
        pvs.bubble = d3.layout.pack()
            .sort(function(a, b) { return b.value - a.value; })
            .padding(1.5);

        pvs.svg = d3.select(self.container).append('svg');

        self.width(self.options.width || 800);
        self.height(self.options.height || 500);
        self.fill = d3.scale.ordinal()
           .range(self.options.fill);

        legend = require('./legend')(self, ngD3);
    }

    /**
     * Met à jour le chord
     *
     * @param  {Object} data
     */
    function update(newData) {

        if (newData) {
            pvs.data = newData;
        }

        self.render();
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        pvs.bubble.size([pvs.width, pvs.height]);

        pvs.svg = d3.select(self.container).append('svg')
            .attr('width', pvs.width)
            .attr('height', pvs.height)
            .attr('class', 'bubble');

        var node = pvs.svg.selectAll('.node')
            .data(pvs.bubble.nodes(ngD3.helpers.bubble.classes(pvs.data))
            .filter(function(d) { return !d.children; }))
            .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        node.append('circle')
            .attr('r', function(d) { return d.r; })
            .style('fill', function(d) { return self.options.color[d.packageName] ? self.options.color[d.packageName] : '#F0F0F0'; });

        node.selectAll('circle')
            .on('mouseover', legend.mouseover)
            .on('mousemove', legend.mousemove)
            .on('mouseout', legend.mouseleave);

        node.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .style('fill', '#F0F0F0')
            .style('font-size', '12px')
            .text(function(d) { return d.className.substring(0, d.r / 4); });

        legend.render(pvs);
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
            return pvs.width;
        }

        pvs.width = newWidth;
        pvs.svg.attr('width', pvs.width);

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

        return self;
    }
};
