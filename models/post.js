const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    content: {type: String, minLength: 1, maxLength: 500},
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    create_date: {type: Date, default: Date.now},
    update_date: {type: Date}
})

postSchema.virtual('url').get(function(){
    return `/post/${this._id}`
})

postSchema.virtual('formatted_date').get(function(){
    let hours = Math.abs(new Date().getTime() - this.create_date) / 36e5;
    if (hours < 1) {
        if (hours * 60 < 2) {
            return Math.trunc((hours * 60) * 60) + 's'
        }
        return Math.trunc(hours * 60) + 'min'
    } else if (hours > 24) {
        let date = (new Date(this.create_date).toDateString()).split(' ')
        return date[1] + date[2
        ]
    }
    return Math.trunc(hours) + 'h'
})

module.exports = mongoose.model('Post', postSchema)