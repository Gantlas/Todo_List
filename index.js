const init = () => {
  const data = {
    toDo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };
  const addCard = document.querySelector(".add-card");
  const listsArr = [...document.querySelectorAll(".list")];
  const form = document.querySelector(".create-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    createItem(data, form);
    form.reset();
  });

  form.addEventListener("reset", () => {
    form.style.display = "none";
  });

  addCard.addEventListener("click", () => {
    form.style.display = "block";
  });

  listsArr.forEach((list) => {
    list.addEventListener("click", (event) => {
      if (event.target.classList.contains("basket")) {
        removeItem(data, event.target);
      } else if (event.target.classList.contains("arrow")) {
        transferItem(data, event.target);
      } else if (event.target.classList.contains("pencil")) {
        // transferItem(data, event.target);
        editItem(data, event.target);
      }
    });
  });
};

const createItem = (data, form) => {
  const toDoList = document.querySelector(".todo__list");
  const titleInput = form.querySelector("#title");
  const descInput = form.querySelector("#description");

  data.toDo.push({
    title: titleInput.value,
    desc: descInput.value,
  });

  displayList(data, toDoList);
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
  const currentItem = arrowNode.closest(".list__item");
  const currentList = currentItem.parentNode;
  const title = currentItem.querySelector(".item__title").textContent;
  const desc = currentItem.querySelector(".item__description").textContent;

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

const editItem = (data, pencilNode) => {
  const itemNode = pencilNode.closest(".list__item");
  const listNode = itemNode.parentNode;
  const titleNode = itemNode.querySelector(".item__title");
  const descNode = itemNode.querySelector(".item__description");
  const title = titleNode.textContent;
  const desc = descNode.textContent;

  itemNode.querySelector(".icon-wrapper").style.display = "none";

  titleNode.innerHTML = `<input type="text" class="edit-title" placeholder="title" value="${titleNode.textContent}"/>`;
  descNode.innerHTML = `<textarea class="edit-desc" cols="37" rows="5" placeholder="description">${descNode.textContent}</textarea>`;
  itemNode.innerHTML += `
  <div class="btn-wrapper">
    <button id="edit">edit</button>
    <button id="cancelEdit">cancel</button>
  </div>`;

  itemNode.addEventListener("click", (event) => {
    if (event.target.matches("#edit")) {
      const newTitle = itemNode.querySelector(".edit-title").value;
      const newDesc = itemNode.querySelector(".edit-desc").value;

      const editionIndex = data[listNode.id].findIndex((el) => {
        return el.title === title && el.desc === desc;
      });

      data[listNode.id][editionIndex] = { title: newTitle, desc: newDesc };
      displayList(data, listNode);
    } else if (event.target.matches("#cancelEdit")) {
      displayList(data, listNode);
    }
  });
};

init();
