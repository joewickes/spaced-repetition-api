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

  walkThroughIds() {
    if (this.head) {
      let currNode = this.head;
      while (currNode.next !== null) {
        currNode = currNode.next;
      }
      
    }
  }

  insertItem(item, next, head) {
    let currNode = null;
    if (head) {
      if (this.head) {
        if (this.head.value.id === next.id) {
          currNode = this.head
          this.head = new _Node(item, currNode);
        } else {
          this.head = new _Node(item, next);
        }
      } else {
        this.head = new _Node(item, next);
      }
    } else if (this.head === null) {
      this.head = new _Node(item, next);
    } else {
      
      let lastNode = null;
      currNode = this.head;
      while (currNode.next.hasOwnProperty('value')) {
        lastNode = currNode;
        currNode = currNode.next;
      }

      currNode.next = new _Node(item, next);
    }
  }

  moveItem(memoryValue) {
    let currNode = this.head;
    let origNext = this.head.next;

    if (currNode) {
      // Hold node that needs to move (with its original next value)
      let movingNode = this.head;
      // let originalNext = movingNode.next;
      
      // Create counter
      let positionCounter = 0;
      let mValue = memoryValue;

      // Move it back _ spaces based on mValue
      // While we haven't traversed far enough, or are not at the end of the list
      while (currNode.next !== null && positionCounter !== mValue) {
        // Increment the position and current node
        positionCounter++;
        currNode = currNode.next;
      }

      // Assign originalNext to head
      movingNode.next = currNode.next;
      currNode.next = movingNode;
      this.head = origNext;

      return {
        moving: {
          id: movingNode.value.id,
          next: movingNode.next.value.id
        }, 
        altered: {
          id: currNode.value.id,
          next: currNode.next.value.id
        }, 
        head: {
          id: this.head.value.id,
          next: this.head.next.value.id
        }
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
        return;
    }
    previousNode.next = currNode.next;
  }

  checkTranslation(guess) {
    if (!this.head) {
      return null;
    } else {
      if (this.head.value.translation === guess) {
        return true;
      } else {
        return false;
      }
    }
  }

  grabHeadInfo() {
    if (this.head) {
      return this.head.value;
    }
  }
}

module.exports = LinkedList;