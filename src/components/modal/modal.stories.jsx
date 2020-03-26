import React from 'react'
import Input from '../forms/input.jsx'
import Modal from './modal.jsx'

export default {
  title: 'Modal',
  component: Modal,
}

export const Basic = () => (
  <Modal contentLabel="Title of modal">
    <Input />
  </Modal>
)

export const LargeContent = () => (
  <Modal contentLabel="so much content">
    <div
      style={{
        width: '100vw',
        height: '120vh',
      }}
    >
      abc
    </div>
  </Modal>
)

export const Fullscreen = () => (
  <Modal fullScreen contentLabel="Library View">
    Hallo Welt!
  </Modal>
)
