const Project = require('../models/Project')

// Public project listing
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    res.render('projects', { projects })
  } catch (error) {
    console.error(error)
    res.status(500).send('Could not load projects.')
  }
}

// Protected admin project dashboard
exports.getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    res.render('admin-projects', { projects })
  } catch (error) {
    console.error(error)
    res.status(500).send('Could not load the admin dashboard.')
  }
}

// Show form to create a new project
exports.getNewProject = (req, res) => {
  res.render('new-project')
}

// Save a new project to the database
exports.postNewProject = async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      image: req.body.image
    })

    await project.save()
    res.redirect('/projects')
  } catch (error) {
    console.error(error)
    res.send('Error: The project could not be created.')
  }
}

// Show edit form for a project
exports.getEditProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })

    if (!project) {
      throw new Error('Project not found')
    }

    res.render('edit-project', { project })
  } catch (error) {
    console.error(error)
    res.status(404).send('Project not found')
  }
}

// Update a project in the database
exports.postEditProject = async (req, res) => {
  try {
    await Project.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
        image: req.body.image
      },
      { new: true }
    )

    res.redirect('/projects')
  } catch (error) {
    console.error(error)
    res.send('Error: The project could not be updated.')
  }
}

// Delete a project from the database
exports.postDeleteProject = async (req, res) => {
  try {
    await Project.findOneAndDelete({ slug: req.params.slug })
    res.redirect('/projects')
  } catch (error) {
    console.error(error)
    res.send('Error: The project could not be deleted.')
  }
}

// Show individual project detail page
exports.getProject = async (req, res) => {
  try {
    const slug = req.params.projectName
    const project = await Project.findOne({ slug })

    res.render('project', { project })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}