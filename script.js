(function () {
    /** This gets the current date and adds it to #copyright **/
    {
        $("#copyright").append(new Date().getFullYear())
    }

    /** Looks for any instance of [canripple] and animates it with
     * amazing ripple effects. **/
    {
        $("[canripple]").on("mousedown", function(event) {  
            const item = $(this);

            const circle = $("<span></span>");
            const diameter = Math.max(item.width(), item.height());
            const radius = diameter / 2;
          
            circle.css({
                width: diameter,
                height: diameter,
                left: event.clientX - item.offset().left - radius,
                top: event.clientY - item.offset().top - radius
            });
          
            circle.addClass("ripple");
          
            const ripple = item.find(".ripple");
          
            if (ripple.length > 0) {
                ripple.remove();
            }
          
            item.append(circle);
        });
    }

    /** Check for any instance of [goto] attributes and on the fly
     * determine the functionality of that [goto] when they click it **/
    {
        $("[goto]").addClass("cursor-pointer");
        $("[goto]").on("click", function (event) {
            if ($(this).attr("goto").includes("//"))
                window.open($(this).attr("goto"), "_blank")
            else if ($(this).attr("goto").includes("/") && !$(this).attr("goto").includes("//"))
                window.location.href = window.location.href.includes("https:") ? `/wo-r${$(this).attr("goto")}` : `${$(this).attr("goto")}`;
            else if ($(this).attr("goto").includes("#")) {
                event.preventDefault();
                let offset = $(`${$(this).attr("goto")}`).offset().top;
                $('html, body').animate({
                    scrollTop: offset
                }, 800)
            }
        })
    }

    /** Check for articles from articles/ using githubs api, 
     * then create the articles pages as well **/
    {   
        /** Converts element tags to match styling */
        function convert_markdown(element) {
            element = element.replace(/h1/g, `h1 class="font-black color-primary text-4xl md:text-5xl leading-normal tracking-tight mt-10"`); // h1
            element = element.replace(/h2/g, `h2 class="font-black color-primary text-3xl md:text-4xl leading-normal tracking-tight mt-10"`); // h2
            element = element.replace(/h3/g, `h3 class="font-black color-primary text-2xl md:text-3xl leading-normal tracking-tight mt-10"`); // h3
            element = element.replace(/href/g, "goto"); // Href to Goto
            element = element.replace(/<a/g, `<a class="cursor-pointer underline"`); // A links
            element = element.replace(/pre/g, `pre class="py-5 px-5 my-5 rounded bg-secondary"`); // Code blocks
            element = element.replace(/<p>/g, `<p class="mb-5">`); // P
            element = element.replace(/<strong>/g, `<strong class="font-black color-accent">`); // Strong
            element = element.replace(/<b>/g, `<b class="font-black color-accent">`); // B
            return element;
        }

        if ($("#list").length) {
            $.ajax({
                url: "https://api.github.com/repos/wo-r/wo-r/contents/articles?ref=website",
                type: "GET",
                success: function (articles) {
                    // Firstly append #list with respective elements
                    $("#list").append(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10"/>`);

                    $.each(articles, function (i, article) {
                        $.ajax({
                            url: article.download_url,
                            type: "GET",
                            success: function (markdown) {
                                const details = markdown.match(/<!--\[(.*?)\]-\[(.*?)\]-\[(.*?)\]-->/).splice(1);
                                let id = details[0].toLowerCase().replace(/ /g, "-");

                                let converter = new showdown.Converter();
                                let formatted_markdown = convert_markdown(converter.makeHtml(markdown));
                                console.log(formatted_markdown)
                                $("#list > div").append(`
                                    <a class="relative overflow-hidden rounded no-underline cursor-pointer select-none" id="${id}">
                                        <div class="absolute inset-0 bg-secondary hover:opacity-100 opacity-80"></div>
                                        <div class="relative flex flex-col py-5 px-5 z-10 pointer-events-none">
                                            <small>${details[2]}</small>
                                            <h2 class="text-3xl font-black mt-2">${details[0]}</h2>
                                            <span>${details[1]}</span>
                                        </div>
                                    </a>
                                `).find(`#${id}`).on("click", function () {
                                    $("#list > div:first-child").addClass("invisible").addClass("h-0");
                                    $("#list").append(`
                                        <div>
                                            <div class="flex flex-col gap-10">
                                                <div class="flex flex-start">
                                                    <a class="cursor-pointer no-underline" id="back">Back</a>
                                                </div>
                                                <div>
                                                    <span>Written <b class="font-black color-accent">${details[2]}</b></span>
                                                    ${formatted_markdown}
                                                </div>
                                            </div>
                                        </div>
                                    `).find("a#back").on("click", function () {
                                        $("#list > div:first-child").removeClass("invisible").removeClass("h-0");
                                        $("#list > div:last-child").remove();
                                    })
                                })

                                /** This needs to be called again here just because links will sometimes
                                 * showup after the event listener has checked for goto attributes **/
                                $("[goto]").addClass("cursor-pointer");
                                $("[goto]").on("click", function (event) {
                                    if ($(this).attr("goto").includes("//"))
                                        window.open($(this).attr("goto"), "_blank")
                                    else if ($(this).attr("goto").includes("/") && !$(this).attr("goto").includes("//"))
                                        window.location.href = window.location.href.includes(":") ? `${$(this).attr("goto")}` : `/wo-r${$(this).attr("goto")}`;
                                    else if ($(this).attr("goto").includes("#")) {
                                        event.preventDefault();
                                        let offset = $(`${$(this).attr("goto")}`).offset().top;
                                        $('html, body').animate({
                                            scrollTop: offset
                                        }, 800)
                                    }
                                })
                            }
                        })
                    })
                },
                error: function() {
                    $("#list").append(`
                        <div class="flex flex-col justify-center items-center gap-10 mt-20">
                            <div class="text-9xl mt-20">:(</div>
                            <div>Could not load/find articles</div>
                        </div>
                    `)
                }
            })
        }

    }
})();