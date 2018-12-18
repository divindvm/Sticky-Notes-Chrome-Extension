

var notes;




$(function(){
  $("body").css('opacity','1');
});


function fade() {
  var i = 0;
  var h1 = document.getElementsByTagName("h1")[0];
  h1.style.opacity = 0;
  var k = window.setInterval(function() {
    if (i >= 10) {
      clearInterval(k);
    } else {
      h1.style.opacity = i / 10;
      i++;
    }
  }, 100);
};




// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;


  

/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '#yes-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,
  
    // listen for drop related events:
  
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget,
          dropzoneElement = event.target;
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');
      draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      event.relatedTarget.textContent = 'Dragged out';
    ;
    },
    ondrop: function (event) {
      event.relatedTarget.textContent = 'Dropped';
      console.log("Drag Completed");
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });
  
  interact('.drag-drop')
    .draggable({
      inertia: true,
      restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      onmove: dragMoveListener,

      ondrop: function (event) {
        // event.relatedTarget.textContent = 'Dropped';
        console.log("Drag Completed");
      },

      ondragleave: function (event) {

        console.log("Drag Leaved");
        // remove the drop feedback style
        // event.target.classList.remove('drop-target');
        // event.relatedTarget.classList.remove('can-drop');
        // event.relatedTarget.textContent = 'Dragged out';
      ;
      },
});
  
  


    

interact('.resize-drag')
.draggable({
  onmove: window.dragMoveListener,
  restrict: {
    restriction: 'parent',
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onend: function (event) {
   console.log("drag leaved : ", event);
   saveNoteLocation(event);
  }
})
.resizable({
  // resize from all edges and corners
  edges: { left: true, right: true, bottom: true, top: true },

  // keep the edges inside the parent
  restrictEdges: {
    outer: 'parent',
    endOnly: true,
  },

  // minimum size
  restrictSize: {
    min: { width: 150, height: 200 },
  },

  inertia: true,
})
.on('resizemove', function (event) {
  var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);

  // update the element's style
  target.style.width  = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  y += event.deltaRect.top;

  target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px,' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
  saveNoteSize(event);
  

  console.log("Current Width is : ", event.rect.width, " and y : ",event.rect.height);
//   target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);


})










window.onload = function() {
    // console.log("items fetched from thge local Storage are : ",  JSON.stringify(localStorage.getItem('itemsArray')));
    var backgroundColor = localStorage.getItem("backgroundColor");
    console.log("background : ", localStorage.getItem("backgroundColor"));
    document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor ? backgroundColor : "#ffffff";
    

    var createButton = document.getElementById('create_button');
    createButton.addEventListener('click', function() { addItems(); });

    //   var grocery_list = {
    //     "Banana": { category: "produce", price: 5.99 },
    //     "Chocolate": { category: "candy", price: 2.75 },
    //     "Wheat Bread": { category: "grains and breads", price: 2.99 }
    //   }
      
      notes = JSON.parse(localStorage.getItem('itemsArray')) || [];
      // console.log("Notes on load : ", JSON.stringify(notes));
  
      var changeButton, deleteButton, pinButton, textArea;
      var wrapper = $('#resize-container'), container;
      for (var key in notes){
          container = $('<div id="note'+ key+'"' + ' class="resize-drag"></div>');
          wrapper.append(container);

          var target = document.getElementById('note'+key) ;
          var x = (parseFloat(notes[key].x)  || 0), y = (parseFloat(notes[key].y) || 0);
          console.log("taget is :",target);
          // translate the element
          target.style.webkitTransform =
          target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
      
          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);

          console.log("Width : ",notes[key].width, "  Height : ",notes[key].height);


          target.style.width  = notes[key].width + 'px';
          target.style.height = notes[key].height + 'px';

          switch(notes[key].color){
            case 0 : target.style.backgroundColor = "#70b2ff";break;
            case 1 : target.style.backgroundColor = "#ffe460";break;
            case 2 : target.style.backgroundColor = "#83ff7c";break;
            case 3 : target.style.backgroundColor = "#7cebff";break;
            case 4 : target.style.backgroundColor = "#ff8e8e";break;
            case 5 : target.style.backgroundColor = "#ffffff";break;
            default: target.style.backgroundColor = "#70b2ff";break;
          }


          // target.setAttribute('data-x', x);
          // target.setAttribute('data-y', y);
          // target.style.transform = 'translate('+x+'px'+','+y+'px)';

          //Delete Button Initialize
         

          container.append('<div class="delete-btn-wrap">' + '<button class="change_button"'+ 'id="'+'edit'+key+'"></button>' + '<button class="delete_button"'+ 'id="'+'delete'+key+'"></button>'  +'</div>');
          changeButton = document.getElementById('delete'+key);
          changeButton.addEventListener('click', function() { onClickDelete(this); });



          //Change Color Button Initialize

          // container.append('<div class="color-btn-wrap">' + '<button class="change_button"'+ 'id="'+'edit'+key+'"></button>' +'</div>');
          changeButton = document.getElementById('edit'+key);
          changeButton.addEventListener('click', function() { changeColor(this); });


       

          //TextArea Initialize

          container.append('<textarea id="text' +key+ '" >'+notes[key].text+'</textarea>');
          textArea = document.getElementById('text'+key);
          // console.log("Text Area", textArea )
          textArea.addEventListener('blur', function() { saveText(this); });

      }

};

