(function() {
    'use strict';

    var BubbleLegend = function BubbleLegend(bubble, ngD3) {
        var self = this;

        var options = {
            tooltip: {
                use: true
            }
        };

        /**
         * Render the chart
         *
         * @param  {Object} pvs
         * @return {Object} self
         */
        self.render = function(pvs) {
            self.tooltip = ngD3.tooltip.create();
        };

        /**
         * Affiche la modal du bubble au hover
         *
         * @param  {Object} d
         * @return {Object} self
         */
        self.mouseover = function mouseover(d) {
            //ngD3.tooltip.generate(d);
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
