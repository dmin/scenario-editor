import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {loadProject, setProject} from './actions'
import getDataForModifications from './actions/get-data-for-modifications'
import {Button} from './components/buttons'
import {Text} from './components/input'
import Modal from './components/modal'

function mapStateToProps (state) {
  return {
    projects: state.scenario.projects
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    getDataForModifications: (opts) => dispatch(getDataForModifications(opts)),
    loadProject: (id) => dispatch(loadProject(id)),
    setProject: (project) => dispatch(setProject(project))
  }
}

class SelectProject extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    setProject: PropTypes.func.isRequired
  }

  state = {
    newProjectName: ''
  }

  createNewProject = () => {
    const modifications = new Map()
    this.props.setProject({
      id: uuid.v4(),
      name: this.state.newProjectName,
      modifications: new Map(),
      variants: ['Default']
    })
    this.props.getDataForModifications({ modifications: [...modifications.values()] })
    this.props.close()
  }

  selectProject = (project) => {
    this.props.loadProject(project.id)
    this.props.close()
  }

  updateNewProjectName = (e) => {
    this.setState({ newProjectName: e.target.value })
  }

  render () {
    const {newProjectName} = this.state

    return (
      <Modal
        onClose={this.props.close}
        >
        <legend>Open Project</legend>
        <ul>{this.renderProjects()}</ul>

        <form>
          <legend>Create Project</legend>
          <Text
            name='Project Name'
            onChange={this.updateNewProjectName}
            value={newProjectName} />
          <Button style='success' onClick={this.createNewProject}>Create</Button> <Button style='danger' onClick={this.props.close}>Cancel</Button>
        </form>
      </Modal>
    )
  }

  renderProjects () {
    return this.props.projects.map((project) => {
      const name = project.name && project.name.length > 0 ? project.name : <i>(no name)</i>
      return (
        <li key={project.id}>
          <a
            href='#'
            onClick={() => this.selectProject(project)}
            >{name}</a>
        </li>
      )
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
