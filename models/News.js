const mongoose = require('mongoose');

const NewzSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
   description:{
    type:String,
    required:true,
    
   },
   image:{
    type:String,
    require:true
   },
   author:{
    type:String,
    required:true
   },
   category:{
    type:String,
    required:true
   },
    date:{
        type:Date,
        default:Date.now
    }})

        const Newz=mongoose.model('newz',NewzSchema)
        module.exports=Newz
