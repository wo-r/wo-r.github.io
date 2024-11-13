(async function () {
    /**
     * Copyright Wo-r 2019
     */

    // Sidemenu
    $("#sidemenuToggle,#sidemenuBackdrop").on("click mousedown", async function (event) {
        if ($(event.target).parent().parent().attr("type") == "open") {
            $("#sidemenuToggle[type=\"open\"]").addClass("invisible");
            $("#showResume[type=\"navbar\"]").addClass("invisible");
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
            let menuWidth = 280;
            let increaseWidth = setInterval(async function () {
                if (menuWidth == 0) {
                    clearInterval(increaseWidth);
                    $("#sidemenuToggle[type=\"open\"]").removeClass("invisible");
                    $("#showResume[type=\"navbar\"]").removeClass("invisible");
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

        if (rippleAnimate.length > 0) {
            rippleAnimate.remove();
        }

        rippleTarget.append(rippleCircle);
        rippleCircle.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", async function () {
            rippleCircle.remove();
        })
    })

    // TODO: Tips
})();