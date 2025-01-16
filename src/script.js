(async function () {
    /**
     * Copyright Wo-r 2019
     * 
     * TODO: refresh this crap its old and needs updating lol
     */

    // Checker function to manage theme stuff throughout the site.
    function isThemeEnabled() {
        if (window.location.href.includes("blogs/blog"))
            return true;

        return false;
    }

    // Utility function to check if it's a new day
    const isNewDay = () => {
        const lastUpdated = localStorage.getItem('lastUpdated');
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        return lastUpdated !== today;
    };

    // Utility function to update the last update timestamp
    const updateLastUpdated = () => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastUpdated', today);
    };

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
        if ($("#totalFollowers").length == 0) return;

        if (!isNewDay() && localStorage.getItem('followersCount') != null) {
            // Use the cached value if it's not a new day
            const cachedFollowersCount = localStorage.getItem('followersCount');
            if (cachedFollowersCount) {
                $("#totalFollowers").text(cachedFollowersCount);
            }
            return;
        }

        const userData = await fetchGitHubData("https://api.github.com/users/wo-r");
        const followersCount = userData ? userData.followers : 0;

        // Store the fetched data and the timestamp
        localStorage.setItem('followersCount', followersCount);
        updateLastUpdated();

        $("#totalFollowers").text(followersCount);
    };

    // Function to fetch and display total repositories
    const fetchRepositoriesCount = async () => {
        if ($("#totalRepos").length == 0) return;

        if (!isNewDay() && localStorage.getItem('repositoriesCount') != null) {
            console.log("cached")
            // Use the cached value if it's not a new day
            const cachedRepositoriesCount = localStorage.getItem('repositoriesCount');
            if (cachedRepositoriesCount) {
                $("#totalRepos").text(cachedRepositoriesCount);
            }
            return;
        }

        const userUrls = ["wo-r", "wo-r-professional", "gradpass"];
        let repositoriesCount = 0;
        let usersProcessed = 0;

        // Fetch repository count for each user
        for (const username of userUrls) {
            const repoData = await fetchGitHubData(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (repoData) {
                repositoriesCount += repoData.length;
            }
            usersProcessed++;
            console.log(usersProcessed)
            if (usersProcessed === userUrls.length) {
                // Store the fetched data and the timestamp
                localStorage.setItem('repositoriesCount', repositoriesCount);
                updateLastUpdated();
                $("#totalRepos").text(repositoriesCount);
            }
        }
    };

    // Function to fetch and display best repositories
    const fetchBestRepositories = async () => {
        if ($("#bestRepos").length == 0) return;

        if (!isNewDay() && localStorage.getItem('bestRepos') != null) {
            // Use the cached value if it's not a new day
            const cachedBestRepos = localStorage.getItem('bestRepos');
            if (cachedBestRepos) {
                $("#bestRepos").html(cachedBestRepos);
            }
            return;
        }

        const userUrls = ["wo-r", "wo-r-professional", "gradpass"];
        const targetRepos = [
            "gradpass.github.io",
            "echo-plus",
            "emulating-the-nintendo-switch",
            "understanding-human-behavior"
        ];
        let bestRepos = [];

        // Fetch repositories for each user
        await Promise.all(userUrls.map(async (username) => {
            const repos = await fetchGitHubData(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (repos) {
                const filteredRepos = repos.filter(repo => targetRepos.includes(repo.name));
                bestRepos = bestRepos.concat(filteredRepos);
            }
        }));

        // Cache the best repositories and store them
        let reposHtml = '';
        bestRepos.forEach((repo) => {
            reposHtml += `
            <a href="${repo.html_url}" tooltip="${repo.description || 'No description available'}" class="cursor-pointer flex-1 text-center select-none">
                <div class="relative overflow-hidden p-10 font-black bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full flex items-center justify-center">
                    <div class="flex flex-row justify-center items-center">
                        <span>${repo.name}</span>
                    </div>
                </div>
            </a>
        `;
        });

        // Store the HTML content and update the timestamp
        localStorage.setItem('bestRepos', reposHtml);
        updateLastUpdated();

        // Update the DOM with the fetched HTML
        $("#bestRepos").html(reposHtml);
    };
    
    // Function to count total amount of blogs
    const fetchTotalBlogs = async () => {
        if ($("#totalBlogs").length == 0)
            return;

        await $.getJSON('../blogs/blogs.json', function (data) {
            if (data.blogs && Array.isArray(data.blogs)) {
                const visibleBlogs = data.blogs.filter(blog => !blog.locked);
                var totalBlogs = visibleBlogs.length;
                $("#totalBlogs").text(totalBlogs);
            }
        });
    };

    // Function to fetch blogs for the blogs.json file
    const fetchBlogs = async () => {
        if ($("#blogs").length == 0)
            return;

        await $.getJSON('../blogs/blogs.json', function (blogs) {
            blogs.blogs.sort((a, b) => new Date(b.created) - new Date(a.created))
            $.each(blogs.blogs, async function (index, { locked, name, description, created, PATH }) {
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

    const previewBlogs = async () => {
        if ($("#previewBlogs").length == 0)
            return;

        await $.getJSON('../blogs/blogs.json', function (blogs) {
            blogs.blogs.sort((a, b) => new Date(b.created) - new Date(a.created))
            blogs.blogs = blogs.blogs.filter(blog => blog.locked !== true).slice(0, 2);

            $.each(blogs.blogs, async function (index, { name, description, created, PATH }) {
                let date = new Date(created).toLocaleString();
                $("#previewBlogs").append(`
                    <a goto="${PATH}" class="cursor-pointer flex-1 select-none">
                        <div ripple class="relative overflow-hidden p-10 bg-brown-dark hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition h-full">
                            <div class="flex flex-col gap-2 h-full">
                                <h1 class="text-1xl md:text-2xl font-nunitoblack font-black leading-tight tracking-tight text-center lg:text-left lg:justify-start items-center lg:items-start">${name}</h1>
                                <span class="text-sm justify-center h-full text-center lg:text-left lg:justify-start items-center lg:items-start">${description}</span>    
                                <span date class="text-sm justify-center text-center lg:text-left lg:justify-start items-center lg:items-start">Written ${date.split(",")[0]} at${date.split(",")[1]}</span>    
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

            await $("#main").parent().scroll(function () {
                let currentScrollPos = $("#main").parent().scrollTop();
                const contentHeight = $("#main")[0].scrollHeight;
                const viewportHeight = $("#main").parent()[0].clientHeight + 100;

                if (contentHeight <= viewportHeight) {
                    $('#navbar').parent().removeClass('opacity-0').addClass("py-3 px-4").find("#navbar").removeClass("h-0");
                    return;
                }

                if (currentScrollPos + viewportHeight >= contentHeight - 20) {
                    $('#navbar').parent().addClass('opacity-0').removeClass("py-3 px-4").find("#navbar").addClass("h-0");
                } else {
                    if (prevScrollpos > currentScrollPos) {
                        $('#navbar').parent().removeClass('opacity-0').addClass("py-3 px-4").find("#navbar").removeClass("h-0");
                    } else {
                        $('#navbar').parent().addClass('opacity-0').removeClass("py-3 px-4").find("#navbar").addClass("h-0");
                    }
                }

                prevScrollpos = currentScrollPos;
            });
        }
    }

    // Function to let the user search for blogs
    const searchBlogs = () => {
        if ($("#search").length == 0)
            return;

        $('#search').on('input', function () {
            var search = $(this).val();
            $('#blogs a h1').each(function () {
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

    // Function to initialize multiple galleries, bind events, and control image switching for each gallery
    const galleryController = () => {
        if ($("#gradpass").length == 0)
            return;

        $.getJSON("../portfolio/gallerys/gallerys.json", function (data) {
            $.each(data.gallerys, function (galleryKey, galleryImages) {
                const galleryId = `#${galleryKey}`;

                let currentImageIndex = 0;

                const updateGallery = () => {
                    const currentImage = galleryImages[currentImageIndex];
                    const imagePath = currentImage.PATH;

                    $(`${galleryId} #gallery img`).attr("src", imagePath);

                    if (currentImage.custom_classings != "") {
                        $(`${galleryId} #gallery img`).addClass(currentImage.custom_classings)
                    }

                    if (currentImage.tooltip != "") {
                        $(`${galleryId} #gallery img`).attr("tooltip", currentImage.tooltip);
                        setupTooltips();
                    }

                    $(`${galleryId} .gallery-image`).find("svg").attr("width", "25px").attr("height", "25px")
                        .find("path").attr("d", "M480-34q-92.64 0-174.47-34.6-81.82-34.61-142.07-94.86T68.6-305.53Q34-387.36 34-480q0-92.9 34.66-174.45 34.67-81.55 95.18-141.94 60.51-60.39 142.07-95Q387.48-926 480-926q92.89 0 174.48 34.59 81.59 34.6 141.96 94.97 60.37 60.37 94.97 141.99Q926-572.83 926-479.92q0 92.92-34.61 174.25-34.61 81.32-95 141.83Q736-103.33 654.45-68.66 572.9-34 480-34Zm-.23-136q130.74 0 220.49-89.51Q790-349.03 790-479.77t-89.51-220.49Q610.97-790 480.23-790t-220.49 89.51Q170-610.97 170-480.23t89.51 220.49Q349.03-170 479.77-170Zm.23-310Z");

                    $(`${galleryId} .gallery-image[image='${currentImageIndex + 1}']`).find("svg").attr("width", "35px").attr("height", "35px")
                        .find("path").attr("d", "M480.04-269q87.58 0 149.27-61.73Q691-392.46 691-480.04q0-87.58-61.73-149.27Q567.54-691 479.96-691q-87.58 0-149.27 61.73Q269-567.54 269-479.96q0 87.58 61.73 149.27Q392.46-269 480.04-269ZM480-34q-92.64 0-174.47-34.6-81.82-34.61-142.07-94.86T68.6-305.53Q34-387.36 34-480q0-92.9 34.66-174.45 34.67-81.55 95.18-141.94 60.51-60.39 142.07-95Q387.48-926 480-926q92.89 0 174.48 34.59 81.59 34.6 141.96 94.97 60.37 60.37 94.97 141.99Q926-572.83 926-479.92q0 92.92-34.61 174.25-34.61 81.32-95 141.83Q736-103.33 654.45-68.66 572.9-34 480-34Zm-.23-136q130.74 0 220.49-89.51Q790-349.03 790-479.77t-89.51-220.49Q610.97-790 480.23-790t-220.49 89.51Q170-610.97 170-480.23t89.51 220.49Q349.03-170 479.77-170Zm.23-310Z");
                };

                $(`${galleryId} .gallery-image`).click(function () {
                    const targetImage = $(this).attr("image") - 1;
                    currentImageIndex = targetImage;
                    updateGallery();
                });

                $(`${galleryId} #gallery-image-decrease`).click(function () {
                    if (currentImageIndex > 0) {
                        currentImageIndex--;
                        updateGallery();
                    }
                });

                $(`${galleryId} #gallery-image-increase`).click(function () {
                    if (currentImageIndex < galleryImages.length - 1) {
                        currentImageIndex++;
                        updateGallery();
                    }
                });

                updateGallery();
            });
        });
    };

    // Function using EmailJS to send a feedback form to a target email
    const manageFeedback = async () => {
        $('#message').on('input', function () {
            $(this).css('height', 'auto');
            $(this).css('height', this.scrollHeight + 'px');

            if ($(this).val() != "")
                $("#message").parent().removeClass("border-2 border-red-800 animate-shake");
        });

        if ($("#message").length == 0 || $("#email").length == 0 || $("#name").length == 0 || $("#submit").attr("disabled"))
            return;

        $("#email").on("input", function () {
            if ($(this).val() != "")
                $("#email").parent().removeClass("border-2 border-red-800 animate-shake");
        })

        if ($("#message").length && $("#email").length) {
            await $("#submit").click(async function () {
                if ($("#message").val() != "" && $("#email").val() != "" && $("#email").val().includes("@")) {
                    function sanitizeInput(input) {
                        if (!input) return '';
                        return input.trim().replace(/["'<>&]/g, function (match) {
                            return '&#' + match.charCodeAt(0) + ';';
                        });
                    }

                    let name = $("#name").val() ? sanitizeInput($("#name").val()) : `Anonymous`;
                    let email = sanitizeInput($("#email").val());
                    let message = sanitizeInput($("#message").val());

                    $("#submit").attr("disabled", "");
                    $("#feedbackStatus").removeClass("hidden");
                    $("#feedbackStatus div.p-10").removeClass("scale-95 opacity-0").addClass("scale-100 opacity-100")
                    $("#progressBar").attr("style", "width: 0%;");

                    setTimeout(async function () {
                        await emailjs.init({ publicKey: "9ac5poQVMm8gyPC01" })

                        $("#progressBar").attr("style", `width: ${20 + Math.floor(Math.random() * (20 - 40))}%;`);
                        $("#loadingMessage").text("Initalizing Email.js...");

                        setTimeout(async function () {
                            $("#progressBar").attr("style", `width: ${40 + Math.floor(Math.random() * (40 - 60))}%;`);
                            $("#loadingMessage").text("Getting form data...");

                            let form = {
                                name: name,
                                email: email,
                                message: message,
                            }

                            setTimeout(async function () {
                                $("#progressBar").attr("style", `width: ${70 + Math.floor(Math.random() * (70 - 90))}%;`);
                                $("#loadingMessage").text("Sending message...");
                                setTimeout(async function () {
                                    await emailjs.send("gmail_sender_98wERH34", "feedback_form_98yuadsf9u", form).then(() => {
                                        $("#progressBar").attr("style", "width: 100%;");
                                        $("#loadingMessage").text("Message sent...");
                                        setTimeout(function () {
                                            $("#name").val("")
                                            $("#email").val("")
                                            $("#message").val("")

                                            $('#feedbackStatus').addClass('hidden');
                                        }, 2000)
                                    }, (err) => {
                                        $("#progressBar").attr("style", "width: 0%;");
                                        $("#loadingMessage").html(`Error sending message: <code class="text-sm bg-brown">${err}</code><br>Logged to console...`);
                                        setTimeout(function () {
                                            $("#name").val("")
                                            $("#email").val("")
                                            $("#message").val("")

                                            $('#feedbackStatus').addClass('hidden');
                                        }, 5000)
                                        console.error(err)
                                    });
                                }, 1000 + Math.floor(Math.random() * (2000 - 1000)))
                            }, 500 + Math.floor(Math.random() * (500 - 100)))
                        }, 1000 + Math.floor(Math.random() * (2000 - 1000)))
                    }, 800 + Math.floor(Math.random() * (800 - 400)))
                } else {
                    if ($($("#message")).val() == "") {
                        $("#message").parent().addClass("border-2 border-red-800 animate-shake");
                    }

                    if ($("#email").val() == "" || !$("#email").val().includes("@")) {
                        $("#email").parent().addClass("border-2 border-red-800 animate-shake");
                    }
                }
            })
        }
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
            } else if (goto.startsWith("mailto:")) {
                // Handle the mailto link
                window.location.href = goto;  // This will open the default mail client
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
                $("#footer").addClass("hidden");
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
                $("#footer").addClass("hidden");
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
                $("#footer").removeClass("hidden");
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

        const tooltip = $('<div class="tooltip bg-brown-dark rounded-xl p-5 text-zinc-300 font-black z-50 select-none shadow-xl"></div>').appendTo('body');
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

    const applyElements = async () => {
        let slashPath = "./";
        for (let i = 0; i < window.location.pathname.split("/").length - 2; i++) {
            slashPath += "../";
        }

        let elements = {
            component: {
                navbar: "",
                sidemenu: "",
                footer: "",
            }
        }

        elements.component.navbar = `
            <div class="flex flex-row gap-2">
                <a id="printResume" type="navbar" tooltip="Quickly print out my entire resume for reviewing" class="cursor-pointer">
                    <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                        <svg class="p-2 pt-[5px]" viewbox="-14 -1000 1000 1000" width="45px" height="45px">    
                            <path class="fill-gray-300 pointer-events-none" d="M330-54q-57 0-96.5-38.8T194-190v-44h-30q-57 0-96.5-39.5T28-370v-144q0-68 47.04-116T189-678h582q68.17 0 114.59 48Q932-582 932-514v144q0 57-39.5 96.5T796-234h-30v44q0 58.4-39.5 97.2Q687-54 630-54H330Zm436-670H194v-29q0-58.4 39.5-97.2Q273-889 330-889h300q57 0 96.5 38.8T766-753v29Zm-76.5 321q25.5 0 42.5-16.81 17-16.82 17-41.69 0-25.5-16.81-43T689.5-522q-24.5 0-42 17.5t-17.5 43q0 24.5 17.5 41.5t42 17ZM330-183h300v-64H330v64Z">
                        </svg>
                    </div>
                </a>
                <a id="sidemenuToggle" type="open" class="cursor-pointer">
                    <div class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                        <svg class="p-2 pt-[5px]" viewbox="0 0 50 45" width="45px" height="45px">    
                            <path class="fill-gray-300 pointer-events-none" d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z">
                        </svg>
                    </div>
                </a>
            </div>
            <div class="flex flex-row items-center">
                <a goto="https://github.com/wo-r" class="cursor-pointer" tooltip="View my github page">
                    <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                        <img class="w-[45px] h-[45px] p-2 rounded-full" src="${slashPath}src/logo/logo-full.jpg">
                    </div>
                </a>
            </div>
        `;

        elements.component.sidemenu = `
            <div id="sidemenuBackdrop" class="hidden xl:hidden z-30 fixed inset-[-1000px] bg-black opacity-50 cursor-pointer"></div>
            <div id="sidemenu" class="z-50 flex-shrink-0 absolute bottom-0 top-0 right-0 xl:relative overflow-x-hidden bg-brown-darker select-none" style="width: 0px;">
                <div class="h-full w-[280px]">
                    <div class="flex h-full min-h-0 flex-col">
                        <div class="h-full w-full flex-1 items-start">
                            <div class="flex h-full w-full flex-col">
                                <div class="flex justify-between py-3 px-4">
                                    <a goto="https://github.com/wo-r" class="cursor-pointer" tooltip="View my github page">
                                        <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl">
                                            <img class="w-[45px] h-[45px] p-2 rounded-full" src="${slashPath}src/logo/logo-full.jpg">
                                        </div>
                                    </a>
                                    <div class="flex flex-row gap-2">
                                        <a id="printResume" type="sidemenu" tooltip="Quickly print out my entire resume for reviewing" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                <svg class="p-2 pt-[5px]" viewbox="-14 -1000 1000 1000" width="45px" height="45px">    
                                                    <path class="fill-zinc-300 pointer-events-none" d="M330-54q-57 0-96.5-38.8T194-190v-44h-30q-57 0-96.5-39.5T28-370v-144q0-68 47.04-116T189-678h582q68.17 0 114.59 48Q932-582 932-514v144q0 57-39.5 96.5T796-234h-30v44q0 58.4-39.5 97.2Q687-54 630-54H330Zm436-670H194v-29q0-58.4 39.5-97.2Q273-889 330-889h300q57 0 96.5 38.8T766-753v29Zm-76.5 321q25.5 0 42.5-16.81 17-16.82 17-41.69 0-25.5-16.81-43T689.5-522q-24.5 0-42 17.5t-17.5 43q0 24.5 17.5 41.5t42 17ZM330-183h300v-64H330v64Z">
                                                </svg>
                                            </div>
                                        </a>
                                        <a id="sidemenuToggle" type="close" class="cursor-pointer">
                                            <div class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                <svg class="p-2 pt-[5px]" viewbox="0 0 50 45" width="45px" height="45px">    
                                                    <path class="fill-zinc-300 pointer-events-none" d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z">
                                                </svg>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-[10px] overflow-y-auto py-5">
                                    <div class="flex flex-col gap-1 py-3 px-4">
                                        <span class="font-black font-nunitoblack text-sm px-3 pb-2">OVERVIEW</span>
                                        <a goto="/" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Home
                                            </div>
                                        </a>
                                        <a goto="/blogs/" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Blogs
                                            </div>
                                        </a>
                                    </div>
                                    <div class="flex flex-col gap-1 py-3 px-4">
                                        <span class="font-black font-nunitoblack text-sm px-3 pb-2">FOR BUSINESS</span>
                                        <a goto="/resume/" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Resume
                                            </div>
                                        </a>
                                        <a goto="/portfolio/" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Portfolio
                                            </div>
                                        </a>
                                        <a goto="" class="cursor-pointer" disabled>
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Certifications
                                            </div>
                                        </a>
                                        <a goto="" class="cursor-pointer" disabled>
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Experience
                                            </div>
                                        </a>
                                        <a goto="" class="cursor-pointer" disabled>
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Education
                                            </div>
                                        </a>
                                        <a goto="/contact/" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Contact Me
                                            </div>
                                        </a>
                                    </div>
                                    <div class="flex flex-col gap-1 py-3 px-4">
                                        <span class="font-black font-nunitoblack text-sm px-3 pb-2">SOCIALS</span>
                                        <a goto="" class="cursor-pointer" disabled>
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                LinkedIn
                                            </div>
                                        </a>
                                        <a goto="https://www.youtube.com/@thatguywoods" tooltip="Check out my youtube channel where I make videos" class="cursor-pointer">
                                            <div ripple class="relative overflow-hidden py-2 px-3 font-black hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 rounded-lg transition">
                                                Youtube
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                ${isThemeEnabled() == false ? `
                                    <div class="flex justify-between py-3 px-4">
                                        <div></div>
                                        <div class="flex flex-row gap-2">
                                            <a id="themeToggle" type="close" class="cursor-pointer">
                                                <div ripple class="relative overflow-hidden hover:bg-brown-light hover:bg-opacity-20 transition rounded-xl z-20">
                                                    <svg class="p-2 pt-[6px]" viewbox="0 -960 960 960" width="45px" height="45px">    
                                                        <path class="fill-zinc-300 pointer-events-none" d="M481-100q-164 0-272.5-108T100-480q0-115 59-213.5T341-837q29-10 53-9t40 13q17 11 25.5 31.5T466-752q2 16 1 28.5t-1 22.5q0 99 70 168t170 69q12 0 25 .5t26 2.5q29-2 48.5 6t29.5 24q11 16 11.5 38t-9.5 51q-44 109-140 175.5T481-100Z">
                                                    </svg>
                                                </div>
                                            </a>
                                        </div>
                                    </div>    
                                ` : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        elements.component.footer = `
            <div class="py-5 px-6 w-full">
                <div class="flex justify-between items-center">
                    <div class="flex flex-1">Copyright &copy; Wo-r 2019-<span id="currentYear"></span></div>
                    <div class="flex flex-row gap-2 flex-2">
                        <a goto="" tooltip="View my LinkedIn page to get a true full view of all my achievements" class="cursor-pointer" disabled>
                            <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                                <svg class="p-2 pt-[3px]" viewbox="0 0 30 25" width="45px" height="45px">    
                                    <path class="fill-gray-300 pointer-events-none" d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z">
                                </svg>
                            </div>
                        </a>
                        <a goto="https://www.youtube.com/@thatguywoods" tooltip="Check out my youtube channel where I make videos" class="cursor-pointer">
                            <div ripple class="relative overflow-hidden hover:bg-brown-light hover:shadow-xl hover:bg-opacity-20 transition rounded-xl z-20">
                                <svg class="p-2 pt-[3px]" viewbox="0 0 50 45" width="45px" height="45px">    
                                    <path class="fill-gray-300 pointer-events-none" d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z">
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        if ($("#navbar").length && $("#sidemenuContainer").length && $("#footer").length) {
            await $("#navbar").append(elements.component.navbar);
            await $("#sidemenuContainer").append(elements.component.sidemenu);
            await $("#footer").append(elements.component.footer);
        }
    }

    // Septerate to all other functions: Handles the theming of the page by loading elements to change it.
    function applyTheme() {
        if (isThemeEnabled())
            return;

        if (localStorage.getItem("theme") == "dark" || localStorage.getItem("theme") == null) {
            if ($("#themeManager").length) {
                $("#themeManagerCSS, #snowOptions").remove();
            }

            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            "brown": "#494327",
                            "brown-dark":"#0a0a08",
                            "brown-darker":"#030302",
                            "brown-light": "#766a37",
                            "brown-accent": "#968613",
                            "brown-accent-light": "#f5f69f"
                        }
                    }
                }
            }
        } else if (localStorage.getItem("theme") == "light" && localStorage.getItem("theme") != null) {
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            "brown": "#b6bcd8",
                            "brown-dark":"#f5f5f7",
                            "brown-darker":"#fcfcfd",
                            "brown-light": "#8995c8",
                            "brown-accent": "#6979ec",
                            "brown-accent-light": "#0a0960",
                            "black": "#b6bcd8",
                            "zinc-300": "#3f3f46",
                            "gray-300": "#3f3f46"
                        }
                    }
                }
            }

            $("head").append(`
                <style id="themeManagerCSS">
                    ::selection {
                        background: #8995c8 !important;
                    }
                    .ripple {
                        background: rgb(137, 149, 200, 0.8) !important;
                    }
                </style>
                <div id="snowOptions"
                    data-flakes-max="100"
                    data-snow-color="#8995c8"
                    data-flake-width="120"
                    data-flake-height="120"
                    data-snow-character="<div class='w-full select-none'>&bull;</div>"
                    data-vmax-x="1"
                    data-vmax-y="1"
                    data-auto-start="true"
                    data-use-gpu="false"
                    data-snow-stick="false"
                    data-exclude-mobile="true">
                </div>
            `)
        }
    }

    applyTheme();

    // Wait for document to be ready
    await $(window).ready(async function () {
        const tasks = [
            applyElements,
            fetchFollowersCount,
            fetchRepositoriesCount,
            fetchBestRepositories,
            fetchTotalBlogs,
            fetchBlogs,
            previewBlogs,
            navbarScroll,
            searchBlogs,
            galleryController,
            manageFeedback,
            handleDisabledElements,
            setupGotoLinks,
            setupSidemenu,
            setupRippleEffect,
            setupTooltips,
            setupPopupText
        ];

        // Run all the initialization functions
        for (let task of tasks) {
            try {
                await task();
            } catch (e) { }
        }

        $("#themeToggle").mousedown(function () {
            let currentTheme = localStorage.getItem("theme");
    
            if (currentTheme === "dark" || currentTheme === null) {
                // Switch to light theme
                localStorage.setItem("theme", "light");
                applyTheme();
            } else {
                // Switch to dark theme
                localStorage.setItem("theme", "dark");
                applyTheme();
            }
        });

        // Set current year
        $("#currentYear").text(new Date().getFullYear());
    })
})();