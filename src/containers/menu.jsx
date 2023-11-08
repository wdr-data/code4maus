import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { push } from 'redux-little-router'

import { MenuComponent } from '../components/menu/menu.jsx'
import { MenuTabs } from '../lib/routing'
import { games, examples, videos } from '../lib/edu'
import { paEvent } from '../lib/piano-analytics/main.js'

const tabIdToTab = {
  0: MenuTabs.edugames,
  1: MenuTabs.projects,
  2: MenuTabs.examples,
  3: MenuTabs.videos,
}

class Menu extends React.Component {
  static mapGameData(game) {
    return {
      key: game.id,
      title: game.name,
      note: game.subtitle,
      linkTo: `/lernspiel/${game.id}`,
      image: game.image,
      hidden: game.hidden,
    }
  }

  static mapVideoData(video) {
    return {
      key: video.id,
      title: video.name,
      note: video.subtitle,
      image: video.image,
      video: video.video,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      eduGames: games.map(Menu.mapGameData),
      examples: examples.map(Menu.mapGameData),
      projects: [],
      videos: videos.map(Menu.mapVideoData),
    }

    paEvent.pageDisplay({ pages: ['Menu'], pageType: 'Hauptseite' })
  }

  componentDidMount() {
    this.loadUserProjects()
  }

  async loadUserProjects() {
    const userProjects = await (
      await fetch(`/data/projects/${this.props.userId}/index.json`)
    ).json()
    const projects = Object.entries(userProjects)
      .map(([key, proj]) => ({
        key,
        title: proj.name,
        note: new Date(proj.updated_at).toLocaleDateString(),
        linkTo: `/projekt/${key}`,
        _sort: proj.updated_at,
      }))
      .sort((a, b) => b._sort - a._sort)
    this.setState({ projects })
  }

  static getTabId(tab) {
    const tabEntry = Object.entries(tabIdToTab).find(
      ([_key, val]) => val === tab
    )
    if (!tabEntry) {
      return 0
    }
    return parseInt(tabEntry[0])
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { tab, userId, ...props } = this.props
    /* eslint-enable */

    return (
      <MenuComponent
        projects={this.state.projects}
        eduGames={this.state.eduGames}
        examples={this.state.examples}
        videos={this.state.videos}
        selectedTab={tab}
        {...props}
      />
    )
  }
}

Menu.propTypes = {
  tab: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  tab: Menu.getTabId((state.router.result || {}).tab),
  userId: state.scratchGui.project.userId,
  isOnline: state.scratchGui.offline.online,
})

const mapDispatchToProps = (dispatch) => ({
  handleTabSelected: (tabId) => dispatch(push(`/${tabIdToTab[tabId]}`)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
