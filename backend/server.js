const express = require("express");
const cors = require("cors");
const router = require("./src/routes/router")

const app = express();
const port = 8000;

app.use(express.json())
app.use(cors({ origin:true }))
app.use("", router);


app.listen(port, (err)=>{
    if(err) console.log(err)

    console.log("Servidor rodando porta " + port)
})