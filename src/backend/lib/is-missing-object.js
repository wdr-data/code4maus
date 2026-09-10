export default function isMissingObject(error) {
  return error.code === 'NotFound' || error.code === 'NoSuchKey'
}
