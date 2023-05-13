const connection = require('./db');
const express = require('express');
const  bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const User = require('./models/user');
const Newz=require('./models/News')
const Report=require('./models/Report')
const fetchuser=require('./middleware/fetchuser')
const jwtsecreat="akshat09"

const app=express();
var port=4000;
app.use(express.json({limit: '200mb'}));
app.use(cors());
connection();

app.post("/insert",async(req,res)=>{
  try {
    const {name,email,password,image}=req.body
    let user1=await User.findOne({email});
    if(user1){
        return res.status(400).json("user already exist");
    }
    const salt=await bcrypt.genSalt(10)
    const secreatpass=await bcrypt.hash(password,salt)
    let user=await new User({name,email,password:secreatpass,image})
    var data=await user.save()
    const data1={
            id:data.id    
    }
    const authoken=jwt.sign(data1,jwtsecreat)
    res.status(200).json({success:true,authoken})
  } catch (error) {
    res.status(400).json('inter server error')  
  }
});
app.post("/login",async(req,res)=>{
  var success=false;
  try {
    const {email,password}=req.body
    let user=await User.findOne({email});
   
    if(!user){
        return res.status(400).json({success,error:"invalid"});
    }
     var comparepass=await bcrypt.compare(password,user.password)
     if(!comparepass){
      return res.status(400).json({success,error:"invalid"});
  }
  const data = {id: user.id};
 
    const authoken=jwt.sign(data,jwtsecreat);
    success=true
    res.send({success,authoken})
  } catch (error) {
    console.log(error);
    res.status(400).json('internal server error')  
  }
});
app.get('/fetchallusers',async (req,res)=>{
  try {
    const data=await User.find().select("-password")
    res.send(data)
    
  } catch (error) {
    res.status(400).json('internal server error')
    
  }
})
app.post("/fetchuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user; 
    const user = await User.findById(userId.id).select("-password");
    res.send(user);
  } catch (error) {
    console.log({ error });
  }
});
app.post("/addnewz",fetchuser, async (req,res)=>{
  try {
    const {title,description,image,author,category}=req.body
    const newz=await new Newz({title,description,image,author,category,user:req.user.id});
    var newzdata=await newz.save()
    res.send({success:true,newzdata})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
app.put("/update/:id",fetchuser, async (req,res)=>{
  try {
    const {title,description,image,author}=req.body
      var myquery = { _id: req.params.id };
      var newvalues = { $set: {title,description,image,author} };
    let newz=await Newz.findById(req.params.id);
    if(!newz){
      return res.send(' doesnot exist')
    }
    if(newz.user.toString()!==req.user.id){
      return res.send('not authorized')
    }
     newz=await Newz.updateOne(myquery, newvalues);
    
    res.send({newz})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
// app.put("/update/:id",fetchuser, async (req,res)=>{
//   try {
//     const {title,description,image,author}=req.body
//     const newnewz={};
//     if(title){newnewz.title=title}
//     if(description){newnewz.description=description}
//     if(image){newnewz.image=image}
//     if(author){newnewz.author=author}
//     let newz=await Newz.findById(req.params.id);
//     if(!newz){
//       return res.send(' doesnot exist')
//     }
//     if(newz.user.toString()!==req.user.id){
//       return res.send('not authorized')
//     }
//      newz=await Newz.findByIdAndUpdate(req.user.id,{$set:newnewz},{new:true});
    
//     res.send({newz})

//   } catch (error) {
//     console.log(error)
//     res.status(400).json({error:error})
    
//   }
// })
app.post("/delete/:id",fetchuser, async (req,res)=>{
  try {
    let newz=await Newz.findById(req.params.id);
    if(!newz){
      return res.send(' doesnot exist')
    }
    if(newz.user.toString()!==req.user.id){
      return res.send('not authorized')
    }
    newz=await Newz.findByIdAndDelete(req.params.id)
 
    res.send({success:true})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
app.post("/deletebyadmin/:id", async (req,res)=>{
  try {
    let user=await User.findById(req.params.id);
    if(!user){
      return res.send(' doesnot exist')
    }
   
    user=await User.findByIdAndDelete(req.params.id)
 
    res.send({success:true})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
app.delete("/deleteadmin/:id", async (req,res)=>{
  try {
    let newz=await Newz.findById(req.params.id);
   
    if(!newz){
      return res.json(' doesnot exist')
    }
  
    newz=await Newz.findByIdAndDelete(req.params.id)
 
    res.send({success:true})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
app.get('/fetchallnewz',async (req,res)=>{
  try {
    const data=await Newz.find()
    res.send(data)
    
  } catch (error) {
    res.status(400).json('internal server error')
    
  }
})
app.post('/fetchallcategorynewz',async (req,res)=>{
  try {
    const {category}=req.body
    const data=await Newz.find({category})
    res.send(data)
    
  } catch (error) {
    res.status(400).json('internal server error')
    
  }
})
app.get('/fetchsingleusernewz',fetchuser,async (req,res)=>{
  try {
    const data=await Newz.find({user:req.user.id})
    res.send(data)
    
  } catch (error) {
    res.status(400).json('internal server error')
    
  }
});
app.post("/reportNewz",fetchuser, async (req,res)=>{
  try {
    const {title,description,image,author,reportid}=req.body
    const report=await new Report({title,description,image,author,user:req.user.id,reportid});
    var reportdata=await report.save()
    res.send({success:true,reportdata})

  } catch (error) {
    console.log(error)
    res.status(400).json({error:error})
    
  }
});
app.post("/fetchreportednewz/:id", async (req, res) => {
  try {
    const id = req.params.id; 
    const user = await Newz.findById(id);
    res.send(user);
  } catch (error) {
    console.log({ error });
  }
});
app.get('/fetchallreportednewz',async (req,res)=>{
  try {
    const data=await Report.find()
    res.send(data)
    
  } catch (error) {
    res.status(400).json('internal server error')
    
  }
})
app.listen(port,()=>{
    console.log(`server is running at ${port}`)
});