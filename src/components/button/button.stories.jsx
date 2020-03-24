import React from 'react'
import { storiesOf } from '@storybook/react'
import Button from './button.jsx'

storiesOf('Button', module)
  .add('default', () => (
    <Button>
      <span>Hier könnte ihr Text stehen</span>
    </Button>
  ))
  .add('primary', () => (
    <Button style="primary">
      <span>Hier könnte ihr Text stehen</span>
    </Button>
  ))
  .add('secondary', () => (
    <Button style="secondary">
      <span>Hier könnte ihr Text stehen</span>
    </Button>
  ))
  .add('wiggle', () => (
    <Button wiggle style="primary">
      <span>Hier könnte ihr Text stehen</span>
    </Button>
  ))
  .add('disabled', () => (
    <Button disabled>
      <span>Hier könnte ihr Text stehen</span>
    </Button>
  ))
