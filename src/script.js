(async function () {
    /**
     * Copyright Wo-r 2019
     * TODO: clean
     */

    // Get github followers, and repositorys
    try {
        const userUrls = [
            "wo-r",
            "wo-r-professional",
            "gradpass"
        ];

        await $.get("https://api.github.com/users/wo-r", function (data) {
            const followersCount = data.followers;
            $("#totalFollowers").text(followersCount);
        }).fail(function () {
            $("#totalFollowers").text("0");
        });

        let repositoriesCount = 0;
        let usersProcessed = 0;
        userUrls.forEach(async function (username) {
            await $.get(`https://api.github.com/users/${username}/repos?per_page=100`, function (data) {
                repositoriesCount += data.length;
                usersProcessed++;
                if (usersProcessed === userUrls.length) {
                    $("#totalRepos").text(repositoriesCount);
                }
            }).fail(function () {
                usersProcessed++;
                if (usersProcessed === userUrls.length) {
                    $("#totalRepos").text(repositoriesCount);
                }
            });
        });
    } catch (e) {}

    // Get github repos from all and show latest (5 only)
    try {
        const userUrls = [
            "wo-r",
            "wo-r-professional",
            "gradpass"
        ];
    
        const targetRepos = [
            "gradpass.github.io",
            "echo-plus",
            "emulating-the-nintendo-switch",
            "understanding-human-behavior"
        ];
    
        let bestRepos = [];
        await Promise.all(userUrls.map(async (username) => {
            try {
                const response = await $.get(`https://api.github.com/users/${username}/repos?per_page=100`);
                const filteredRepos = response.filter(repo => targetRepos.includes(repo.name));
                bestRepos = bestRepos.concat(filteredRepos);
            } catch (e) {}
        }));
    
        bestRepos.forEach((repo) => {
            $("#bestRepos").append(`
                <a goto="${repo.html_url}" tooltip="${repo.description || "No description available"}" class="cursor-pointer flex-1 text-center select-none">
                    <div ripple class="relative overflow-hidden p-10 font-black bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full flex items-center justify-center">
                        <div class="flex flex-row justify-center items-center">
                            <span>${repo.name}</span>
                        </div>
                    </div>
                </a>
            `);
        });
    } catch (e) {}

    // Disabled
    try {
        $("[disabled]").each(async function () {
            $(this).attr("tooltip", "This is currently not available")
            $(this).find("[ripple]").removeAttr("ripple")
            $(this).children().addClass("hover:opacity-20").parent().addClass("select-none cursor-not-allowed").on("click", async function (e) {
                e.preventDefault()
            })
        })
    } catch (e) {}

    // Goto
    try {
        $("[goto]").click(async function () {
            if ($(this).attr("disabled") != undefined)
                return;
            else if ($(this).attr("goto") == "#" || $(this).attr("goto") == "")
                return;

            if ($(this).attr("goto").includes("https://")) {
                window.open($(this).attr("goto"), "_blank");
            } else if ($(this).attr("goto").startsWith("#")) {
                const targetElement = $($(this).attr("goto"));
                if (targetElement.length) {
                    $('#main').parent().animate({
                        scrollTop: targetElement.offset().top - $('#main').offset().top - 200
                    }, 800);
                }
            } else if ($(this).attr("goto").startsWith("/")) {
                window.location.href = `${$(this).attr("goto")}`;
            }
        });
    } catch (e) {}

    // Sidemenu
    try {
        if (localStorage.getItem("sidemenu") != null && localStorage.getItem("sidemenu") == "true") {
            $("#sidemenuToggle[type=\"open\"]").addClass("invisible");
            $("#showResume[type=\"navbar\"]").addClass("invisible");
            $("#navbar").addClass("hidden").parent().addClass("hidden")
            $("#sidemenuBackdrop").removeClass("hidden")
            $("#sidemenu").removeClass("invisible");
            $("#sidemenu").css("width", "280px")
        }


        $("#sidemenuToggle,#sidemenuBackdrop").on("click mousedown", async function (event) {
            if ($(event.target).parent().parent().attr("type") == "open") {
                localStorage.setItem("sidemenu", true)
                $("#sidemenuToggle[type=\"open\"]").addClass("invisible");
                $("#showResume[type=\"navbar\"]").addClass("invisible");
                $("#navbar").addClass("hidden").parent().addClass("hidden")
                $("#sidemenuBackdrop").removeClass("hidden")
                $("#sidemenu").removeClass("invisible");

                let menuWidth = 0;
                let increaseWidth = setInterval(async function () {
                    if (menuWidth >= 280) {
                        clearInterval(increaseWidth);
                    } else {
                        // Check if the #main width gets smaller than specific tailwind container sizes
                        if ($("#main").width() < 1280 && $(window).width() > 1280) { // XL
                            $("#main").find("[class*=\"lg:\"]").each(async function () {
                                $(this).attr("class", $(this).attr("class").replace("lg:", "1xl:"))
                            })
                        }

                        menuWidth += 20;
                        $("#sidemenu").css("width", `${menuWidth}px`)
                    }
                })
            } else {
                localStorage.setItem("sidemenu", false)
                let menuWidth = 280;
                let increaseWidth = setInterval(async function () {
                    if (menuWidth == 0) {
                        clearInterval(increaseWidth);
                        $("#sidemenuToggle[type=\"open\"]").removeClass("invisible");
                        $("#showResume[type=\"navbar\"]").removeClass("invisible");
                        $("#navbar").removeClass("hidden").parent().removeClass("hidden")
                        $("#sidemenuBackdrop").addClass("hidden")
                        $("#sidemenu").addClass("invisible");
                    } else {
                        $("#main").find("[class*=\"1xl:\"]").each(async function () {
                            $(this).attr("class", $(this).attr("class").replace("1xl:", "lg:"))
                        })

                        menuWidth -= 20;
                        $("#sidemenu").css("width", `${menuWidth}px`)
                    }
                })
            }
        })
    } catch (e) {}

    // Ripple
    try {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            return;
        } else {
            $("[ripple]").mousedown(async function (event) {
                let rippleTarget = $(this);

                let rippleCircle = $("<span></span>");
                let rippleDiameter = Math.max(rippleTarget.width(), rippleTarget.height());
                let rippleRadius = rippleDiameter / 2;

                // Corrected positioning logic
                let offsetX = event.clientX - rippleTarget.offset().left - rippleRadius;
                let offsetY = event.clientY - rippleTarget.offset().top - rippleRadius;

                rippleCircle.css({
                    width: rippleDiameter,
                    height: rippleDiameter,
                    left: offsetX,
                    top: offsetY
                });

                rippleCircle.addClass("ripple");

                rippleTarget.append(rippleCircle);
                rippleCircle.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                    rippleCircle.remove();
                });
            });
        }
    } catch (e) {}

    // Tooltips
    try {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            return;
        } else {
            var tooltip = $('<div class="tooltip bg-brown-dark rounded-xl p-5 text-zinc-300 font-black z-50 select-none"></div>').appendTo('body');

            var isTooltipVisible = false;

            $(document).mousemove(function (event) {
                if (isTooltipVisible) {
                    var tooltipWidth = tooltip.outerWidth();
                    var tooltipHeight = tooltip.outerHeight();

                    var mouseX = event.pageX;
                    var mouseY = event.pageY;

                    var tooltipX = mouseX + 10;
                    var tooltipY = mouseY + 10;

                    if (tooltipX + tooltipWidth > $(window).width()) {
                        tooltipX = mouseX - tooltipWidth - 10;
                    }

                    if (tooltipY + tooltipHeight > $(window).height()) {
                        tooltipY = mouseY - tooltipHeight - 10;
                    }

                    if (tooltipX < 0) {
                        tooltipX = 10;
                    }

                    if (tooltipY < 0) {
                        tooltipY = mouseY + 10;
                    }

                    tooltip.css({
                        left: tooltipX,
                        top: tooltipY
                    });
                }
            });

            // Hover event to show the tooltip
            $('[tooltip]').hover(function () {
                var $this = $(this);
                var tooltipText = $this.attr('tooltip');

                tooltip.text(tooltipText);

                tooltip.addClass('show');
                isTooltipVisible = true;
            }, function () {
                tooltip.removeClass('show');
                isTooltipVisible = false;
            });
        }
    } catch (e) {}

    // Popup text
    try {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            $("[popup]").each(async function () {
                $(this).removeClass("invisible")
            })
        } else {
            function animatePopupText(element) {
                $(element).removeClass("invisible")

                var text = $(element).text();
                var wrappedText = '';
                var speed = 'slow'; // Default speed

                // Check for speed attribute and set the speed accordingly
                if ($(element).attr('fast') !== undefined) {
                    speed = 'fast';
                } else if ($(element).attr('moderate') !== undefined) {
                    speed = 'moderate';
                } else if ($(element).attr('veryFast') !== undefined) {
                    speed = 'veryFast';
                } else if ($(element).attr('extremelyFast') !== undefined) {
                    speed = 'extremelyFast';
                }

                // Adjust the delay based on the speed
                var delay;
                switch (speed) {
                    case 'fast':
                        delay = 50;
                        break;
                    case 'moderate':
                        delay = 100;
                        break;
                    case 'veryFast':
                        delay = 30;
                        break;
                    case 'extremelyFast':
                        delay = 5;
                        break;
                    default:
                        delay = 200; // slow by default
                }

                // Split the text into words and wrap each word in a span
                var words = text.split(' ');
                for (var i = 0; i < words.length; i++) {
                    if (words[i].trim()) { // Ignore empty spaces if any
                        wrappedText += '<div class="popup-word flex flex-row">';
                        for (var j = 0; j < words[i].length; j++) {
                            wrappedText += '<span class="popup-letter">' + words[i][j] + '</span>';
                        }
                        wrappedText += '</div> ';
                    } else {
                        wrappedText += '<span class="popup-letter">&nbsp;</span>'; // For multiple spaces
                    }
                }

                $(element).html(wrappedText);

                // Animate each letter
                $(element).find('.popup-letter').each(function (index) {
                    $(this).delay(delay * index).queue(function (next) {
                        $(this).addClass('show');
                        next();
                    });
                });
            }

            const observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animatePopupText(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            $('[popup]').each(function () {
                observer.observe(this);
            });
        }
    } catch (e) {}
})();