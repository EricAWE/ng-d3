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
        options: {},
        chart: 'bubble',
        dataType: 'genealogic',
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
    }

    /**
     * Met à jour le chord
     *
     * @param  {Object} data
     */
    function update(newData, options) {

        if (options) {
            self.options = options;
            self.width(self.options.width || 800);
            self.height(self.options.height || 500);
            legend.parameters = _.extend(legend.parameters, self.options.legend);
        }

        if (newData) {
            pvs.data = newData;
        }

        self.supports = ngD3.helpers.chord.sortSupports(pvs.data, self.options.supports);

        if (!pvs.bubbleData) {
            self.render();
        }
        else {
            legend.renderGenealogic();
            _transition();
        }
    }

    /**
     * @private
     * Fait la transition pour le bubble
     *
     * @param  {Object} old
     */
    function _transition() {
        pvs.bubble.size([self.width(), self.height()]);
        pvs.bubbleData = pvs.bubble.nodes(ngD3.helpers.bubble.classes(pvs.data));

        pvs.svg
            .transition()
            .duration(300)
            .attr('width', self.width())
            .attr('height', self.height());

        pvs.svg.selectAll('.node')
            .data(pvs.bubbleData
                .filter(function(d) { return !d.children; }))
                .transition()
                .duration(400)
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        pvs.svg.selectAll('.circle')
            .data(pvs.bubbleData
            .filter(function(d) { return !d.children; }))
            .transition()
            .duration(400)
            .attr('r', function(d) { return d.r; });
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        legend = require('../../utils/legend')(self, ngD3);

        pvs.bubble.size([pvs.width, pvs.height]);
        pvs.svg = legend.placeChart();
        pvs.bubbleData = pvs.bubble.nodes(ngD3.helpers.bubble.classes(pvs.data));

        pvs.svg
            .attr('width', pvs.width)
            .attr('height', pvs.height)
            .attr('class', 'bubble');

        var node = pvs.svg.selectAll('.node')
            .data(pvs.bubbleData
            .filter(function(d) { return !d.children; }))
            .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function() { return 'translate(' + self.height() / 2 + ',' + self.width() / 2 + ')'; });

        var circles = node.append('circle')
            .attr('class', 'circle')
            .attr('r', function() { return 0; })
            .style('fill', function(d) { return _.find(self.supports, {key: d.className}) ? _.find(self.supports, {key: d.className}).color : '#F0F0F0'; });

        node
            .transition()
            .duration(300)
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        circles
            .transition()
            .duration(500)
            .attr('r', function(d) { return d.r; });

        node.selectAll('circle')
           .on('mouseover', function(d) { ngD3.tooltip.mouseover(self, d); })
           .on('mousemove', ngD3.tooltip.mousemove)
           .on('mouseout', ngD3.tooltip.mouseleave);

        node.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .style('fill', '#F0F0F0')
            .style('font-size', '12px')
            .text(function(d) { return d.className.substring(0, d.r / 4); });

        ngD3.tooltip.render(pvs);
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
