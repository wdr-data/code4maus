export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

export function error(statusCode, message, additionalPayload = {}) {
  return json(statusCode, { error: message, ...additionalPayload })
}
