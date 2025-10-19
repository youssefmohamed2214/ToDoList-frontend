let ToDoList = JSON.parse(localStorage.getItem('AllList')) || [];
let doneList = JSON.parse(localStorage.getItem('doneList')) || [];
let ToDoListbody = document.querySelector("tbody");
let taskInput = document.querySelector("#ToDoInput");
let dateInput = document.querySelector("#dueDate");
let priorityInput = document.querySelector("#priority");


let filterBy = document.querySelector('#filterBy');

let searchlist = [];

let nextTaskID = JSON.parse(localStorage.getItem('nextTaskID')) || 0;

let SortWith = JSON.parse(localStorage.getItem('SortWith')) || {
    type: 'Asc',
    catogory: 'sortTaskID'
};
sort(SortWith.type, SortWith.catogory);


//set placeholder for search input
let searchInput = document.querySelector('#searchInput');
let searchBy = document.querySelector('#searchBy');

// Convert onfocus to addEventListener
searchInput.addEventListener('focus', () => {
    if (searchBy.value === "Task Date") { searchInput.setAttribute('placeholder', 'YYYY-MM-DD'); } if (searchBy.value === "Due Date") { searchInput.setAttribute('placeholder', 'YYYY-MM-DD'); } if (searchBy.value === "Priority") { searchInput.setAttribute('placeholder', 'High, Medium, Low'); }
});

// Convert onblur to addEventListener
searchInput.addEventListener('blur', () => {
    if (searchInput.value.trim() === "") {
        searchInput.setAttribute('placeholder', 'Search tasks...');
    }
});

// Update placeholder when search type changes
searchBy.addEventListener('change', () => {
    if (searchBy.value === "Task Date" || searchBy.value === "Due Date") {
        searchInput.setAttribute('placeholder', 'YYYY-MM-DD');
    } else if (searchBy.value === "Priority") {
        searchInput.setAttribute('placeholder', 'High, Medium, Low'); 
    } else { 
        searchInput.setAttribute('placeholder', 'Search tasks...'); 
    }
    search();
});

//call search function
searchInput.addEventListener('input', search);


//call filter function
filterBy.addEventListener('change', Filter);



let AddToDoListBtn = document.querySelector("#AddBtn");
let deleteAllBtn = document.querySelector("#deleteAll");

setDefaultday();
outputToDo();



document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener('click', setupSorting);
});

function setupSorting(e) {
    if (ToDoList.length === 0 || ToDoList.length === 1) {
        return;
    }
    SortWith.type = e.target.classList.contains('Asc') ? 'Asc' : 'Desc';
    SortWith.catogory = e.target.classList.contains('sortTaskID') ? 'sortTaskID'
        : e.target.classList.contains('sortTasks') ? 'sortTasks'
            : e.target.classList.contains('sortDate') ? 'sortDate' : 'sortPriority';

    localStorage.setItem('SortWith', JSON.stringify(SortWith));
    sort(SortWith.type, SortWith.catogory);
}

