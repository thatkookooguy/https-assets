(function createInlineDiagram() {
  let elementBeingDragged; // GLOBAL REFERENCE FOR ELEMENT BEING DRAGGED
  let startY, startHeight; // RESIZABLE DIV HELPERS

  injectStyleToHeader();
  const diagramContainer = createDiagramBox();
  createTreeCopyRecursive(document.body, diagramContainer);
  document.body.appendChild(diagramContainer);

  function createDiagramBox() {
    const diagramBox = document.createElement("div");
    diagramBox.id = "kb-diagram";
    diagramBox.innerHTML = "";
    // resizer
    const resizer = document.createElement("div");
    resizer.className = "resizer";
    diagramBox.appendChild(resizer);
    resizer.addEventListener("mousedown", initResize, false);

    diagramBox.addEventListener("drop", onDrop, false);

    return diagramBox;
  }

  function createTreeCopyRecursive(node, newParent) {
    if (node.id === "kb-diagram" || node.nodeName === "SCRIPT") {
      return;
    }

    const newElement = document.createElement("div");
    newElement.classList.add("kb-element-rep");
    const children = document.createElement("div");
    children.classList.add("children");
    newElement.innerHTML = `<div class="kb-title">${node.nodeName}<div/>`;
    newElement.appendChild(children);
    newElement.setAttribute("kb-name", node.nodeName);
    newElement.originalNode = node;

    if (node.nodeName !== "BODY") {
      newElement.addEventListener("dragstart", dragStart);
      // newElement.addEventListener('dragend', dragEnd);
      newElement.setAttribute("draggable", true);
      newElement.addEventListener("dragover", onDragOver);
      newElement.addEventListener("dragleave", dragLeave);
    }

    newElement.style.backgroundColor = `#${str2RGB(node.nodeName)}`;
    newParent.appendChild(newElement);

    newElement.addEventListener("mouseover", onMouseOver, false);
    newElement.addEventListener("mouseout", onMouseOut, false);

    if (node.children.length) {
      createTreeCopyRecursive(node.children[0], children);
    }

    if (node.nextElementSibling) {
      createTreeCopyRecursive(node.nextElementSibling, newParent);
    }
  }

  function str2RGB(str) {
    return intToARGB(hashCode(str + "hello"));

    function hashCode(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    }

    function intToARGB(i) {
      var hex =
          ((i >> 24) & 0xff).toString(16) +
          ((i >> 16) & 0xff).toString(16) +
          ((i >> 8) & 0xff).toString(16) +
          (i & 0xff).toString(16);
      hex += "000000";
      return hex.substring(0, 6);
    }
  }

  function onMouseOver() {
    this.originalNode && this.originalNode.classList.add("kb-hover");
  }

  function onMouseOut() {
    this.originalNode && this.originalNode.classList.remove("kb-hover");
  }

  function onDragOver(event) {
    if (event.target === elementBeingDragged) {
      event.target.style.border = "";
      return;
    }

    // prevent default to allow drop
    event.preventDefault();

    if (event.target.className !== "kb-element-rep") {
      return;
    }

    const mouseX = window.event.pageX;
    const rect = event.target.getBoundingClientRect();
    const xInElement = mouseX - rect.left;

    if (xInElement < 10) {
      event.target.style.border = "";
      event.target.style.borderLeft = "5px solid black";
    } else if (rect.width - xInElement < 10) {
      event.target.style.border = "";
      event.target.style.borderRight = "5px solid black";
    } else {
      event.target.style.border = "5px solid black";
    }
  }

  function dragStart() {
    elementBeingDragged = event.target;
  }

  function dragLeave(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className == "kb-element-rep") {
      event.target.style.border = "";
    }
  }

  function onDrop(event) {
    // prevent default action
    event.preventDefault();
    const target = event.target;
    if (target.className == "kb-element-rep") {
      if (target.style.borderLeft) {
        moveElement("left", elementBeingDragged, target);
        moveElement(
          "left",
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }

      if (target.style.borderRight) {
        moveElement("right", elementBeingDragged, target);
        moveElement(
          "right",
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }

      if (event.target.style.border) {
        moveElement("in", elementBeingDragged, target);
        moveElement(
          "in",
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }
      event.target.style.border = "";
    }
  }

  function moveElement(position, node2move, nodeTarget) {
    if (position === "left") {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.parentNode.insertBefore(node2move, nodeTarget);
      return;
    }

    if (position === "right") {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.parentNode.insertBefore(node2move, nodeTarget.nextSibling);
      return;
    }

    if (position === "in") {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.appendChild(node2move);
      return;
    }
  }

  function initResize(e) {
    startY = e.clientY;
    startHeight = parseInt(
      document.defaultView.getComputedStyle(diagramContainer).height,
      10
    );
    document.documentElement.addEventListener("mousemove", doResize, false);
    document.documentElement.addEventListener("mouseup", stopResize, false);
  }

  function doResize(e) {
    diagramContainer.style.height = startHeight - e.clientY + startY + "px";
  }

  function stopResize(e) {
    document.documentElement.removeEventListener("mousemove", doResize, false);
    document.documentElement.removeEventListener("mouseup", stopResize, false);
  }

  function injectStyleToHeader() {
    const css = `
#kb-diagram {
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 300px;
z-index: 100;
background: lightgrey;
overflow-y: auto;
resize: vertical;
padding-top: 0.5em;
}

.resizer {
height: 9px;
position: absolute;
left: 0;
right: 0;
top: 0;
cursor: n-resize;
}

.kb-title {
pointer-events: none;
}

.children {
display: flex;
align-items: flex-start;
flex-wrap: wrap;
}

.kb-element-rep {
border: 1px solid black;
display: inline-block;
padding: 0.5em;
min-width: 3em;
min-height: 3em;
margin: 0.1em;
}

.kb-hover {
background: rgba(0, 255, 0, 0.2) !important;
}
`;

    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.type = "text/css";

    style.innerHTML = css;

    head.appendChild(style);
  }
})();
