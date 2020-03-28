$(document).ready(function(){
	// alert("test");
    function reload() {
        var container = $("#toolbox");
        var content = container.innerHTML;
        container.innerHTML= content; 
    }
    reload();
    if(example > 0) {
    	$(".dataset2face").attr("href", "/dataset2face?example=" + example);
    }
});
