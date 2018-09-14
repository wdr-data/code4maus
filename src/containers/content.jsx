import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';

import ContentWrapper from '../components/content-wrapper/content-wrapper.jsx';
import ParentHelp, { attributes as parentAttributes } from '../lib/content/parents.md';
import Privacy, { attributes as privacyAttributes } from '../lib/content/privacy.md';
import Terms, { attributes as termsAttributes } from '../lib/content/terms.md';

const contentMap = {
    'eltern': {
        Component: ParentHelp,
        attributes: parentAttributes,
    },
    'datenschutz': {
        Component: Privacy,
        attributes: privacyAttributes,
    },
    'impressum': {
        Component: Terms,
        attributes: termsAttributes,
    },
};

class Content extends React.Component {
    wrapContent(children, props) {
        return <ContentWrapper backToHome={this.props.backToHome} {...props}>{children}</ContentWrapper>;
    }

    render() {
        if (!(this.props.page in contentMap)) {
            return this.wrapContent('Inhalt nicht gefunden.');
        }

        const { Component, attributes } = contentMap[this.props.page];
        return this.wrapContent(<Component />, attributes);
    }
}

Content.propTypes = {
    page: PropTypes.string,
    backToHome: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    page: state.router.params.page,
});
const mapDispatchToProps = (dispatch) => ({
    backToHome: () => dispatch(push('/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
