const express = require("express")
const axios = require("axios");
const router = express.Router()

router.post("/authenticate", async (req,res)=>{

    const {username, secret} = req.body;

    await axios.post("https://api.chatengine.io/users/",
        {username:username, secret:secret},
        {headers: {"private-key": "9ea75561-e573-4115-a901-6203f96ed037"}}
    )
    .then((r)=>{
        return res.status(200).json(r.data);
    })
    .catch((err)=>{
        console.log(err)
    })

})

module.exports = router;