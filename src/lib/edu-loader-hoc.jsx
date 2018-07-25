import { Views } from './routing';
import { connect } from 'react-redux';
import React from 'react';
import { loadGame } from '../reducers/edu-layer';
import { setProjectId } from '../reducers/project';

const EduLoaderHOC = (WrappedComponent) => {
    class EduLoaderComponent extends React.Component {
        componentDidMount() {
            if (this.props.router.view === Views.edu &&
                this.props.router.params.eduId) {
                this.loadGame(this.props.router.params.eduId);
            }
        }
        componentDidUpdate(prevProps) {
            if (this.props.router.view === Views.edu &&
                this.props.router.params.eduId &&
                prevProps.router.params.eduId !== this.props.router.params.eduId) {
                this.loadGame(this.props.router.params.eduId);
            }
        }
        async loadGame(id) {
            const game = await (await fetch(`/edu/${id}/game.json`)).json();
            this.props.dispatch(loadGame(id, game));
            this.props.dispatch(setProjectId(`edu/${id}`));
        }
        render() {
            const {
                projectId,
                enabled,
                router,
                dispatch,
                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    {...componentProps}
                />
            );
        }
    }

    return connect((state) => ({
        projectId: state.scratchGui.project.id,
        enabled: state.scratchGui.eduLayer.enabled,
        router: {
            view: state.router.result ? state.router.result.view : '',
            params: state.router.params || {},
        },
    }))(EduLoaderComponent);
};

export default EduLoaderHOC;
