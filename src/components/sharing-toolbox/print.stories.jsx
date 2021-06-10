import React from 'react'
import PrintLayout from './print.jsx'
import stageDummy from './stage.png'

export default {
  title: 'PrintLayout',
  component: PrintLayout,
}

export const Basic = () => (
  <div
    style={{
      border: '1px solid red',
      display: 'inline-block',
      background: 'white',
    }}
  >
    <PrintLayout stage={stageDummy} userHandle={'Hallo Welt'} />
  </div>
)
