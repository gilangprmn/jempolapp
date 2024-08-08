const express= require('express')
const session = require('express-session')
const pasth= require('path')
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const colection= require("./config");
const { register } = require('module');
const { name } = require('ejs');
const {login,user, task, reward, redeemreward, requestTask, Group, Point} = require('./config');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/dasboard', (req, res) => {
    if (!req.session.user) {
        res.render('dasboard');
    }
});

app.get('/password', (req, res) => {
    res.render('password');
});

app.get('/test', (req, res) => {
    res.send("Test")
});

app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('home');
});

app.get('/change_password', (req, res) => {
    if (!req.session.user) {
        res.render('change_password');
    }
    
// reward
app.post('/reward', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            category: req.body.category,
            points: req.body.points,
            limit: req.body.limit,
            image_url: req.body.image_url,
            created_at: new Date(),
            updated_at: new Date()
        };
        const newreward = new reward(data);
        await newreward.save();

        const responData = {
            message: "Data Berhasil ditambah!",
            status: 200
        };
        res.send(responData);
    } catch (err) {
        const responData = {
            message: "Data gagal ditambah!",
            status: 400,
            error: err.message
        };
        res.send(responData);
    }
});
});
//task
app.post('/task', async (req, res) => {
    try {
        const data = {
            user_id:req.body.user_id,
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            completed: req.body.false,
            poin: req.body.poin
        };
        const newTask = new task(data);
        await newTask.save();
            const responData = {
                message: "Data Berhasil ditambah!",
                status: 200
            };
            res.send(responData);
        } catch (err) {
            const responData = {
                message: "Data gagal ditambah!",
                status: 400,
                error: err.message
            };
            res.send(responData);
        }
});
// //task review
// app.get('/taskreview', async (req, res) => {
//     try {
//       const task = await task.findById(req.params.id);
//       if (!task) {
//         return res.status(404).send({ message: 'Task not found', status: 404 });
//       }
//       res.send(task);
//     } catch (error) {
//       res.status(500).send({ message: 'Error retrieving task', status: 500, error: error.message });
//     }
//   });
// //taskaccept
// app.post('/tasksaccept', async (req, res) => {
//     try {
//       const task = await task.findById(req.params.id);
//       if (!task) {
//         return res.status(404).send();
//       }
//       task.status = 'accepted';
//       await task.save();
//       res.send(task);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });
  
//   // Deny Task Endpoint
//   app.post('/tasksdeny', async (req, res) => {
//     try {
//       const task = await task.findById(req.params.id);
//       if (!task) {
//         return res.status(404).send();
//       }
//       task.status = 'denied';
//       await task.save();
//       res.send(task);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });
  
// // Endpoint untuk menerima atau menolak task
// app.post('/task', async (req, res) => {
//     try {
//         const action = req.body.action; // 'accept' atau 'deny'

//         const task = await task.findById(task);

//         if (!task) {
//             return res.status(404).send({
//                 pesan: "Tugas tidak ditemukan!",
//                 status: 404
//             });
//         }

//         if (action === 'accept') {
//             task.selesai = true;
//         } else if (action === 'deny') {
//             task.selesai = false;
//         } else {
//             return res.status(400).send({
//                 pesan: "Aksi tidak valid!",
//                 status: 400
//             });
//         }

//         await task.save();

//         const responData = {
//             pesan: action === 'accept' ? "Tugas diterima!" : "Tugas ditolak!",
//             status: 200
//         };
//         res.status(200).send(responData);
//     } catch (err) {
//         res.status(500).send({
//             pesan: "Kesalahan server: " + err.message,
//             status: 500
//         });
//     }
// });

//group task
app.post('/grup', async (req, res) => {
    try {
        const Data={
            nama: req.body.nama,
            tugas: req.body.tugas,
        }
        const newGroup = new Group(Data);
        await newGroup.save();
        const responData = {
            pesan: "Grup berhasil ditambah!",
            status: 200
        };
        res.status(200).send(responData);
    } catch (err) {
        const responData = {
            pesan: "Grup gagal ditambah!",      
            status: 400
        };
        res.status(400).send(responData);
    }
});
//profile
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        res.render('profile');
    }
});
//mendapatkan point anak
app.get('/poin', async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const poin = req.body.poin;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send({
                pesan: "Invalid user ID",
                status: 400
            });
        }

        let usersData = await user.findOne({ _id: user_id });
        if (!usersData) {
            return res.status(404).send({
                pesan: "Data tidak ditemukan!",
                status: 404
            });
        } else {
            let point = await Point.findOne({ user_id: user_id });
            if (!point) {
                point = new Point({
                    user_id: user_id,
                    poin: poin
                });
                await point.save();
            } else {
                point.poin = poin;
                await point.save();
            }
        }

        let pointData = await Point.findOne({ user_id: user_id });

        // user = await user.findOne({ _id: new ObjectId(user_id) });

        res.status(200).send({
            pesan: "Poin berhasil didaptkan!",
            namaAnak: usersData.name,
            poin: pointData.poin,
            status: 200
        });
    } catch (err) {
        res.status(400).send({
            pesan: "Kesalahan server: " + err.message,
            status: 400
        });
    } 
});

