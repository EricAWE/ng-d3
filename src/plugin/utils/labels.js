var Tooltip = function Tooltip() {
    'use strict';

    var pvs;
    var self = {
        tooltip: null,
        create: createTooltip,
        hide: hideTooltip,
        render: renderTooltip,
        mousemove: mousemoveTooltip,
        mouseleave: mouseleaveTooltip,
        mouseover: mouseoverTooltip,
    };

    return self;

    /**
     * Crée une tooltip
     *
     * @return {Object} tooltip
     */
    function createTooltip() {
        var tooltip = d3.select('body')
            .append('div')
            .attr('class', 'ngD3-animate')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('opacity', '0')
            .style('color', 'rgba(0, 0, 0, 0.9)')
            .style('padding', '10px')
            .style('background-color', 'rgba(250, 250, 250, 0.95)')
            .style('border', '1px solid rgba(0, 0, 0, 0.1)')
            .style('border-radius', '5px')
            .style('box-shadow', '0 0 10px rgba(0,0,0,0.2)')
            .style('font', '10px sans-serif')
            .text('tooltip');

        return tooltip;
    }

    /**
     * Cache une tooltip
     *
     * @param  {Object} tooltip
     * @return {Oject} tooltip
     */
    function hideTooltip(tooltip) {
        tooltip.style('opacity', '1');

        return tooltip;
    }

    /**
     * Render the chart
     *
     * @param  {Object} pvs
     * @return {Object} self
     */
    function renderTooltip(_pvs) {
        pvs = _pvs;
        self.tooltip = self.create();

        return self.tooltip;
    }

    /**
     * Action de la tooltip
     * quand la souris est en mouvement
     *
     */
    function mousemoveTooltip() {
        return self.tooltip
            .style('top', (d3.event.pageY - 10) + 'px')
            .style('left', (d3.event.pageX + 10) + 'px');
    }

    /**
     * Action de la tooltip
     * quand la souris quitte
     *
     */
    function mouseleaveTooltip() {
        self.tooltip.style('opacity', '0');
    }

    /**
     * Affiche la modal du bubble au hover
     *
     * @param  {Object} d
     * @return {Object} self
     */
    function mouseoverTooltip(chart, d) {
        var color = _.find(chart.options.supports, {key: d.className}) ? _.find(chart.options.supports, {key: d.className}).color : '#F0F0F0';

        self.tooltip.text(d.className + ': ' + pvs.format(d.value));
        self.tooltip.style('opacity', '1');
        self.tooltip.style('border', '1px solid ' + color);
    }
};

module.exports = new Tooltip();
