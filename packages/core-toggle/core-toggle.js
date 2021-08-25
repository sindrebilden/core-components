import { closest, dispatchEvent, getUUID, IS_ANDROID, IS_BROWSER, IS_IOS, toggleAttribute } from '../utils'

// Element to ensure overflowing content can be reached by scrolling
const SCROLLER = IS_BROWSER && document.createElement('div')
const AUTOPOSITION = ['bottom', 'top', 'left', 'right']
export default class CoreToggle extends HTMLElement {
  static get observedAttributes () { return ['hidden', 'autoposition'] }

  connectedCallback () {
    if (IS_IOS) document.documentElement.style.cursor = 'pointer' // Fix iOS events for closing popups (https://stackoverflow.com/a/16006333/8819615)
    if (!IS_ANDROID) this.setAttribute('aria-labelledby', this.button.id = this.button.id || getUUID()) // Andriod reads only label instead of content

    this.value = this.button.textContent // Set up aria-label
    this.setAttribute('role', 'group') // Help Edge
    this.button.setAttribute('aria-expanded', this._open = !this.hidden)
    this.button.setAttribute('aria-controls', this.id = this.id || getUUID())
    document.addEventListener('keydown', this, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents
    document.addEventListener('click', this)
  }

  disconnectedCallback () {
    this._button = null
    document.removeEventListener('keydown', this, true)
    document.removeEventListener('click', this)
  }

  attributeChangedCallback () {
    if (this.autoposition) {
      observeToggle(this, this.hidden ? false : this.button, this.autoposition)
    }
    if (this._open === this.hidden) { // this._open comparison ensures actual change
      this.button.setAttribute('aria-expanded', this._open = !this.hidden)
      try { this.querySelector('[autofocus]').focus() } catch (err) {}
      dispatchEvent(this, 'toggle')
    }
  }

  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'keydown' && event.keyCode === 27) {
      const isButton = event.target.getAttribute && event.target.getAttribute('aria-expanded') === 'true'
      const isHiding = isButton ? event.target === this.button : closest(event.target, this.nodeName) === this
      if (isHiding) {
        this.hidden = true
        this.button.focus() // Move focus back to button
        return event.preventDefault() // Prevent closing maximized Safari and other coreToggles
      }
    }
    if (event.type === 'click') {
      const btn = closest(event.target, 'a,button')
      if (btn && !btn.hasAttribute('aria-expanded') && closest(event.target, this.nodeName) === this) dispatchEvent(this, 'toggle.select', btn)
      else if (btn && btn.getAttribute('aria-controls') === this.id) this.hidden = !this.hidden
      else if (this.popup && !this.contains(event.target)) this.hidden = true // Click in content or outside
    }
  }

  get button () {
    if (this._button && (this._button.getAttribute('data-for') || this._button.getAttribute('for')) === this.id) return this._button // Speed up
    return (this._button = this.id && document.querySelector(`[for="${this.id}"],[data-for="${this.id}"]`)) || this.previousElementSibling
  }

  // aria-haspopup triggers forms mode in JAWS, therefore store as custom attr
  get popup () { return this.getAttribute('popup') === 'true' || this.getAttribute('popup') || this.hasAttribute('popup') }

  set popup (val) { this[val === false ? 'removeAttribute' : 'setAttribute']('popup', val) }

  get autoposition () {
    const attrVal = this.getAttribute('autoposition')
    if (attrVal === null) { return false }
    return AUTOPOSITION.indexOf(attrVal.toLowerCase()) !== -1 ? attrVal.toLowerCase() : 'bottom'
  }

  set autoposition (val) { this.setAttribute('autoposition', val) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }

  set hidden (val) { toggleAttribute(this, 'hidden', val) }

  // Sets this.button aria-label, so visible button text can be augmentet with intension of button
  // Example: Button text: "01.02.2019", aria-label: "01.02.2019, Choose date"
  // Does not updates aria-label if not allready set to something else than this.popup
  get value () { return this.button.value || this.button.textContent }

  set value (data = false) {
    if (!this.button || !this.popup.length) return
    const button = this.button
    const popup = (button.getAttribute('aria-label') || `,${this.popup}`).split(',')[1]
    const label = data.textContent || data || '' // data can be Element, Object or String

    if (popup === this.popup) {
      const target = button.querySelector('span') || button // Use span to preserve embedded HTML and SVG
      button.value = data.value || label
      target[data.innerHTML ? 'innerHTML' : 'textContent'] = data.innerHTML || label
      button.setAttribute('aria-label', `${button.textContent},${this.popup}`)
    }
  }
}