// Endpoint untuk menambah poin anak
app.post('/pointambah', async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const poin = req.body.poin;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send({
                pesan: "Invalid user ID",
                status: 400
            });
        }

        let usersData = await user.findOne({ _id: user_id });
        if (!usersData) {
            return res.status(404).send({
                pesan: "Data tidak ditemukan!",
                status: 404
            });
        } else {
            let point = await Point.findOne({ user_id: user_id });
            if (!point) {
                point = new Point({
                    user_id: user_id,
                    poin: poin
                });
                await point.save();
            } else {
                point.poin += poin;
                await point.save();
            }
        }

        let pointData = await Point.findOne({ user_id: user_id });

        // user = await user.findOne({ _id: new ObjectId(user_id) });

        res.status(200).send({
            pesan: "Poin berhasil ditambahkan!",
            namaAnak: usersData.name,
            poin: pointData.poin,
            status: 200
        });
    } catch (err) {
        res.status(400).send({
            pesan: "Kesalahan server: " + err.message,
            status: 400
        });
    } 
});

// Endpoint untuk mengurangi poin anak
app.post('/poinkurang', async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const poin = req.body.poin;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send({
                pesan: "Invalid user ID",
                status: 400
            });
        }

        let usersData = await user.findOne({ _id: user_id });
        if (!usersData) {
            return res.status(404).send({
                pesan: "Data tidak ditemukan!",
                status: 404
            });
        } else {
            let point = await Point.findOne({ user_id: user_id });
            if (!point) {
                point = new Point({
                    user_id: user_id,
                    poin: poin
                });
                await point.save();
            } else {
                point.poin -= poin;
                await point.save();
            }
        }

        let pointData = await Point.findOne({ user_id: user_id });

        // user = await user.findOne({ _id: new ObjectId(user_id) });

        res.status(200).send({
            pesan: "Poin berhasil dikurangi!",
            namaAnak: usersData.name,
            poin: pointData.poin,
            status: 200
        });
    } catch (err) {
        res.status(400).send({
            pesan: "Kesalahan server: " + err.message,
            status: 400
        });
    }
});


//request task
app.post('/requestTask', async (req, res) => {
    try {
        const data = {
            judulTask: req.body.judulTask,
            kategoriTask:req.body.kategoriTask,
            deskripsiTask:req.body.deskripsiTask,
            earnedPoints:req.body.earnedPoints
        };
        const newrequestTask = new requestTask(data);
        await newrequestTask.save();
        const responData = {
            message : "Data Berhasil ditambah!",
            status : 200
        };
        res.send(responData);
    } catch (err) {
        const responData = {
            message : "Data gagal ditambah!",
            error : err.message,
            status : 500
        };
        res.send(responData);
    }
});
// Login user
app.post('/login', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            email: req.body.email,
            password:hashedPassword,
        };
        const newlogin = new login(data);
        await newlogin.save();
        if (newlogin == true) {
            const responData = {
                message : "Data Berhasil ditambah!",
                status : 200
            };
            res.send(responData);
        } else {
            const responData = {
                message : "Data gagal ditambah!",
                status : 400
            };
            res.send(responData);
        }
    } catch (err) {
        res.send('Error logging in: ' + err.message);
    }
});
// Register user
app.post('/register', async (req, res) => {
    try {
        const secretKey = "inirahasiabangetbtw"
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            name: req.body.username,
            email: req.body.email,
            password:hashedPassword,
            phone: req.body.phone,
            role: req.body.role
        };
        const newusers = new user(data);
        await newusers.save();

        if (req.body.role == "orangtua"){
            const payload = {
                userId : newusers._id,
                username : newusers.name
            }

            const token = jwt.sign(payload, secretKey);
            const updateUser = await user.findByIdAndUpdate(newusers._id, { token : token})
        }

        const responData = {
            message : "Data Berhasil ditambah!",
            status : 200
        };
        res.send(responData);
    } catch (err) {
        res.send('Error registering user: ' + err.message);
    }
});

//redeem reward
app.post('/redeemreward', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            limit:req.body.limit,
            updated_at:req.body.updated_at
        };
        const newredeemreward = new redeemreward(data);
        await newredeemreward.save();
        if (redeemreward) {
            return res.status(404).send({ message: 'Reward not found!', status: 404 });
        }

        if (redeemreward.limit > 0) {
            redeemreward.limit -= 1;
            redeemreward.updated_at = new Date();
            await redeemreward.save();
            
            const responData = {
                message: "redeem reward berhasil!",
                status: 200
            };
            res.send(responData);
        } else {
            const responData = {
                message: "Reward limit reached!",
                status: 400
            };
            res.send(responData);
        }
    } catch (err) {
        const responData = {
            message: "redeem reward tidak berhasil!",
            status: 400,
            error: err.message
        };
        res.send(responData);
    }
});
// password user
app.post('/password', async (req, res) => {
    try {
        const user = await bcrypt.findOne({ email: req.body.Email });
        if (!user) {
            return res.send('User not found');
        }
        res.redirect('/');
    } catch (err) {
        res.send('Error logging in: ' + err.message);
    }
});

// Buat task baru
// app.post('/task', async (req, res) => {
//     try {
//         const userdata = await collection.create(data)
//         console.log(userdata);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });
// Dapatkan semua task
// app.get('/task', async (req, res) => {
//     try {
//         const tasks = await Task.find();
//         res.send(tasks);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });
//  task
// app.post('/task', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });
//         if (!task) {
//             return res.status(404).send();
//         }
//         res.send(task);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// Hapus task
app.delete('/task', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});


// GET LIST ALL USERS
app.get('/users', async (req, res) => {
    try {
        const users = await user.find();

        return res.status(200).send({
            status: 200,
            data: users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 500,
            pesan: "Terjadi kesalahan pada server!"
        });
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});