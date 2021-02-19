class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertItem(item, next) {
    if (this.head === null) {
      this.head = new _Node(item, next);
    } else {
      let currNode = this.head;

      while (currNode.next.id !== item.id && currNode.next !== null) {
        currNode = currNode.next;
      }

      currNode.next = new _Node(item, next);
    }
  }

  moveItem(memoryValue) {
    let currNode = this.head;

    console.log('currNode', currNode);

    if (currNode) {
      // Hold node that needs to move (with its original next value)
      let movingNode = this.head;
      // let originalNext = movingNode.next;
      
      // Create counter
      let positionCounter = 0;
      let mValue = memoryValue;

      // Move it back _ spaces based on mValue
      if (currNode) {
        // While we haven't traversed far enough, or are not at the end of the list
        while (positionCounter !== mValue || currNode.next !== null) {
          console.log('currentNode', currNode);
          // Increment the position and current node
          positionCounter++;
          currNode = currNode.next;
        }
        console.log('currentNode', currNode);

        // Assign originalNext to head
        movingNode.next = currNode.next,
        currNode.next = movingNode.value
      }
    }
  }

  find(item) { 
    // Start at the head
    let currNode = this.head;
    // If the list is empty
    if (!this.head) {
        return null;
    }
    // Check for the item 
    while (currNode.value !== item) {
      console.log(currNode.value);
        /* Return null if it's the end of the list 
           and the item is not on the list */
        if (currNode.next === null) {
            return null;
        }
        else {
            // Otherwise, keep looking 
            currNode = currNode.next;
        }
    }
    // Found it
    console.log(currNode.value);
    return currNode;
  }

  remove(item){ 
    // If the list is empty
    if (!this.head) {
        return null;
    }
    // If the node to be removed is head, make the next node head
    if (this.head.value === item) {
        this.head = this.head.next;
        return;
    }
    // Start at the head
    let currNode = this.head;
    // Keep track of previous
    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
        // Save the previous node 
        previousNode = currNode;
        currNode = currNode.next;
    }
    if (currNode === null) {
        console.log('Item not found');
        return;
    }
    previousNode.next = currNode.next;
  }
}

module.exports = LinkedList;