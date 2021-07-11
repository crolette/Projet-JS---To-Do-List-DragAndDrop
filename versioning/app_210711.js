const toDoList = document.querySelector(".todo");
const onGoingList = document.querySelector(".ongoing");
const lists = [...document.querySelectorAll(".list")];
const addToDoForm = document.querySelector(".form__todo");
const deleteZone = document.querySelector(".delete");
let id = 1;

let toDos = [];

/* Exemples de to do chargés si aucunes to do n'a été trouvé dans le local storage */
let toDosExamples = [
  {
    id: 1,
    title: "Exemple 1",
    description: "Ne pas oublier de ramener les casiers vides",
    tag: ["home", "holiday"],
    assignee: "avatar1",
    deadline: "12/08/2021",
    list: "todo",
  },
  {
    id: 2,
    title: "Exemple 2",
    description: "Appeler le garage",
    tag: ["home"],
    assignee: "avatar2",
    deadline: "12/07/2021",
    list: "ongoing",
  },
  {
    id: 3,
    title: "Exemple 3",
    description: "Faire un petit projet de To Do list",
    tag: ["home"],
    assignee: "avatar5",
    deadline: "12/07/2021",
    list: "done",
  },
];

const test = 2
console.log(document.querySelector(`[data-id='${test}']`))

// EventListeners

addToDoForm.addEventListener("submit", (e) => {
    if(!checkboxRequired()) {
        e.preventDefault()
    }
})

function cardsEvent() {
  const cards = [...document.querySelectorAll(".card")];
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });
}

lists.forEach((list) => {
  list.addEventListener("dragover", function (e) {
    dragOverList(list, e);
  });
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", function (e) {
    dragLeaveList(list, e);
  });
  list.addEventListener("drop", function (e) {
    drop(list, e);
  });
});

function addEventDelete() {
  deleteZone.addEventListener("dragover", dragOver);
  deleteZone.addEventListener("dragenter", dragEnter);
  deleteZone.addEventListener("dragleave", dragLeave);
  deleteZone.addEventListener("drop", function (e) {
    deleteToDo(e);
  });
}



function deleteToDo(e) {
  const id = e.dataTransfer.getData("text/plain");

  // Filtre les to do qui n'ont pas l'id de l'item à supprimer
  let newtoDos = [...toDos].filter((item) => item.id.toString() !== id);
  toDos = newtoDos;
  localStorage.setItem("toDos", JSON.stringify(toDos));
  localStorage.setItem("id", highestIdToDo());
  const toDelete = document.getElementById(id);
  console.log(toDelete)
  toDelete.remove();
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  deleteZone.classList.remove("hide");
  addEventDelete();
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}

function dragEnd(e) {
  e.target.classList.remove("hide");
  deleteZone.classList.add("hide");
}

function dragOver(e) {
  e.preventDefault();
}


function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragOverList(list, e) {
  e.preventDefault();
  list.classList.add("hover");
}

function dragLeaveList(list, e) {
  e.preventDefault();
  list.classList.remove("hover");
}

function drop(list, e) {
  list.classList.remove("hover");

  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);
  changeToDoList(id, list);

  list.appendChild(draggable);

  // display the draggable element
  draggable.classList.remove("hide");
}

// Recherche le plus grand id dans le tableau
function highestIdToDo() {
    let toDosTemp = JSON.parse(localStorage.getItem("toDos"));
    let id = 0
    // map va renvoyer un tableau avec tous les numéros d'id et math.max.apply va prendre le nombre le plus grand
    id = Math.max.apply(null, toDosTemp.map(item => item.id))
    return id >= 0 ? id : 0
}


function changeToDoList(id, list) {
  let listName = list.className.replace(/list /i, "").replace(/ hover/i, "");
  let toDosTemp = JSON.parse(localStorage.getItem("toDos"));
  toDosTemp[id - 1].list = listName;
  localStorage.setItem("toDos", JSON.stringify(toDosTemp));
}

window.onload = checkToDo();

function checkToDo() {
  const parameters = location.search.substring(1).split("&");

  if (
    JSON.parse(localStorage.getItem("toDos")) === null &&
    parameters[0] === ""
  ) {
    addToDosToList(toDosExamples);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) === null &&
    parameters[0] != ""
  ) {
    addInfoToDo();
    addToDosToList(toDos);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) != null &&
    parameters[0] != ""
  ) {
    toDos = JSON.parse(localStorage.getItem("toDos"));
    addInfoToDo();
    addToDosToList(toDos);
  } else if (
    JSON.parse(localStorage.getItem("toDos")) != null &&
    parameters[0] === ""
  ) {
    toDos = JSON.parse(localStorage.getItem("toDos"));
    addToDosToList(toDos);
  }
}

function addInfoToDo() {
  const parameters = location.search.substring(1).split("&");

  /* récupère l'id sauvé dans le localstorage */
  id = JSON.parse(localStorage.getItem("id"));
  console.log(id)
  let newTodo = {};
  newTodo.id = id + 1;
  newTodo.list = "todo";
  let tags = [];

  for (x in parameters) {
    let temp = parameters[x].split("=");
    thevar = unescape(temp[0]);

    thevalue = unescape(temp[1]).replaceAll("+", " ");
    if (thevar === "tag") {
      tags.push(thevalue);
      newTodo[thevar] = tags;
    } else if (thevar === "deadline") {
      newTodo[thevar] = new Date(thevalue);
    } else {
      newTodo[thevar] = thevalue;
    }
  }

  if (!compare(newTodo, toDos[toDos.length - 1])) {
    toDos.push(newTodo);
  }
}

function addToDosToList(toDoList) {
  toDoList.forEach((toDo) => {
    const date = new Date(toDo.deadline);

    let temp = `
        <div class="card" id="${toDo.id}" draggable="true">
        <div class="card__content">
          <div class="content__title">
            <h3>${toDo.title}</h3>
            <img src="./images/${
              toDo.assignee
            }.png" alt="" class="img__assignee" />
          </div>
          <div class="content__text">
            <p>
             ${toDo.description}
            </p>
          </div>
          <div class="content__footer">
            <div class="footer__tags">
            ${toDo.tag
              .map(
                (tag) =>
                  `<span class="tag tag--${tag.toLowerCase()}">${tag}</span>`
              )
              .join("")}
            </div>
            <div class="footer__deadline">
              <img src="./images/timer-outline.svg" alt="" />
              <p>${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>
        `;

    document
      .querySelector(`.${toDo.list}`)
      .insertAdjacentHTML("beforeend", temp);

    cardsEvent();
  });

  localStorage.setItem("toDos", JSON.stringify(toDoList));
  localStorage.setItem("id", highestIdToDo());
}

/* Fonction qui compare si la nouvelle to-do est la même que la dernière entrée. Pour éviter lors de plusieurs rechargement de page de recréer plusieurs fois la to-do */
function compare(obj1, obj2) {
  let obj1Temp = { ...obj1 };
  let obj2Temp = { ...obj2 };

  delete obj1Temp.id;
  delete obj2Temp.id;
  delete obj1Temp.list;
  delete obj2Temp.list;

  if (JSON.stringify(obj1Temp) === JSON.stringify(obj2Temp)) {
    return true;
  } else {
    return false;
  }
}

function checkboxRequired () {
    const checkboxes = [...document.getElementsByName("tag")]
    let checked = false
    checkboxes.forEach(checkbox => {
        if(checkbox.checked) {
            console.log("true")
            checked = true
        }
    })
    return checked
}

console.log(checkboxRequired())


