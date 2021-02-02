var http = require("http");
var fs = require("fs");
const { nanoid } = require("nanoid");
//database
const db = require(`../db`);
const Todos = require(`../models/todo_model`);
var port = 5500;
var server = http.createServer();
/////////
const app = require(`./Router`)(server);

//test db
db.authenticate()
  .then(() => console.log(`db connected`))
  .catch((err) => console.log(`error: ${err}`));

// //////create server + index +xhr js
server
  .on("request", function (request, response) {
    var requestUrl = new URL(request.url, `http://${request.headers.host}`);
    console.log(request.url);
    console.log(request.method);
    console.log(requestUrl.pathname);
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
    } else {
      let splittedUrl = request.url.split(".");
      let isJs =
        splittedUrl[splittedUrl.length - 1] &&
        splittedUrl[splittedUrl.length - 1].toLowerCase() === "js";
      if (!isJs) {
        return;
      }
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
  })
  .listen(port);

//routes
app.post("/todo/post", function (req, res) {
  let body = "";

  req.on(`data`, (chunk) => {
    body += chunk.toString();
    const data = {
      name: body,
      isCompleted: false,
    };
    let { name, isCompleted } = data;
    Todos.create({
      name,
      isCompleted,
    }).then((todo) => {
      res.end(todo.dataValues.id + "");
    });
  });
});

app.drop("/drop", function (req, res) {
  console.log(`got caught`)
  try {
    Todos.destroy({
      where: {},
    });
    res.end();
  } catch (err) {
    console.log(err);
  }
});
app.delete(`/todo/delete`, function (req, res) {
  let body = "";
  req.on(`data`, (chunk) => {
    body += chunk.toString();

    Todos.destroy({
      where: { id: body },
    })
      .then(function () {
        res.end();
      })
      .catch((err) => console.log(`add error ${err}`));
  });
});
app.patch(`/todo/patch`, function (req, res) {
  let body = "";
  req.on(`data`, (chunk) => {
    body += chunk.toString();

    Todos.findOne({
      where: { id: body },
    })
      .then(function (result) {
        Todos.update(
          { isCompleted: !result.isCompleted },
          {
            where: {
              id: body,
            },
          }
        );
        res.end(`element with id ${body} updated`);
      })
      .catch((err) => console.log(`add error ${err}`));
  });
});
app.put("/todo/put", function (req, res) {
  let body = "";
  req.on(`data`, (chunk) => {
    body += chunk.toString();

    Todos.update(
      { isCompleted: body },
      {
        where: {},
      }
    )
      .then(function () {
        res.end("all updated");
      })
      .catch((err) => console.log(`add error ${err}`));
  });
});
app.get("/todo/getall", function (req, res) {
  try {
    Todos.findAll().then((result) => res.end(JSON.stringify(result)));
  } catch (err) {
    console.log(err);
  }
});
app.count(`/todo/getall/count`, function (req, res) {
  try {
    Todos.findAll().then(function (result) {
      let array = Array.from(result);
      let length = array.length;
      res.end(length + "");
    });
  } catch (err) {
    console.log(err);
  }
});

// server.listen(port);
// console.log("Browse to http://127.0.0.1:" + port);
