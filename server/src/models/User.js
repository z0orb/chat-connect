const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: [true, 'Username must be filled'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be 3 characters minimum'],
            maxlength: [30, 'Username must be 30 characters maximum']
        },

        password:
        {
            type: String,
            required: [true, 'Password must be filled'],
            minlength: [6, 'Password must be 6 characters minimum'],
            select: false
        },

        bio:
        {
            type: String,
            default: '',
            maxlength: [500, 'Bio must be less or equal than 500 characters']
        },

        avatar:
        {
            type: String,
            default: 'https://via.placeholder.com/150'
        },

        status:
        {
            type: String,
            enum: ['online', 'offline', 'away'],
            default: 'offline'
        },

        createdRooms: 
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }],

        joinedRooms:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }]
    },

    { timestamps: true}
);

//Hash password sebelum save changes
UserSchema.pre('save', async function() {
    //only has kalo new
    //WOI UDAH GAUSAH PAKAI next() lagi mongo v5.x sudah gaperlu njir
    if (!this.isModified('password')) return;
  
    try 
    {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } 
    
    catch (error) 
    {
      throw error;
    }
  });
  
  
  

//Method compare password
UserSchema.methods.comparePassword = async function (inputPassword)
{
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