function sort(type, catogory) {
    let onSortBtn;

    //check if the list is empty
    if (ToDoList.length === 0 || ToDoList.length === 1) {
        return;
    }


    //remove all 'on' classes from buttons
    document.querySelectorAll(".sort-btn").forEach(btn => {
        btn.classList.remove('on');
    });

    //conditions for sorting task id
    if (catogory === "sortTaskID" && type === 'Asc') {
        sortTaskIdAsc();
    } else if (catogory === "sortTaskID" && type === 'Desc') {
        sortTaskIdDesc();
    } else if (catogory === "sortTasks" && type === 'Asc') {
        sortTaskcontentAsc();
    } else if (catogory === "sortTasks" && type === 'Desc') {
        sortTaskcontentDesc();
    } else if (catogory === "sortDate" && type === 'Asc') {
        sortTaskDateAsc();
    } else if (catogory === "sortDate" && type === 'Desc') {
        sortTaskDateDesc();
    } else if (catogory === "sortPriority" && type === 'Asc') {
        sortTaskPriorityAsc();
    } else if (catogory === "sortPriority" && type === 'Desc') {
        sortTaskPriorityDesc();
    }



    function sortTaskIdAsc() {
        ToDoList.sort((taskID1, taskID2) => {
            return taskID1.id - taskID2.id;
        })
    }
    function sortTaskIdDesc() {
        ToDoList.sort((taskID1, taskID2) => {
            return taskID2.id - taskID1.id;
        })
    }




    function sortTaskcontentAsc() {
        ToDoList.sort((taskContent1, taskContent2) => {
            return taskContent1.task.localeCompare(taskContent2.task);
        })
    }
    function sortTaskcontentDesc() {
        ToDoList.sort((taskContent1, taskContent2) => {
            return taskContent2.task.localeCompare(taskContent1.task);
        })
    }



    function sortTaskDateAsc() {
        ToDoList.sort((taskDate1, taskDate2) => {
            return taskDate1.date.localeCompare(taskDate2.date);
        })
    }
    function sortTaskDateDesc() {
        ToDoList.sort((taskDate1, taskDate2) => {
            return taskDate2.date.localeCompare(taskDate1.date);
        })
    }

    function sortTaskPriorityAsc() {
        // Define priority order for sorting (low to high)
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        ToDoList.sort((a, b) => {
            const priorityA = a.priority || 'medium';
            const priorityB = b.priority || 'medium';
            return priorityOrder[priorityB] - priorityOrder[priorityA];
        });
    }

    function sortTaskPriorityDesc() {
        // Define priority order for sorting (high to low)
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        ToDoList.sort((a, b) => {
            const priorityA = a.priority || 'medium';
            const priorityB = b.priority || 'medium';
            return priorityOrder[priorityA] - priorityOrder[priorityB];
        });
    }

    localStorage.setItem('SortWith', JSON.stringify(SortWith));

    onSortBtn = document.querySelector(`.sort-btn.${catogory}.${type}`);
    if (onSortBtn) {
        onSortBtn.classList.add('on');
    } else {
        console.warn("Could not find sort button to highlight for:", catogory, type);
    }
    updateLocalStorage();
    outputToDo();
}




//deleteAll trigger
deleteAllBtn.addEventListener('click', delAll);



//delete single task ,edit single task and mark task done
ToDoListbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('actionsBtnDel')) {
        del(e.target.closest('tr'));
    }

    if (e.target.classList.contains('actionsBtnEdit')) {
        TaskEdit(e.target.closest('tr').dataset.index);
    }

    if (e.target.classList.contains('saveBtn')) {
        saveEdited(e.target.closest('tr'));
    }

    if (e.target.classList.contains('cancelButton')) {
        cancelEdit(e.target.closest('tr'));
    }
});

//handle enter to the edit text input
ToDoListbody.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target.classList.contains('EditTaskInput')
        || e.target.classList.contains('EditTaskDate'))) {
        saveEdited(e.target.closest('tr'));
    }
});

// add ToDoList in array
AddToDoListBtn.addEventListener('click', AddToDoList);





function AddToDoList() {
    const today = new Date();
    const year = today.getFullYear();

    let dataInput;
    ++nextTaskID;
    dataInput = {
        id: nextTaskID,
        task: taskInput.value.trim(),
        date: removespaces(dateInput.value),
        priority: priorityInput.value
    }

    localStorage.setItem('nextTaskID', JSON.stringify(nextTaskID));

    //restriction on edited date input
    if (dateInput.value === "") {
        showErrorToast('Date must contain value');
        valid = true;
    }


    //check for empty task
    if (dataInput.task === "") {
        showErrorToast("Task must be not empty");
        return 0;
    }

    //restriction on edited date input
    if (Number(dateInput.value.slice(0, 4)) < +year) {
        showErrorToast(`year must be not less than ${year}`);
        return 0;
    }

    //add task to array
    ToDoList.push(dataInput);
    taskInput.value = "";
    removeRepeated();
    sort(SortWith.type, SortWith.catogory);
    updateLocalStorage();
    outputToDo();
}


