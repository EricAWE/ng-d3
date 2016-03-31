(function() {
    'use strict';

    var SunburstLegend = function SunburstLegend(sunburst, ngD3) {
        var self = this;
        var options = {
            trail: {
                height: 75,
                width: null,
                b: { w: 75, h: 30, s: 3, t: 10 }
            },
            desc: 'of the total'
        };

        /**
         * Créer la legend pour le sunburst
         *
         * @param  {Object} svg
         * @return {Object} self
         */
        self.render = function renderLegend(_sunburst) {
            sunburst = _sunburst;

            var explanationTop = options.trail.b.h ? ((sunburst.height * 0.5) - (options.trail.b.h * 1)) : ((sunburst.height * 0.5) - (sunburst.radius / 2));

            sunburst.svg.append('circle')
                .attr('r', sunburst.radius + 15)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .on('mouseleave', self.mouseout);

            self.explanation
                .style('width', sunburst.radius + 10 + 'px')
                .style('height', sunburst.radius + 10 + 'px')
                .style('left', ((sunburst.width * 0.5) - (sunburst.radius * 0.5)) + 'px')
                .style('top', explanationTop + 'px');
        };

        /**
         * Rénitialise le sunburst
         */
        self.mouseout = function() {
            self.explanation.style('visibility', 'hidden');
            self.trail.style('visibility', 'hidden');
            d3.selectAll('path').style('opacity', 1);
        };

        /**
         * Fade les paths necessaires
         * et affiche un pourcentage au hover d'une paths
         *
         * @param {Object} d
         */
        self.mouseover = function(d) {
            var percentage = (100 * d.value / sunburst.totalSize).toPrecision(3);
            var percentageString = percentage + '%';
            var sequenceArray = ngD3.helpers.sunburst.getAncestors(d);

            if (percentage < 0.1) {
                percentageString = '< 0.1%';
            }

            self.explanation.style('visibility', 'visible');
            self.percentage.html(percentageString + '<br><span style="font-size:16px;">' + options.desc + '</span>');

            _updateBreadcrumbs(sequenceArray, percentageString);

            d3.selectAll('path').style('opacity', 0.3);

            sunburst.svg.selectAll('path')
                .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                })
                .style('opacity', 1);
        };

        /**
         * Update the breadcrumb trail to show the current sequence and percentage.
         *
         */
        function _updateBreadcrumbs(nodeArray, percentageString) {

            var g = self.trail
                .selectAll('g')
                .data(nodeArray, function(d) { return d.name + d.depth; });
            var entering = g.enter().append('svg:g');

            entering.append('svg:polygon')
                .attr('points', _breadcrumbPoints)
                .style('fill', function(d) { return _.find(options.supports, {key: d.name}) ? _.find(options.supports, {key: d.name}).color : '#F0F0F0'; });

            entering.append('svg:text')
                .attr('x', (options.trail.b.w + options.trail.b.t) / 2)
                .attr('y', options.trail.b.h / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .style('fill', '#ffffff')
                .text(function(d) { return d.name; });

            // Set position for entering and updating nodes.
            g.attr('transform', function(d, i) {
                return 'translate(' + i * (options.trail.b.w + options.trail.b.s) + ', 0)';
            });

            // Remove exiting nodes.
            g.exit().remove();

            // Now move and update the percentage at the end.
            self.trail.select('#endlabel')
                .attr('x', (nodeArray.length + 0.5) * (options.trail.b.w + options.trail.b.s))
                .attr('y', options.trail.b.h / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .text(percentageString);

            // Make the breadcrumb trail visible, if it's hidden.
            self.trail.style('visibility', 'visible');
        }

        /**
         * Generate a string that describes the points of a breadcrumb polygon.
         */
        function _breadcrumbPoints(d, i) {
            var points = [];

            points.push('0,0');
            points.push(options.trail.b.w + ',0');
            points.push(options.trail.b.w + options.trail.b.t + ',' + (options.trail.b.h / 2));
            points.push(options.trail.b.w + ',' + options.trail.b.h);
            points.push('0,' + options.trail.b.h);

            if (i > 0) {
                points.push(options.trail.b.t + ',' + (options.trail.b.h / 2));
            }

            return points.join(' ');
        }

        /**
         * Initie la légend pour le sunburst
         */
        function _init() {
            options = ngD3.helpers.extend({}, options, sunburst.options.legend);
            options.supports = sunburst.options.supports;

            self.explanation = d3.select(sunburst.container)
                .append('div')
                .attr('class', 'ngD3-explanation');

            var contentExplanation = self.explanation
                .append('div')
                .attr('class', 'ngD3-explanation-wrapper');

            self.percentage = contentExplanation.append('span')
                .attr('class', 'ngd3-percentage');

            self.trail = d3.select(sunburst.container)
                .append('svg')
                .style('width', sunburst.width() + 'px')
                .style('height', options.trail.b.h)
                .attr('class', 'ngd3-trail');

            self.trail.append('svg:text')
                .style('fill', '#000');

            return self;
        }

        _init();
        return self;
    };

    module.exports = exports = function(sunburst, ngD3) {
        return new SunburstLegend(sunburst, ngD3);
    };
})();
