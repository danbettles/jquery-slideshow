/*jslint browser:true this:true multivar:true*/
/*global jQuery, window*/
/**
 * @author Dan Bettles <danbettles@yahoo.co.uk>
 * @license http://opensource.org/licenses/MIT MIT
 */

(function (jQuery, window) {
    "use strict";

    /**
     * @constructor
     * @param {jQuery} $deck
     * @param {Object} options
     */
    function Slideshow($deck, options) {
        this
            .setIntervalId(undefined)
            .setDeckEl($deck)
            .setOptions(jQuery.extend({
                delay: 7000
            }, options));
    }

    /**
     * @type {String}
     */
    Slideshow.CSS_CLASS_VISIBLE = "jquery-slideshow-visible";

    Slideshow.prototype = {

        /**
         * Sets the ID of the (`window`) interval used to advance the slideshow.
         *
         * @private
         * @param {Number} intervalId
         * @returns {Slideshow}
         */
        setIntervalId: function (intervalId) {
            this.intervalId = intervalId;

            return this;
        },

        /**
         * Returns the ID of the (`window`) interval used to advance the slideshow.
         *
         * @private
         * @returns {Number}
         */
        getIntervalId: function () {
            return this.intervalId;
        },

        /**
         * @private
         * @param {jQuery} $deck
         * @returns {Slideshow}
         */
        setDeckEl: function ($deck) {
            this.$deck = $deck;

            return this;
        },

        /**
         * @returns {jQuery}
         */
        getDeckEl: function () {
            return this.$deck;
        },

        /**
         * @returns {jQuery}
         */
        getSlideEls: function () {
            return this.getDeckEl().children();
        },

        /**
         * @private
         * @param {Object} options
         * @returns {Slideshow}
         */
        setOptions: function (options) {
            this.options = options;

            return this;
        },

        /**
         * @returns {Object}
         */
        getOptions: function () {
            return this.options;
        },

        /**
         * Raises the specified slide to the top of the deck, making it visible.
         *
         * @private
         * @param {jQuery} $slide
         * @returns {Slideshow}
         */
        raiseSlide: function ($slide) {
            $slide
                .css("z-index", 3)
                .addClass(Slideshow.CSS_CLASS_VISIBLE);

            return this;
        },

        /**
         * @private
         * @param {jQuery} $from
         * @param {jQuery} $to
         * @returns {Slideshow}
         */
        transitionBetweenSlides: function ($from, $to) {
            var slideshow = this;

            $to
                .css("z-index", 2)
                .show();

            $from.fadeOut(700, function () {
                $from
                    .css("z-index", 1)
                    .removeClass(Slideshow.CSS_CLASS_VISIBLE);

                slideshow.raiseSlide($to);
            });

            return this;
        },

        /**
         * Applies styles to the deck and the slides.
         *
         * @private
         * @returns {Slideshow}
         */
        applyStyles: function () {
            var deckWidth,
                maxSlideHeight = 0;

            this.getDeckEl().css("width", "");

            deckWidth = this.getDeckEl().width();

            this.getSlideEls().css("height", "");

            this.getSlideEls().each(function () {
                var currSlideHeight;

                currSlideHeight = jQuery(this).outerHeight(true);

                if (currSlideHeight > maxSlideHeight) {
                    maxSlideHeight = currSlideHeight;
                }
            });

            jQuery()
                .add(this.getDeckEl())
                .add(this.getSlideEls())
                    .css({
                        width: deckWidth,
                        height: maxSlideHeight
                    });

            this.getDeckEl().css("position", "relative");

            this.getSlideEls().css({
                position: "absolute",
                zIndex: 1
            });

            return this;
        },

        /**
         * Sets-up the GUI.
         *
         * @returns {Slideshow}
         */
        setUp: function () {
            var slideshow = this;

            this.applyStyles();

            this.raiseSlide(this.getSlideEls().first());

            jQuery(window).resize(function () {
                slideshow.applyStyles();
            });

            return this;
        },

        /**
         * @private
         * @returns {Slideshow}
         */
        showNextSlide: function () {
            var $currSlide,
                $nextSlide;

            $currSlide = this.getSlideEls().filter("." + Slideshow.CSS_CLASS_VISIBLE);

            $nextSlide = $currSlide.next();

            if (!$nextSlide.size()) {
                $nextSlide = this.getSlideEls().first();
            }

            this.transitionBetweenSlides($currSlide, $nextSlide);

            return this;
        },

        /**
         * @returns {Slideshow}
         */
        start: function () {
            var slideshow = this,
                intervalId;

            intervalId = window.setInterval(function () {
                slideshow.showNextSlide();
            }, this.getOptions().delay);

            this.setIntervalId(intervalId);

            return this;
        }
    };

    jQuery.fn.extend({

        /**
         * @param {Object} [options]
         * @returns {jQuery}
         */
        slideshow: function (options) {
            return this.each(function () {
                var $deck = jQuery(this),
                    slideshow;

                slideshow = new Slideshow($deck, options || {});

                slideshow
                    .setUp()
                    .start();
            });
        }
    });
}(jQuery, window));
