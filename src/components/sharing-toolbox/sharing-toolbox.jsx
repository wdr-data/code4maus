import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from '@wdr-data/scratch-vm';
import QRCode from 'qrcode.react';
import gifshot from 'gifshot';

import styles from './sharing-toolbox.css';
import InlineSvg from '../inline-svg/inline-svg.jsx';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import { Spinner } from '../loader/loader.jsx';

import gifIcon from '!raw-loader!../../../assets/icons/icon_gif.svg';
import printIcon from '!raw-loader!../../../assets/icons/icon_print.svg';
import printButton from '../../../assets/img/button_print.png';
import printNowButton from '../../../assets/img/button_printnow.png';
import shareButton from '../../../assets/img/button_share.png';

const useScreenshotState = (vm, onImageReady) => {
    const [ image, setImage ] = useState('');
    const [ isScreenshotLoading, setScreenshotLoading ] = useState(false);
    const takeScreenshot = useCallback(() => {
        const renderer = vm.runtime.renderer;
        setScreenshotLoading(true);
        setImage('');
        onImageReady();
        renderer.requestSnapshot((image) => {
            setImage(image);
            setScreenshotLoading(false);
        });
    }, [ vm, onImageReady, setImage ]);
    return { takeScreenshot, image, isScreenshotLoading };
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

const SharingModal = ({ onRequestClose, image, isLoading, canPrint, title }) => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const print = usePrintScreenshot(image, dispatch);
    const share = useSharingScreenshot(image, dispatch);
    const pending = state.isLoading || isLoading;
    return (
        <Modal
            className={styles.modalContent}
            contentLabel={title}
            onRequestClose={onRequestClose}
        >
            <div className={styles.screenshotWrapper}>
                <img
                    src={image}
                    className={styles.screenshot}
                />
                {state.mode === 'print' && <div className={styles.printScreenshot}></div>}
                {pending && <div className={styles.spinnerWrapper}><Spinner /></div>}
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
                            disabled={pending}
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
                            {canPrint && <Button
                                disabled={pending}
                                onClick={() => dispatch({ type: actionPrintPreview })}
                            >
                                <img
                                    className={styles.buttonIcon}
                                    draggable={false}
                                    src={printButton}
                                />
                            </Button>}
                            <Button
                                disabled={pending || state.mode === 'share'}
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
        </Modal>
    );
};

SharingModal.propTypes = {
    title: PropTypes.string.isRequired,
    canPrint: PropTypes.bool,
    image: PropTypes.string,
    onRequestClose: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
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

const useRecording = (vm, onGifReady) => {
    const [ { timeLeft, isRecording }, dispatch ] = useReducer(recordingReducer, recordingInitialState);
    const [ gifImage, setGifImage ] = useState('');
    const [ isGifLoading, setIsGifLoading ] = useState(false);
    const imagesRef = useRef([]);
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            dispatch({ type: 'stop' });
        } else {
            dispatch({ type: 'start' });
        }
    }, [ isRecording, dispatch ]);
    useEffect(() => {
        let interval = null;
        const renderer = vm.runtime.renderer;
        if (isRecording) {
            interval = setInterval(() => {
                renderer.requestSnapshot((image) => {
                    imagesRef.current.push(image);
                });
                dispatch({ type: 'tick' });
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
                setIsGifLoading(true);
                setGifImage('');
                onGifReady();
                const canvas = renderer.canvas;
                gifshot.createGIF({
                    images: imagesRef.current,
                    gifWidth: canvas.width,
                    gifHeight: canvas.height,
                }, (obj) => {
                    setIsGifLoading(false);
                    if (obj.error) {
                        console.error(obj.error);
                        return;
                    }
                    setGifImage(obj.image);
                });
                imagesRef.current = [];
            }
        };
    }, [ isRecording, dispatch, vm ]);
    useEffect(() => {
        if (isRecording) {
            vm.greenFlag();
        }
        return () => vm.stopAll();
    }, [ vm, isRecording ]);
    return { timeLeft, toggleRecording, isRecording, gifImage, isGifLoading };
};

const SharingToolboxComponent = ({ vm }) => {
    const [ isGifOpen, setGifOpen ] = useState(false);
    const [ isScreenshotOpen, setScreenshotOpen ] = useState(false);
    const { image, takeScreenshot, isScreenshotLoading } = useScreenshotState(vm, () => setScreenshotOpen(true));
    const { toggleRecording, isRecording, timeLeft, gifImage, isGifLoading } = useRecording(vm, () => setGifOpen(true));

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
            {isScreenshotOpen && <SharingModal
                isLoading={isScreenshotLoading}
                image={image}
                onRequestClose={() => setScreenshotOpen(false)}
                title="Dein Bild"
                canPrint
            />}
            {isGifOpen && <SharingModal
                isLoading={isGifLoading}
                title="Dein Gif"
                image={gifImage}
                onRequestClose={() => setGifOpen(false)}
            />}
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
