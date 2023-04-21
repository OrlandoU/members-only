const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: {type: String, maxLength: 35, required: true},
    last_name: {type: String, maxLength: 35, required: true},
    password: {type: String, minLength: 1},
    email: {type: String, required:true},
    isAdmin: {type: Boolean, default: false},
    isMember: {type: Boolean, default: false},
    member_date: {type: Schema.Types.Date}
})

userSchema.virtual('member_formatted_date').get(function(){
    const date = new Date(); // create a new Date object
    const options = {
        year: 'numeric',
        month: 'long'
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate
})
userSchema.virtual('full_name').get(function(){
    return `${this.first_name} ${this.last_name}`
})

userSchema.virtual('url').get(function(){
    return `/user/${this._id}`
})

module.exports = mongoose.model('User', userSchema)