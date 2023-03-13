const db = require('../server')

const userSchema = {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, 
    experience: { type: Number, required: true}
}

module.exports = db.model('User', userSchema)