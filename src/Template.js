class ToDoTemplate {
  constructor() {}
  static showMeDom(todo) {
    let ul = document.querySelector(".todo-list");
    let li = document.createElement("li");
    li.id = todo.id;
    if (todo.isCompleted) {
      li.className = "completed";
    } else {
      li.className = "";
    }
    let div = document.createElement("div");
    div.className = "view";
    let markArea = document.createElement("input");
    markArea.className = "toggle";
    markArea.type = "checkbox";
    markArea.checked = todo.isCompleted;
    markArea.id = `mark-${todo.id}`;
    let label = document.createElement("label");
    label.textContent = todo.name;
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "destroy";
    deleteBtn.id = `delete-${todo.id}`;
    ul.append(li);
    li.append(div);
    div.append(markArea);
    div.append(label);
    div.append(deleteBtn);
  }
}
