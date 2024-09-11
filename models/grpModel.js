const  mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    creator_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    image:{
        type:String,required:true
    },
    limits:{type:Number,
    required:true
}

});
module.exports= mongoose.model('Group',groupSchema);
