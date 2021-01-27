class Store {
  constructor() {}
  static setCount(score) {
    localStorage.setItem("count", score);
  }
  static getCount() {
    return localStorage.getItem("count");
  }
  static get(callback) {
    fetch("/todo/getall", { method: "GET" })
      .then((response) => response.text())
      .then((result) => {
        callback(JSON.parse(result));
      });
  }
  static setStatusFilter(status) {
    localStorage.setItem("status", status);
  }
  static getStatusFilter() {
    return localStorage.getItem("status");
  }
  //make request for new todo in db and take id of dat todo
  static postTodo(name, callback) {
    fetch(`/todo/post?message=${name}`, { method: "POST" })
      .then((response) => response.text())
      .then((result) => {
        callback(result);
      });
  }
  //drop db
  static dropDb() {
    fetch("/drop", { METHOD: "DELETE" }).then(console.log("Db dropped"));
  }
  static getLength(callback) {
    fetch(`/todo/getlength`, { method: "GET" });
    // .then((response) => response.text())
    // .then((result) => {callback(result);

    // });
  }
  static delete(id) {
    fetch(`/todo/delete?message=${id}`, { method: "DELETE" }).then(
      console.log(`${id} deleted`)
    );
  }
  static update(id) {
    fetch(`/todo/patch?message=${id}`, { method: "PATCH" }).then(
      console.log(`updated ${id}`)
    );
  }
  static updateAll(status) {
    fetch(`/todo/put?message=${!status}`, { method: "PUT" });
  }
}
