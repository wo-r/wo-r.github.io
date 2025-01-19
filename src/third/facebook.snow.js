/*!
 * SnowStorm Effect v1.0
 * Original code sourced from Facebook (Meta) 2024
 * Property of Facebook (Meta), all rights reserved.
 *
 * This script creates a snowstorm effect by generating snowflakes that fall randomly across the screen.
 * It was originally developed for Facebook and has been adapted for use in other web environments.
 *
 * Copyright Facebook (Meta) 2024
 * All rights reserved. Unauthorized reproduction or distribution of this code is prohibited.
 *
 * For licensing information, contact Facebook (Meta).
 */
(function ($, window, document) {
    var SnowStorm = function () {
        var self = this;

        // Configuration
        self.excludeMobile = true;
        self.autoStart = true;
        self.flakesMax = 128;
        self.flakesMaxActive = 64;
        self.animationInterval = 33;
        self.useGPU = true;
        self.className = null;
        self.snowColor = "#494327";
        self.snowCharacter = "<div class='w-full transition-all animate-spin select-none'>&bull;</div>";
        self.snowStick = true;
        self.targetElement = $("body")[0];
        self.useMeltEffect = true;
        self.flakeWidth = 8;
        self.flakeHeight = 8;
        self.vMaxX = 2;
        self.vMaxY = 1;
        self.zIndex = 0;
        self.freezeOnBlur = false;

        self.flakes = [];
        self.active = false;
        self.disabled = false;
        self.timer = null;

        // Retrieve snowstorm settings from the HTML container
        var snowContainer = document.getElementById('snowOptions');

        if (snowContainer) {
            self.flakesMax = parseInt(snowContainer.getAttribute('data-flakes-max')) || self.flakesMax;
            self.snowColor = snowContainer.getAttribute('data-snow-color') || self.snowColor;
            self.flakeWidth = parseInt(snowContainer.getAttribute('data-flake-width')) || self.flakeWidth;
            self.flakeHeight = parseInt(snowContainer.getAttribute('data-flake-height')) || self.flakeHeight;
            self.snowCharacter = snowContainer.getAttribute('data-snow-character') || self.snowCharacter;
            self.vMaxX = parseFloat(snowContainer.getAttribute('data-vmax-x')) || self.vMaxX;
            self.vMaxY = parseFloat(snowContainer.getAttribute('data-vmax-y')) || self.vMaxY;
            self.autoStart = snowContainer.getAttribute('data-auto-start') === 'false' ? false : self.autoStart;
            self.useGPU = snowContainer.getAttribute('data-use-gpu') === 'false' ? false : self.useGPU;
            self.snowStick = snowContainer.getAttribute('data-snow-stick') === 'false' ? false : self.snowStick;
            self.excludeMobile = snowContainer.getAttribute('data-exclude-mobile') === 'false' ? false : self.excludeMobile;
        }

        // Properties
        self.h = 0;  // window width
        self.l = 0;  // window height
        self.n = 0;  // half window width
        self.s = 0;  // body height
        self.v = 1;  // speed multiplier
        self.t = false; // use position fixed
        self.w = false; // relative position flag

        // Initializations
        self.init = function () {
            self.resizeHandler();
            self.createSnow(self.flakesMax);
            self.bindEvents();

            if (self.autoStart) {
                self.start();
            }
        };

        // Create snowflakes
        self.createSnow = function (flakeCount) {
            for (var i = 0; i < flakeCount; i++) {
                self.flakes.push(new self.SnowFlake());
            }
        };

        // Snowflake class
        self.SnowFlake = function () {
            var flake = this;
            flake.x = Math.random() * self.h;
            flake.y = -Math.random() * self.l;
            flake.vX = 0;
            flake.vY = 0;
            flake.active = true;

            // Create snowflake element
            flake.o = $('<div>', {
                html: self.snowCharacter,
                class: self.className,
                css: {
                    position: self.t ? 'fixed' : 'absolute',
                    color: self.snowColor,
                    width: self.flakeWidth + 'px',
                    height: self.flakeHeight + 'px',
                    fontFamily: 'arial,verdana',
                    fontWeight: 'normal',
                    zIndex: self.zIndex,
                    cursor: 'default',
                    overflow: 'hidden',
                    lineHeight: self.flakeHeight + 'px',
                    textAlign: 'center',
                    verticalAlign: 'baseline'
                }
            }).appendTo(self.targetElement);

            flake.setVelocities = function () {
                flake.vX = Math.random() * self.vMaxX - self.vMaxX / 2;
                flake.vY = Math.random() * self.vMaxY + 0.2;
            };

            flake.setVelocities();
            flake.move = function () {
                flake.x += flake.vX * self.v;
                flake.y += flake.vY;

                if (flake.x >= self.h || flake.x < 0) flake.x = Math.random() * self.h;
                if (flake.y >= self.l) flake.y = -self.flakeHeight;

                flake.o.css({
                    left: flake.x + 'px',
                    top: flake.y + 'px'
                });
            };
        };

        // Resize handler
        self.resizeHandler = function () {
            self.h = $(window).width() - 16;
            self.l = $(window).height();
            self.s = $('body')[0].scrollHeight;
            self.n = Math.floor(self.h / 2);
        };

        // Scroll handler
        self.scrollHandler = function () {
            var scrollTop = $(window).scrollTop();
            self.flakes.forEach(function (flake) {
                if (!flake.active && self.snowStick) {
                    flake.o.css('top', scrollTop + self.l - self.flakeHeight + 'px');
                }
            });
        };

        // Event bindings
        self.bindEvents = function () {
            $(window).on('resize', function () {
                self.resizeHandler();
                self.restartSnow();
            });

            $(window).on('scroll', function () {
                self.scrollHandler();
            });
        };

        // Restart snowfall on resize
        self.restartSnow = function () {
            self.flakes.forEach(function (flake) {
                flake.o.remove();
            });
            self.flakes = [];
            self.createSnow(self.flakesMax);
        };

        // Start snow animation
        self.start = function () {
            if (self.disabled) return;
            self.active = true;

            function animate() {
                if (!self.active) return;

                self.flakes.forEach(function (flake) {
                    flake.move();
                });

                requestAnimationFrame(animate);
            }

            animate();
        };

        // Stop snow animation
        self.stop = function () {
            self.active = false;
        };

        window.SnowStorm = self
    };

    // Start SnowStorm instance
    new SnowStorm();
})(jQuery, window, document);