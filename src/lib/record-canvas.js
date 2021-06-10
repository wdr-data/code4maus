import { useMemo, useCallback, useRef } from 'react'

const mimeType = 'video/webm;codecs=h264' // used for recorder
const mimeTypeShort = 'video/webm' // used for blob
export const supported = MediaRecorder.isTypeSupported(mimeType)

export const useRecordCanvas = (canvas) => {
  const mediaBlobsRef = useRef([])
  const onRecordingBlob = useCallback(
    ({ data }) => mediaBlobsRef.current.push(data),
    [mediaBlobsRef]
  )
  const recorder = useMemo(() => {
    if (!supported) {
      return null
    }
    const stream = canvas.captureStream()
    const rec = new MediaRecorder(stream, { mimeType })
    rec.addEventListener('dataavailable', onRecordingBlob)
    return rec
  }, [canvas, onRecordingBlob])

  const startRecording = useCallback(() => recorder && recorder.start(100), [
    recorder,
  ])
  const stopRecording = useCallback(() => {
    if (!recorder || recorder.state !== 'recording') {
      return null
    }
    recorder.stop()
    return new Blob(mediaBlobsRef.current, { type: mimeTypeShort })
  }, [recorder, mediaBlobsRef])
  return {
    startRecording,
    stopRecording,
  }
}

export default useRecordCanvas
