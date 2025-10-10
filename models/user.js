const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required: true, unique: true},
    password:{type:String, required: true},
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
