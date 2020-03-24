import React from 'react'
import { storiesOf } from '@storybook/react'
import PrintLayout from './print.jsx'
import stageDummy from './stage.png'

storiesOf('PrintLayout', module).add('default', () => {
  return (
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
})