function setTextColor(picker) {
  // console.log("Color picked is :",picker);
  // console.log("Color is : ",picker);
  document.getElementsByTagName('body')[0].style.backgroundColor = '#' + picker.toString()
  localStorage.setItem("backgroundColor",'#' + picker.toString());
  // target.style.backgroundColor = '#' + picker.toString()
}



function saveText(item){
    console.log("Save Text : ", item.value, " and id  : ",  item.id.slice(4));
    console.log("Notes Are : ", notes);

    notes[item.id.slice(4)].text = item.value;
    localStorage.setItem('itemsArray', JSON.stringify(notes));

    // notes[item.id.slice(4)].productName = 
}

// function changeColor(element){
//   document.getElementsByTagName('body')[0].style.backgroundColor = '#' + picker.toString()
// }


function onClickDelete(id){
    console.log("ide of the element is : ", id, id.offsetTop, id.offsetLeft); 
}


function addItems(){
  
  console.log("Add Items called");

  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

  var lastItem = oldItems[oldItems.length-1];
  // console.log(lastItem);
  console.log("last item is : ", lastItem);
  // console.log("old items are : ", oldItems);
  // console.log("Y is : ", lastItem.y+10)
  var newItem = {
     color : lastItem ? (lastItem.color < 4 ?  lastItem.color +1 : 0 ) : 0,
     text : "",
     width : 200,
     height : 250,
     x : lastItem ? lastItem.x+10 : 20,
     y : lastItem ? lastItem.y : 20
  };
  oldItems.push(newItem);
  
  localStorage.setItem('itemsArray', JSON.stringify(oldItems));
  location.reload(); 

}




function saveNoteLocation(event){
    // console.log("Id for Savinfg location is : ",event.target.id.slice(4), " and x : ", event.pageX , "and Y : ", event.pageY);
    var target = event.target,
    x = (parseFloat(target.getAttribute('data-x')) || 0),
    y = (parseFloat(target.getAttribute('data-y')) || 0);

    console.log("parseFloat(target.getAttribute('data-y')) :   ", )
    notes[event.target.id.slice(4)].x =  x;
    notes[event.target.id.slice(4)].y =  y;
    localStorage.setItem('itemsArray', JSON.stringify(notes));
}



function saveNoteSize(event){
  var width = event.rect.width,
  height = event.rect.height;
  console.log("Size Changed : ",event);

  notes[event.target.id.slice(4)].width =  width;
  notes[event.target.id.slice(4)].height =  height;
  localStorage.setItem('itemsArray', JSON.stringify(notes));
}


function onClickDelete(item){

  var index = parseInt(item.id.slice(6)), oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
  console.log("Ärray before Deletion : ", oldItems);

  if ( index > -1) {
    oldItems.splice(index, 1);
  }
  
  localStorage.setItem('itemsArray', JSON.stringify(oldItems));
  console.log("Ärray after Deletion : ", oldItems);
  location.reload(); 

}



function changeColor(item){


  var color,index, target;
  index = parseInt(item.id.slice(4));
  
  if(parseInt(notes[index].color) < 5){
    notes[index].color = parseInt(notes[index].color)+1;
  }
  else{
    notes[index].color = 0;
  }
  

  target = document.getElementById('note'+index);

  switch(notes[index].color){
    case 0 : target.style.backgroundColor = "#70b2ff";break;
    case 1 : target.style.backgroundColor = "#ffe460";break;
    case 2 : target.style.backgroundColor = "#83ff7c";break;
    case 3 : target.style.backgroundColor = "#7cebff";break;
    case 4 : target.style.backgroundColor = "#ff8e8e";break;
    case 5 : target.style.backgroundColor = "#ffffff";break;
    default: target.style.backgroundColor = "#70b2ff";break;
  }

  localStorage.setItem('itemsArray', JSON.stringify(notes));
  
}


function addlinks(link){
  
}
