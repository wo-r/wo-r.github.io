(async function () {
    /**
     * Copyright Wo-r 2019
     */

    // Disabled
    $("[disabled]").each(async function () {
        $(this).find("[ripple]").removeAttr("ripple")
        $(this).addClass("select-none cursor-not-allowed").on("click", async function (e) {
            e.preventDefault()
        })
    })

    // Goto
    $("[goto]").click(async function () {
        if ($(this).attr("disabled") != undefined)
            return;

        if ($(this).attr("goto").includes("https://")) {
            window.open($(this).attr("goto"), "_blank");
        } else if ($(this).attr("goto").startsWith("#")) {
            const targetElement = $($(this).attr("goto"));
            if (targetElement.length) {
                $("html, body").animate(
                    { scrollTop: targetElement.offset().top },
                    500
                );
            }
        } else if ($(this).attr("goto").startsWith("/")) {
            window.location.href = `${$(this).attr("goto")}`;
        }
    });

    // Sidemenu
    if (localStorage.getItem("sidemenu") != null && localStorage.getItem("sidemenu") == "true") {
        $("#sidemenuToggle[type=\"open\"]").addClass("invisible");
        $("#showResume[type=\"navbar\"]").addClass("invisible");
        $("#navbar").addClass("hidden")
        $("#main").removeClass("mt-5")
        $("#sidemenuBackdrop").removeClass("hidden")
        $("#sidemenu").removeClass("invisible");
        $("#sidemenu").css("width", "280px")
    }

    $("#sidemenuToggle,#sidemenuBackdrop").on("click mousedown", async function (event) {
        if ($(event.target).parent().parent().attr("type") == "open") {
            localStorage.setItem("sidemenu", true)
            $("#sidemenuToggle[type=\"open\"]").addClass("invisible");
            $("#showResume[type=\"navbar\"]").addClass("invisible");
            $("#navbar").addClass("hidden")
            $("#main").removeClass("mt-5")
            $("#sidemenuBackdrop").removeClass("hidden")
            $("#sidemenu").removeClass("invisible");

            let menuWidth = 0;
            let increaseWidth = setInterval(async function () {
                if (menuWidth >= 280) {
                    clearInterval(increaseWidth);
                } else {
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
                    $("#navbar").removeClass("hidden")
                    $("#main").addClass("mt-5")
                    $("#sidemenuBackdrop").addClass("hidden")
                    $("#sidemenu").addClass("invisible");
                } else {
                    menuWidth -= 20;
                    $("#sidemenu").css("width", `${menuWidth}px`)
                }
            })
        }
    })

    // Ripple
    $("[ripple]").on("mousedown", async function (event) {
        let rippleTarget = $(this);

        let rippleCircle = $("<span></span>");
        let rippleDiameter = Math.max(rippleTarget.width(), rippleTarget.height());
        let rippleRadius = rippleDiameter / 2;

        rippleCircle.css({
            width: rippleDiameter,
            height: rippleDiameter,
            left: event.clientX - rippleTarget.offset().left - rippleRadius,
            left: event.clientY - rippleTarget.offset().top - rippleRadius
        });

        rippleCircle.addClass("ripple");

        let rippleAnimate = rippleTarget.find(".ripple");

        rippleTarget.append(rippleCircle);
        rippleCircle.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", async function () {
            rippleCircle.remove();
        })
    })

    // TODO: Tips
    
})();