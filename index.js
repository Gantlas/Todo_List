const init = () => {
  const data = {
    toDo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };

  const addCard = document.querySelector(".add-card");
  addCard.addEventListener("click", () => {
    if (document.querySelector("#create")) {
      return;
    }
    createItemForm(data);
  });

  const main = document.querySelector(".main");
  main.addEventListener("click", (event) => {
    if (event.target.classList.contains("basket")) {
      removeItem(data, event.target);
    } else if (event.target.classList.contains("arrow")) {
      transferItem(data, event.target);
    }
  });
};

const createItemForm = (data) => {
  const toDoList = document.querySelector(".todo__list");
  toDoList.innerHTML += `
    <div class="create-wrapper">
      <label for="title">Title:</label>
      <input id="title" type="text" placeholder="title"/>
      <label for="description">Description</label>
      <textarea id="description" rows="5" cols="30" placeholder="description"></textarea>
      <div class="btn-wrapper">
        <button id="create">create</button>
        <button id="cancel">cancel</button>
      </div>
    </div>`;
  const titleInput = toDoList.querySelector("#title");
  const descInput = toDoList.querySelector("#description");
  const createBtn = toDoList.querySelector("#create");
  const cancelBtn = toDoList.querySelector("#cancel");

  document.querySelector(".add-card").addEventListener("click", () => {});
  createBtn.addEventListener("click", () => {
    data.toDo.push({
      title: titleInput.value,
      desc: descInput.value,
    });
    displayList(data, toDoList);
  });
  cancelBtn.addEventListener("click", () => {
    displayList(data, toDoList);
  });
};

const displayList = (data, listNode) => {
  listNode.innerHTML = "";
  data[listNode.id].forEach((el) => {
    listNode.innerHTML += `<li class="list__item">
    <h3 class="item__title">${el.title}</h3>
    <p class="item__description">${el.desc}</p>
    <div class="icon-wrapper">     
      ${
        listNode.id === "deleted"
          ? ``
          : `<img class="icon arrow"  src="images/arrow.svg" alt="arrow" />
             <img class="icon pencil" src="images/pencil.svg" alt="pencil" />
             <img class="icon basket" src="images/trash.svg" alt="basket" />`
      }
    </div>
  </li>`;
  });
};

const removeItem = (data, basketNode) => {
  const itemNode = basketNode.closest(".list__item");
  const listNode = itemNode.parentNode;
  const deletedList = document.querySelector(".deleted__list");
  const title = itemNode.querySelector(".item__title").textContent;
  const desc = itemNode.querySelector(".item__description").textContent;

  const removeIndex = data[listNode.id].findIndex((el) => {
    return el.title === title && el.desc === desc;
  });

  data.deleted.push(data[listNode.id][removeIndex]);
  data[listNode.id].splice(removeIndex, 1);

  displayList(data, listNode);
  displayList(data, deletedList);
};

const transferItem = (data, arrowNode) => {
  const currentList = arrowNode.closest(".list__item").parentNode;
  const title = currentList.querySelector(".item__title").textContent;
  const desc = currentList.querySelector(".item__description").textContent;

  let transferNode = null;
  switch (currentList.id) {
    case "toDo":
      transferNode = document.querySelector("#inProgress");
      break;
    case "inProgress":
      transferNode = document.querySelector("#done");
      break;
    case "done":
      transferNode = document.querySelector("#deleted");
      break;
    default:
      transferNode = null;
  }

  if (transferNode) {
    const currentItemIndex = data[currentList.id].findIndex((el) => {
      return el.title === title && el.desc === desc;
    });

    data[transferNode.id].push(data[currentList.id][currentItemIndex]);
    data[currentList.id].splice(currentItemIndex, 1);

    displayList(data, currentList);
    displayList(data, transferNode);
  }
};

init();
