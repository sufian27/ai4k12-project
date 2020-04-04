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

    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drag(ev) {
        ev.dataTransfer.setData('Img', ev.target.id);
    }
    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData('img');
        ev.target.after(document.getElementById(data));
        // console.log($('.conbox').children().length);
        // $('.con2.main .boxs').html(
        //   '<img id="dragImg36" draggable="true" ondragstart="drag(event)" src="./../Public/images/191.png" alt="">',
        // );
        // console.log(ev.target);
        // $('.boxs img').css({ opacity: 1 });
        // $(ev.target)
        //   .parents('.boxs')
        //   .find('img')
        //   .css({ opacity: 0.4 });
    }

});
