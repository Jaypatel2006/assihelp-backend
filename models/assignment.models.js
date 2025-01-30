import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const assignmentschema = new mongoose.Schema({
    subject:{
        type:String
    },
    file:{
        type:String
    }
},{timestamps:true})

assignmentschema.plugin(mongooseAggregatePaginate);
export const Assignment = mongoose.model("Assignment",assignmentschema);