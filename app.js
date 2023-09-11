const sql = require('mssql')
const express = require('express')
const app = express()
const sqlConfig = require('./db/connect')
const dmis = require('./routes/dmis')
const htmlPages = require('./routes/htmlpages')
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const notFound = require('./middleware/not-found');


app.use(express.json())

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended : true}))

app.use(session({
    key : "userId",
    secret : process.env.SESSIONSECRET,
    resave : false,
    saveUninitialized :false,
    cookie : {
        expires : 86400000
    } 
}))


app.use('/', htmlPages)

app.use(express.static('./public'))

app.use('/api/v1/dmis', dmis)

app.use(notFound)


const port  = process.env.PORT || 5000

const start = async () => {
    try {
        const sqlConnect = await sql.connect(sqlConfig)
        app.listen(port, ()=>{
            console.log(`Server listening.... at ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()

