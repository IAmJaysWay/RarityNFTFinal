const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const coolCats = require("./coolcats.json");
const doodles = require("./doodles.json");

const impostors = require("./impostors.json");
app.use(cors());
app.use(express.json());

const files = [
  {
    contract: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    data: doodles
  },
  {
    contract: "0x1a92f7381b9f03921564a437210bb9396471050c",
    data: coolCats,
  },
  {
    contract: "0x3110ef5f612208724ca51f5761a69081809f03b7",
    data: impostors,
  },
]

app.get("/nftCollection", async (req, res) => {
  const { query } = req;

  let data;

  try{
    data = files.find((e)=> e.contract === query.contract).data
  } catch(e){
    return res.status(400);
  }

  return res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Listening for API Calls`);
});
