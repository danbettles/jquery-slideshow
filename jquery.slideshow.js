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
                delay: 7000,
                height: Slideshow.HEIGHT_EQUALIZE
            }, options));
    }

    /**
     * @type {String}
     */
    Slideshow.CSS_CLASS_VISIBLE = "jquery-slideshow-visible";

    /**#@+
     * @type {String}
     */
    Slideshow.HEIGHT_EQUALIZE = "equalize";
    Slideshow.HEIGHT_AUTO = "auto";
    /**#@-*/

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
            var optionHeight,
                finalHeight;

            optionHeight = this.getOptions().height;

            //Deck and slides:

            finalHeight = optionHeight;

            switch (optionHeight) {
            case Slideshow.HEIGHT_EQUALIZE:
                finalHeight = 0;

                this.getSlideEls().each(function () {
                    var currSlideHeight;

                    currSlideHeight = jQuery(this).outerHeight(true);

                    if (currSlideHeight > finalHeight) {
                        finalHeight = currSlideHeight;
                    }
                });

                break;

            case Slideshow.HEIGHT_AUTO:
                finalHeight = "";
                break;
            }

            jQuery()
                .add(this.getDeckEl())
                .add(this.getSlideEls())
                .css({
                    width: this.getDeckEl().width(),
                    height: finalHeight
                });

            //Deck only:

            this.getDeckEl().css({
                position: "relative"
            });

            //Slides only:

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

            if (this.getSlideEls().size() <= 1) {
                return;
            }

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
                (new Slideshow(jQuery(this), options || {}))
                    .setUp()
                    .start();
            });
        }
    });
}(jQuery, window));
