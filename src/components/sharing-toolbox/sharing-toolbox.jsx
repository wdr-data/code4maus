import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from '@wdr-data/scratch-vm';

import styles from './sharing-toolbox.css';
import InlineSvg from '../inline-svg/inline-svg.jsx';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';

import gifIcon from '!raw-loader!../../../assets/icons/icon_gif.svg';
import printIcon from '!raw-loader!../../../assets/icons/icon_print.svg';
import mausImage from '../../../assets/img/head_logo.png';

const useScreenshotState = (vm, open) => {
    const [ isScreenshotOpen, setScreenshotOpen ] = useState(false);
    const [ screenshotSource, setScreenshotSource ] = useState('');
    useEffect(() => {
        if (open) {
            const renderer = vm.runtime.renderer;
            renderer.requestSnapshot((image) => {
                setScreenshotSource(image);
                setScreenshotOpen(true);
            });
        } else {
            setScreenshotOpen(false);
            setScreenshotSource('');
        }
    }, [ open ]);
    return {
        isScreenshotOpen,
        screenshotSource,
    };
};

const SharingImageModal = ({ open, vm, onRequestClose }) => {
    const { isScreenshotOpen, screenshotSource } = useScreenshotState(vm, open);
    if (!isScreenshotOpen) {
        return null;
    }
    return (
        <Modal
            className={styles.modalContent}
            contentLabel="Dein Foto"
            onRequestClose={onRequestClose}
        >
            <Box className={styles.screenshotWrapper}>
                <img
                    src={screenshotSource}
                    className={styles.screenshotStage}
                />
                <Box className={styles.buttonWrapper}>
                    <Button style='primary'>
                        Drucken
                    </Button>
                    <Button style='primary'>
                        Teilen
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const SharingToolboxComponent = ({ vm }) => {
    const [ isGifOpen, setGifOpen ] = useState(false);
    const [ isScreenshotOpen, setScreenshotOpen ] = useState(false);

    return (
        <React.Fragment>
            <div className={styles.toolboxWrapper}>
                <div className={styles.toolboxBackground}>
                    <InlineSvg
                        svg={gifIcon}
                        className={styles.sharingButton}
                        onClick={() => setGifOpen(true)}
                    />
                    <InlineSvg
                        svg={printIcon}
                        className={styles.sharingButton}
                        onClick={() => setScreenshotOpen(true)}
                    />
                </div>
            </div>
            <SharingImageModal
                vm={vm}
                open={isScreenshotOpen}
                onRequestClose={() => setScreenshotOpen(false)}
            />
            {isGifOpen && <Modal
                className={styles.modalContent}
                contentLabel="Dein Gif"
                onRequestClose={() => setGifOpen(false)}
            >
                <Box className={styles.screenshotWrapper}>
                    <img
                        src={mausImage}
                        className={styles.screenshotStage}
                    />
                    <Box className={styles.buttonWrapper}>
                        <Button style='primary'>
                            Teilen
                        </Button>
                    </Box>
                </Box>
            </Modal>}
        </React.Fragment>
    );
};

SharingToolboxComponent.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapStateToProps = (state) => ({
    vm: state.scratchGui.vm,
});

export default connect(mapStateToProps, null)(SharingToolboxComponent);
