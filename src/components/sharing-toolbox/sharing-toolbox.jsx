import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import VM from 'scratch-vm'
import QRCode from 'qrcode.react'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import ffmpegWorkerPath from 'file-loader!ffmpeg.js/ffmpeg-worker-mp4' // eslint-disable-line import/no-unresolved

import InlineSvg from '../inline-svg/inline-svg.jsx'
import Modal from '../modal/modal.jsx'
import Button from '../button/button.jsx'
import Input from '../forms/input.jsx'
import { Spinner } from '../loader/loader.jsx'
import { useRecordCanvas } from '../../lib/record-canvas.js'
import { useFeatureFlag, FEATURE_PRINTING } from '../../lib/feature-flags.js'

import printButton from '../../../assets/img/button_print.png'
import printNowButton from '../../../assets/img/button_printnow.png'
import shareButton from '../../../assets/img/button_share.png'

import { StageSizeRequester } from '../../lib/stage-size-provider.jsx'
import buttonBorder from './button_preview.svg'
import PrintLayout from './print.jsx'
import styles from './sharing-toolbox.css'
import printIcon from '!raw-loader!../../../assets/icons/icon_print.svg'
import gifIcon from '!raw-loader!../../../assets/icons/icon_gif.svg'

const useScreenshotState = (vm, onImageReady) => {
  const [image, setImage] = useState(null)
  const [isScreenshotLoading, setScreenshotLoading] = useState(false)
  const takeScreenshot = useCallback(() => {
    const renderer = vm.runtime.renderer
    setScreenshotLoading(true)
    setImage(null)
    onImageReady()
    renderer.requestSnapshot(() =>
      renderer.gl.canvas.toBlob((blob) => {
        setImage(blob)
        setScreenshotLoading(false)
      })
    )
  }, [vm, onImageReady, setImage])
  return { takeScreenshot, image, isScreenshotLoading }
}

const usePrintScreenshot = (layoutRef, dispatch) => {
  const print = useCallback(async () => {
    if (layoutRef.current === null) {
      return
    }
    dispatch({ type: actionPrintLoading })
    // to do: send to printer
    const canvas = await html2canvas(layoutRef.current)
    const doc = new JsPDF({
      format: 'a5',
      unit: 'mm',
    })
    doc.addImage({
      imageData: canvas,
      x: 20,
      y: 20,
      w: 73,
      h: 73,
    })
    doc.addImage({
      imageData: canvas,
      x: 20,
      y: 115,
      w: 73,
      h: 73,
    })
    const pdf = doc.output('blob')
    try {
      await printPdf(pdf)
      dispatch({ type: actionPrintFinished })
    } catch (e) {
      dispatch({ type: actionError, payload: e.message })
    }
  }, [layoutRef, dispatch])
  return print
}

const useSaveName = () => {
  const [userHandle, setUserHandle] = useState('')
  const onChangeUserHandle = useCallback(
    (event) => setUserHandle(event.target.value),
    [setUserHandle]
  )
  return { onChangeUserHandle, userHandle }
}

const useSaveResult = (asset, dispatch) =>
  useCallback(async () => {
    if (!asset || asset.isClosed) {
      return
    }

    dispatch({ type: actionShareStart })
    try {
      const res = await fetch(`/api/prepareShareResult`, { method: 'POST' })
      if (!res.ok) {
        throw new Error(`uploading result failed`)
      }

      const body = await res.json()
      await fetch(body.uploadUrl, {
        method: 'PUT',
        body: asset,
      })
      dispatch({ type: actionSharePreview, payload: body.sharingKey })
    } catch (e) {
      dispatch({ type: actionError, payload: e.message })
    }
  }, [dispatch, asset])

const printPdf = async (buffer) => {
  const url = 'http://localhost:8602'
  const formData = new FormData()
  formData.append('button', buffer)
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    throw new Error(await response.text())
  }
}

const initialState = {
  mode: 'default',
  isLoading: false,
  sharingKey: '',
  errorMessage: '',
}

const actionPrintPreview = 'printPreview'
const actionPrintFinished = 'printFinished'
const actionPrintLoading = 'printLoading'
const actionSharePreview = 'sharePreview'
const actionShareStart = 'shareStart'
const actionError = 'error'

