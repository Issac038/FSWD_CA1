const express = require('express');
const {default:mongoose} = require('mongoose');
const app = express();
require('dotenv').config()
app.use(express.json())

const mongoURL = process.env.MONGO_URI
const PORT = process.env.PORT
mongoose.connect(mongoURL)
    .then(()=>{
        console.log("Connected successfully to database")
    })
    .catch(()=>{
        console.log("Error connecting to database")
    })

const resSchema = new mongoose.Schema({
    item:{type:String,required:true},
    city:{type:String,required:true},
    item:[{type:mongoose.Schema.Types.ObjectId,ref:"Item"}]
})
const resModel = new mongoose.model('Restaurant',resSchema)

const ItemsSchema = new mongoose.Schema({
    item:{type:String,required:true},
    price:{type:Number,required:true}
})
const ItemsModel = new mongoose.model('Item',ItemsSchema)

//Res
const handleAsync = (fn)=>(req,res)=>
    fn(req,res).catch((err)=>res.json({error:err.message}))

app.get('/restaurant',handleAsync(async(req,res)=>{
    const restaurant = await resModel.find().populate('item') 
    res.json(restaurant)
    })
)
app.post('/restaurant',handleAsync(async(req,res)=>{
    const restaurant = new resModel.body(req.params).save()
    res.json(restaurant) 
    })
)
app.delete('/restaurant/:id',handleAsync(async(req,res)=>{
    const restaurant = await resModel.findByIdAndDelete(req.params.id)
    res.json(restaurant) 
})
)
// app.put('/',()=>{})

//Items
app.get('/item',handleAsync(async(req,res)=>{
    const item = await ItemsModel.find() 
    res.json(item)
    })
)
// app.post('/',()=>{})
app.delete('/item/:id',handleAsync(async(req,res)=>{
    const item = await ItemsModel.findByIdAndDelete(req.params.id)
    res.json(item)
}))
// app.put('/',()=>{})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})