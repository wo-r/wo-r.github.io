(async function () {
    $("#copyright").append(new Date().getFullYear())

    $("[ripple]").on("mousedown", function(event) {  
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


    $("[goto]").addClass("cursor-pointer");
    $("[goto]").on("click", function (event) {
        if ($(this).attr("goto").includes("//"))
            window.open($(this).attr("goto"), "_blank")
        else if ($(this).attr("goto").includes("/") && !$(this).attr("goto").includes("//"))
            window.location.href = $(this).attr("goto");
        else if ($(this).attr("goto").includes("#") && $(this).attr("goto").length > 1) {
            event.preventDefault();
            let offset = $(`${$(this).attr("goto")}`).offset().top;
            $('html, body').animate({
                scrollTop: offset - 50
            }, 800)
        }
    })

    $("#menu").click(async function (e) {
        if (!$("#menu svg:first-child").hasClass("hidden") && $("#menu svg:last-child").hasClass("hidden")) {
            $("#menu svg:first-child").addClass("hidden").parent().find("svg:last-child").removeClass("hidden");
            $("#menu--target").fadeIn(200, function () {
                $(this).removeClass("hidden");
                $(this).attr("style", "")
            });
        } else {
            $("#menu svg:first-child").removeClass("hidden").parent().find("svg:last-child").addClass("hidden");
            $("#menu--target").fadeOut(200, function () {
                $(this).addClass("hidden");
                $(this).attr("style", "")
            });
        }
    })

    $(document).on("scroll", function() {
        if ($(".bar").length) {
            if ($(".bar").first()[0].getBoundingClientRect().top >= 0 && 
                $(".bar").first()[0].getBoundingClientRect().left >= 0 && 
                $(".bar").first()[0].getBoundingClientRect().bottom <= $(window).height() && 
                $(".bar").first()[0].getBoundingClientRect().right <= $(window).width()) {
                
                $(".bar").each(function() {
                    var bar = $(this);
                    var percentage = bar.attr("to");
            
                    bar.children().animate({ width: percentage }, 1000);
                });
            }
        }
    });

    if ($("#articles").length) {
        let article_list = [];
        async function fetch_articles(url) {
            try {
                let articles = await $.ajax({
                    url: url,
                    method: "GET"
                })
        
                for (let article of articles) {
                    if (article.name == "readme.md") {
                        continue;
                    } else if (article.type == "dir") {
                        await fetch_articles(article.url);
                    } else {
                        article_list.push(article);
                    }
                }
            } catch (e) {
                throw e;
            }
        }

        try {
            await fetch_articles("https://api.github.com/repos/wo-r/wo-r.github.io/contents/src/articles");

            for (let article of article_list) {
                let details = await $.ajax({
                    url: article.download_url,
                    method: "GET"
                })

                let matches = details.match(/HEAD::\[(.*?)\]\nSUBHEAD::\[(.*?)\]\nDATE::\[(.*?)\]/s);
                let head="",subhead="",date="";
                if (matches) {
                    head = matches[1];
                    subhead = matches[2];
                    date = matches[3];
                }

                details = marked.parse(details);
                details = details.replace(/<h1/g, `<h1 class="text-4xl font-black text-brown"`)
                details = details.replace(/<h2/g, `<h2 class="text-2xl font-black text-brown"`)
                details = details.replace(/<h3/g, `<h3 class="text-1xl font-black text-brown"`)
                details = details.replace(/<p>/g, `<p class="font-semibold mb-3">`)
                details = details.replace(/href=/g, `goto=`)
                details = details.replace(/<a /g, `<a class="font-bold text-brown hover:text-brown-light hover:underline"`)

                $("body").find(".loading").remove();
                let $article = $(`
                    <div class="article flex cursor-pointer transition hover:transform-gpu hover:scale-105 flex-1 flex-col bg-white p-10 shadow-xl">
                        <h2 class="text-2xl font-black text-brown pointer-events-none">${head}</h2>
                        <span class="font-semibold pointer-events-none">${subhead}</span>
                    </div>
                `).mouseup(async function () {
                    $("body").addClass("overflow-hidden");
                    let $overlay = $(`
                        <div id="opened">
                            <div id="overlay" class="fixed inset-0 z-50 overflow-scroll bg-gray-900 bg-opacity-50 flex justify-start items-start animation-fadein">
                                <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center my-28 items-center pointer-events-none animation-popin">
                                    <div class="bg-white shadow-xl text-black rounded-xl w-full px-5 py-5 pointer-events-auto">
                                        <div class="flex justify-center items-center mb-4 pb-4 border-b-[3px] border-b-brown">
                                            <h2 class="text-2xl font-bold text-center">${head}</h2>
                                        </div>
                                        <div class="mt-4">
                                            ${details}
                                        </div>
                                        <div class="mt-4">
                                            <span class="font-bold">Written ${date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).mouseup(async function (e) {
                        switch ($(e.target).attr("id")) {
                            case "overlay": {
                                $("#overlay").fadeOut(400, function () {
                                    $("#opened").remove();
                                });
                                $("body").removeClass("overflow-hidden");
                            }
                        }
                    })

                    await $("body").append($overlay);

                    $("[goto]").addClass("cursor-pointer");
                    $("[goto]").on("click", function (event) {
                        if ($(this).attr("goto").includes("//"))
                            window.open($(this).attr("goto"), "_blank")
                        else if ($(this).attr("goto").includes("/") && !$(this).attr("goto").includes("//"))
                            window.location.href = $(this).attr("goto");
                        else if ($(this).attr("goto").includes("#") && $(this).attr("goto").length > 1) {
                            event.preventDefault();
                            let offset = $(`${$(this).attr("goto")}`).offset().top;
                            $('html, body').animate({
                                scrollTop: offset - 50
                            }, 800)
                        }
                    })

                    hljs.highlightAll();
                })

                await $("#articles").append($article);
            }
        } catch (e) {
            console.log(e)
            $("#articles").find(".loading").empty();
            $("#articles").find(".loading").append(`<div class="flex flex-col justify-center items-center h-[55vh] font-semibold">Failed to get articles!</div>`);
        }
    }
})();