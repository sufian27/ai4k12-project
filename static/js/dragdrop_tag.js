function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData('Img', ev.target.id);
    current_id = parseInt(ev.target.id.substr(4)) + 1;
}
function dropChild(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('img');
    var data_element = document.getElementById(data);
    if(typeof(data_element) != 'undefined' && data_element != null) {
        data_element.width = "100";
        if (ev.target.className == 'compare-canvas') {
        	var x = ev.target.childElementCount;
        	data_element.style.zIndex = x.toString();
        	ev.target.appendChild(data_element);
        	var elem = ev.target.nextElementSibling;
        } else {
        	var x = ev.target.parentNode.childElementCount;
        	data_element.style.zIndex = x.toString();
        	ev.target.after(data_element);
        	var elem = ev.target.parentNode.nextElementSibling;
        }

        var canvas_id = elem.previousElementSibling.id;
        var canvas_id_val = parseInt(canvas_id.substr(6));
        // $(".compare-canvas img").css('top', 0 );
        // $(".compare-canvas img").css('left', 100*canvas_id_val );
        $(".compare-canvas img").addClass("overlay");
        
        $("#" + canvas_id).children("img").css('opacity', 1/(x+1));

        fade(current_id);
        addTags(elem, current_id);
    }
}

function fade(id) {
	var data_id = parseInt(id) - 1;
	$("#wrap" + data_id).css('opacity', 0.4);
}

function addTags(elem, face_id) {
	var id_tag = document.createElement("span");
	var close = document.createElement("button");
	id_tag.className = "badge";
	close.className = "close";
	var text = document.createTextNode(face_id);
	var text_close = document.createTextNode("x");
	close.appendChild(text_close);
	id_tag.appendChild(text);
	id_tag.appendChild(close);
	elem.appendChild(id_tag);
}