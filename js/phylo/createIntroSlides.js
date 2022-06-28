var page = 0
var title_text;
var body_text;
var body_image;
$("#show_intro").click(function() {
    //$("#mask").css("-webkit-mask-image", "linear-gradient(white, transparent)");
    $("#intro_slides").css("display", "block");
    
});

$(".skip-button").click(function() {
    $("#intro_slides").css("display", "none");
})

$(".next-button").click(function() {
    console.log("here")
})

$('.previous-button').click(function() {
    console.log("p")
}) 


if(page == 0) {
 // load html text content, and previous button
} else if (page == 1) {

} else if (page == 2) {
    
} else if (page == 3) {

} else if (page == 4) {

}