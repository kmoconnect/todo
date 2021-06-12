// LocalStorage Controle

const LSCtrl = (function(){

    return {
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromLS: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItem: function(updateItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updateItem.ID === item.ID){
                    items.splice(index, 1, updateItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));

        },
        deleteItem: function(deleteItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(item.ID === deleteItem.ID){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItems: function(){
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    const Item = function(id, title, status){
        this.ID = id;
        this.title = title;
        this.status =  status;
    }
    
    const data = {
        items: LSCtrl.getItemsFromLS(),
        currentItem: null
    }

    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(title, status){
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].ID +1;
            } else {
                ID = 0;
            }

            // Create new item
            newItem = new Item(ID, title, status);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.ID === id){
                    found = item
                }
            });

            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        updateStatus: function(id, status){
            // loop trough all the items and set the status
            data.items.forEach(function(item){
                // match the id
                if(item.ID === id){
                    // change the status
                    item.status = status;
                    // change the currentItem
                    ItemCtrl.setCurrentItem(item);
                }
                
            });
            
        },
        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.ID;
            })

            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },
        activeItems: function(){

            const activeItems = data.items.filter(function(item){
                if(item.status === 0){
                    return item; 
                }
            });

            return activeItems;
           
        },
        completedItems: function(){

            const completedItems = data.items.filter(function(item){
                if(item.status === 1){
                    return item; 
                }
            });

            return completedItems;
           
        },
        clearAllItems: function(){
            data.items = [];
        },
        logData: function(){
            return data;
        }
    }
})()

// UI Controller
const UIctrl = (function(){
    const UIselectors = {
        mode: '.mode',
        form: '#new-item',
        todoInput: '#item',
        todoStatus: '#status',
        todoList: '#todos',
        todoItems: '#items',
        todoNav: '.nav',
        todoNavItems: '.number-items',
        todoNavAll: '#all',
        todoNavAllMobile: '.links.mobile #all',
        todoNavCompleted: '#completed',
        todoNavCompletedMobile: '.links.mobile #completed',
        todoNavActive: '#active',
        todoNavActiveMobile: '.links.mobile #active',
        todoNavLinks: '.links a',
        delete: '.delete',
        clearBtn: '#clear',
        activeLink: '.active'
    }   

    return {
        populateItems: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<div class="todo" id="todo-${item.ID}">
                        <input type="checkbox" ${(item.status === 1) ? `checked="true"` : ``}>
                        <span class="todo-title">${item.title}</span>
                        <img src="images/icon-cross.svg" class="delete">
                        </div>`;
            })

            // Insert todo items
            document.querySelector(UIselectors.todoItems).innerHTML = html;
        },
        getItemInput: function(){
            let status = 0;
            if(document.querySelector(UIselectors.todoStatus).checked){
                status = 1;
            }
            return {
                title: document.querySelector(UIselectors.todoInput).value,
                status: status
            }
        },
        addItem: function(item){
            // Show the nav
            document.querySelector(UIselectors.todoNav).style.display = 'flex';
            // Create element
            const newTodo = document.createElement('div');
            // Add className
            newTodo.className = 'todo';
            // Add Item ID
            newTodo.id = `todo-${item.ID}`;
            // Add draggable
            newTodo.draggable = true;
            // Add HTML
            newTodo.innerHTML = `<input type="checkbox" ${(item.status === 1) ? `checked="true"` : ``}>
                                <span class="todo-title">${item.title}</span>
                                <img src="images/icon-cross.svg" alt="delete todo" class="delete">`;

            document.querySelector(UIselectors.todoItems).insertAdjacentElement('beforeend', newTodo);

            return newTodo;
        },
        deleteItem: function(id){
            const deleteItem = document.querySelector(`#todo-${id}`);
            deleteItem.remove();
        },
        clearFields: function(){
            document.querySelector(UIselectors.todoInput).value = '';
            document.querySelector(UIselectors.todoStatus).checked = false;
        },
        showTotalItems: function(totalItems){
            if(totalItems === 0){
                document.querySelector(UIselectors.todoNavItems).textContent = `No items`;
            } else {
                document.querySelector(UIselectors.todoNavItems).textContent = `${totalItems} items left`;
            }
            
        },
        activeItems: function(activeItem){

            // output only the active items
            let output = '';
            activeItem.forEach(function(item){
                output += `<div class="todo" id="todo-${item.ID}">
                <input type="checkbox" ${(item.status === 1) ? `checked="true"` : ``}>
                <span class="todo-title">${item.title}</span>
                <img src="images/icon-cross.svg" class="delete">
                </div>`;

            });

            document.querySelector(UIselectors.todoItems).innerHTML = output;
        },
        completedItems: function(completedItems){

            // output only the active items
            let output = '';
            completedItems.forEach(function(item){
                output += `<div class="todo" id="todo-${item.ID}">
                <input type="checkbox" ${(item.status === 1) ? `checked="true"` : ``}>
                <span class="todo-title">${item.title}</span>
                <img src="images/icon-cross.svg" class="delete">
                </div>`;

            });

            document.querySelector(UIselectors.todoItems).innerHTML = output;
        },
        removeItems: function(){
            document.querySelector(UIselectors.todoItems).innerHTML = '';
        },
        removeTodoActive: function(){
            const activeLinks = document.querySelectorAll(UIselectors.todoNavLinks);
            activeLinks.forEach(function(link){
                link.removeAttribute('class');
            });
        },
        getSelectors: function(){
            return UIselectors;
        }
    }

})();

// App controller

