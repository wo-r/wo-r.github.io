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

    $('[tooltip]').each(function() {
        var tooltipText = $(this).attr('tooltip');
        $(this).addClass('relative inline-block');
        $(this).append(`<div class="tooltip pointer-events-none hidden absolute w-max mt-14 z-10 p-3 bg-white shadow-xl text-black text-sm rounded-lg">${tooltipText}</div>`);
    
        $(this).on('mouseenter', function() {
            var $tooltip = $(this).find('.tooltip');
            $tooltip.fadeIn(200, function () {
                $(this).attr("style", "")
                $(this).removeClass('hidden');
            })
        
            var rect = this.getBoundingClientRect();
            var top = rect.top + window.scrollY;
            var bottom = rect.bottom + window.scrollY;
            var left = rect.left + window.scrollX;
            var right = rect.right + window.scrollX;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
        
            if (left < windowWidth / 2) {
                $tooltip.addClass('right-full transform translate-x-full');
            } else {
                $tooltip.addClass('right-full');
            }
        
            if (top < windowHeight / 2) {
                $tooltip.addClass('top-full transform -translate-y-full');
            } else {
                $tooltip.addClass('bottom-full mb-3');
            }
        });
    
        $(this).on('mouseleave', function() {
            $(this).find('.tooltip').fadeOut(200, function () {
                $(this).attr("style", "")
                $(this).addClass('hidden');
            });
        });
    });
})();