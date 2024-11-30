

// if there is no data in localStorage then just return empty
let todo = JSON.parse(localStorage.getItem("todo")) || [];
let archivedTasks = JSON.parse(localStorage.getItem("archivedTasks")) || []; // save the archived tasks
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const deleteCompletedButton = document.getElementById("deleteCompletedButton");
let todoCountP = document.querySelector(".todoCount-p");
const archievedButton = document.getElementById("archievedButton");
const homeButton = document.getElementById("home");

//while loading the page it will load the elements in it
document.addEventListener("DOMContentLoaded", function () {
 
  //add using click
  addButton.addEventListener("click", addTask);

  //add using enter button
  todoInput.addEventListener("keydown", function (event) { //we pass {keydown}  through the argument (event) 
    if (event.key === "Enter") {
      event.preventDefault(); // to prevent the default for the key enter from browser (to prevent any default action)
      addTask(); // after we prevent the default we will make enter do the fuction addTask
    }
  });

  deleteButton.addEventListener("click", deleteAllTasks);

  // 000000
  deleteCompletedButton.addEventListener("click", deleteCompletedTasks);
  archievedButton.addEventListener("click", displayArchivedTasks);
  homeButton.addEventListener("click", function () {
    document.querySelector('.search-field').value = ""; // clean up the search field
    displayTasks();
  });

// from that we conclude that (addTask /deleteAllTasks/displayTasks /deleteCompletedTasks ) are functions then we should declare these functions below
displayTasks();
});

// delete a task based on the index of it
function deleteTask(index) {
  todo.splice(index, 1); // delete from todo list
  saveToLocalStorage();  
  displayTasks();        // updates
}

// 1==============> displayTasks
function displayTasks() {
  todo = JSON.parse(localStorage.getItem("todo")) || [];
  archivedTasks = JSON.parse(localStorage.getItem("archivedTasks")) || [];
  //counter
  let incompleteTasksCount = 0;
  // delete old tasks from screen
  todoList.innerHTML = ""; 
  // to sort completed tasks down and incomplete tasks up
  const sortedTasks = todo.sort((a, b) => {
    if (a.completed === b.completed) return 0; // tasks are equal
    return a.completed ? 1 : -1; // move completed tasks to the bottom
  });

  sortedTasks.forEach((item, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
      <input type="checkbox" ${item.completed ? "checked" : ""} class="todo-checkbox"> 
      <span class="task-text ${item.completed ? "completed" : ""}">${item.text}</span>
      <i class="fa-solid fa-box-archive archive-btn"></i>
      <i class="fa-solid fa-trash deleteTask"></i>
    `;
    //we used ternary operator instead of (if statement)
    // item.completed ? "checked" : "" ===========>explaining  [if item==true then "checked" else ""]

     //if task is not completed
      if (!item.completed) {
        incompleteTasksCount++;
      }

    // change the status of the task item
    // if the task is "Completed" 
    taskItem.querySelector(".todo-checkbox").addEventListener("change", () => {
       toggleTask(index);  // we will create this function below (***)
    });

     //archieve the task
    // add archieved tasks
    taskItem.querySelector(".archive-btn").addEventListener("click", () => {
      archiveTask(index); //9999
    });

     // delete a task
     taskItem.querySelector(".deleteTask").addEventListener("click", () => {
      deleteTask(index);
    });

    todoList.appendChild(taskItem);
  });

 // the status before completed (0 incompleted)
  todoCountP.textContent = "";
  todoCountP.style.color = "rgb(0, 233, 0)";
  
  if(incompleteTasksCount === 0){
    todoCountP.textContent ="Completed!"
  }
  else{
    todoCountP.textContent = `${incompleteTasksCount} Incomplete`;
    todoCountP.style.color = "#97b8ff";
  }
}

// toggleTask (***) change the status of the task between completed and incompleted
function toggleTask(index) {
  // invert the state of task "completed"
  todo[index].completed = !todo[index].completed;

  //save new state
  saveToLocalStorage();

  // updates on screen
  displayTasks();
}

// 2====> addTask
function addTask() {
  const newTask = todoInput.value.trim(); 

  // to ensure that the input field  is not empty
  if (newTask !== "") {
    //any task has text and state(completed ====> true or false) then we add that in an object to (todo)
    todo.push({
      text: newTask,
      completed: false
    });

    //save the updates
    saveToLocalStorage();

   // after adding we delete the value of the input field
    todoInput.value = "";

    //updates
    displayTasks();
  }
}

// 3=======================>deleteAllTasks
function deleteAllTasks() {
  var sure = confirm("Are you sure you want to delete all tasks?");
  if (sure) { // delete all tasks
    todo = []; 
    saveToLocalStorage();
    displayTasks(); 
  } else {
    alert("No tasks were deleted.");
  }
}

// 4====================>deleteCompletedTasks
function deleteCompletedTasks() {
  // we make filter to know un completed tasks
  todo = todo.filter(task => !task.completed);

  // save updates
  saveToLocalStorage();

  displayTasks();
}

//9999
// function archiveTask(index) {
//   // move tasks to archive
//   const archivedTask = todo.splice(index, 1)[0];  //delete task from (todo)
//   archivedTasks.push(archivedTask);  // add task to archieved
//   saveToLocalStorage();
//   displayTasks();  // updates
  
// }//@@

// to displayArchivedTasks
function displayArchivedTasks() {
  todoList.innerHTML = "";  // delete tasks to dispaly just archieved tasks

  archivedTasks.forEach((task, index) => {
    const archivedItem = document.createElement("div"); //for each task to display it
    archivedItem.className = "task-item";
    archivedItem.innerHTML = `
      <span class="task-text">${task.text}</span>
      <i class="fa-solid fa-boxes-packing restore-btn"></i> 
      <i class="fa-solid fa-trash delete-btn"></i> 
    `;
        // restore archivedItem
        archivedItem.querySelector(".restore-btn").addEventListener("click", () => restoreTask(index));

        // delete archivedItem
        archivedItem.querySelector(".delete-btn").addEventListener("click", () => deleteArchivedTask(index));
        todoList.appendChild(archivedItem);
  });
}

// function to restore archivedItem
function restoreTask(index) {
  const restoredTask = archivedTasks.splice(index, 1)[0]; // delete task from archived list
  todo.push(restoredTask); // add archived item to list of normal tasks
  saveToLocalStorage();
  displayArchivedTasks();
}

// function to delete archivedItem
function deleteArchivedTask(index) {
  archivedTasks.splice(index, 1); // delete task from archived list
  saveToLocalStorage();
  displayArchivedTasks();
}

// save all of this to local storage
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
  localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
}

// displayUnarchivedTasks
function displayUnarchivedTasks() {
  
  todoList.innerHTML = ""; //delete all tasks to show just UnarchivedTasks
  const unarchivedTasks = todo.filter(task => !task.archived); 
  // displayUnarchivedTasks
  unarchivedTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} class="todo-checkbox">  
      <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
      <i class="fa-solid fa-box-archive archive-btn"></i>
    `;
    // add the icon
    taskItem.querySelector(".archive-btn").addEventListener("click", () => {
      archiveTask(index);
    });

    todoList.appendChild(taskItem);
  });
}

