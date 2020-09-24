const init = () => {
  const data = {
    toDo: [],
    inProgress: [],
    done: [],
    deleted: [],
  };
  const addCard = document.querySelector(".add-card");
  const clearCard = document.querySelector(".clear-card");
  const listsArr = [...document.querySelectorAll(".list")];
  const form = document.querySelector(".create-form");
  let currentValue = null;

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

  clearCard.addEventListener("click", () => {
    data.deleted = [];
    displayList(data, listsArr[3]);
  });

  listsArr.forEach((list) => {
    list.addEventListener("click", (event) => {
      switch ((event, true)) {
        case event.target.matches(".basket"):
          removeItem(data, event.target);
          break;
        case event.target.matches(".arrow"):
          transferItem(data, event.target);
          break;
        case event.target.matches(".pencil") &&
          !document.querySelector(".edit-title"):
          currentValue = showEditInputs(event.target);
          break;
        case event.target.matches("#edit"):
          editItem(data, event.target, currentValue);
          break;
        case event.target.matches("#cancelEdit"):
          displayList(data, event.target.closest(".list"));
          break;
      }
    });

    list.addEventListener("mousedown", (event) => {
      if (event.target.matches(".list__item")) {
        const listItem = event.target.closest(".list__item");
        const listItemWidth = getComputedStyle(listItem).width;

        listItem.ondragstart = () => {
          return false;
        };

        const shiftX = event.clientX - listItem.getBoundingClientRect().left;
        const shiftY = event.clientY - listItem.getBoundingClientRect().top;

        listItem.style.position = "fixed";
        listItem.style.zIndex = 100;
        listItem.style.width = listItemWidth;

        const moveAt = (pageX, pageY) => {
          listItem.style.left = pageX - shiftX + "px";
          listItem.style.top = pageY - shiftY + "px";
        };

        let currentDroppable = null;

        const onMouseMove = (event) => {
          moveAt(event.pageX, event.pageY);

          listItem.style.display = "none";
          const elemBelow = document.elementFromPoint(
            event.clientX,
            event.clientY
          );
          listItem.style.display = "";

          if (!elemBelow) return;

          const droppableBelow = elemBelow.closest("section");
          if (droppableBelow !== currentDroppable) {
            if (currentDroppable) {
              currentDroppable.style.borderColor = "";
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
              currentDroppable.style.borderColor = "rgb(61, 62, 136)";
            }
          }
        };

        document.addEventListener("mousemove", onMouseMove);

        listItem.onmouseup = () => {
          if (currentDroppable) {
            dropTransfer(
              data,
              listItem,
              currentDroppable.querySelector(".list")
            );
            currentDroppable.style.borderColor = "";
          } else {
            displayList(data, listItem.closest(".list"));
            listItem.remove();
          }
          document.removeEventListener("mousemove", onMouseMove);
          listItem.onmouseup = null;
        };
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
          ? `<img class="icon arrow reverse"  src="images/arrow.svg" alt="arrow" />`
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

  commonFunction(data, listNode, deletedList, removeIndex);
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
    case "deleted":
      transferNode = document.querySelector("#toDo");
      break;
    default:
      transferNode = null;
  }

  if (transferNode) {
    const currentItemIndex = data[currentList.id].findIndex((el) => {
      return el.title === title && el.desc === desc;
    });

    commonFunction(data, currentList, transferNode, currentItemIndex);
  }
};

const commonFunction = (data, currentList, transferList, index) => {
  data[transferList.id].push(data[currentList.id][index]);
  data[currentList.id].splice(index, 1);

  displayList(data, currentList);
  displayList(data, transferList);
};

const showEditInputs = (pencilNode) => {
  const itemNode = pencilNode.closest(".list__item");
  const titleNode = itemNode.querySelector(".item__title");
  const descNode = itemNode.querySelector(".item__description");
  const title = titleNode.textContent;
  const desc = descNode.textContent;

  itemNode.querySelector(".icon-wrapper").style.display = "none";

  titleNode.innerHTML = `<input type="text" class="edit-title" placeholder="title" value="${title}"/>`;
  descNode.innerHTML = `<textarea class="edit-desc" cols="37" rows="5" placeholder="description">${desc}</textarea>`;
  itemNode.innerHTML += `
  <div class="btn-wrapper">
    <button id="edit">edit</button>
    <button id="cancelEdit">cancel</button>
  </div>`;

  return { title: title, desc: desc };
};

const editItem = (data, editBtnNode, currentValue) => {
  const itemNode = editBtnNode.closest(".list__item");
  const listNode = itemNode.parentNode;
  const newTitle = itemNode.querySelector(".edit-title").value;
  const newDesc = itemNode.querySelector(".edit-desc").value;

  const editionIndex = data[listNode.id].findIndex((el) => {
    return el.title === currentValue.title && el.desc === currentValue.desc;
  });

  data[listNode.id][editionIndex] = { title: newTitle, desc: newDesc };
  displayList(data, listNode);
};

const dropTransfer = (data, currentItemNode, transferListNode) => {
  const currentListNode = currentItemNode.closest(".list");

  const title = currentItemNode.querySelector(".item__title").textContent;
  const desc = currentItemNode.querySelector(".item__description").textContent;

  const currentItemIndex = data[currentListNode.id].findIndex((el) => {
    return el.title === title && el.desc === desc;
  });

  commonFunction(data, currentListNode, transferListNode, currentItemIndex);
};

init();
