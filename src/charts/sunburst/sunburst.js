module.exports = function(ngD3) {
    'use strict';

    var pvt = {
        sunburst: null,
        radius: null,
        svg: null,
        width: null,
        height: null,
        data: null,
        arc: null,
        totalSize: null,
        explanation: null,
        percentage: null
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
    var legend;

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

        pvt.svg = d3.select(self.container)
            .append('svg')
            .attr('class', 'ngD3-sunburst');

        pvt.sunburst = d3.layout.partition()
            .sort(null)
            .value(function(d) { return d.size; });

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
            pvt.data = newData;
        }

        self.render();
    }

    /**
     * Render le chart sans transition
     *
     */
    function render() {
        self.clear();

        pvt.svg = d3.select(self.container).append('svg')
            .attr('width', pvt.width)
            .attr('height', pvt.height)
            .attr('class', 'ngD3-sunburst')
            .append('g')
                .attr('transform', 'translate(' + pvt.width * 0.5 + ',' + pvt.height * 0.5 + ')');

        legend.render(pvt);

        pvt.sunburst.size([2 * Math.PI, pvt.radius * pvt.radius]);

        pvt.arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        var path = pvt.svg.datum(pvt.data).selectAll('path')
            .data(pvt.sunburst.nodes)
            .enter().append('path')
                .attr('display', function(d) { return d.depth ? null : 'none'; })
                .attr('d', pvt.arc)
                .style('stroke', '#fff')
                .style('fill', function(d) { return self.options.color[d.name] ? self.options.color[d.name] : '#F0F0F0'; })
                .style('fill-rule', 'evenodd')
                .each(ngD3.helpers.sunburst.stash)
                .on('mouseover', legend.mouseover);

        pvt.totalSize = path.data()[0].value;
    }

    /**
     * Clear le chart
     *
     * @return {Object} self
     */
    function clear() {
        d3.select(self.container).selectAll('.ngD3-sunburst').remove();

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
            return pvt.width;
        }

        pvt.width = newWidth;
        _setRadius();
        pvt.svg.attr('width', pvt.width);

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
            return pvt.height;
        }

        pvt.height = newHeight;
        _setRadius();
        pvt.svg.attr('height', pvt.height);

        return self;
    }

    /**
     * Update le radius pour le sunburst
     */
    function _setRadius() {
        pvt.radius = Math.min(pvt.width, pvt.height) / 2;
    }
};
