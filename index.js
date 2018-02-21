const express    = require('express')
const http       = require('http')
const socketIO   = require('socket.io')
const cors       = require('cors')
const bodyParser = require('body-parser')

const passport   = require('./config/auth')
const socketAuth = require('./config/socket-auth')

const { users, sessions, batches, students, evaluations } = require('./routes')

const port = process.env.PORT || 3030

const app    = express()
const server = http.Server(app)
const io     = socketIO(server)

// using auth middleware
io.use(socketAuth);

io.on('connect', socket => {
  socket.emit('ping', `Welcome to the server, ${socket.request.user.name}`)
  console.log(`${socket.request.user.name} connected to the server`)
})

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(users)
  .use(sessions)
  .use(batches(io))
  // .use(students(io))
  // .use(evaluations(io))

  // catch 404 and forward to error handler
  .use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // default error handler, 500 if no status given
  .use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    })
  })

server.listen(port)
