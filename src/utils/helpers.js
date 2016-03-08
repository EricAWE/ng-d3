var Helpers = function Helpers() {
    'use strict';

    var self = {
        chord: {
            groupTicks: groupTicks,
            fade: fade,
            arcTween: arcTweenChord,
            chordTween: chordTween
        },
        bubble: {
            classes: classesBubble
        },
        sunburst: {
            stash: stash,
            arcTween: arcTweenSunburst,
            getAncestors: getAncestors
        },
        extend: extend
    };

    return self;

    /**
     * Extend parameters
     *
     * @param  {Object} out
     * @return {Object} extended
     */
    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) {
                continue;
            }

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        out[key] = extend(out[key], obj[key]);
                    }
                    else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    }

    /**
     * Stash the old values for transition.
     *
     * @param  {Object} d
     * @return {Object} stashes
     */
    function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
    }

    /**
     * Given a node in a partition layout, return an array of all of its ancestor
     * nodes, highest first, but excluding the root.
     *
     * @param  {Object} node
     * @return {Object} path
     */
    function getAncestors(node) {
        var path = [];
        var current = node;

        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }

        return path;
    }

    /**
     * Interpolate the arcs in data space
     *
     * @param  {Object} a
     * @return {Object} arcs
     */
    function arcTweenSunburst(a, arc) {
        var b;
        var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);

        return function(t) {
            b = i(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        };
    }

    /**
     * Returns a flattened hierarchy containing all leaf nodes under the root
     *
     * @param  {Object} root
     * @return {Object} classes
     */
    function classesBubble(root) {
        var classes = [];

        /**
         * recursive function for classes
         */
        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    /**
     * Format les ticks pour le chord
     *
     * @param {Object} data
     */
    function groupTicks(d) {
        var k = (d.endAngle - d.startAngle) / d.value;

        return d3.range(0, d.value, 1000).map(function(v, i) {
            return {
                angle: v * k + d.startAngle,
                label: i % 5 ? null : v / 1000 + 'k'
            };
        });
    }

    /**
     * Returns an event handler for fading a given chord group.
     *
     * @param  {Number} opacity
     * @param  {Object} svg
     * @return {Object} svgs
     */
    function fade(opacity, svg) {
        return function(g, i) {
            svg.selectAll('g.chord path')
            .filter(function(d) { return d.source.index !== i && d.target.index !== i; })
            .transition()
            .style('opacity', opacity);
        };
    }

    /**
     * Interpolate the arcs
     *
     * @param  {Object} arcSvg
     * @param  {Object} old
     * @return {Object} arcs
     */
    function arcTweenChord(arcSvg, old) {
        return function(d, i) {
            i = d3.interpolate(old.groups[i], d);

            return function(t) {
                return arcSvg(i(t));
            };
        };
    }

    /**
     * Interpolate the chords
     *
     * @param  {Object} chordSvg
     * @param  {Object} old
     * @return {Object} tweens
     */
    function chordTween(chordSvg, old) {
        return function(d, i) {
            i = d3.interpolate(old.chords[i], d);

            return function(t) {
                return chordSvg(i(t));
            };
        };
    }

};

module.exports = new Helpers();
