const inputText = document.querySelector("input.new-todo"); //input text
const markThemAllBtn = document.querySelector("#mark-em-all"); //btn for mark unmark;
const clrLclBtn = document.querySelector("#clear-local"); //clear local btn
let data = localStorage.getItem("count"); //for check if localstorage is empty and pull or not
let status; // var for filters view
//filter btns
let allBtn = document.querySelector("#all");
let activeBtn = document.querySelector("#active");
let completedBtn = document.querySelector("#completed");

if (data && data != 0) {
  Store.get(View.showAll);
  View.filter(Store.getStatusFilter());
  View.counterOnReload();
  View.showFooterBar(true, true);
} else if (data == 0) {
  View.showFooterBar(false, false);
}
let testBtn = document.querySelector("#testgetbtn");
testBtn.addEventListener("click", function () {
  //  function handler(result)
  //  {console.log(result)}
  console.log("done");
  Store.counter();
});
//add todo > array,storage,html DOM
inputText.addEventListener("keydown", function (e) {
  if (e.keyCode == 13 && this.value !== "") {
    let hint = this;
    //emit('todoAdded', new Model(hint.value, result));
    function postTodoCallback(result) {
      let todo = new Model(hint.value, result);
      View.showTodo(todo);

      hint.value = "";
      View.showFooterBar(true, true);
    }

    Store.postTodo(hint.value, postTodoCallback, View.counter);
  }
});
//delete/mark
mainSection.addEventListener("click", function (e) {
  let x = e.target;
  let id;
  if (x.className == "destroy") {
    id = x.id.slice(7);
    View.delete(id);

    Store.delete(id, View.counter);
  } else if (x.className == "toggle") {
    id = x.id.slice(5);
    Store.update(id);
    View.mark(id);
  }
});

//clear local storage
clrLclBtn.addEventListener("click", function () {
  localStorage.clear();
  Store.dropDb();
});

//mark em all
markThemAllBtn.addEventListener("click", function () {
  let status = markThemAllBtn.classList.contains("completed");
  View.markEmAll(status);
  markThemAllBtn.classList.toggle("completed");
  Store.updateAll(status);
});

//filters
allBtn.addEventListener("click", function () {
  View.filter("all");
});
activeBtn.addEventListener("click", function () {
  View.filter("active");
});
completedBtn.addEventListener("click", function () {
  View.filter("completed");
});
