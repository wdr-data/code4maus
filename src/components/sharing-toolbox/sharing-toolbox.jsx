import React, {
    useState,
    useEffect,
    useCallback,
    useReducer,
    useRef,
} from 'react';
import url from 'url';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VM from '@wdr-data/scratch-vm';
import QRCode from 'qrcode.react';
import gifshot from 'gifshot';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import ippEncoder, { CONSTANTS as IPPCONSTANTS } from 'ipp-encoder';
import { useFeatureFlag, FEATURE_PRINTING } from '../../lib/feature-flags.js';


import styles from './sharing-toolbox.css';
import InlineSvg from '../inline-svg/inline-svg.jsx';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Input from '../forms/input.jsx';
import { Spinner } from '../loader/loader.jsx';
import PrintLayout from './print.jsx';

import gifIcon from '!raw-loader!../../../assets/icons/icon_gif.svg';
import printIcon from '!raw-loader!../../../assets/icons/icon_print.svg';
import printButton from '../../../assets/img/button_print.png';
import printNowButton from '../../../assets/img/button_printnow.png';
import shareButton from '../../../assets/img/button_share.png';
import buttonBorder from './button_preview.svg';

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

const usePrintScreenshot = (layoutRef, dispatch) => {
    const print = useCallback(async () => {
        if (layoutRef.current === null) {
            return;
        }
        dispatch({ type: actionPrintLoading });
        // to do: send to printer
        const canvas = await html2canvas(layoutRef.current);
        const doc = new JsPDF({
            format: 'a5',
            unit: 'mm',
        });
        doc.addImage({
            imageData: canvas,
            x: 20,
            y: 20,
            w: 73,
            h: 73,
        });
        doc.addImage({
            imageData: canvas,
            x: 20,
            y: 115,
            w: 73,
            h: 73,
        });
        const pdf = doc.output('blob');
        try {
            await printPdf(pdf);
            dispatch({ type: actionPrintFinished });
        } catch (e) {
            dispatch({ type: actionError, payload: e.message });
        }
    }, [ layoutRef, dispatch ]);
    return print;
};

const useSaveName = () => {
    const [ userHandle, setUserHandle ] = useState('');
    const onChangeUserHandle = useCallback((event) => setUserHandle(event.target.value), [ setUserHandle ]);
    return { onChangeUserHandle, userHandle };
};

const parseDataUri = (dataUri) => {
    const matches = dataUri.match(/^data:([^;]+);base64,(.*)/);
    if (!matches) {
        throw new Error('Invalid DataUri: ' + dataUri);
    }
    return [
        matches[1],
        Uint8Array.from(atob(matches[2]), (c) => c.charCodeAt(0)),
    ];
};

const useSaveResult = (image, dispatch) => {
    const saveResult = useCallback(async () => {
        const [ contentType, data ] = parseDataUri(image);
        dispatch({ type: actionShareStart });
        const ext = contentType.split('/')[1];
        try {
            const res = await fetch(`/api/prepareShareResult`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: ext,
                }),
            });
            if (!res.ok) {
                throw new Error(`uploading result failed`);
            }

            const body = await res.json();
            await fetch(body.uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType,
                },
                body: data,
            });
            dispatch({ type: actionSharePreview, payload: body.sharingKey });
        } catch (e) {
            dispatch({ type: actionError, payload: e.message });
        }
    }, [ dispatch, image ]);
    return saveResult;
};

const printPdf = async (buffer) => {
    const url = 'http://localhost:8602';
    const formData = new FormData();
    formData.append('button', buffer);
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error(await response.text());
    }
};

const initialState = {
    mode: 'default',
    isLoading: false,
    sharingKey: '',
    errorMessage: '',
};

const actionPrintPreview = 'printPreview';
const actionPrintFinished = 'printFinished';
const actionPrintLoading = 'printLoading';
const actionSharePreview = 'sharePreview';
const actionShareStart = 'shareStart';
const actionError = 'error';

const reducer = (state, action) => {
    switch (action.type) {
    case actionPrintPreview:
        return { ...initialState, mode: 'print' };
    case actionPrintFinished:
        return { ...initialState };
    case actionPrintLoading:
        return { ...state, isLoading: true };
    case actionSharePreview:
        return {
            ...state,
            isLoading: false,
            mode: 'share',
            sharingKey: action.payload,
        };
    case actionShareStart:
        return {
            ...initialState,
            isLoading: true,
        };
    case actionError:
        return {
            ...state,
            errorMessage: action.payload,
            isLoading: false,
            mode: 'default',
        };
    default:
        return state;
    }
};

