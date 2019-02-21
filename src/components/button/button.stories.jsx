import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './button.jsx';

storiesOf('Button', module)
    .add('default', () => (
        <Button />
    ))
    .add('primary', () => (
        <Button primary='true'></Button>
    ))
    .add('secondary', () => (
        <Button secondary='true'></Button>
    ))
    .add('wiggle', () => (
        <Button wiggle='true' primary='true'></Button>
    ))
    .add('disabled', () => (
        <Button disabled='true'>
        </Button>
    ));
