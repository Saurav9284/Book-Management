const express = require('express')
const cors = require('cors')
const { connection,PORT } = require('./Config/db')
const UserController = require('./Controllers/user.controller')
const BookController = require('./Controllers/book.controller')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send({msg:'API Live'})
})

app.use('/user', UserController)
app.use('/book', BookController)

app.listen(PORT, async () => {
    try {
        await connection
        console.log('Connected to DB')
    } catch (error) {
        console.log(error)
    }
    console.log(`Listening on PORT:${PORT}`)
})