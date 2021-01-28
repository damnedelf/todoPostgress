let data = localStorage.getItem("count"); //for check if localstorage is empty and pull or not
let status; // var for filters view
//filter btns


if (data && data != 0) {
  Store.get(View.showAll);
  View.filter(Store.getStatusFilter());
  Store.counter();
  View.counter(Store.getCount());
  View.showFooterBar(true, true);
} else if (data == 0) {
  View.showFooterBar(false, false);
}

emitter.subscribe(`event:test`, (data) => console.log(data));
//add todo > array,storage,html DOM
emitter.subscribe(`event:onEnter`, function (id) {
  let x = Store.getCount();
  x++;
  function postTodoCallback(result) {
    let todo = new Model(id, result);
    View.showTodo(todo);

    View.showFooterBar(true, true);
  }

  Store.postTodo(id, postTodoCallback);
  View.counter(x);
});

//delete/
emitter.subscribe(`event:onDelete`, function (id) {
  View.delete(id);
  let x = Store.getCount();
  x--;

  Store.delete(id);
  View.counter(x);
});
//mark
emitter.subscribe(`event:onMark`, function (id) {
  Store.update(id);
  View.mark(id);
});

//clear
emitter.subscribe(`event:onClear`, function () {
  localStorage.clear();
  Store.dropDb();
});

//mark em all
emitter.subscribe(`event:markAll`, function () {
  let status = markThemAllBtn.classList.contains("completed");
  View.markEmAll(status);
  markThemAllBtn.classList.toggle("completed");
  Store.updateAll(status);
});

//filters
emitter.subscribe(`event:allBtn`,()=>View.filter("all"));
emitter.subscribe(`event:activeBtn`,()=>View.filter("active"));
emitter.subscribe(`event:completedBtn`,()=>View.filter("completed"));
  
