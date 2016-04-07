var Helpers = function Helpers() {
    'use strict';

    var COLORS = ['#3daadf', '#fd5154', '#59da80', '#f5af05', '#8e44ad', '#F89406', '#1abc9c', '#5b5b5b'];
    var self = {
        chord: {
            classes: classesChord,
            groupTicks: groupTicks,
            fade: fade,
            arcTween: arcTweenChord,
            chordTween: chordTween,
            sortSupports: sortSupports,
            recalculateData: recalculateData,
            completeResults: _completeResults
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
        extend: extend,
        generateSupports: generateSupports
    };

    return self;

    /**
     * recalculateData for the chord
     *
     * @param  {Object} supports
     * @param  {Array}  oldData
     * @return {Array}  data
     */
    function recalculateData(sortSupports, oldData) {
        console.log(sortSupports, oldData);

        return [];
    }

    /**
     * Return supports generated
     *
     * @param  {Mixed} supports
     * @param  {Array} colors
     * @return {Array} supports
     */
    function generateSupports(_supports, data, _colors) {
        var supports = [];
        var support = {};
        var colors = _colors || COLORS;

        if (typeof _supports === 'object') {
            supports = _supports;
        }
        else {
            var i = 0;
            var uniques = _getUniquesSupports(data.children);

            _.forEach(uniques, function(key) {
                i = colors.length > i ? i : 0;
                support = {
                    name: key,
                    key: key,
                    color: colors[i]
                };

                supports.push(support);
                i++;
            });
        }

        return supports;
    }

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
        var test = [];

        root.children.forEach(function(children) {
            test.push(children.name);
            var childArray = [];

            children.children.forEach(function(value) {
                childArray.push(value.size);
            });

            data.push(childArray);
        });

        return data;
    }

    /**
     * Complete data that is uncomplete for the matrix
     *
     * @param  {Object} data
     * @return {Object} children
     */
    function _completeResults(data) {
        var isExist;
        var newChild;
        var oldChild;
        var uniques = _getUniquesSupports(data);

        // Attribution d'une valeur à zéro si la valeur n'existe pas
        _.forEach(data, function(v, i) {
            _.forEach(v.children, function(child) {
                isExist = _.find(data, {name: child.name});

                if (!isExist) {
                    newChild = {name: child.name, children: []};

                    _.forEach(uniques, function(key) {
                        newChild.children.push({name: key, size: 0});
                    });

                    data.push(newChild);
                }

                _.forEach(uniques, function(key) {
                    var isKeyExist = _.find(v.children, {name: key});

                    if (!isKeyExist) {
                        data[i].children.push({name: key, size: 0});
                    }
                });
            });
        });

        // Range ensuite les data dans le même ordre
        // pour éviter toutes confusions avec la matrix
        _.forEach(data, function(v, i) {
            newChild = [];
            _.forEach(uniques, function(key) {
                oldChild = _.find(v.children, {'name': key});
                newChild.push(oldChild);
            });

            data[i].children = newChild;
        });

        return data;
    }

    /**
     * Returns unqiues supports
     *
     * @param  {Object} data
     * @return {Array} uniques
     */
    function _getUniquesSupports(data) {
        var uniquesNames = _.map(data, function(d) { return d.name; });
        var uniques = _.chain(data)
            .map(function(d) { return _.map(d.children, function(v) { return v.name; }); })
            .concat(uniquesNames)
            .flatten()
            .uniq()
            .value();

        return uniques;
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
    function groupTicks(d, maxResult) {
        var groups = {
            1: {v: 1},
            2: {v: 1},
            3: {v: 10},
            4: {v: 100},
            5: {v: 1000},
        };
        var group = groups[maxResult.toString().length];
        var k = (d.endAngle - d.startAngle) / d.value;

        return d3.range(0, d.value, group.v).map(function(v, i) {
            return {
                angle: v * k + d.startAngle,
                label: i % 5 || v === 0 ? null : _formatKilo(v)
            };
        });
    }

    /**
     * Format number in kilo if > 1000
     *
     * @param  {Number} num
     * @return {Number} result
     */
    function _formatKilo(num) {
        return num > 999 ? num / 1000 + 'k' : num;
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