//read Todolist output it in screen
function outputToDo(value = ToDoList) {
    ToDoListbody.innerHTML = '';
    value.forEach((taskContent) => {
        //create elements for each task
        let taskTr = document.createElement('tr');
        let checkboxTd = document.createElement('td');
        let taskCheckbox = document.createElement('input');
        let taskTDELID = document.createElement('td');
        let taskTdElContent = document.createElement('td');
        let taskTdElDate = document.createElement('td');
        let taskTdElPriority = document.createElement('td');
        let priorityBadge = document.createElement('span');
        let ActionsELeTd = document.createElement('td');

        let actionsBtnDel = document.createElement('button');
        let actionsBtnEdit = document.createElement('button');

        //add classes
        taskTr.classList.add('taskTr');
        if (doneList.includes(taskContent.id)) {
            taskTr.classList.add('done');
        }

        // Setup checkbox
        checkboxTd.classList.add('checkbox-cell');
        taskCheckbox.setAttribute('type', 'checkbox');
        taskCheckbox.classList.add('task-checkbox');
        if (doneList.includes(taskContent.id)) {
            taskCheckbox.checked = true;
        }

        // Add event listener to checkbox
        taskCheckbox.addEventListener('change', (e) => {
            e.stopPropagation(); // Prevent event bubbling to the row
            const taskId = +taskTr.dataset.index;

            if (e.target.checked) {
                taskTr.classList.add('done');
                if (!doneList.includes(taskId)) {
                    doneList.push(taskId);
                }
            } else {
                taskTr.classList.remove('done');
                const doneIndex = doneList.indexOf(taskId);
                if (doneIndex > -1) {
                    doneList.splice(doneIndex, 1);
                }
            }
            localStorage.setItem('doneList', JSON.stringify(doneList));
        });

        taskTdElContent.classList.add('taskTdElContent');
        taskTdElDate.classList.add('taskTdElDate');
        taskTdElPriority.classList.add('taskTdElPriority');
        ActionsELeTd.classList.add('ActionsELeTd');
        actionsBtnDel.classList.add('actionsBtnDel');
        actionsBtnEdit.classList.add('actionsBtnEdit');
        taskTDELID.classList.add('taskTDELID');

        // Add priority badge
        priorityBadge.classList.add('priority-badge');
        priorityBadge.classList.add(taskContent.priority || 'medium');

        // Add icon based on priority
        let priorityIcon = document.createElement('i');
        if (taskContent.priority === 'high') {
            priorityIcon.className = 'fas fa-exclamation-circle priority-icon';
        } else if (taskContent.priority === 'medium') {
            priorityIcon.className = 'fas fa-dot-circle priority-icon';
        } else {
            priorityIcon.className = 'fas fa-angle-down priority-icon';
        }

        priorityBadge.appendChild(priorityIcon);
        priorityBadge.appendChild(document.createTextNode(taskContent.priority || 'medium'));

        //set attributes
        taskTr.setAttribute("data-index", taskContent.id);

        //add content in elements
        taskTdElContent.textContent = taskContent.task;
        taskTdElDate.textContent = taskContent.date;
        actionsBtnDel.innerHTML = '<i class="fas fa-trash-alt btn-icon"></i>Delete';
        actionsBtnEdit.innerHTML = '<i class="fas fa-edit btn-icon"></i>Edit';
        taskTDELID.textContent = taskContent.id;

        //connect elements and append to page
        checkboxTd.appendChild(taskCheckbox);
        taskTr.appendChild(checkboxTd);
        taskTr.appendChild(taskTDELID);
        taskTr.appendChild(taskTdElContent);
        taskTr.appendChild(taskTdElDate);
        taskTdElPriority.appendChild(priorityBadge);
        taskTr.appendChild(taskTdElPriority);
        ActionsELeTd.appendChild(actionsBtnEdit);
        ActionsELeTd.appendChild(actionsBtnDel);
        taskTr.appendChild(ActionsELeTd);

        ToDoListbody.appendChild(taskTr);
    })
    localStorage.setItem('nextTaskID', JSON.stringify(nextTaskID));
}

function setDefaultday(ret = false) {
    //set default value today for date
    // Get today's date
    const today = new Date();

    // Format it as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, add 1
    const day = String(today.getDate()).padStart(2, '0');

    // Set the value
    dateInput.value = `${year}-${month}-${day}`;
    if (ret) {
        return `${year}-${month}-${day}`;
    }
}


