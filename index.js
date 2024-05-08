const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app =express();

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://user:D240ryZjps6W76yv@cluster0.iazms3n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
   
    const userCollection = client.db('userDB').collection('users')

   // user single information added from database
    app.post('/users',async(req,res)=>{
        const user = req.body
        // console.log(user)
        const result  = await userCollection.insertOne(user)
        res.send(result)
    })

    //  all data url create
    app.get('/users',async(req,res)=>{
        const curser = await userCollection.find().toArray()
        res.send(curser)
    })

    // delete single data 
    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    // single data information create url
    app.get('/users/:id',async(req,res)=>{
        const id =req.params.id
        const query = {_id:new ObjectId(id)}
        const user = await userCollection.findOne(query)
        res.send(user)
    })

    // single data update 
    app.put('/users/:id',async(req,res)=>{
        const id =req.params.id
        const user = req.body
        console.log(id,user);
        const filter = {_id: new ObjectId(id)}
        const option = {upsert: true}
        const updateUser = {
            $set:{
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                status: user.status
            }
        }
        const result = await userCollection.updateOne(filter,updateUser,option)
        res.send(result)
    })

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
res.send('server is running')
})
// D240ryZjps6W76yv

app.listen(port,()=>{
console.log(`port is running is, ${port}`)
})
