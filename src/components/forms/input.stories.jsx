import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from './input.jsx';

storiesOf('Input', module)
    .add('default', () => (
        <Input
            placeholder="Dies ist ein Platzhalter!"
        >
        </Input>
    ));
