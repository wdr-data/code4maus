import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { history } from '../lib/app-state-hoc.jsx'

import ContentWrapper from '../components/content-wrapper/content-wrapper.jsx'
import ParentHelp, {
  attributes as parentAttributes,
} from '../lib/content/parents.md'
import Teacher, {
  attributes as teacherAttributes,
} from '../lib/content/teachers.md'
import Privacy, {
  attributes as privacyAttributes,
} from '../lib/content/privacy.md'
import Terms, { attributes as termsAttributes } from '../lib/content/terms.md'
import { paEvent } from '../lib/piano-analytics/main.js'

const contentMap = {
  eltern: {
    Component: ParentHelp,
    attributes: parentAttributes,
  },
  lehrkraefte: {
    Component: Teacher,
    attributes: teacherAttributes,
  },
  datenschutz: {
    Component: Privacy,
    attributes: privacyAttributes,
  },
  impressum: {
    Component: Terms,
    attributes: termsAttributes,
  },
}

class Content extends React.Component {
  wrapContent(children, props) {
    return (
      <ContentWrapper backToHome={this.props.backToHome} {...props}>
        {children}
      </ContentWrapper>
    )
  }

  componentDidMount() {
    paEvent.pageDisplay({
      pages: [this.props.match.params.page],
      pageType: 'Beitrag'
    })
  }

  render() {
    if (!(this.props.match.params.page in contentMap)) {
      return this.wrapContent('Inhalt nicht gefunden.')
    }

    const { Component, attributes } = contentMap[this.props.match.params.page]
    return this.wrapContent(<Component />, attributes)
  }
}

Content.propTypes = {
  page: PropTypes.string,
  backToHome: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  // page: state.router.params.page,
})

const mapDispatchToProps = () => ({
  backToHome: () => history.push('/'),
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
