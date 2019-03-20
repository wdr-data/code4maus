import React, { useState, useEffect, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from '@wdr-data/scratch-vm';
import classnames from 'classnames';
import QRCode from 'qrcode.react';

import styles from './sharing-toolbox.css';
import InlineSvg from '../inline-svg/inline-svg.jsx';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import { Spinner } from '../loader/loader.jsx';

import gifIcon from '!raw-loader!../../../assets/icons/icon_gif.svg';
import printIcon from '!raw-loader!../../../assets/icons/icon_print.svg';
import mausImage from '../../../assets/img/head_logo.png';

const useScreenshotState = (vm, onImageReady) => {
    const [ image, setImage ] = useState('');
    const takeScreenshot = useCallback(() => {
        const renderer = vm.runtime.renderer;
        renderer.requestSnapshot((image) => {
            setImage(image);
            onImageReady();
        });
    }, [ vm, onImageReady, setImage ]);
    return { takeScreenshot, image };
};

const usePrintScreenshot = (image, dispatch) => {
    const print = useCallback(
        () => {
            dispatch({ type: actionPrintLoading });
            // to do: send to printer
            setTimeout(() => {
                dispatch({ type: actionPrintFinished });
            }, 2000);
        }, [ dispatch ]
    );
    return print;
};

const useSharingScreenshot = (image, dispatch) => {
    const share = useCallback(
        () => {
            dispatch({ type: actionShareLoading });
            // to do: generate url for sharing
            setTimeout(() => {
                dispatch({ type: actionSharePreview, payload: 'adfbvba.com' });
            }, 2000);
        }, [ dispatch ]
    );
    return share;
};

const initialState = {
    mode: 'default',
    isLoading: false,
    sharingUrl: '',
};

const actionPrintPreview = 'printPreview';
const actionPrintFinished = 'printFinished';
const actionPrintLoading = 'printLoading';
const actionShareLoading = 'shareLoading';
const actionSharePreview = 'sharePreview';

const reducer = (state, action) => {
    switch (action.type) {
    case actionPrintPreview:
        return { ...state, mode: 'print' };
    case actionPrintFinished:
        return { ...state, mode: 'default', isLoading: false };
    case actionPrintLoading:
    case actionShareLoading:
        return { ...state, isLoading: true };
    case actionSharePreview:
        return {
            ...state,
            isLoading: false,
            mode: 'share',
            sharingUrl: action.payload,
        };
    default:
        return state;
    }
};

const SharingImageModal = ({ onRequestClose, image }) => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const print = usePrintScreenshot(image, dispatch);
    const share = useSharingScreenshot(image, dispatch);
    return (
        <Modal
            className={styles.modalContent}
            contentLabel="Dein Foto"
            onRequestClose={onRequestClose}
        >
            <Box className={styles.screenshotWrapper}>
                <div className={styles.imageWrapper}>
                    <img
                        src={image}
                        className={classnames(styles.screenshotStage, {
                            [styles.printScreenshot]: state.mode === 'print',
                        })}
                    />
                    {state.isLoading && <div className={styles.spinnerWrapper}><Spinner /></div>}
                    {state.mode === 'share' && <div className={styles.sharingWrapper}>
                        <QRCode value={state.sharingUrl} renderAs="svg" />
                        <span>{state.sharingUrl}</span>
                    </div>}
                </div>
                <Box className={styles.buttonWrapper}>
                    { state.mode === 'print'
                        ? (
                            <Button
                                style='primary'
                                disabled={state.isLoading}
                                onClick={print}
                            >
                            Jetzt drucken
                            </Button>
                        )
                        : (
                            <React.Fragment>
                                <Button
                                    style='primary'
                                    disabled={state.isLoading}
                                    onClick={() => dispatch({ type: actionPrintPreview })}
                                >
                                Drucken
                                </Button>
                                <Button
                                    style='primary'
                                    disabled={state.isLoading || state.mode === 'share'}
                                    onClick={share}>
                                Teilen
                                </Button>
                            </React.Fragment>
                        )}
                </Box>
            </Box>
        </Modal>
    );
};

SharingImageModal.propTypes = {
    image: PropTypes.string,
    onRequestClose: PropTypes.func.isRequired,
};

const useRecording = (vm) => {
    const [ isRecording, setRecording ] = useState(false);
    const [ timeLeft, setTimeLeft ] = useState(10);
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            vm.stopAll();
            setRecording(false);
        } else {
            setRecording(true);
            vm.greenFlag();
        }
    }, [ vm, setRecording, isRecording ]);
    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => console.warn('tick'), 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [ isRecording ]);
    return { timeLeft, toggleRecording, isRecording };
};

const SharingToolboxComponent = ({ vm }) => {
    const [ isGifOpen, setGifOpen ] = useState(false);
    const [ isScreenshotOpen, setScreenshotOpen ] = useState(false);
    const { image, takeScreenshot } = useScreenshotState(vm, () => setScreenshotOpen(true));
    const { toggleRecording, isRecording, timeLeft } = useRecording(vm);

    return (
        <React.Fragment>
            <div className={styles.toolboxWrapper}>
                <div className={styles.toolboxBackground}>
                    <InlineSvg
                        svg={gifIcon}
                        className={styles.sharingButton}
                        onClick={toggleRecording}
                    />
                    {isRecording && <span>{timeLeft}</span>}
                    <InlineSvg
                        svg={printIcon}
                        className={styles.sharingButton}
                        onClick={takeScreenshot}
                    />
                </div>
            </div>
            {isScreenshotOpen && <SharingImageModal
                vm={vm}
                image={image}
                onRequestClose={() => setScreenshotOpen(false)}
            />}
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
