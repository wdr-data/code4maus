/**
 *  StartAudioContext.js
 *  @author Yotam Mann
 *  @license http://opensource.org/licenses/MIT MIT License
 *  @copyright 2016 Yotam Mann
 */
;(function (_root, factory) {
  module.exports = factory()
})(this, function () {
  // TAP LISTENER/////////////////////////////////////////////////////////////

  /**
   * @class  Listens for non-dragging tap ends on the given element
   * @param {Element} element
   * @internal
   */
  let TapListener = function (element, context) {
    this._dragged = false

    this._element = element

    this._bindedMove = this._moved.bind(this)
    this._bindedEnd = this._ended.bind(this, context)

    element.addEventListener('touchstart', this._bindedEnd)
    element.addEventListener('touchmove', this._bindedMove)
    element.addEventListener('touchend', this._bindedEnd)
    element.addEventListener('mouseup', this._bindedEnd)
  }

  /**
   * drag move event
   */
  TapListener.prototype._moved = function (_event) {
    this._dragged = true
  }

  /**
   * tap ended listener
   */
  TapListener.prototype._ended = function (context) {
    if (!this._dragged) {
      startContext(context)
    }
    this._dragged = false
  }

  /**
   * remove all the bound events
   */
  TapListener.prototype.dispose = function () {
    this._element.removeEventListener('touchstart', this._bindedEnd)
    this._element.removeEventListener('touchmove', this._bindedMove)
    this._element.removeEventListener('touchend', this._bindedEnd)
    this._element.removeEventListener('mouseup', this._bindedEnd)
    this._bindedMove = null
    this._bindedEnd = null
    this._element = null
  }

  // END TAP LISTENER/////////////////////////////////////////////////////////

  /**
   * Plays a silent sound and also invoke the "resume" method
   * @param {AudioContext} context
   * @private
   */
  function startContext(context) {
    // this accomplishes the iOS specific requirement
    let buffer = context.createBuffer(1, 1, context.sampleRate)
    let source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start(0)

    // resume the audio context
    if (context.resume) {
      context.resume()
    }
  }

  /**
   * Returns true if the audio context is started
   * @param  {AudioContext}  context
   * @return {Boolean}
   * @private
   */
  function isStarted(context) {
    return context.state === 'running'
  }

  /**
   * Invokes the callback as soon as the AudioContext
   * is started
   * @param  {AudioContext}   context
   * @param  {Function} callback
   */
  function onStarted(context, callback) {
    function checkLoop() {
      if (isStarted(context)) {
        callback()
      } else {
        requestAnimationFrame(checkLoop)
      }
    }

    if (isStarted(context)) {
      callback()
    } else {
      checkLoop()
    }
  }

  /**
   * Add a tap listener to the audio context
   * @param  {Array|Element|String|jQuery} element
   * @param {Array} tapListeners
   */
  function bindTapListener(element, tapListeners, context) {
    if (Array.isArray(element) || (NodeList && element instanceof NodeList)) {
      for (let i = 0; i < element.length; i++) {
        bindTapListener(element[i], tapListeners, context)
      }
    } else if (typeof element === 'string') {
      bindTapListener(document.querySelectorAll(element), tapListeners, context)
    } else if (element.jquery && typeof element.toArray === 'function') {
      bindTapListener(element.toArray(), tapListeners, context)
    } else if (Element && element instanceof Element) {
      // if it's an element, create a TapListener
      let tap = new TapListener(element, context)
      tapListeners.push(tap)
    }
  }

  /**
   * @param {AudioContext} context The AudioContext to start.
   * @param {Array|String|Element|jQuery=} elements For iOS, the list of elements
   *                                               to bind tap event listeners
   *                                               which will start the AudioContext. If
   *                                               no elements are given, it will bind
   *                                               to the document.body.
   * @param {Function=} callback The callback to invoke when the AudioContext is started.
   * @return {Promise} The promise is invoked when the AudioContext
   *                       is started.
   */
  function StartAudioContext(context, elements, callback) {
    // the promise is invoked when the AudioContext is started
    let promise = new Promise(function (success) {
      onStarted(context, success)
    })

    // The TapListeners bound to the elements
    let tapListeners = []

    // add all the tap listeners
    if (!elements) {
      elements = document.body
    }
    bindTapListener(elements, tapListeners, context)

    // dispose all these tap listeners when the context is started
    promise.then(function () {
      for (let i = 0; i < tapListeners.length; i++) {
        tapListeners[i].dispose()
      }
      tapListeners = null

      if (callback) {
        callback()
      }
    })

    return promise
  }

  return StartAudioContext
})
