var http = require("http");
var fs = require("fs");
var url = require("url");
const { nanoid } = require("nanoid");
var port = 5500;

var server = http.createServer();
const mongoose = require("mongoose");
const todo = require("./models/todo_model");
//db connect
mongoose.connect("mongodb://localhost/toDoCollection", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection
  .once("open", function () {
    console.log("connection is up");
  })
  .on("error", function (error) {
    console.log("error>>>>>>", error);
  });
//////create server + index +xhr js
server.on("request", function (request, response) {
  var requestUrl = new URL(request.url, `http://${request.headers.host}`);
  var urlParsed = url.parse(request.url, true);
  console.log(request.url);
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
    try {
      mongoose.connection.collections.todos.drop();
      response.end("db has been dropped");
    } catch (err) {
      response.end(`Oops.. error:...${err}`);
    }

    /////////make new todo in mongo
  } else if (request.method == "POST" && requestUrl.pathname == "/todo/post") {
    let person = new todo({
      name: urlParsed.query.message.toString(),
      id: nanoid(),
      isCompleted: false,
    });
    try {
      person.save();
      response.end(person.id);
    } catch (error) {
      response.write(`Some error ${error}`);
      response.end();
    }

    /////delete todo
  } else if (
    request.method == "DELETE" &&
    requestUrl.pathname == `/todo/delete`
  ) {
    try {
      todo
        .findOneAndRemove({ id: urlParsed.query.message })
        .then(function () {});

      response.end(`${urlParsed.query.message} deleted`);
    } catch (error) {
      response.write(`error ${error}`);
      response.end();
    }

    //mark todo request
  } else if (request.method == "PATCH") {
    try {
      todo.findOne({ id: urlParsed.query.message }).then(function (result) {
        todo
          .findOneAndUpdate(
            { id: urlParsed.query.message },
            { $set: { isCompleted: !result.isCompleted } }
          )
          .then(function () {
            response.end(`${urlParsed.query.message} updated`);
          });
      });
    } catch (error) {
      response.write(`error ${error}`);
      response.end();
    }
    //mark all request
  } else if (request.method == "PUT") {
    let condition = urlParsed.query.message;
    try {
      todo
        .updateMany({}, { $set: { isCompleted: condition } })
        .then(function () {
          response.end(`all updated`);
        });
    } catch (error) {
      response.write(`all updated error ${error}`);
      response.end();
    }
    //get array
  } else if (request.url == "/todo/getall" && request.method == "GET") {
    try {
      todo.find({}).then(function (result) {
        response.end(JSON.stringify(result));
      });
    } catch (error) {
      response.write(`get array from db ${error}`);
      response.end();
    }
  }
  //counter
  else if (request.url == "/todo/getall/count") {
    try {
      todo.find({}).then(function (result) {
        response.write(result.length + "");
        response.end();
      });
    } catch (error) {
      response.write(`get array from db ${error}`);
      response.end();
    }
  } else {
    response.writeHead(200, { "Content-Type": "application.js" });
    fs.readFile(`.${request.url}`, function (err, data) {
      if (err) {
        response.write(`smth go wrong ${err}`);
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
