import express from 'express'
import routes from './routes'
import cors from 'cors'
import session from 'express-session'

import './database'

class App {
  constructor() {
    this.app = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(
      session({
        secret: 'keyboard cat', // Substitua por um segredo seguro
        resave: false,
        saveUninitialized: true,
      }),
    )
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app