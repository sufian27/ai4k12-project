$(document).ready(function() {
    // alert("base");
    function tool_reload() {
        var container = $("#toolbox");
        var content = container.innerHTML;
        container.innerHTML= content; 
    }
    tool_reload();
    if(example > 0) {
    	$(".var").attr("href", "/var?example=" + example);
        $(".dataset2face").attr("href", "/dataset2face?example=" + example);
        $(".compare").attr("href", "/compare?example=" + example);
    }

});
