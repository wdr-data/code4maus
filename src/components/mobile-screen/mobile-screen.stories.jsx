import React from 'react'
import MobileScreen from './mobile-screen.jsx'
import { MemoryRouter } from 'react-router-dom'

export default {
  title: 'MobileScreen',
  component: MobileScreen,
  decorators: [
    (WrappedStory) => (
      <div style={{ margin: 'auto', maxWidth: '320px' }}>
        <WrappedStory />
      </div>
    ),
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export const Basic = () => <MobileScreen />
