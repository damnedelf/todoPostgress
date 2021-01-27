var http = require("http");
var fs = require("fs");
var url = require("url");
const { nanoid } = require("nanoid");
var port = 5500;

var server = http.createServer();
const mongoose = require("mongoose");
const todo = require("./models/todo_model");
//db connect
mongoose.connect("mongodb://localhost/toDoCollection");
mongoose.connection
  .once("open", function () {
    console.log("connection is up");
  })
  .on("error", function (error) {
    console.log("error>>>>>>", error);
  });
//////create server + index +xhr js
server.on("request", function (request, response) {
  var requestUrl =new URL(request.url, `http://${request.headers.host}`);
  var urlParsed = url.parse(request.url, true);
  console.log(request.method);
  console.log(urlParsed.pathname);
  // console.log(request.headers);
  if (request.url == "/") {
    response.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile("index.html", function (err, data) {
      if (err) {
        response.write("smth go wrong ");
        response.end();
      } else {
        response.write(data);
        response.end();
      }
    });
    //drop db
  } else if (request.url == "/drop") {
    mongoose.connection.collections.todos.drop();
    console.log("dropped");
    /////////make new todo in mongo
  } else if (request.method == "POST"&&requestUrl.pathname=='/todo/post') {
    let person = new todo({
      name: urlParsed.query.message.toString(),
      id: nanoid(),
      isCompleted: false,
    });
    person.save();
    response.end(person.id);

    /////delete todo
  } else if (request.method == "DELETE"&&requestUrl.pathname ==`/todo/delete`) {
    todo.findOneAndRemove({ id: urlParsed.query.message }).then(function () {});
    //mark todo request
  } else if (request.method == "PATCH") {
    todo.findOne({ id: urlParsed.query.message }).then(function (result) {
      todo
        .findOneAndUpdate(
          { id: urlParsed.query.message },
          { $set: { isCompleted: !result.isCompleted } }
        )
        .then(function () {});
    });
    //mark all request
  } else if (request.method == "PUT") {
    let condition = urlParsed.query.message;
    todo
      .updateMany({}, { $set: { isCompleted: condition } })
      .then(function () {});
      //get array
  } else if (request.url=='/todo/getall'&&request.method=='GET') {
   todo.find({}).then(function(result){
       response.end(JSON.stringify(result));
      
   })
  }
  //get lenght for counter 
//   else if (request.url == "/todo/getlength") {
//  todo.find({}).then(function(result){
//   console.log(result.length);
 
// })
//   }
// else if (request.url == "/todo/getlength") {
//   todo.find({}).then(function(result){
//    let i = 0;
//     for(let a of result){
//      i++;
//    }
//   console.log(i);
//  })
//    }
else if (request.url == "/todo/getlength") {
 todo.estimatedDocumentCount({}).then(function(result){
   console.log(result);
 }) 
 
   }
else {
    response.writeHead(200, { "Content-Type": "application.js" });
    fs.readFile(`.${request.url}`, function (err, data) {
      if (err) {
        response.write("smth go wrong ");
        response.end();
      } else {
        response.write(data);
        response.end();
      }
    });
  }
  response.writeHead(200);
});
server.listen(port);
console.log("Browse to http://127.0.0.1:" + port);