const reducer = (state, action) => {
  switch (action.type) {
    case actionPrintPreview:
      return { ...initialState, mode: 'print' }
    case actionPrintFinished:
      return { ...initialState }
    case actionPrintLoading:
      return { ...state, isLoading: true }
    case actionSharePreview:
      return {
        ...state,
        isLoading: false,
        mode: 'share',
        sharingKey: action.payload,
      }
    case actionShareStart:
      return {
        ...initialState,
        isLoading: true,
      }
    case actionError:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        mode: 'default',
      }
    default:
      return state
  }
}

const SharingModal = ({
  onRequestClose,
  asset,
  isLoading,
  canPrint,
  title,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const layoutRef = useRef(null)
  const print = usePrintScreenshot(layoutRef, dispatch)
  const pending = state.isLoading || isLoading
  const saveResult = useSaveResult(asset, dispatch)
  const { onChangeUserHandle, userHandle } = useSaveName()
  const showPrinting = useFeatureFlag(FEATURE_PRINTING)

  const isImage = asset && asset.type.startsWith('image/')
  const isVideo = asset && asset.type.startsWith('video/')
  useEffect(() => {
    if (asset && !isImage && !isVideo) {
      dispatch({ type: actionError, payload: 'Unsupported media type' })
    }
  }, [asset, isImage, isVideo, dispatch])

  const assetURL = useMemo(() => (asset ? URL.createObjectURL(asset) : ''), [
    asset,
  ])
  useEffect(() => () => assetURL && URL.revokeObjectURL(assetURL), [assetURL])

  const typeIndicator = asset && asset.type.split('/')[0][0]
  const shareURL = state.sharingKey
    ? `https://code4maus.de/${typeIndicator}/${state.sharingKey}`
    : ''

  return (
    <Modal
      className={styles.modalContent}
      contentLabel={title}
      onRequestClose={onRequestClose}
    >
      <div className={styles.screenshotWrapper}>
        {isImage && <img src={assetURL} className={styles.screenshot} />}
        {isVideo && (
          <video src={assetURL} autoPlay loop className={styles.screenshot} />
        )}
        {state.mode === 'print' && (
          <div className={styles.printWrapper}>
            <img src={buttonBorder} className={styles.printScreenshot} />
            <div className={styles.textWrapper}>
              <div className={styles.userHandle}>{userHandle}</div>
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
              <QRCode value={shareURL} renderAs="svg" />
            </div>
            <div className={styles.sharingkeyWrapper}>
              <div>{shareURL}</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.buttonWrapper}>
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
          <>
            {canPrint && showPrinting && (
              <Button
                disabled={pending}
                onClick={() => dispatch({ type: actionPrintPreview })}
              >
                <img
                  className={styles.buttonIcon}
                  draggable={false}
                  src={printButton}
                />
              </Button>
            )}
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
          </>
        )}
      </div>
      {isImage && (
        <div className={styles.printLayout}>
          <PrintLayout
            stage={assetURL}
            layoutRef={layoutRef}
            userHandle={userHandle}
          />
        </div>
      )}
    </Modal>
  )
}

