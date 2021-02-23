const LinkedList = require('./LinkedList');

const linkedList = new LinkedList;

linkedList.insertItem({id: 1, memory_value: 1, next: 2});
linkedList.insertItem({id: 2, memory_value: 1, next: 3});
linkedList.insertItem({id: 3, memory_value: 1, next: null});

linkedList.moveItem(1);