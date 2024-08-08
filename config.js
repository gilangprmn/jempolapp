const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Jempolapps")

//chek database connected or not
.then(()=>{
    console.log("database connected succesfully");
})
.catch(()=>{
    console.log("database can't be connected");
})

//Create a schema
const loginschema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true 
    },
    phone:{
        type: String,
        required: true
    },
    token:{
        type: String
    },
    role:{
        type: String,
        required:true,
            enum: ['anak', 'orangtua', 'pengasuh'],
            default: 'anak'
    }
});

// Definisi model Task
const TaskSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: String,
        default: true
    },
    point:{
        type: String,
        default: false
    },
    completed: {
        type: String,
        default: false
    }

});

//request task
const requestTaskSchema = new mongoose.Schema({
    judulTask: { type: String, required: true },
    kategoriTask: { type: String, required: true },
    deskripsiTask: { type: String, required: true },
    earnedPoints: { type: Number, required: true },
    
});
//reward
const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    points: { type: Number, required: true },
    limit: { type: Number, required: true },
    image_url: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
//redeem reward
 const RewardSchema = new mongoose.Schema({
    name: String,
    limit: Number,
    updated_at: Date
});
//password
const passwordSchema = new mongoose.Schema({
    email:String,
    limit: Number,
    description: String,
  });
//group task
  const groupSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    tugas: [{
        type: String,
        required: true,
    }]
});

//poin anak
const pointSchema = new mongoose.Schema({
    user_id: {
        type:String,
        ref: 'User',
        required: true,
    },
    poin: {
        type: Number,
        default: 0,
    }
});


//colection part
const user = new mongoose.model('user', loginschema);
const task = mongoose.model('task', TaskSchema);
const reward = new mongoose.model ('Reward',rewardSchema);
const password = new mongoose.model ('password',passwordSchema);
const requestTask= mongoose.model('requestTask', requestTaskSchema);
const redeemreward = new mongoose.model ('redeemreward',RewardSchema);
const Group = mongoose.model('Group', groupSchema);
const Point = mongoose.model('Point', pointSchema);

module.exports = {user, task, reward, password, requestTask, Point, Group, redeemreward};