SharingModal.propTypes = {
  title: PropTypes.string.isRequired,
  canPrint: PropTypes.bool,
  asset: PropTypes.instanceOf(Blob),
  userHandle: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

const recordingInitialState = {
  timeLeft: 10, // seconds (float)
  isRecording: false,
}

const convertVideo = (inBuf) =>
  new Promise((res, rej) => {
    const conv = new Worker(ffmpegWorkerPath)
    let stdout = ''
    let stderr = ''
    conv.addEventListener('message', ({ data: msg }) => {
      switch (msg.type) {
        case 'ready':
          conv.postMessage({
            type: 'run',
            MEMFS: [{ name: 'in.webm', data: inBuf }],
            TOTAL_MEMORY: 128 * 1024 * 1024,
            arguments: [
              '-i',
              'in.webm',
              '-vf',
              'scale=400:300',
              '-r',
              '30',
              '-c:v',
              'libx264',
              '-preset',
              'ultrafast',
              '-an',
              'out.mp4',
            ],
          })
          console.log('ffmpeg is ready') // eslint-disable-line no-console
          break
        case 'stdout':
          stdout += msg.data + '\n'
          break
        case 'stderr':
          stderr += msg.data + '\n'
          break
        case 'exit':
          console.log('ffmpeg exited with:', msg.data) // eslint-disable-line no-console
          console.log('stdout:', stdout) // eslint-disable-line no-console
          console.log('stderr:', stderr) // eslint-disable-line no-console
          break
        case 'done':
          res(msg.data.MEMFS[0].data)
          break
        case 'error':
          rej(msg.data)
          break
      }
    })
  })

const recordingReducer = (state, action) => {
  switch (action.type) {
    case 'start':
      return { ...recordingInitialState, isRecording: true }
    case 'tick':
      const timeLeft = state.timeLeft - action.payload / 1000 // eslint-disable-line no-case-declarations
      if (timeLeft <= 0.1) {
        return recordingInitialState
      }
      return { ...state, timeLeft }
    case 'stop':
      return recordingInitialState
    default:
      return state
  }
}

const useRecording = (vm, onVideoProcessing, requestStageSize) => {
  const [{ timeLeft, isRecording }, dispatch] = useReducer(
    recordingReducer,
    recordingInitialState
  )
  const { startRecording, stopRecording } = useRecordCanvas(
    vm.runtime.renderer.canvas
  )
  const [videoData, setVideoData] = useState(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      dispatch({ type: 'stop' })
    } else {
      dispatch({ type: 'start' })
    }
  }, [isRecording, dispatch])
  useEffect(() => {
    let interval = null
    if (isRecording) {
      requestStageSize({ width: 400, height: 300 }).then(() => {
        startRecording()
        const tickInterval = 100 // 100 ms tick interval
        interval = setInterval(
          () => dispatch({ type: 'tick', payload: tickInterval }),
          tickInterval
        )
      })
    }
    return async () => {
      if (isRecording) {
        onVideoProcessing()
        setIsVideoLoading(true)

        const blob = stopRecording()
        if (interval) {
          clearInterval(interval)
        }
        requestStageSize()

        const inBuf = await new Promise((res) => {
          const reader = new FileReader()
          reader.addEventListener('load', ({ target }) => {
            res(target.result)
          })
          reader.readAsArrayBuffer(blob)
        })
        const videoData = await convertVideo(inBuf)
        const outBlob = new Blob([videoData], { type: 'video/mp4' })
        setVideoData(outBlob)
        setIsVideoLoading(false)
      }
    }
  }, [
    isRecording,
    dispatch,
    onVideoProcessing,
    requestStageSize,
    startRecording,
    stopRecording,
  ])
  useEffect(() => {
    if (isRecording) {
      vm.greenFlag()
    }
    return () => vm.stopAll()
  }, [vm, isRecording])

  const reset = useCallback(() => {
    setVideoData(null)
    setIsVideoLoading(false)
  }, [setVideoData, setIsVideoLoading])

  return {
    timeLeft,
    toggleRecording,
    isRecording,
    videoData,
    isVideoLoading,
    reset,
  }
}

const SharingToolboxComponent = ({ vm, requestStageSize }) => {
  const [isGifOpen, setGifOpen] = useState(false)
  const [isScreenshotOpen, setScreenshotOpen] = useState(false)
  const { image, takeScreenshot, isScreenshotLoading } = useScreenshotState(
    vm,
    () => setScreenshotOpen(true)
  )
  const {
    toggleRecording,
    isRecording,
    timeLeft,
    videoData,
    isVideoLoading,
    reset: resetVideo,
  } = useRecording(vm, () => setGifOpen(true), requestStageSize)

  return (
    <>
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
          title="Dein Bild"
          asset={image}
          onRequestClose={() => setScreenshotOpen(false)}
          canPrint
        />
      )}
      {isGifOpen && (
        <SharingModal
          isLoading={isVideoLoading}
          title="Dein Gif"
          asset={videoData}
          onRequestClose={() => {
            setGifOpen(false)
            resetVideo()
          }}
        />
      )}
    </>
  )
}

SharingToolboxComponent.propTypes = {
  vm: PropTypes.instanceOf(VM).isRequired,
  requestStageSize: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  vm: state.scratchGui.vm,
})

const ConnectedSharingToolbox = connect(
  mapStateToProps,
  null
)(SharingToolboxComponent)

const SharingToolboxTop = () => (
  <StageSizeRequester>
    {(requestStageSize) => (
      <ConnectedSharingToolbox requestStageSize={requestStageSize} />
    )}
  </StageSizeRequester>
)

export default SharingToolboxTop
