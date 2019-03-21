import React, { useState, useEffect, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from '@wdr-data/scratch-vm';
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
import printButton from '../../../assets/img/button_print.png';
import printNowButton from '../../../assets/img/button_printnow.png';
import shareButton from '../../../assets/img/button_share.png';

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
                        className={styles.screenshotStage}
                    />
                    {state.mode === 'print' && <div className={styles.printScreenshot}></div>}
                    {state.isLoading && <div className={styles.spinnerWrapper}><Spinner /></div>}
                    {state.mode === 'share' && <div className={styles.sharingWrapper}>
                        <div className={styles.qrWrapper}>
                            <QRCode value={state.sharingUrl} renderAs="svg" />
                            <span>{state.sharingUrl}</span>
                        </div>
                    </div>}
                </div>
                <Box className={styles.buttonWrapper}>
                    { state.mode === 'print'
                        ? (
                            <Button
                                className={state.isLoading ? styles.disableButton : '' }
                                // disabled={state.isLoading}
                                onClick={print}
                            >
                                <img
                                    className={styles.buttonIcon}
                                    draggable={false}
                                    src={printNowButton}
                                />
                            </Button>
                        )
                        : (
                            <React.Fragment>
                                <Button
                                    className={state.isLoading ? styles.disableButton : '' }
                                    // disabled={state.isLoading}
                                    onClick={() => dispatch({ type: actionPrintPreview })}
                                >
                                    <img
                                        className={styles.buttonIcon}
                                        draggable={false}
                                        src={printButton}
                                    />
                                </Button>
                                <Button
                                    className={(state.isLoading || state.mode === 'share') ? styles.disableButton : '' }
                                    // disabled={state.isLoading || state.mode === 'share'}
                                    onClick={share}>
                                    <img
                                        className={styles.buttonIcon}
                                        draggable={false}
                                        src={shareButton}
                                    />
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

const recordingInitialState = {
    timeLeft: 10,
    isRecording: false,
};

const recordingReducer = (state, action) => {
    switch (action.type) {
    case 'start':
        return { ...recordingInitialState, isRecording: true };
    case 'tick':
        const timeLeft = state.timeLeft - 1; // eslint-disable-line no-case-declarations
        if (timeLeft === 0) {
            return recordingInitialState;
        }
        return { ...state, timeLeft };
    case 'stop':
        return recordingInitialState;
    default:
        return state;
    }
};

const useRecording = (vm) => {
    const [ { timeLeft, isRecording }, dispatch ] = useReducer(recordingReducer, recordingInitialState);
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            dispatch({ type: 'stop' });
        } else {
            dispatch({ type: 'start' });
        }
    }, [ isRecording, dispatch ]);
    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => dispatch({ type: 'tick' }), 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [ isRecording, dispatch ]);
    useEffect(() => {
        if (isRecording) {
            vm.greenFlag();
        }
        return () => vm.stopAll();
    }, [ vm, isRecording ]);
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
