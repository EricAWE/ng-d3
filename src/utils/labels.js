var Tooltip = function Tooltip() {
    'use strict';

    var self = {
        create: create,
        generate: generateTooltip
    };

    return self;

    /**
     * Crée une tooltip
     *
     */
    function create() {
        var tooltip = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'visible')
            .style('color', 'white')
            .style('padding', '8px')
            .style('background-color', 'rgba(0, 0, 0, 0.75)')
            .style('font', '12px sans-serif')
            .text('tooltip');

        return tooltip;
    }

    /**
     * Gnére une tooltip
     *
     * @param {Object} d
     */
    function generateTooltip(d) {
        console.log(d);
    }

};

module.exports = new Tooltip();
