/*jslint browser:true this:true multivar:true*/
/*global jQuery, window*/
/**
 * @author Dan Bettles <danbettles@yahoo.co.uk>
 * @license http://opensource.org/licenses/MIT MIT
 */

(function (jQuery, window) {
    "use strict";

    var CSS_CLASS_VISIBLE = "jquery-slideshow-visible",
        DIMENSION_WIDTH = "width",
        DIMENSION_HEIGHT = "height",
        SIZE_MAX_CONTENT = "max-content",
        SIZE_AUTO = "auto";

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
                delay: 7000,
                width: SIZE_MAX_CONTENT,
                height: SIZE_MAX_CONTENT,
                stopOnHover: true
            }, options));
    }

    Slideshow.prototype = {

        /**
         * Sets the ID of the (`window`) interval used to advance the slideshow.
         *
         * @private
         * @param {Number} intervalId
         * @returns {Slideshow} this
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
         * @returns {Slideshow} this
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
         * @private
         * @returns {jQuery}
         */
        getSlideEls: function () {
            return this.getDeckEl().children();
        },

        /**
         * @private
         * @param {Object} options
         * @returns {Slideshow} this
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
         * @returns {Slideshow} this
         */
        showSlide: function ($slide) {
            $slide
                .css("z-index", 3)
                .addClass(CSS_CLASS_VISIBLE);

            return this;
        },

        /**
         * @private
         * @param {jQuery} $from
         * @param {jQuery} $to
         * @returns {Slideshow} this
         */
        transitionBetweenSlides: function ($from, $to) {
            var slideshow = this;

            $to
                .css("z-index", 2)
                .show();

            $from.fadeOut(700, function () {
                $from
                    .css("z-index", 1)
                    .removeClass(CSS_CLASS_VISIBLE);

                slideshow.showSlide($to);
            });

            return this;
        },

        /**
         * @private
         * @param {String} dimension
         * @param {Number|String} size
         * @returns {Slideshow} this
         */
        setDimensionSize: function (dimension, size) {
            var finalSize;

            finalSize = size;

            switch (size) {
            case SIZE_MAX_CONTENT:
                finalSize = 0;

                this.getSlideEls().each(function () {
                    var $slide = jQuery(this),
                        outerSizeMethodName,
                        currSize;

                    outerSizeMethodName = "outer" + dimension.substr(0, 1).toUpperCase() + dimension.substr(1);
                    currSize = $slide[outerSizeMethodName](true);

                    if (currSize > finalSize) {
                        finalSize = currSize;
                    }
                });

                break;

            case SIZE_AUTO:
                finalSize = "";
                break;
            }

            jQuery()
                .add(this.getDeckEl())
                .add(this.getSlideEls())
                .css(dimension, finalSize);

            return this;
        },

        /**
         * Recalculates the width and height of the deck and each of the slides.
         *
         * @private
         * @returns {Slideshow} this
         */
        resize: function () {
            return this
                .setDimensionSize(DIMENSION_WIDTH, this.getOptions().width)
                .setDimensionSize(DIMENSION_HEIGHT, this.getOptions().height);
        },

        /**
         * @private
         * @returns {Slideshow} this
         */
        showNextSlide: function () {
            var $currSlide,
                $nextSlide;

            if (this.getSlideEls().size() <= 1) {
                return;
            }

            $currSlide = this.getSlideEls().filter("." + CSS_CLASS_VISIBLE);

            $nextSlide = $currSlide.next();

            if (!$nextSlide.size()) {
                $nextSlide = this.getSlideEls().first();
            }

            this.transitionBetweenSlides($currSlide, $nextSlide);

            return this;
        },

        /**
         * @returns {Slideshow} this
         */
        start: function () {
            var slideshow = this,
                intervalId;

            intervalId = window.setInterval(function () {
                slideshow.showNextSlide();
            }, this.getOptions().delay);

            this.setIntervalId(intervalId);

            return this;
        },

        /**
         * @returns {Slideshow} this
         */
        stop: function () {
            window.clearInterval(this.getIntervalId());
            this.setIntervalId(undefined);

            return this;
        },

        /**
         * Sets-up the GUI.
         *
         * @returns {Slideshow} this
         */
        setUp: function () {
            var slideshow = this;

            this.getDeckEl().css({
                position: "relative"
            });

            this.getSlideEls().css({
                position: "absolute",
                zIndex: 1
            });

            this.resize();

            this.showSlide(this.getSlideEls().first());

            jQuery(window).resize(function () {
                slideshow.resize();
            });

            this.getDeckEl().hover(function () {
                if (slideshow.getOptions().stopOnHover) {
                    slideshow.stop();
                }
            }, function () {
                if (slideshow.getOptions().stopOnHover) {
                    slideshow.start();
                }
            });

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
                (new Slideshow(jQuery(this), options || {}))
                    .setUp()
                    .start();
            });
        }
    });
}(jQuery, window));