function del(trRem) {
    const dontAskKey = 'dontAskDeleteSingleTask';
    const shouldAskForConfirmation = localStorage.getItem(dontAskKey) !== 'true';

    function executeDeletionAndNotify() {
        const indexToDelete = Number(trRem.dataset.index);
        const doneIndex = doneList.indexOf(indexToDelete);
        if (doneIndex > -1) {
            doneList.splice(doneIndex, 1); // Remove from doneList if present
            localStorage.setItem('doneList', JSON.stringify(doneList)); // Update storage
        }
        // Remove the task from the array
        const arrayIndexToDelete = ToDoList.findIndex(task => task.id === indexToDelete);

        if (arrayIndexToDelete > -1) {
            ToDoList.splice(arrayIndexToDelete, 1);
        } else {
            console.error("Task with ID", indexToDelete, "not found in ToDoList for deletion.");
        }
        updateLocalStorage();
        outputToDo();
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            width: 'auto',
            padding: '0.6em 0.8em',
            customClass: {
                popup: 'custom-small-swal-toast'
            },
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: `<span style="font-size: 0.9em;">Task deleted!</span>`
        });
    }

    if (shouldAskForConfirmation) {
        Swal.fire({
            title: "Are you sure you want to delete this task?",
            text: "This action cannot be undone.",
            icon: 'warning',
            input: 'checkbox',
            inputPlaceholder: 'Don\'t ask me again',
            inputValue: 0,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Yes, delete task!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                executeDeletionAndNotify();
                if (result.value === 1) {
                    localStorage.setItem(dontAskKey, 'true');
                }
            }
        });
    } else {
        executeDeletionAndNotify();
    }
}


function delAll() {
    Swal.fire({
        title: "Are you sure you want to delete all tasks?",
        text: "This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Yes, delete all!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            ToDoList = [];
            doneList = [];
            localStorage.setItem('doneList', JSON.stringify(doneList));
            updateLocalStorage();
            outputToDo();
            Swal.fire(
                'Deleted!',
                'All tasks have been successfully deleted.',
                'success'
            );
        }
    });
}

//update local storage
function updateLocalStorage() {
    localStorage.setItem('AllList', JSON.stringify(ToDoList));
}

//edit single task
function TaskEdit(taskId) {
    // First, check if any row is already in edit mode and cancel that edit
    const existingEditInputs = document.querySelectorAll('.EditTaskInput');
    if (existingEditInputs.length > 0) {
        // There's already an edit in progress, cancel it first
        const editingRow = existingEditInputs[0].closest('tr');
        cancelEdit(editingRow);
    }

    //get all elements of tr to edit
    const taskElement = document.querySelector(`[data-index="${taskId}"]`);

    let taskTdElContent = taskElement.querySelector('.taskTdElContent');
    let taskTdElDate = taskElement.querySelector('.taskTdElDate');
    let taskTdElPriority = taskElement.querySelector('.taskTdElPriority');
    let ActionsELeTd = taskElement.querySelector('.ActionsELeTd');

    let actionsBtnEdit = ActionsELeTd.querySelector('.actionsBtnEdit');
    let actionsBtnDel = ActionsELeTd.querySelector('.actionsBtnDel');

    //create element input to edit value
    let EditTaskInput = document.createElement('input');
    //create the date input to edit value
    let EditTaskDate = document.createElement('input');
    //create the priority select to edit value
    let EditTaskPriority = document.createElement('select');

    //set attributes
    EditTaskInput.setAttribute("type", "text");
    EditTaskInput.setAttribute("value", taskTdElContent.textContent);

    EditTaskDate.setAttribute("type", "text");
    EditTaskDate.setAttribute("value", taskTdElDate.textContent);

    // Get current priority from the badge
    const currentPriority = taskTdElPriority.querySelector('.priority-badge').textContent;

    // Create priority options
    const priorities = ['high', 'medium', 'low'];
    priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        if (currentPriority === priority) {
            option.selected = true;
        }
        EditTaskPriority.appendChild(option);
    });

    //add classes
    EditTaskInput.classList.add('EditTaskInput');
    EditTaskDate.classList.add('EditTaskDate');
    EditTaskPriority.classList.add('EditTaskPriority');

    //add the input to the ui
    taskTdElContent.textContent = '';
    taskTdElContent.appendChild(EditTaskInput);
    //add the date edited to the ui
    taskTdElDate.textContent = '';
    taskTdElDate.appendChild(EditTaskDate);
    //add the priority select to the ui
    taskTdElPriority.innerHTML = '';
    taskTdElPriority.appendChild(EditTaskPriority);

    //hide the edit button to show the save button
    actionsBtnEdit.setAttribute('hidden', '');
    actionsBtnDel.setAttribute('hidden', '');

    //cancel button
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('cancelButton');
    cancelButton.textContent = 'Cancel';

    //save button
    let saveBtn = document.createElement('button');

    //add class to save button
    saveBtn.classList.add('saveBtn');

    //add content to save button
    saveBtn.textContent = 'Save';

    //add save btn to save edited data
    ActionsELeTd.appendChild(saveBtn);
    ActionsELeTd.appendChild(cancelButton);

    // Update action buttons creation
    actionsBtnDel.innerHTML = '<i class="fas fa-trash-alt btn-icon"></i>Delete';
    actionsBtnEdit.innerHTML = '<i class="fas fa-edit btn-icon"></i>Edit';

    // Update saveBtn and cancelButton creation in TaskEdit function
    saveBtn.innerHTML = '<i class="fas fa-save btn-icon"></i>Save';
    cancelButton.innerHTML = '<i class="fas fa-times btn-icon"></i>Cancel';
}