function archiveTask(index) {
  // add to archieved tasks
  const archivedTask = todo.splice(index, 1)[0];  // delete from todo
  archivedTasks.push(archivedTask);  // sdd to archieved
  saveToLocalStorage(); 
  // displayUnarchivedTasks();  
  displayTasks();  // Updates the task list without hiding any icons
} //@@


// (handle search input field)

document.addEventListener('DOMContentLoaded', () => {
  const searchIcon = document.querySelector('.fa-magnifying-glass');
  const inputSearch = document.querySelector('.input-search');
  const searchField = document.querySelector('.search-field');

   //initial status
  inputSearch.style.display = 'none';
  // inputSearch.style.width = '100%';

  //display search field
  searchIcon.addEventListener('click', () => {
    if (inputSearch.style.display === 'none') {
      inputSearch.style.display = 'block'; 
    } else {
      inputSearch.style.display = 'none'; 
    }
  });

    // to find a task 
  searchField.addEventListener('input', function () {
    const query = searchField.value.toLowerCase(); //the text inside input field
    const filteredTasks = todo.filter(task => task.text.toLowerCase().includes(query)); // the task should equals (query) ==> the text in the input field (it return an array of tasks)
    displayFilteredTasks(filteredTasks); //**
  });
});

// to show the tasks we searched about
//**
function displayFilteredTasks(filteredTasks) {
  todoList.innerHTML = ""; // delete old list to show the tasks we need

    //show tasks
  filteredTasks.forEach((item, index) => {
    const taskIndex = todo.findIndex(task => task.text === item.text); // original index of a task
    const taskItem = document.createElement("div"); // create div for each task
    taskItem.className = "task-item";
    //to keep the status of task
    taskItem.innerHTML = `
      <input type="checkbox" ${item.completed ? "checked" : ""} class="todo-checkbox">  
      <span class="task-text ${item.completed ? "completed" : ""}">${item.text}</span>
      <i class="fa-solid fa-box-archive archive-btn"></i>
      <i class="fa-solid fa-trash deleteTask"></i>
    `;

   // change the status
   taskItem.querySelector(".todo-checkbox").addEventListener("change", () => {
    toggleTask(taskIndex); // using original index
    displayFilteredTasks(filteredTasks); 
  });

 // archieve the tasks
 taskItem.querySelector(".archive-btn").addEventListener("click", () => {
  archiveTask(taskIndex);
  displayFilteredTasks(filteredTasks);
});

 // delete the task
 taskItem.querySelector(".deleteTask").addEventListener("click", () => {
  deleteTask(taskIndex); 
  displayFilteredTasks(filteredTasks); 
});
    todoList.appendChild(taskItem); // to add (TaskItem) to the list (todoList)
  });
}

// to change the status of the task
function toggleTask(index) {
  todo[index].completed = !todo[index].completed; // change the status
  saveToLocalStorage(); 
  displayTasks(); // updated
}

// one function to save all changes in the local storage
// save tasks to lacal storage && save archieved tasks to lacal storage
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo)); // save all normal tasks to local storage
  localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks)); // save all archieved tasks to local storage
}
//important note !!!!!
//we convert data (arrays & objects) to string when we save it to lacal storage  using JSON.stringify()
// and we convert the string to data (arrays & objects)when we retrieve it from local storage using JSON.parse()





