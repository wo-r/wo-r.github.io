(async function () {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    "brown": "#494327",
                    "brown-light": "#766a37",
                    "brown-accent": "#968613"
                },
            }
        }
    }

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
        if ($(".bar").first()[0].getBoundingClientRect().top >= 0 && 
            $(".bar").first()[0].getBoundingClientRect().left >= 0 && 
            $(".bar").first()[0].getBoundingClientRect().bottom <= $(window).height() && 
            $(".bar").first()[0].getBoundingClientRect().right <= $(window).width()) {
            
            $(".bar").each(function() {
                console.log(this)
                var bar = $(this);
                var percentage = bar.attr("to");
        
                bar.children().animate({ width: percentage }, 1000);
            });
        }
    });
})();