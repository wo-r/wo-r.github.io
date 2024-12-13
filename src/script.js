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

    // Function to count total amount of blogs
    const fetchTotalBlogs = async () => {
        await $.getJSON('../blogs/blogs.json', function(data) {
            if (data.blogs && Array.isArray(data.blogs)) {
                const visibleBlogs = data.blogs.filter(blog => !blog.locked);
                var totalBlogs = visibleBlogs.length;
                $("#totalBlogs").text(totalBlogs);
            }
        });
    };

    // Function to fetch blogs for the blogs.json file
    const fetchBlogs = async () => {
        await $.getJSON('../blogs/blogs.json', function(blogs) {
            blogs.blogs.sort((a, b) => new Date(b.created) - new Date(a.created))
            $.each(blogs.blogs, async function (index, {locked, name, description, created, PATH}) {
                if (locked)
                    return;

                let date = new Date(created).toLocaleString();
                if (window.location.href.includes("127.0.0.1"))
                    console.log("Current Date:", new Date().toISOString())

                $("#blogs").append(`
                    <a goto="${PATH}" class="cursor-pointer flex-1 select-none">
                        <div ripple class="relative overflow-hidden p-10 bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full">
                            <div class="flex flex-col gap-2 justify-center md:justify-start items-center md:items-start h-full">
                                <h1 class="text-1xl md:text-6xl font-nunitoblack font-black leading-tight tracking-tight">${name}</h1>
                                <span class="text-sm md:text-lg justify-center h-full text-center lg:text-left lg:justify-start items-center lg:items-start">${description}</span>    
                                <span date class="text-sm md:text-lg justify-center text-center lg:text-left lg:justify-start items-center lg:items-start">Written ${date.split(",")[0]} at${date.split(",")[1]}</span>    
                            </div>
                        </div>
                    </a>
                `)
            })
        });
    }

    // Function to allow the navbar to hide while scrolling dowm
    const navbarScroll = async () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
            return;
        } else {
            let prevScrollpos = $("#main").parent().scrollTop();
            await $("#main").parent().scroll(function() {
                let currentScrollPos = $("#main").parent().scrollTop();
                if (prevScrollpos > currentScrollPos) {
                    $('#navbar').parent().removeClass('opacity-0').addClass("py-3 px-4").find("#navbar").removeClass("h-0");
                } else
                    $('#navbar').parent().addClass('opacity-0').removeClass("py-3 px-4").find("#navbar").addClass("h-0");
                prevScrollpos = currentScrollPos;
            });
        }
    }

    // Function to let the user search for blogs
    const searchBlogs = () => {
        $('#search').on('input', function() {
            var search = $(this).val();
            $('#blogs a h1').each(function() {
                if (search.length === 0) {
                    $(this).html($(this).text()).show();
                    $(this).parent().parent().parent().show()
                } else {            
                    if ($(this).text().match(new RegExp(search, "gi")) !== null) {
                        var highlightedText = $(this).text().replace(new RegExp(search, "gi"), `<span class="text-brown-light">$&</span>`);
                        $(this).html(highlightedText).show();
                        $(this).parent().parent().parent().show()
                    } else {
                        $(this).parent().parent().parent().hide()
                    }
                }
            });
        });
    }

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
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        } else {
            if (localStorage.getItem("sidemenu") === "true") {
                $("#sidemenuToggle[type='open']").addClass("invisible");
                $("#showResume[type='navbar']").addClass("invisible");
                $("#navbar").addClass("hidden").parent().addClass("hidden");
                $("#sidemenuBackdrop").removeClass("hidden");
                $("#sidemenu").removeClass("invisible").css("width", "280px");
            }
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
        // Set current year
        $("#currentYear").text(new Date().getFullYear());

        // Run all the initialization functions
        const tasks = [
            fetchFollowersCount,
            fetchRepositoriesCount,
            fetchBestRepositories,
            fetchTotalBlogs,
            fetchBlogs,
            navbarScroll,
            searchBlogs,
            handleDisabledElements,
            setupGotoLinks,
            setupSidemenu,
            setupRippleEffect,
            setupTooltips,
            setupPopupText
        ];
    
        for (let task of tasks) {
            try {
                await task();
            } catch (e) {}
        }
    })
})();
