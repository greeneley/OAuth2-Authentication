
import express from 'express';
import mongoDbInit from '~/database/connectDb.js'
import mongoose, { Connection, Schema } from 'mongoose'
import connection from '~/database/connectDb.js'

const app = express();
const port  = 3000;

const connection: Connection = await mongoDbInit;

const userSchema = new Schema({
  name: String,
  age: Number
}, {
  timestamps: true,
  collection: 'users'
})

const userModel = connection.model('users', userSchema);
async function createUser() {
  const newUser = new userModel({
    name: "DINH",
    age: 12
  })
  
  try {
    const result = await newUser.save();
    console.log("User saved: ", result)
  } catch (err) {
    console.error('Error saving user:', err);
  }
}
createUser();

app.get("/", (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});