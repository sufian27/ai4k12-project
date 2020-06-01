$(document).ready( function() {
    // $("#data_table").toggleClass("hidden");
    // $("#face").toggleClass("hidden");
    // $(this).text(function(i, text){
    //     return text === "View all Faces" ? "View the Table" : "View all Faces";
    // })

    for (data_id = 0; data_id < dataset_face.length; data_id++) {
         var face_plance_content = $('<span id = "id' + data_id + '"class="droppable" draggable="true" ondrop="drop(event, this)" ondragover="allowDrop(event)" "></span>');
         $('#face_table').append(face_plance_content);
         document.getElementById("face_table").style.backgroundColor="black"
          var container=document.getElementById("id"+data_id);

      //    container.style.position='absolute'
          container.addEventListener("dragover", dragover, false)
          container.addEventListener("dragstart", dragstart, false)
          container.addEventListener("dragenter", dragenter)
          // container.addEventListener("drop", drop, false)
          container.style.mixBlendMode= 'screen'


    }

    for (data_id = 0; data_id < dataset_face.length; data_id++) {
        datapoint_face = dataset_face[data_id];
        var face_place_id = "#id" + data_id;
        d3.select(face_place_id)
            .call(chernoffFace(1));
        $(face_place_id + ' svg').attr('id', "face" + data_id);
        $(face_place_id + ' svg').attr('class', 'hover-face');
        lastFaceId=data_id
    }

});
let lastFaceId;
let dragStartComponentID;
let idCount=2000
function dragover(e) {
  e.preventDefault()
  //console.log(e.target.id)

  //console.log("bematlabi")
}
function allowDrop(e){
  e.preventDefault()
}
function dragstart(e) {

  dragStartComponentID=(e.target.id)
  console.log(e.target.id)
  console.log(e.clientX)
  console.log(e.clientY)

}
function dragenter(e) {
  e.preventDefault()
}
function drop(event, target) {
  event.preventDefault();
  console.log(target.id)
   var secondDiv=document.getElementById(target.id)
   var firstDiv= document.getElementById(dragStartComponentID)
   firstDiv.style.position='absolute'
   secondDiv.style.position='absolute'

   var el1Style = window.getComputedStyle(firstDiv);
  var left1Value = el1Style.getPropertyValue("left").replace("px", "");
  var el2Style = window.getComputedStyle(secondDiv);
 var left2Value = el2Style.getPropertyValue("left").replace("px", "");

var top1Value = el1Style.getPropertyValue("top").replace("px", "");
var top2Value = el2Style.getPropertyValue("top").replace("px", "");


 console.log(left1Value)
 // console.log(secondDiv)
 console.log(left2Value)

 secondDiv.style.position='relative'

  var leftDif= left2Value-left1Value
    firstDiv.style.left = (Number(left1Value) + leftDif) + "px";



  var topDif= top2Value-top1Value
    if(top2Value>top1Value){
    firstDiv.style.top = (Number(top1Value) - topDif) + "px";
  }else{
    firstDiv.style.top = (Number(top1Value) + topDif) + "px";

  }
  console.log(top1Value)
  // console.log(secondDiv)
  console.log(top2Value)

  var face_plance_content = $('<span id = "id' + idCount++ + '"class="droppable" draggable="true" ondrop="drop(event, this)" ondragover="allowDrop(event)" "></span>');
  var svgElement=$('<svg width="100" height="120" viewBox="0 0 100 120" class="hover-face"/>' )
  face_plance_content.append(svgElement)
  $(face_plance_content).insertBefore(document.getElementById('id'+lastFaceId--));


  //  secondDiv.style.left = (Number(left2Value) - 100) + "px";


   // dragStartComponent.style.left = (event.originalEvent.clientX + parseInt(offset[0],10)) + 'px';
   // dragStartComponent.style.top = (event.oritingalEvent.clientY + parseInt(offset[1],10)) + 'px';

  //
  // //
  // console.log(event.originalEvent.clientX)
  // console.log(event.originalEvent.clientY)
  // e.style.backgroundColor='black'
  // e.style.mixBlendMode= 'screen'
  // dragStartComponent.style.left = e.getBoundingClientRect().left + "px";
  // dragStartComponent.style.top = e.getBoundingClientRect().top + "px";



}
