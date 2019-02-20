import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './button.jsx';

storiesOf('Button', module)
    .add('default', () => (
        <Button />
    ))
    .add('disabled', () => (
        <Button disabled='true'>
        </Button>
    ));
