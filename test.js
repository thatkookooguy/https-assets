(function createInlineDiagram() {
  let elementBeingDragged; // GLOBAL REFERENCE FOR ELEMENT BEING DRAGGED
  let startY, startHeight; // RESIZABLE DIV HELPERS

  init();

  function init() {
    injectStyleToHeader();
    const diagramContainer = createDiagramBox();
    createTreeCopyRecursive(document.body, diagramContainer);
    document.body.appendChild(diagramContainer);
  }

  /**
   * Create the container for the diagram.
   * Also adds event handlers for resize and
   * the "drop" part of the "drag n drop".
   */
  function createDiagramBox() {
    const diagramBox = document.createElement('div');
    diagramBox.id = 'kb-diagram';
    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    diagramBox.appendChild(resizer);

    // EVENTS
    resizer.addEventListener('mousedown', initResize, false);
    diagramBox.addEventListener('drop', onDrop, false);

    return diagramBox;
  }

  /**
   * Goes over the DOM itself, and while traversing it,
   * creates a diagram copy of the same structure.
   *
   * The recursive mostly helps in attaching the nodes
   * to the correct parent.
   *
   * @param {DomNode} node root of tree to traverse
   * @param {DomNode} newParent where to attach the diagram copy of the DOM
   */
  function createTreeCopyRecursive(node, newParent) {
    // Don't go over the diagram itself if present
    if (node.id === 'kb-diagram') {
      return;
    }

    // Skip script tags (but keep traversing after them)
    // not doing the same for kb-diagram since it's the last one
    if (node.nodeName !== 'SCRIPT') {
      const newElement = document.createElement('div');
      newElement.classList.add('kb-element-rep');
      const children = document.createElement('div');
      children.classList.add('children');
      newElement.innerHTML = `<div class="kb-title">${node.nodeName}<div/>`;
      newElement.appendChild(children);
      newElement.setAttribute('kb-name', node.nodeName);

      newElement.originalNode = node;

      // Don't allow user to move the body itself,
      // since that will be an illegal move
      if (node.nodeName !== 'BODY') {
        newElement.addEventListener('dragstart', onDragStart);
        newElement.setAttribute('draggable', true);
        newElement.addEventListener('dragover', onDragOver);
        newElement.addEventListener('dragleave', onDragLeave);
      }

      // generate a random color based on the string itself
      // so the color will be unique and repeatable
      newElement.style.backgroundColor = `#${str2RGB(node.nodeName)}`;
      newParent.appendChild(newElement);

      newElement.addEventListener('mouseover', onMouseOver, false);
      newElement.addEventListener('mouseout', onMouseOut, false);

      // recursive next step for children
      if (node.children.length) {
        createTreeCopyRecursive(node.children[0], children);
      }
    }

    // recursive next step for sibling
    if (node.nextElementSibling) {
      createTreeCopyRecursive(node.nextElementSibling, newParent);
    }
  }

  /**
   * creates a color based on a string.
   * The 'hello' substring was added to change
   * the color space a little to be more
   * pleasant :-)
   *
   * Source: https://www.designedbyaturtle.co.uk/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
   * @param {String} str
   */
  function str2RGB(str) {
    return intToARGB(hashCode(str + 'hello'));
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
      hex += '000000';
      return hex.substring(0, 6);
    }
  }

  /**
   * move DOM nodes. Basically used for the drag-n-drop
   * user interaction
   * @param {String} position should we move inside
   *   another element, right of it, or left of it
   * @param {DomNode} node2move the node we want to move
   * @param {DomNode} nodeTarget the node we want to move relative to
   */
  function moveElement(position, node2move, nodeTarget) {
    if (position === 'left') {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.parentNode.insertBefore(node2move, nodeTarget);
      return;
    }

    if (position === 'right') {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.parentNode.insertBefore(node2move, nodeTarget.nextSibling);
      return;
    }

    if (position === 'in') {
      node2move.parentNode.removeChild(node2move);
      nodeTarget.appendChild(node2move);
      return;
    }
  }

  function doesAncestorsContain(nodeStart, nodeFind) {
    let currentNode = nodeStart;
    while (currentNode && currentNode !== nodeFind) {
      currentNode = currentNode.parentNode;
    }

    return !!currentNode;
  }

  /* ************** */
  /* EVENT HANDLERS */
  /* ************** */

  /**
   * When user points mouse on diagram node,
   * highlight the original node as well.
   */
  function onMouseOver() {
    this.originalNode && this.originalNode.classList.add('kb-hover');
  }

  /**
   * The opposite of above function.
   * when stop hovering over element, remove the class
   */
  function onMouseOut() {
    this.originalNode && this.originalNode.classList.remove('kb-hover');
  }

  /**
   * handles finishing a drag-n-drop.
   * - Don't allow to drop on self (and children)
   * - Don't allow drop on items ouside the diagram
   * - Based on mouse position inside element, show coresponding
   *   border highlighting
   * @param {dragOverEvent} event
   */
  function onDragOver(event) {
    if (doesAncestorsContain(event.target, elementBeingDragged)) {
      event.target.style.border = '';
      return;
    }

    // prevent default to allow drop
    event.preventDefault();

    if (event.target.className !== 'kb-element-rep') {
      return;
    }

    const mouseX = window.event.pageX;
    const rect = event.target.getBoundingClientRect();
    const xInElement = mouseX - rect.left;

    if (xInElement < 10) {
      event.target.style.border = '';
      event.target.style.borderLeft = '5px solid black';
    } else if (rect.width - xInElement < 10) {
      event.target.style.border = '';
      event.target.style.borderRight = '5px solid black';
    } else {
      event.target.style.border = '5px solid black';
    }
  }

  /**
   * Save a reference to the dragged object on start
   */
  function onDragStart() {
    elementBeingDragged = event.target;
  }

  /**
   * remove any border styling when leaving a drop zone
   * @param {DragLeaveEvent} event
   */
  function onDragLeave(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className == 'kb-element-rep') {
      event.target.style.border = '';
    }
  }

  /**
   * When the ite is being dropped,
   * we need to move both the item itself,
   * and the DomNode it represent in the
   * original DOM
   * @param {DropEvent} event
   */
  function onDrop(event) {
    // prevent default action
    event.preventDefault();
    const target = event.target;
    if (target.className == 'kb-element-rep') {
      if (target.style.borderLeft) {
        moveElement('left', elementBeingDragged, target);
        moveElement(
          'left',
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }

      if (target.style.borderRight) {
        moveElement('right', elementBeingDragged, target);
        moveElement(
          'right',
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }

      if (event.target.style.border) {
        moveElement('in', elementBeingDragged, target);
        moveElement(
          'in',
          elementBeingDragged.originalNode,
          target.originalNode
        );
      }
      event.target.style.border = '';
    }
  }

  /* *************** */
  /* RESIZE HANDLERS */
  /* *************** */

  function initResize(e) {
    startY = e.clientY;
    startHeight = parseInt(
      document.defaultView.getComputedStyle(diagramContainer).height,
      10
    );
    document.documentElement.addEventListener('mousemove', doResize, false);
    document.documentElement.addEventListener('mouseup', stopResize, false);
  }

  function doResize(e) {
    diagramContainer.style.height = startHeight - e.clientY + startY + 'px';
  }

  function stopResize(e) {
    document.documentElement.removeEventListener('mousemove', doResize, false);
    document.documentElement.removeEventListener('mouseup', stopResize, false);
  }

  /* ******************* */
  /* UNGLY FUNCTIONS :-) */
  /* ******************* */

  function injectStyleToHeader() {
    const css = `
#kb-diagram {
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 300px;
z-index: 100000;
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

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';

    style.innerHTML = css;

    head.appendChild(style);
  }
})();
