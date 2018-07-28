import React from 'react';
import {Views} from '../lib/routing';
import MenuComponent from '../components/menu/menu.jsx';
import {connect} from 'react-redux';

const bucketUrl = process.env.S3_BUCKET_URL_PROJECT;

class Menu extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            projects: []
        }
    }
    componentDidMount () {
        this.loadUserProjects();
    }
    async loadUserProjects () {
        const projects = await (await fetch(`${bucketUrl}/projects/${this.props.userId}/index.json`)).json();
        this.setState({ projects });
    }
    render () {
        return (
            <MenuComponent projects={this.state.projects} />
        )
    }
}

const mapStateToProps = state => ({
    router: {
        view: state.router.result.view,
    },
    userId: state.scratchGui.project.userId,
});
const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Menu);