// console.log("this linked");

// event listeners, JS runs when button clicked
window.onload = function () {
    $('#enter-button').click(function () {  // when start button is clicked
        $("#widgets").removeClass("hidden"); // shows game page
        $('html,body').animate({
            scrollTop: $("#widgets").offset().top
        },
            'slow');
    });
};