function saveEdited(EditedTr) {
    const today = new Date();
    const year = today.getFullYear();

    let datePattern = /^\d{4}-\d{2}-\d{2}$/;

    let EditTaskInput = EditedTr.querySelector('.EditTaskInput');
    let EditTaskDate = EditedTr.querySelector('.EditTaskDate');
    let EditTaskPriority = EditedTr.querySelector('.EditTaskPriority');
    let cancelButton = EditedTr.querySelector('.cancelButton');

    //input edited values
    let editedTaskValue = EditTaskInput.value.trim();
    let editedTaskDate = removespaces(EditTaskDate.value);
    let editedTaskPriority = EditTaskPriority.value;

    //btns
    let ActionsELeTd = EditedTr.querySelector('.actionsBtnEdit');
    let actionsBtnDel = EditedTr.querySelector('.actionsBtnDel');
    let saveBtn = EditedTr.querySelector('.saveBtn');

    //restriction on edited task input
    if (EditTaskInput.value.trim() === "") {
        showErrorToast('must contain value');
        return 0;
    }

    if (Number(EditTaskDate.value.slice(0, 4)) < +year) {
        showErrorToast(`must be not less than ${year}`);
        return 0;
    }

    //restriction on edited date input
    if (EditTaskDate.value === "") {
        showErrorToast('must contain value');
        return 0;
    }

    if (Number(EditTaskDate.value.slice(5, 7)) < 1 || Number(EditTaskDate.value.slice(8, 10)) < 1 ||
        Number(EditTaskDate.value.slice(5, 7)) > 12 || Number(EditTaskDate.value.slice(8, 10)) > 31) {
        showErrorToast(`day and month must be valid`);
        return 0;
    }

    if (!datePattern.test(editedTaskDate)) {
        showErrorToast(`Error: Use YYYY-MM-DD format, e.g., ${setDefaultday(true)}`);
        return 0;
    }

    ActionsELeTd.removeAttribute('hidden');
    actionsBtnDel.removeAttribute('hidden');
    saveBtn.remove();
    cancelButton.remove();

    let taskTdElPriority = EditedTr.querySelector('.taskTdElPriority');

    // Clear old content and create a new priority badge
    taskTdElPriority.innerHTML = '';
    let priorityBadge = document.createElement('span');
    priorityBadge.classList.add('priority-badge');
    priorityBadge.classList.add(editedTaskPriority);

    // Add icon based on priority
    let priorityIcon = document.createElement('i');
    if (editedTaskPriority === 'high') {
        priorityIcon.className = 'fas fa-exclamation-circle priority-icon';
    } else if (editedTaskPriority === 'medium') {
        priorityIcon.className = 'fas fa-dot-circle priority-icon';
    } else {
        priorityIcon.className = 'fas fa-angle-down priority-icon';
    }

    priorityBadge.appendChild(priorityIcon);
    priorityBadge.appendChild(document.createTextNode(editedTaskPriority));

    taskTdElPriority.appendChild(priorityBadge);

    EditTaskInput.outerHTML = editedTaskValue;
    EditTaskDate.outerHTML = editedTaskDate;

    let index = 0;
    ToDoList.forEach((el, i) => {
        if (+EditedTr.dataset.index === +el.id) {
            index = i;
        }
    });

    ToDoList[index].task = editedTaskValue;
    ToDoList[index].date = editedTaskDate;
    ToDoList[index].priority = editedTaskPriority;
    removeRepeated();
    sort(SortWith.type, SortWith.catogory);
}


