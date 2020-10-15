const express = require('express')
const Sequelize = require('sequelize')
const app = express()
const port = process.env.port || 3000;
app.use(express.json());
const sequelize = new Sequelize('postgres://srtojqanovzqvm:caa6592a83f2ffc6760dbcdb090559ce38b4b27e6088d482465313d2c6ed7450@ec2-176-34-184-174.eu-west-1.compute.amazonaws.com:5432/d4kog87tj8lhj8', {
    dialect: 'postgres',
    protocol: 'postgres',
	host: 'postgres_server',
      port: 5432,
      username: 'srtojqanovzqvm',
      password: 'caa6592a83f2ffc6760dbcdb090559ce38b4b27e6088d482465313d2c6ed7450',
    dialectOptions: {
        ssl: { require: true,
          // Ref.: https://github.com/brianc/node-postgres/issues/2009
          rejectUnauthorized: false,
        }
}})
sequelize
.authenticate()
.then(() => {
console.log('Connection has been established successfully.');
})
.catch(err => {
console.error('Unable to connect to the database:', err);
});
const User = sequelize.define('user', {
// attributes
firstName: {
type: Sequelize.STRING,
allowNull: false
},
lastName: {
type: Sequelize.STRING
// allowNull defaults to true
}
}, {
// options
});
const dept = sequelize.define('dept', {
// attributes
userID: {
type: Sequelize.INTEGER,
allowNull: false
},
deptName: {
type: Sequelize.STRING
// allowNull defaults to true
}
}, {
// options
});
// Note: using `force: true` will drop the table if it already exists
User.sync({ force: false }) // Now the `users` table in the database corresponds to the model definition
dept.sync({ force: false }) // Now the `users` table in the database corresponds to the model definition
app.get('/', (req, res) => res.json({ message: 'Hello World' }))
app.post('/user', async (req, res) => {
try {
const newUser = new User(req.body)
await newUser.save()
res.json({ user: newUser }) // Returns the new user that is created in the database
} catch(error) {
console.error(error)
}
})
app.post('/dept', async (req, res) => {
try {
const newdept = new dept(req.body)
await newdept.save()
res.json({ dept: newdept }) // Returns the new user that is created in the database
} catch(error) {
console.error(error)
}
})

app.get('/user/:userId', async (req, res) => {
const userId = req.params.userId
try {
const user = await User.findAll({
where: {
id: userId
}
}
)
res.json({ user })
} catch(error) {
console.error(error)
}
})
app.get('/user1/:userId/:lastName', async (req, res) => {
const userId = req.params.userId
const lastName = req.params.lastName
try {
const { Op } = require("sequelize");
const users = await User.findAll({
	attributes: ['firstName','lastName'],
  where: {
    [Op.and]: [
	  { id: userId },
      { lastName: lastName }
    ]
  }
});
res.json(users);
} catch(error) {
console.error(error)
}
})
app.get('/user2/:userId/:lastName', async (req, res) => {
const userId = req.params.userId
const lastName = req.params.lastName
try {
const { QueryTypes } = require('sequelize');
const users = await sequelize.query("SELECT * FROM users", { type: QueryTypes.SELECT });
res.json(users);
} catch(error) {
console.error(error)
}
})
console.log(‘Port created at :’,port);
app.listen(PORT, () => console.log(`Example app listening on port ${port}!`))

