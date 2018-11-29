import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import log from '../lib/log';

import {
    openLoadingProject,
    closeLoadingProject,
} from '../reducers/modals';
import { loadGame } from '../reducers/edu-layer';

/**
 * SBFileUploader component passes a file input, load handler and props to its child.
 * It expects this child to be a function with the signature
 *     function (renderFileInput, loadProject) {}
 * The component can then be used to attach project loading functionality
 * to any other component:
 *
 * <SBFileUploader>{(renderFileInput, loadProject) => (
 *     <MyCoolComponent
 *         onClick={loadProject}
 *     >
 *         {renderFileInput()}
 *     </MyCoolComponent>
 * )}</SBFileUploader>
 */

class SBFileUploader extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'getProjectTitleFromFilename',
            'renderFileInput',
            'setFileInput',
            'handleChange',
            'handleClick',
        ]);
    }
    getProjectTitleFromFilename(fileInputFilename) {
        if (!fileInputFilename) {
            return '';
        }
        // only parse title from files like "filename.sb2" or "filename.sb3"
        const matches = fileInputFilename.match(/^(.*)\.sb[23]$/);
        if (!matches) {
            return '';
        }
        return matches[1].substring(0, 100); // truncate project title to max 100 chars
    }
    // called when user has finished selecting a file to upload
    handleChange(e) {
        // Remove the hash if any (without triggering a hash change event or a reload)
        history.replaceState({}, document.title, '.');
        const reader = new FileReader();
        const thisFileInput = e.target;
        reader.onload = () => this.props.vm.loadProject(reader.result)
            .then(() => {
                this.props.onLoadingFinished();
                // Reset the file input after project is loaded
                // This is necessary in case the user wants to reload a project
                thisFileInput.value = null;
                history.pushState({}, document.title, '/projekt/neu');
            })
            .catch((error) => {
                log.warn(error);
                alert(
                    'Dein Projekt konnte leider nicht geladen werden. '+
                    'Falls ein erneuter Versuch nicht funktioniert, teile uns das Problem mit dem Knopf "Feedback" mit!'
                );
                this.props.onLoadingFinished();
                // Reset the file input after project is loaded
                // This is necessary in case the user wants to reload a project
                thisFileInput.value = null;
            });
        if (thisFileInput.files) { // Don't attempt to load if no file was selected
            this.props.onLoadingStarted();
            reader.readAsArrayBuffer(thisFileInput.files[0]);
        }
    }
    handleClick() {
        // open filesystem browsing window
        this.fileInput.click();
    }
    setFileInput(input) {
        this.fileInput = input;
    }
    renderFileInput() {
        return (
            <input
                accept=".sb2,.sb3"
                ref={this.setFileInput}
                style={{ display: 'none' }}
                type="file"
                onChange={this.handleChange}
            />
        );
    }
    render() {
        return this.props.children(this.props.className, this.renderFileInput, this.handleClick);
    }
}

SBFileUploader.propTypes = {
    canSave: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.func,
    className: PropTypes.string,
    onLoadingFinished: PropTypes.func,
    onLoadingStarted: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func,
    }),
};
SBFileUploader.defaultProps = {
    className: '',
};
const mapStateToProps = (state) => ({
    vm: state.scratchGui.vm,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLoadingFinished: () => dispatch(closeLoadingProject()),
    onLoadingStarted: () => {
        dispatch(loadGame(null, null));
        dispatch(openLoadingProject());
    },
});

// Allow incoming props to override redux-provided props. Used to mock in tests.
const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
    {}, stateProps, dispatchProps, ownProps
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SBFileUploader);
