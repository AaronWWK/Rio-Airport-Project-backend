const express = require("express");
const knex = require("knex");
const cors = require("cors");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123456",
    database: "smart-brain"
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("this is working");
});

app.post("/connectivity", (req, res) => {
  const searchid = req.body.searchid;
  db.select("*")
    .from("connectedmacid")
    .where("mainid", "=", searchid)
    .then(data => {
      if (data.length > 0) {
        db.select("relatedmacid", "connectivity")
          .from("connectedmacid")
          .where("mainid", "=", searchid)
          .then(data => {
            res.json(data);
          });
      } else {
        res.status(400).json("id not found");
      }
    })
    .catch(console.log);
});

app.post("/chart", (req, res) => {
  const groupnum = req.body.groupnum;
  let level_data = {
    level1: [],
    level2: [],
    level3: [],
    level4: []
  };
  db.select("*")
    .from("devices")
    .where("groupnum", "=", groupnum)
    .orderBy(['level', 'tnum'])
    .then(data => {
      data.map(function(obj) {
        if (obj.level === 'LEVEL 1') {
          level_data.level1.push(obj.num)
        } else if (obj.level === 'LEVEL 2') {
          level_data.level2.push(obj.num)
        } else if (obj.level === 'LEVEL 3') {
          level_data.level3.push(obj.num)
        } else if (obj.level === 'LEVEL 4') {
          level_data.level4.push(obj.num)
        }
      })
      res.json(level_data)
    });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("server is running on port 3001");
});
