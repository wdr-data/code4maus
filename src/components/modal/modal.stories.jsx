import React from 'react'
import { storiesOf } from '@storybook/react'
import Modal from './modal.jsx'
import Input from '../forms/input.jsx'

storiesOf('Modal', module)
  .add('default', () => (
    <Modal contentLabel="Title of modal">
      <Input />
    </Modal>
  ))
  .add('large content', () => (
    <Modal contentLabel="so much content">
      <div
        style={{
          width: '100vw',
          height: '120vh'
        }}
      >
        abc
      </div>
    </Modal>
  ))
  .add('fullscreen', () => (
    <Modal fullScreen contentLabel="Library View">
      Hallo Welt!
    </Modal>
  ))
