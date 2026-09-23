require('dotenv').config()
const express = require('express')
const path = require('path')
const connectDB = require('./config/database')
const pageController = require('./controllers/pages')
const projectController = require('./controllers/projects')

const app = express()
const PORT = process.env.PORT || 3000

// Set EJS as the templating engine
app.set('view engine', 'ejs')

// Parse form data from POST requests
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Serve static CSS and JS files
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/js', express.static(path.join(__dirname, 'js')))

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"')
    return res.status(401).send('Authentication required')
  }

  const [username, password] = Buffer.from(
    auth.split(' ')[1],
    'base64'
  ).toString().split(':')

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next()
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"')
    return res.status(401).send('Invalid credentials')
  }
}

// Static page routes
app.get('/', pageController.getIndex)
app.get('/home', pageController.getHome)
app.get('/about', pageController.getAbout)

// Protected admin project dashboard
app.get(
  '/admin/projects',
  adminAuth,
  projectController.getAdminProjects
)

// Project routes
app.get('/projects', projectController.getProjects)
app.get('/projects/new', adminAuth, projectController.getNewProject)
app.post('/projects', adminAuth, projectController.postNewProject)
app.get('/project/:slug/edit', adminAuth, projectController.getEditProject)
app.post('/project/:slug/edit', adminAuth, projectController.postEditProject)
app.post('/project/:slug/delete', adminAuth, projectController.postDeleteProject)
app.get('/project/:projectName', projectController.getProject)

// Serve remaining static files from /public
app.use(express.static('public'))

// 404 handler — must be last
app.use((req, res) => {
  res.status(404).sendFile('404.html', { root: 'public' })
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})