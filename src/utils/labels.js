var Tooltip = function Tooltip() {
    'use strict';

    var self = {
        create: createTooltip,
        hide: hideTooltip
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

};

module.exports = new Tooltip();
