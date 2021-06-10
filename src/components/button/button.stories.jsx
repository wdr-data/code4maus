import React from 'react'
import Button from './button.jsx'

export default {
  title: 'Button',
  component: Button,
}

export const Basic = () => (
  <Button>
    <span>Hier könnte ihr Text stehen</span>
  </Button>
)

export const Primary = () => (
  <Button style="primary">
    <span>Hier könnte ihr Text stehen</span>
  </Button>
)

export const Secondary = () => (
  <Button style="secondary">
    <span>Hier könnte ihr Text stehen</span>
  </Button>
)

export const Wiggle = () => (
  <Button wiggle style="primary">
    <span>Hier könnte ihr Text stehen</span>
  </Button>
)

export const Disabled = () => (
  <Button disabled>
    <span>Hier könnte ihr Text stehen</span>
  </Button>
)
