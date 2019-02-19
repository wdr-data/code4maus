import React from 'react';
import { storiesOf } from '@storybook/react';
import Modal from './modal.jsx';
import Input from '../forms/input.jsx';

storiesOf('Modal', module)
    .add('default', () => (
        <Modal
            contentLabel="Title of modal"
        >
            <Input />
        </Modal>
    ));
