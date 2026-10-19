import React, { useState } from 'react'

import { paIsOptedOut, paSetOptOut } from '../../lib/piano-analytics/main.js'

import styles from './piano-opt-out.css'

const PianoOptOut = () => {
  const [optedOut, setOptedOut] = useState(paIsOptedOut)

  const onChange = (e) => {
    paSetOptOut(e.target.checked)
    setOptedOut(paIsOptedOut())
  }

  return (
    <p className={styles.optOut}>
      <label>
        <input type="checkbox" checked={optedOut} onChange={onChange} />
        Der Datenerhebung durch Piano Analytics widersprechen.
      </label>
    </p>
  )
}

export default PianoOptOut
