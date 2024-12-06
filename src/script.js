(async function () {
    /**
     * Copyright Wo-r 2019
     */

    // Helper function to get GitHub user data
    const fetchGitHubData = async (url) => {
        try {
            const response = await $.get(url);
            return response;
        } catch (e) {
            console.error(`Error fetching data from: ${url}`, e);
            return null;
        }
    };

    // Function to fetch and display total followers
    const fetchFollowersCount = async () => {
        const userData = await fetchGitHubData("https://api.github.com/users/wo-r");
        const followersCount = userData ? userData.followers : 0;
        $("#totalFollowers").text(followersCount);
    };

    // Function to fetch and display total repositories
    const fetchRepositoriesCount = async () => {
        const userUrls = ["wo-r", "wo-r-professional", "gradpass"];
        let repositoriesCount = 0;
        let usersProcessed = 0;

        userUrls.forEach(async (username) => {
            const repoData = await fetchGitHubData(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (repoData) {
                repositoriesCount += repoData.length;
            }
            usersProcessed++;
            if (usersProcessed === userUrls.length) {
                $("#totalRepos").text(repositoriesCount);
            }
        });
    };

    // Function to fetch and display best repositories
    const fetchBestRepositories = async () => {
        const userUrls = ["wo-r", "wo-r-professional", "gradpass"];
        const targetRepos = [
            "gradpass.github.io",
            "echo-plus",
            "emulating-the-nintendo-switch",
            "understanding-human-behavior"
        ];
        let bestRepos = [];

        await Promise.all(userUrls.map(async (username) => {
            const repos = await fetchGitHubData(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (repos) {
                const filteredRepos = repos.filter(repo => targetRepos.includes(repo.name));
                bestRepos = bestRepos.concat(filteredRepos);
            }
        }));

        bestRepos.forEach((repo) => {
            $("#bestRepos").append(`
                <a href="${repo.html_url}" tooltip="${repo.description || 'No description available'}" class="cursor-pointer flex-1 text-center select-none">
                    <div class="relative overflow-hidden p-10 font-black bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full flex items-center justify-center">
                        <div class="flex flex-row justify-center items-center">
                            <span>${repo.name}</span>
                        </div>
                    </div>
                </a>
            `);
        });
    };

    // Function to handle disabled elements
    const handleDisabledElements = () => {
        $("[disabled]").each(function () {
            $(this).attr("tooltip", "This is currently not available");
            $(this).find("[ripple]").removeAttr("ripple");
            $(this).children().addClass("hover:opacity-20").parent().addClass("select-none cursor-not-allowed").on("click", function (e) {
                e.preventDefault();
            });
        });
    };

    // Function to handle click events for elements with "goto" attribute
    const setupGotoLinks = () => {
        $("[goto]").click(function () {
            if ($(this).attr("disabled") !== undefined) return;

            const goto = $(this).attr("goto");
            if (goto === "#" || goto === "") return;

            if (goto.includes("https://")) {
                window.open(goto, "_blank");
            } else if (goto.startsWith("#")) {
                const targetElement = $(goto);
                if (targetElement.length) {
                    $('#main').parent().animate({
                        scrollTop: targetElement.offset().top - $('#main').offset().top - 200
                    }, 800);
                }
            } else if (goto.startsWith("/")) {
                window.location.href = goto;
            }
        });
    };

    // Function to manage side menu toggle
    const setupSidemenu = () => {
        if (localStorage.getItem("sidemenu") === "true") {
            $("#sidemenuToggle[type='open']").addClass("invisible");
            $("#showResume[type='navbar']").addClass("invisible");
            $("#navbar").addClass("hidden").parent().addClass("hidden");
            $("#sidemenuBackdrop").removeClass("hidden");
            $("#sidemenu").removeClass("invisible").css("width", "280px");
        }

        $("#sidemenuToggle, #sidemenuBackdrop").on("click mousedown", function (event) {
            const isOpen = $(event.target).parent().parent().attr("type") === "open";
            localStorage.setItem("sidemenu", isOpen ? "true" : "false");

            if (isOpen) {
                $("#sidemenuToggle[type='open']").addClass("invisible");
                $("#showResume[type='navbar']").addClass("invisible");
                $("#navbar").addClass("hidden").parent().addClass("hidden");
                $("#sidemenuBackdrop").removeClass("hidden");
                $("#sidemenu").removeClass("invisible");

                let menuWidth = 0;
                const increaseWidth = setInterval(function () {
                    if (menuWidth >= 280) {
                        clearInterval(increaseWidth);
                    } else {
                        menuWidth += 20;
                        $("#sidemenu").css("width", `${menuWidth}px`);
                    }
                });
            } else {
                $("#sidemenuToggle[type='open']").removeClass("invisible");
                $("#showResume[type='navbar']").removeClass("invisible");
                $("#navbar").removeClass("hidden").parent().removeClass("hidden");
                $("#sidemenuBackdrop").addClass("hidden");
                $("#sidemenu").addClass("invisible");

                let menuWidth = 280;
                const decreaseWidth = setInterval(function () {
                    if (menuWidth === 0) {
                        clearInterval(decreaseWidth);
                    } else {
                        menuWidth -= 20;
                        $("#sidemenu").css("width", `${menuWidth}px`);
                    }
                });
            }
        });
    };

    // Function to handle ripple effect
    const setupRippleEffect = () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) return;

        $("[ripple]").mousedown(function (event) {
            const rippleTarget = $(this);
            const rippleCircle = $("<span></span>");
            const rippleDiameter = Math.max(rippleTarget.width(), rippleTarget.height());
            const rippleRadius = rippleDiameter / 2;

            const offsetX = event.clientX - rippleTarget.offset().left - rippleRadius;
            const offsetY = event.clientY - rippleTarget.offset().top - rippleRadius;

            rippleCircle.css({
                width: rippleDiameter,
                height: rippleDiameter,
                left: offsetX,
                top: offsetY
            }).addClass("ripple");

            rippleTarget.append(rippleCircle);
            rippleCircle.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                rippleCircle.remove();
            });
        });
    };

    // Function to handle tooltips
    const setupTooltips = () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) return;

        const tooltip = $('<div class="tooltip bg-brown-dark rounded-xl p-5 text-zinc-300 font-black z-50 select-none"></div>').appendTo('body');
        let isTooltipVisible = false;

        $('[tooltip]').hover(function () {
            tooltip.text($(this).attr('tooltip')).addClass('show');
            isTooltipVisible = true;
        }, function () {
            tooltip.removeClass('show');
            isTooltipVisible = false;
        });

        $(document).mousemove(function (event) {
            if (isTooltipVisible) {
                const tooltipWidth = tooltip.outerWidth();
                const tooltipHeight = tooltip.outerHeight();
                let tooltipX = event.pageX + 10;
                let tooltipY = event.pageY + 10;

                if (tooltipX + tooltipWidth > $(window).width()) tooltipX = event.pageX - tooltipWidth - 10;
                if (tooltipY + tooltipHeight > $(window).height()) tooltipY = event.pageY - tooltipHeight - 10;
                if (tooltipX < 0) tooltipX = 10;
                if (tooltipY < 0) tooltipY = event.pageY + 10;

                tooltip.css({ left: tooltipX, top: tooltipY });
            }
        });
    };

    // Function to handle popup text animation
    const setupPopupText = () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            $("[popup]").each(function () {
                $(this).removeClass("invisible");
            });
        } else {
            function animatePopupText(element) {
                $(element).removeClass("invisible");

                let text = $(element).text();
                let wrappedText = '';
                let speed = 'slow'; // Default speed

                // Check for speed attribute and set the speed accordingly
                if ($(element).attr('fast') !== undefined) speed = 'fast';
                else if ($(element).attr('moderate') !== undefined) speed = 'moderate';
                else if ($(element).attr('veryFast') !== undefined) speed = 'veryFast';
                else if ($(element).attr('extremelyFast') !== undefined) speed = 'extremelyFast';

                // Adjust the delay based on the speed
                const delay = {
                    fast: 50,
                    moderate: 100,
                    veryFast: 30,
                    extremelyFast: 5,
                    slow: 200
                }[speed];

                // Split the text into words and wrap each word in a span
                const words = text.split(' ');
                words.forEach(word => {
                    if (word.trim()) {
                        wrappedText += `<div class="popup-word flex flex-row">${word.split('').map(letter => `<span class="popup-letter">${letter}</span>`).join('')}</div> `;
                    } else {
                        wrappedText += '<span class="popup-letter">&nbsp;</span>';
                    }
                });

                $(element).html(wrappedText);

                $(element).find('.popup-letter').each(function (index) {
                    $(this).delay(delay * index).queue(function (next) {
                        $(this).addClass('show');
                        next();
                    });
                });
            }

            const observer = new IntersectionObserver((entries, observer) => {
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
    };

    // Wait for document to be ready
    await $(window).ready(async function () {
        // Run all the initialization functions
        await fetchFollowersCount();
        await fetchRepositoriesCount();
        await fetchBestRepositories();
        handleDisabledElements();
        setupGotoLinks();
        setupSidemenu();
        setupRippleEffect();
        setupTooltips();
        setupPopupText();
    })
})();
