var Legend = function Legend() {
    'use strict';

    var ngD3;
    var self = {
        parameters: {
            align: 'right',
            enabled: true,
            itemWidth: 10,
            layout: 'vertical'
        },
        init: initLegend,
        render: renderLegend
    };

    return self;

    /**
     * Initie la légend
     *
     */
    function initLegend(parameters, _ngD3) {
        ngD3 = _ngD3;
        parameters.options.legend = parameters.options.legend || {};
        self.parameters = ngD3.helpers.extend({}, self.parameters, parameters.options.legend);

        if (self.parameters.enabled === false) {
            return;
        }

        self.renderLegend();
    }

    /**
     * Créer la légend
     *
     */
    function renderLegend() {
        console.log('YO');
    }
};

module.exports = new Legend();
