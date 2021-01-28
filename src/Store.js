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
        console.log(`catch`);
      })
      .catch((error) => alert(`get array from db ${error}`));
  }
  static setStatusFilter(status) {
    localStorage.setItem("status", status);
  }
  static getStatusFilter() {
    return localStorage.getItem("status");
  }
  //make request for new todo in db and take id of dat todo
  static postTodo(name, callback,callback2) {
    fetch(`/todo/post?message=${name}`, { method: "POST" })
      .then((response) => response.text())
      .then((result) => {
        callback(result);
      })
      .then(function(){callback2();})
      .catch((error) => alert(`some error : ${error}`));
  }
  //drop db
  static dropDb() {
    async function f() {
      try {
        let response = await fetch("/drop", { METHOD: "DELETE" });
        let message = await response.text();
        console.log(message);
      } catch (err) {
        let response = await fetch("/drop", { METHOD: "DELETE" });
        let message = await response.text();
        console.log(`${err}
        DB error ${message}`);
      }
    }
    f();
  }
  static delete(id,callback) {
    fetch(`/todo/delete?message=${id}`, { method: "DELETE" })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(function(){callback();})
      .catch((error) => alert(`error delete  ${error}`));
  }
  static update(id) {
    fetch(`/todo/patch?message=${id}`, { method: "PATCH" })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => alert(`error update ${error}`));
  }
  static updateAll(status) {
    fetch(`/todo/put?message=${!status}`, { method: "PUT" })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => alert(`error updated all  ${error}`));
  }
  static counter(handler) {
    fetch("/todo/getall/count", { method: "GET" })
      .then((response) => response.text())
      .then((result) => {
        handler(result);
      });
    // .then((response) => response.text())
    // .then((result) => {

    //   callback(result);
    // })
    // .catch(error=> alert(`get array from db ${error}`));
  }
}