const App = (function(UIctrl, ItemCtrl, LSCtrl){
    // Load Event Listeners
    const loadEventListeners = function(){
        const UIselectors = UIctrl.getSelectors();

        // change mode: dark / light
        document.querySelector(UIselectors.mode).addEventListener('click', changeMode);

        // form submit new todo item
        document.querySelector(UIselectors.form).addEventListener('submit', addNewItem);

        // Todo nav Active items
        document.querySelector(UIselectors.todoNavActive).addEventListener('click', showActiveItems);
        
        // for mobile Active items
        document.querySelector(UIselectors.todoNavActiveMobile).addEventListener('click', showActiveItems);

        // Todo nav Completed  items
        document.querySelector(UIselectors.todoNavCompleted).addEventListener('click', showCompletedItems);

        // for mobile Completed items
        document.querySelector(UIselectors.todoNavCompletedMobile).addEventListener('click', showCompletedItems);

        // Todo nav All items
        document.querySelector(UIselectors.todoNavAll).addEventListener('click', showAllItems);

        // for mobile All items
        document.querySelector(UIselectors.todoNavAllMobile).addEventListener('click', showAllItems);

        // Delete event
        document.querySelector(UIselectors.todoList).addEventListener('click', changeItem);

        // Clear
        document.querySelector(UIselectors.clearBtn).addEventListener('click', clearItems);
    }

    // change body class
    function changeMode(){
        if(document.body.className === 'light-mode'){
            document.body.className = 'dark-mode';
        } else if(document.body.className === 'dark-mode'){
            document.body.className = 'light-mode';
        }
    }

    // Submit new item
    function addNewItem(e){
        e.preventDefault();
        const input = UIctrl.getItemInput();
        // Validate form
        if(input.title !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.title, input.status);

            // Add item to UI
            const dragAble = UIctrl.addItem(newItem);

            dragAble.addEventListener('dragstart', dragStart);
            dragAble.addEventListener('dragend', dragEnd);
            dragAble.addEventListener('dragover', dragOver);

            // Show total items
            UIctrl.showTotalItems(ItemCtrl.getItems().length);

            // Add to localStorage
            LSCtrl.storeItem(newItem);

            // Clear fields
            UIctrl.clearFields();
        }
    }

    // Display active items
    const showActiveItems = function(e){
        e.preventDefault();

        // get the active items
        const activeItems = ItemCtrl.activeItems();

        // passing only the id with status 1
        UIctrl.activeItems(activeItems);

        // remove first all the active class
        UIctrl.removeTodoActive();

        // set the active class
        e.target.className = 'active';
        
    }

    const showCompletedItems = function(e){
        e.preventDefault();

        const completedItems = ItemCtrl.completedItems();

        // show all completed items
        UIctrl.completedItems(completedItems);

        // remove first all the active class
        UIctrl.removeTodoActive();

        // set the active class
        e.target.className = 'active';
    }

    const showAllItems = function(e){
        // Fetch items from data structure
        const items = ItemCtrl.getItems();

        // show all the items
        UIctrl.populateItems(items);
        
        // remove first all the active class
        UIctrl.removeTodoActive();
        
        // set the active class
        e.target.className = 'active';
    }

    // Delete item or change status with event delegation
    const changeItem = function(e){

        // Delete item when clicking on delete icon
        if(e.target.classList.contains('delete')){
            // get the parent item id
            const todoItemID = e.target.parentNode.id;
            // break into array by splitting -
            const idArray = todoItemID.split('-');
            // get just the ID
            const id = parseInt(idArray[1]);

            // get item to delete
            const itemToDelete = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToDelete);

            // Get current item
            const currentItem = ItemCtrl.getCurrentItem();

            // Delete from data structure
            ItemCtrl.deleteItem(currentItem.ID);

            // Delete from UI
            UIctrl.deleteItem(currentItem.ID);

            // Delete from localStorage
            LSCtrl.deleteItem(currentItem);

            // Show total items
            UIctrl.showTotalItems(ItemCtrl.getItems().length);
            
        }

        // update status when checked on checkbox
        if(e.target.nodeName === 'INPUT'){
             // get the parent item id
             const todoItemID = e.target.parentNode.id;
             // break into array by splitting -
             const idArray = todoItemID.split('-');
             // get just the ID
             const id = parseInt(idArray[1]);
 
             // get item to update
             const itemToUpdate = ItemCtrl.getItemById(id);
            
             // Set the status
             let status;
             if(e.target.checked){
                status = 1;
             } else {
                status = 0;
             }

             // Update from data structure
             ItemCtrl.updateStatus(itemToUpdate.ID, status);
             // update in localStorage
             LSCtrl.updateItem(ItemCtrl.getCurrentItem());

        }
    }

    const clearItems = function(){
        // Clear items in Item Controller
        ItemCtrl.clearAllItems();

        // Clear Items in UI Controller
        UIctrl.removeItems();

        // Clear localStorage
        LSCtrl.clearItems();
    }

    let selected;
    // Start drag
    function dragStart(item){
        item.target.classList.add('hovered');
        selected = item.target;
      
    }

    // Stop drag
    function dragEnd(item){
        item.target.classList.remove('hovered');
      
    }

    // Drag Over
    function dragOver(item){
        item.preventDefault();
        item.target.parentNode.insertBefore(selected, item.target.nextSibling)
    }

    return {
        init: function(){
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Populate items
            UIctrl.populateItems(items);
            // Show total items
            UIctrl.showTotalItems(items.length);

            // Load event listeners
            loadEventListeners();
        }
    }

})(UIctrl, ItemCtrl, LSCtrl)

App.init();