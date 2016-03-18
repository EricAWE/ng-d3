var Helpers = function Helpers() {
    'use strict';

    var self = {
        chord: {
            classes: classesChord,
            groupTicks: groupTicks,
            fade: fade,
            arcTween: arcTweenChord,
            chordTween: chordTween,
            sortSupports: sortSupports
        },
        bubble: {
            classes: classesBubble
        },
        sunburst: {
            stash: stash,
            arcTween: arcTweenSunburst,
            getAncestors: getAncestors
        },
        lighten: lighten,
        extend: extend
    };

    return self;

    /**
     * Lighten or darken an hexa color
     *
     * @param  {String} hex
     * @param  {Number} lum
     * @return {String} rgb
     */
    function lighten(hex, lum) {
        var rgb;

        if (hex.length > 7 ) {
            rgb = shadeRGBColor(hex, lum);
        }
        else {
            rgb = shadeColor2(hex, lum);
        }

        return rgb;
    }

    /**
     * Shade rgb color
     *
     * @param  {String} color
     * @param  {Number} percent
     * @return {String} rgb
     */
    function shadeRGBColor(color, percent) {
        var f = color.split(',');
        var t = percent < 0 ? 0 : 255;
        var p = percent < 0 ? percent * -1 : percent;
        var R = parseInt(f[0].slice(4));
        var G = parseInt(f[1]);
        var B = parseInt(f[2]);

        return 'rgb(' + (Math.round((t - R) * p) + R) + ',' + (Math.round((t - G) * p) + G) + ',' + (Math.round((t - B) * p) + B) + ')';
    }

    /**
     * Shade rgb color
     *
     * @param  {String} color
     * @param  {Number} percent
     * @return {String} rgb
     */
    function shadeColor2(color, percent) {
        var f = parseInt(color.slice(1), 16);
        var t = percent < 0 ? 0 : 255;
        var p = percent < 0 ? percent * -1 : percent;
        var R = f >> 16;
        var G = f >> 8 & 0x00FF;
        var B = f & 0x0000FF;

        return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    /**
     * Returns a color array in the right order from data
     *
     * @param  {Object} data
     * @param  {Object} supports
     * @return {Array}  colorArray
     */
    function sortSupports(data, supports) {
        var suportsArray = [];

        data.children.forEach(function(children) {
            var support = _.find(supports, {key: children.name});

            suportsArray.push(support);
        });

        return suportsArray;
    }

    /**
     * Returns a flattened hierarchy containing all leaf nodes under the root
     * for the chord diagram
     *
     * @param  {Object} root
     * @return {Array}  data
     */
    function classesChord(root) {
        var data = [];

        root.children.forEach(function(children) {
            var childArray = [];

            children.children.forEach(function(value) {
                childArray.push(value.size);
            });

            data.push(childArray);
        });

        return data;
    }

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
    function fade(g, i, opacity, svg) {
        return svg.selectAll('g.chord path')
            .filter(function(d) { return d.source.index !== i && d.target.index !== i; })
            .transition()
            .style('opacity', opacity);
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
