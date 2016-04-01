var Resizer = function Resize() {
    'use strict';

    var pvt = {
        attachEvent: null,
        isIE: null,
        requestFrame: null,
        cancelFrame: null,
        raf: null
    };

    var self = {
        addListener: addListener,
        removeListener: removeListener
    };

    _init();

    return self;

    /**
     * Initie la fonction
     */
    function _init() {
        pvt.attachEvent = document.attachEvent;
        pvt.isIE = navigator.userAgent.match(/Trident/);
        pvt.requestFrame = (function() {
            var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
            function(fn) { return window.setTimeout(fn, 20); };

            return function(fn) { return raf(fn); };
        })();

        pvt.cancelFrame = (function() {
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;

            return function(id) { return cancel(id); };
        })();
    }

    /**
     * Resize listener
     */
    function resizeListener(e) {
        var win = e.target || e.srcElement;

        if (win.__resizeRAF__) pvt.cancelFrame(win.__resizeRAF__);

        win.__resizeRAF__ = pvt.requestFrame(function() {
            var trigger = win.__resizeTrigger__;

            trigger.__resizeListeners__.forEach(function(fn) {
                fn.call(trigger, e);
            });
        });
    }

    /**
     * on load
     */
    function objectLoad() {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }

    /**
     * Ajoute un listener sur un element
     */
    function addListener(element, fn) {
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];

            if (pvt.attachEvent) {
                element.__resizeTrigger__ = element;
                element.pvt.attachEvent('onresize', resizeListener);
            }
            else {
                if (getComputedStyle(element).position === 'static') element.style.position = 'relative';
                var obj = element.__resizeTrigger__ = document.createElement('object');

                obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                if (pvt.isIE) element.appendChild(obj);
                obj.data = 'about:blank';
                if (!pvt.isIE) element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    }

    /**
     * Remove l'écoute du resize sur un element
     */
    function removeListener(element, fn) {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);

        if (!element.__resizeListeners__.length) {
            if (pvt.attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    }
};

module.exports = new Resizer();
