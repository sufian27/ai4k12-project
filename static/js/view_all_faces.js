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
          container.style.mixBlendMode= 'hard-light'



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
let listOfFacesDroppedUpon=[]

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

  if(target.id!==dragStartComponentID){
    let opacVal=0.8
    for(var i=0; i<listOfFacesDroppedUpon.length;i++){
      if(listOfFacesDroppedUpon[i].localeCompare(target.id)===0){
        opacVal=opacVal-0.1
      }
    }
    //do spmething only if user does not drop element on itself

       listOfFacesDroppedUpon.push(target.id)

  var idCodeOfDragStart= dragStartComponentID.slice(2,)

   var secondDiv=document.getElementById(target.id)

   console.log(dragStartComponentID, target.id)
   var firstDiv= document.getElementById(dragStartComponentID)
   secondDiv.style.opacity='0.9'
   firstDiv.style.opacity=opacVal
   //firstDiv.style.position='absolute'
  // secondDiv.style.position='absolute'
   var position1=firstDiv.getBoundingClientRect()
   var left1Value=position1.left
   var top1Value=position1.top
   var position2=secondDiv.getBoundingClientRect()
   var left2Value=position2.left
   var top2Value=position2.top
 //   var el1Style = window.getComputedStyle(firstDiv);
 //  var left1Value = el1Style.getPropertyValue("left").replace("px", "");
 //  var el2Style = window.getComputedStyle(secondDiv);
 // var left2Value = el2Style.getPropertyValue("left").replace("px", "");
//
// var top1Value = el1Style.getPropertyValue("top").replace("px", "");
// var top2Value = el2Style.getPropertyValue("top").replace("px", "");


 console.log(left1Value)
 // console.log(secondDiv)
 console.log(left2Value)
 firstDiv.style.position='relative'

 //secondDiv.style.position='relative'

  var leftDif= left2Value-left1Value
  if(left2Value<left1Value ||left2Value===left1Value){
    // var face_plance_content = $('<span id = "id' + idCount++ + '"class="droppable" draggable="true" ondrop="drop(event, this)" ondragover="allowDrop(event)" "></span>');
    // var svgElement=$('<svg width="100" height="120" viewBox="0 0 100 120" class="hover-face"/>' )
    // face_plance_content.append(svgElement)
  //  $(face_plance_content).insertAfter(document.getElementById(dragStartComponentID));
    firstDiv.style.left = (firstDiv.style.left + leftDif) + "px";

    // secondDiv.style.left=(Number(left2Value-10))+'px'
    // secondDiv.style.top=(Number(top2Value+10))+'px'
    // firstDiv.style.top=(Number(top1Value+10))+'px'

  }else{
    // var face_plance_content = $('<span id = "id' + idCount++ + '"class="droppable" draggable="true" ondrop="drop(event, this)" ondragover="allowDrop(event)" "></span>');
    // var svgElement=$('<svg width="100" height="120" viewBox="0 0 100 120" class="hover-face"/>' )
    // face_plance_content.append(svgElement)
    // $(face_plance_content).insertAfter(document.getElementById(dragStartComponentID));
    firstDiv.style.left = firstDiv.style.left + leftDif + "px";


    // $(face_plance_content).insertAfter(document.getElementById(target.id));
  }



  var topDif= top2Value-top1Value
    if(top2Value>top1Value){
    firstDiv.style.top = (firstDiv.style.top + topDif) + "px";
  }else if(top2Value<top1Value){
    firstDiv.style.top = (firstDiv.style.top + topDif) + "px";

  }else{
    firstDiv.style.top=firstDiv.style.top+'px'
  }
  console.log(top1Value)
  // console.log(secondDiv)
  console.log(top2Value)



  //  $(face_plance_content).insertAfter(document.getElementById(target.id));

  }
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