function cancelEdit(editedTr) {
    let index = 0;
    let EditTaskInput = editedTr.querySelector('.EditTaskInput');
    let EditTaskDate = editedTr.querySelector('.EditTaskDate');
    let EditTaskPriority = editedTr.querySelector('.EditTaskPriority');
    let saveBtn = editedTr.querySelector('.saveBtn');
    let cancelButton = editedTr.querySelector('.cancelButton');
    let ActionsELeTd = editedTr.querySelector('.actionsBtnEdit');
    let actionsBtnDel = editedTr.querySelector('.actionsBtnDel');

    ToDoList.forEach((el, i) => {
        if (+editedTr.dataset.index === +el.id) {
            index = i;
        }
    });

    EditTaskInput.outerHTML = ToDoList[index].task;
    EditTaskDate.outerHTML = ToDoList[index].date;

    // Clear old content and create a new priority badge
    let taskTdElPriority = editedTr.querySelector('.taskTdElPriority');
    taskTdElPriority.innerHTML = '';
    let priorityBadge = document.createElement('span');
    priorityBadge.classList.add('priority-badge');
    priorityBadge.classList.add(ToDoList[index].priority || 'medium');

    // Add icon based on priority
    let priorityIcon = document.createElement('i');
    if (ToDoList[index].priority === 'high') {
        priorityIcon.className = 'fas fa-exclamation-circle priority-icon';
    } else if (ToDoList[index].priority === 'medium') {
        priorityIcon.className = 'fas fa-dot-circle priority-icon';
    } else {
        priorityIcon.className = 'fas fa-angle-down priority-icon';
    }

    priorityBadge.appendChild(priorityIcon);
    priorityBadge.appendChild(document.createTextNode(ToDoList[index].priority || 'medium'));

    taskTdElPriority.appendChild(priorityBadge);

    saveBtn.remove();
    cancelButton.remove();

    ActionsELeTd.removeAttribute('hidden');
    actionsBtnDel.removeAttribute('hidden');
}


function removespaces(inputX) {
    let input = inputX.trim();
    let output = "";
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== " ") {
            output += input[i];
        }
    }
    return output;
}

function removeRepeated() {
    let task;
    let date;
    for (let i = 0; i < ToDoList.length - 1; i++) {
        task = ToDoList[i].task;
        date = ToDoList[i].date;
        for (let j = i + 1; j < ToDoList.length; j++) {
            if (ToDoList[j].task === task && ToDoList[i].date === date) {
                ToDoList.splice(j, 1);
                showErrorToast("repeated task has been deleted");
            }
        }
    }
}


function showErrorToast(message) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end", // Or another position you prefer for errors
        showConfirmButton: false,
        timer: 3000, // Maybe a bit longer for errors so user can read
        timerProgressBar: true,
        icon: 'error', // Use error icon
        width: 'auto',
        padding: '0.6em 0.8em',
        customClass: {
            popup: 'custom-small-swal-toast' // Use your existing class
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        // title: message // Using title directly
        html: `<span style="font-size: 0.9em;">${message}</span>` // Or html for more control
    });
}


//search

function search() {
    if (searchInput.value.trim() === "") {
        outputToDo();
        return 0;
    }

    if (searchBy.value === "Task ID") {
        searchByID(searchInput.value.trim());
    }
    if (searchBy.value === "Task Content") {
        searchByTaskContent(searchInput.value.trim());
    }
    if (searchBy.value === "Due Date") { searchByDate(searchInput.value.trim()); }
    if (searchBy.value === "Priority") {
        searchByPriority(searchInput.value.trim());
    }
}
function searchByID(searchValue) {
    let searchResult = ToDoList.filter((task) => {
        if (task.id === +searchValue) {
            return task;
        }
    })
    outputToDo(searchResult);
}
function searchByTaskContent(searchValue) {
    let searchResult = ToDoList.filter((Task) => {
        return Task.task.toLowerCase().includes(searchValue);
    })
    outputToDo(searchResult);
}
function searchByDate(searchValue) {
    let searchResult = ToDoList.filter((task) => {
        if (task.date === searchValue) {
            return task;
        }
    })
    outputToDo(searchResult);
}
function searchByPriority(searchValue) {
    let searchResult = ToDoList.filter((task) => {
        if (task.priority === searchValue) {
            return task;
        }
    })
    outputToDo(searchResult);
}
//filter
function Filter() {
    if (filterBy.value === "all") {
        outputToDo();
    }
    if (filterBy.value === "completed") {
        Completed();
    }
    if (filterBy.value === "uncompleted") {
        unCompleted();
    }
}


function Completed() {
    let Completed = ToDoList.filter((task) => {
        if (doneList.includes(task.id)) {
            return task;
        }
    })
    outputToDo(Completed);
}
function unCompleted() {
    let unCompleted = ToDoList.filter((task) => {
        if (!doneList.includes(task.id)) {
            return task;
        }
    })
    outputToDo(unCompleted);
}

