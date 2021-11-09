const taskContainer = document.querySelector(".task__container");
const modalContainer = document.querySelector(".modal__body");
let globalTaskData = [];

const generateHTML = (taskData) => {
  return `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card">
  <div class="card-header gap-2 d-flex justify-content-end">
    <button type="button" class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)">
      <i class="fas fa-pencil-alt" name=${taskData.id}></i>
    </button>
    <button type="button" class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
      <i class="fas fa-trash-alt" name=${taskData.id}></i>
    </button>
  </div>
  <div class="card-body">
    <img
      src=${taskData.image}
      alt="Card Image"
      class="card-img"
    />
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">
      ${taskData.description}
    </p>
    <span class="badge bg-primary">${taskData.type}</span>
  </div>
  <div class="card-footer">
    <button type="button" class="btn btn-outline-primary"  data-bs-toggle="modal"
    data-bs-target="#cardModal"
    onclick="openTask.apply(this, arguments)" name=${taskData.id}>
      Open Task
    </button>
  </div>
</div>
</div>
</div>`;
};

const generateModal = (taskData) => {
  const date = new Date(parseInt(taskData.id));
  return `<div id="${taskData.id}">
  <img
    src="https://images.unsplash.com/photo-1526429450415-2b979b89d228?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjR8fG5vdGVzfGVufDB8MHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    alt="modal-image"
    class="card-img mb-3"
  />
  <strong class="text-secondary">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${taskData.title}</h2>
  <p class="lead">${taskData.description}</p>
</div>
`;
};

const saveToLocalStorage = () =>
  localStorage.setItem("tasky", JSON.stringify({ card: globalTaskData }));

const insertToDOM = (content) =>
  taskContainer.insertAdjacentHTML("beforeend", content);

const addNewCard = () => {
  // Get task data
  const taskData = {
    id: `${Date.now()}`,
    image: document.getElementById("imageURL").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };
  console.log(taskData);

  globalTaskData.push(taskData);

  saveToLocalStorage();

  const newCard = generateHTML(taskData);

  insertToDOM(newCard);

  // Clear the form
  document.getElementById("imageURL").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};

// Load Card
const loadExistingCards = () => {
  // Check local storage
  const getData = localStorage.getItem("tasky");

  // Parse JSON data, if exists
  if (!getData) return;

  const taskCards = JSON.parse(getData);
  globalTaskData = taskCards.card;

  globalTaskData.map((taskData) => {
    // Generate HTML code for those data
    const newCard = generateHTML(taskData);

    // Insert to the DOM
    insertToDOM(newCard);
  });

  return;
};

// Delete Card
const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTask = globalTaskData.filter((task) => task.id !== targetID);
  globalTaskData = removeTask;

  saveToLocalStorage();

  //Access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

// Edit Card
const editCard = (event) => {
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
};

// Save Edit
const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  const updateGlobalTasks = globalTaskData.map((task) => {
    if (task.id === targetID) {
      console.log({ ...task, ...updatedData });
      return { ...task, ...updatedData };
    }
    return task;
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#cardModal");
  submitButton.innerHTML = "Open Task";
};

// Open Task

const openTask = (event) => {
  const targetID = event.target.getAttribute("name");
  const getTask = globalTaskData.filter(({ id }) => id === targetID);
  modalContainer.innerHTML = generateModal(getTask[0]);
};

// Search Task

const searchTask = (event) => {
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
  const resultData = globalTaskData.filter(({ title }) =>
    title.includes(event.target.value)
  );

  resultData.map((taskData) => {
    taskContainer.insertAdjacentHTML("beforeend", generateHTML(taskData));
  });
};
