const mongoose = require('mongoose');

const Reportschema=new mongoose.Schema({
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
   reportid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'report'
   },
    date:{
        type:Date,
        default:Date.now
    }})

        const Report=mongoose.model('reports',Reportschema)
        module.exports=Report
