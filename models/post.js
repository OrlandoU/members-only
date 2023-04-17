const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, minLength: 1, maxLength: 500},
    create_date: {type: Date, default: new Date()},
    update_date: {type: Date}
})

postSchema.virtual('url').get(function(){
    return `/post/${this_id}`
})