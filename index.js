const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app=express();

const port=process.env.PORT ||5000;




//middleware

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgzt8q2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("CakeStoreDb").collection("users");
    const cakesCollection = client.db("CakeStoreDb").collection("cakes");
    const ordersCollection = client.db("CakeStoreDb").collection("orders");


    //ordersCollection

    app.post ('/orders',async(req,res)=>{
         const order=req.body;
         const result= await ordersCollection.insertOne(order)
         res.send(result)
    })

    app.get('/orders',async(req,res)=>{
      
         const  result=await ordersCollection.find().toArray()
         res.send(result)
    })

    
     app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const result=await ordersCollection.deleteOne({_id:new ObjectId(id)})
            res.send(result)
     })


     app.patch('/orders/:id',async (req,res)=>{
             const id=req.params.id;
             const confirm=req.body;
             console.log(id,confirm)

             const filter={_id:new ObjectId(id)}
             const options = { upsert: true }

             const updatedDoc={
                $set:{
                    status:confirm?.status
                }
             }

             const result=await ordersCollection.updateOne(filter,updatedDoc,options)
             res.send(result)

     })




//cakes collection

app.post('/cakes',async (req,res)=>{
    const cake=req.body;
    // console.log(cake);
    const result=await cakesCollection.insertOne(cake)
    res.send(result)
})

app.get('/cakes',async(req,res)=>{
     const result=await cakesCollection.find().toArray()
     res.send(result)
})

app.delete('/cakes/:id',async(req,res)=>{
     const id= req.params.id;
     const result=await cakesCollection.deleteOne({_id:new ObjectId(id)})
     res.send(result)
    // console.log(id);
})

app.get('/cakes/:id',async(req,res)=>{
     const id=req.params.id;
     const result=await cakesCollection.findOne({_id:new ObjectId(id)})
     res.send(result)
})



//user collection
    app.post ('/users',async(req,res)=>{
           const user=req.body;
        //    console.log(user);
        const result=await userCollection.insertOne(user)
        res.send(result)

    })



    app.get('/users',async( req,res)=>{
          const result=await userCollection.find().toArray()
          res.send(result)
    })
 

    app.patch('/users/:id',async(req,res)=>{
         const id=req.params.id;
         const Role=req.body;
        //  console.log(id,Role.role);
        const filter={_id:new ObjectId(id)}
        const options = { upsert: true }

        const updatedDoc={
          $set:{
             role:Role?.role
          }
        }

        const result=await userCollection.updateOne(filter,updatedDoc,options)
         res.send(result)


    })







//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
      res.send('cake house is running')
})

app.listen(port,()=>{
     console.log(`This site is going on port ${port}`);
})