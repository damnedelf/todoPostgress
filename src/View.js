const mainSection = document.querySelector(".main"); // main pole where uls lives
const filtersBar = document.querySelector("#footer-bar"); //footer bar with counter and filters
let todoUl = document.querySelector("#todo-list");
// tag visibility
function displayStyle(tag, visibility) {
  if (visibility) {
    tag.style = "display:block";
  } else {
    tag.style = "display:none";
  }
}

class View {
  constructor() {}
  static showFooterBar(x, y) {
    if (x) {
      displayStyle(mainSection, true);
    } else {
      displayStyle(mainSection, false);
    }
    if (y) {
      displayStyle(filtersBar, true);
    } else {
      displayStyle(filtersBar, false);
    }
  }
  static remove(element) {
    element.parentNode.parentNode.remove();
  }
  static markEmAll(status) {
    let liArray = mainSection.querySelectorAll("li");
    for (let li of liArray) {
      let mark = li.querySelector("input");
      if (status) {
        mark.checked = false;
        li.className = "";
      } else {
        li.className = "completed";
        mark.checked = true;
      }
    }
  }
  static counter() {
    let target = document.querySelector("#count");
   function handler(result)
    {
      let x = result;
      Store.setCount(x);
      if (x == 1) {
        target.textContent = `${x} item left`;
        View.showFooterBar(true, true);
      } else if (x > 1) {
        target.textContent = `${x} items left`;
      } else {
        View.showFooterBar(true, false);
      }
      
    }
    Store.counter(handler);

   
  }
  static counterOnReload() {
    let target = document.querySelector("#count");
    let x = Store.getCount();
    if (x == 1) {
      target.textContent = `${x} item left`;
      View.showFooterBar(true, true);
    } else if (x > 1) {
      target.textContent = `${x} items left`;
    } else {
      View.showFooterBar(true, false);
    }
  }
  static showAll(array) {
    for (let todo of array) {
      ToDoTemplate.showMeDom(todo);
    }
  }
  static showTodo(todo) {
    ToDoTemplate.showMeDom(todo);
  }
  static delete(id) {
    let li = document.getElementById(id);
    li.remove();
  }
  static mark(id) {
    let li = document.getElementById(id);
    li.classList.toggle("completed");
    let mark = li.querySelector("input");
    mark.checked = mark.checked;
  }
  static filter(status) {
    Store.setStatusFilter(status);
    let liArray = Array.from(mainSection.querySelectorAll("li"));
    if (status == "all") {
      for (let li of liArray) {
        li.setAttribute("style", "display:block");
      }
    } else if (status == "active") {
      for (let li of liArray)
        if (li.classList.contains("completed")) {
          li.setAttribute("style", "display:none");
        } else {
          li.setAttribute("style", "display:block");
        }
    } else if (status == "completed") {
      for (let li of liArray)
        if (li.classList.contains("completed")) {
          li.setAttribute("style", "display:block");
        } else {
          li.setAttribute("style", "display:none");
        }
    }
  }
  static clearDom() {
    todoUl.innerHTML = "";
  }
}