const SharingModal = ({
    onRequestClose,
    image,
    isLoading,
    canPrint,
    title,
}) => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const layoutRef = useRef(null);
    const print = usePrintScreenshot(layoutRef, dispatch);
    const pending = state.isLoading || isLoading;
    const saveResult = useSaveResult(image, dispatch);
    const { onChangeUserHandle, userHandle } = useSaveName();
    const showPrinting = useFeatureFlag(FEATURE_PRINTING);

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={title}
            onRequestClose={onRequestClose}
        >
            <div className={styles.screenshotWrapper}>
                <img src={image} className={styles.screenshot} />
                {state.mode === 'print' && (
                    <div className={styles.printWrapper}>
                        <img
                            src={buttonBorder}
                            className={styles.printScreenshot}
                        />
                        <div className={styles.textWrapper}>
                            <div className={styles.userHandle}>
                                {userHandle}
                            </div>
                        </div>
                    </div>
                )}
                {pending && (
                    <div className={styles.overlay}>
                        <Spinner />
                    </div>
                )}
                {state.errorMessage && (
                    <div className={styles.overlay}>
                        <p className={styles.errorMessage}>{state.errorMessage}</p>
                    </div>
                )}
                {state.mode === 'share' && (
                    <div className={styles.overlay}>
                        <div className={styles.qrWrapper}>
                            <QRCode
                                value={`${location.origin}/teilen/?id=${
                                    state.sharingKey
                                }`}
                                renderAs="svg"
                            />
                        </div>
                        <div className={styles.sharingkeyWrapper}>
                            <div>{`${location.origin}/teilen/?id=${
                                state.sharingKey
                            }`}</div>
                        </div>
                    </div>
                )}
            </div>
            <Box className={styles.buttonWrapper}>
                {state.mode === 'print' ? (
                    <div className={styles.inputWrapper}>
                        <Input
                            onChange={onChangeUserHandle}
                            className={styles.nameInput}
                            placeholder="Dein Name oder Twitter Name"
                            value={userHandle}
                            maxlength={20}
                        />
                        <Button disabled={pending} onClick={print}>
                            <img
                                className={styles.buttonIcon}
                                draggable={false}
                                src={printNowButton}
                            />
                        </Button>
                    </div>
                ) : (
                    <React.Fragment>
                        {canPrint && showPrinting &&
                            <Button
                                disabled={pending}
                                onClick={() =>
                                    dispatch({ type: actionPrintPreview })
                                }
                            >
                                <img
                                    className={styles.buttonIcon}
                                    draggable={false}
                                    src={printButton}
                                />
                            </Button>
                        }
                        <Button
                            disabled={pending || state.mode === 'share'}
                            onClick={saveResult}
                        >
                            <img
                                className={styles.buttonIcon}
                                draggable={false}
                                src={shareButton}
                            />
                        </Button>
                    </React.Fragment>
                )}
            </Box>
            <div className={styles.printLayout}>
                <PrintLayout stage={image} layoutRef={layoutRef} userHandle={userHandle} />
            </div>
        </Modal>
    );
};

SharingModal.propTypes = {
    title: PropTypes.string.isRequired,
    canPrint: PropTypes.bool,
    image: PropTypes.string,
    userHandle: PropTypes.string,
    onRequestClose: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

const recInterval = 100;
const recordingInitialState = {
    timeLeft: 3, // seconds (float)
    isRecording: false,
};

const recordingReducer = (state, action) => {
    switch (action.type) {
    case 'start':
        return { ...recordingInitialState, isRecording: true };
    case 'tick':
        const timeLeft = state.timeLeft - (recInterval / 1000); // eslint-disable-line no-case-declarations
        if (timeLeft <= 0.1) {
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
    const [ { timeLeft, isRecording }, dispatch ] = useReducer(
        recordingReducer,
        recordingInitialState
    );
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
            }, recInterval);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
                setIsGifLoading(true);
                setGifImage('');
                onGifReady();
                const canvas = renderer.canvas;
                gifshot.createGIF(
                    {
                        images: imagesRef.current,
                        gifWidth: canvas.width,
                        gifHeight: canvas.height,
                    },
                    (obj) => {
                        setIsGifLoading(false);
                        if (obj.error) {
                            console.error(obj.error);
                            return;
                        }
                        setGifImage(obj.image);
                    }
                );
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
    const { image, takeScreenshot, isScreenshotLoading } = useScreenshotState(
        vm,
        () => setScreenshotOpen(true)
    );
    const {
        toggleRecording,
        isRecording,
        timeLeft,
        gifImage,
        isGifLoading,
    } = useRecording(vm, () => setGifOpen(true));

    return (
        <React.Fragment>
            <div className={styles.toolboxWrapper}>
                <div className={styles.toolboxBackground}>
                    <div className={styles.recordingButtonWrapper}>
                        <InlineSvg
                            svg={gifIcon}
                            className={styles.sharingButton}
                            onClick={toggleRecording}
                        />
                        {isRecording && (
                            <div className={styles.counter}>{timeLeft.toFixed(1)}s</div>
                        )}
                    </div>
                    <InlineSvg
                        svg={printIcon}
                        className={styles.sharingButton}
                        onClick={takeScreenshot}
                    />
                </div>
            </div>
            {isScreenshotOpen && (
                <SharingModal
                    isLoading={isScreenshotLoading}
                    image={image}
                    onRequestClose={() => setScreenshotOpen(false)}
                    title="Dein Bild"
                    canPrint
                />
            )}
            {isGifOpen && (
                <SharingModal
                    isLoading={isGifLoading}
                    title="Dein Gif"
                    image={gifImage}
                    onRequestClose={() => setGifOpen(false)}
                />
            )}
        </React.Fragment>
    );
};

SharingToolboxComponent.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapStateToProps = (state) => ({
    vm: state.scratchGui.vm,
});

export default connect(
    mapStateToProps,
    null
)(SharingToolboxComponent);
