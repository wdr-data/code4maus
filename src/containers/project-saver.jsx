import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import slug from 'slugg';
import { detect } from 'detect-browser';

/**
 * Project saver component passes a saveProject function to its child.
 * It expects this child to be a function with the signature
 *     function (saveProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <ProjectSaver>{(saveProject, props) => (
 *     <MyCoolComponent
 *         onClick={saveProject}
 *         {...props}
 *     />
 * )}</ProjectSaver>
 */
class ProjectSaver extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [ 'saveProject' ]);
    }
    saveProject() {
        const browser = detect();

        const saveLink = document.createElement('a');
        document.body.appendChild(saveLink);

        this.props.vm.saveProjectSb3().then((content) => {
            // TODO user-friendly project name
            // File name: project-DATE-TIME
            const date = new Date();
            const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
            const filename = `${slug(this.props.name)}-${timestamp}.sb3`;

            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, filename);
                return;
            }

            // Use special handling for mobile Safari
            if (browser && browser.name === 'ios') {
                console.log('detected mobile safari');
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.addEventListener('load', () => {
                        console.log('opening data url:', reader.result);
                        window.open(reader.result);
                        resolve();
                    }, false);
                    reader.addEventListener('abort', () => reject(new Error('Aborted.')));
                    reader.addEventListener('error', () => reject(reader.error));
                    console.log('loading blob as data url:', content);
                    reader.readAsDataURL(content);
                });
            }

            const url = window.URL.createObjectURL(content);
            saveLink.href = url;
            saveLink.download = filename;
            saveLink.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(saveLink);
        });
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.saveProject, props);
    }
}

ProjectSaver.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func,
    }),
    name: PropTypes.string,
};

const mapStateToProps = (state) => ({
    vm: state.scratchGui.vm,
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectSaver);
