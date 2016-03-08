(function() {
    'use strict';

    var BubbleLegend = function BubbleLegend(bubble, ngD3) {
        var self = this;
        var pvs;

        var options = {
            tooltip: {
                use: true,
                groupBy: 'groups'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
        };

        /**
         * Render the chart
         *
         * @param  {Object} pvs
         * @return {Object} self
         */
        self.render = function(_pvs) {
            pvs = _pvs;
            self.tooltip = ngD3.tooltip.create();

            return self.tooltip;
        };

        self.mousemove = function() {
            return self.tooltip
                .style('top', (d3.event.pageY - 10) + 'px')
                .style('left', (d3.event.pageX + 10) + 'px');
        };

        self.mouseleave = function() {
            self.tooltip.style('opacity', '0');
        };

        /**
         * Affiche la modal du bubble au hover
         *
         * @param  {Object} d
         * @return {Object} self
         */
        self.mouseover = function mouseover(d) {
            var color = bubble.options.color[d.packageName] ? bubble.options.color[d.packageName] : '#F0F0F0';

            self.tooltip.text(d.className + ': ' + pvs.format(d.value));
            self.tooltip.style('opacity', '1');
            self.tooltip.style('border', '1px solid ' + color);
        };

        /**
         * Initie la légend pour le sunburst
         */
        function _init() {
            options = ngD3.helpers.extend({}, options, bubble.options.legend);
        }

        _init();
        return self;
    };

    module.exports = exports = function(bubble, ngD3) {
        return new BubbleLegend(bubble, ngD3);
    };
})();