/**
 * setPosition
 * @param {HTMLElement} contentEl Reference to the core-toggle element
 * @param {HTMLElement} triggerEl Reference to the triggering element (usually <a> or <button>)
 * @param {'bottom' | String} preferedDir Prefered direction to render in default: 'bottom' (swap String with values)
 */
function setPosition (contentEl, triggerEl, preferedDir) {
  if (contentEl._skipPosition) return
  contentEl._skipPosition = true
  // TODO: Break if elements are gone or similar mumbo jumbo
  const triggerRect = triggerEl.getBoundingClientRect()
  const contentRect = contentEl.getBoundingClientRect()

  const hasSpaceRight = triggerRect.left + contentRect.width < window.innerWidth
  const hasSpaceUnder = triggerRect.bottom + contentRect.height < window.innerHeight
  const hasSpaceOver = triggerRect.top - contentRect.height > 0
  const prefersUnder = ['bottom', 'bottom-start', 'bottom-end'].indexOf(preferedDir) !== -1

  // Always place under when no hasSpaceOver, as no OS can scroll further up than window.scrollY = 0
  const placeUnder = (prefersUnder && hasSpaceUnder) || !hasSpaceOver
  const scroll = placeUnder ? window.pageYOffset + triggerRect.bottom + contentRect.height + 30 : 0

  contentEl.style.left = `${Math.round(hasSpaceRight ? triggerRect.left : triggerRect.right - contentRect.width)}px`
  contentEl.style.top = `${Math.round(placeUnder ? triggerRect.bottom : triggerRect.top - contentRect.height)}px`
  contentEl.style.marginTop = `${placeUnder ? 7 : -7}px` // Animate margin (not transform) to play nice with position:fixed
  SCROLLER.style.cssText = `position:absolute;padding:1px;top:${Math.round(scroll)}px`
  contentEl._skipPosition = null
}

/**
* observeToggle
* @param {HTMLElement} contentEl Reference to the core-toggle element
* @param {HTMLElement|Boolean} triggerEl Reference to the triggering element (usually <a> or <button>). Set to false to teardown
* @param {'bottom' | String} preferedDir Prefered direction to render in default: 'bottom' (swap String with values)
*/
function observeToggle (contentEl, triggerEl, preferedDir = 'bottom') {
  if (triggerEl === false) {
    if (!contentEl._positionObserver) return
    // Teardown
    SCROLLER.removeAttribute('style')
    contentEl._positionObserver.disconnect()
    contentEl._positionObserver = null
    // TODO: clear contentEl._setPosition
    // Garbageday!
    contentEl.style.position = ''
    window.removeEventListener('scroll', contentEl._setPosition, true) // Use capture to also listen for elements with overflow
    window.removeEventListener('resize', contentEl._setPosition)
  } else {
    contentEl._setPosition = () => setPosition(contentEl, triggerEl, preferedDir)
    contentEl.style.position = 'fixed'
    window.addEventListener('scroll', contentEl._setPosition, true) // Use capture to also listen for elements with overflow
    window.addEventListener('resize', contentEl._setPosition)
    contentEl._positionObserver = window.MutationObserver && new window.MutationObserver(contentEl._setPosition)
    contentEl._positionObserver.observe(contentEl, { childList: true, subtree: true, attributes: true })
    contentEl._setPosition()
  }
}
