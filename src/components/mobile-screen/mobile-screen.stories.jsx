import React from 'react'
import MobileScreen from './mobile-screen.jsx'

export default {
  title: 'MobileScreen',
  component: MobileScreen,
  decorators: [
    (WrappedStory) => (
      <div style={{ margin: 'auto', maxWidth: '320px' }}>
        <WrappedStory />
      </div>
    ),
  ],
}

export const Basic = () => <MobileScreen />
