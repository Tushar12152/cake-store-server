const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app=express();

const port=process.env.PORT ||5000;




//middleware

app.use(cors())
app.use(express.json())








app.get('/',(req,res)=>{
      res.send('cake house is running')
})

app.listen(port,()=>{
     console.log(`This site is going on port ${port}`);
})