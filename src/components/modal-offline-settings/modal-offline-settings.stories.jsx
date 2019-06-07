import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';

import ModalOfflineSettings, { modes } from './modal-offline-settings.jsx';


storiesOf('ModalOfflineSettings', module)
    .add('default', () => (
        <ModalOfflineSettings mode={select('mode', modes, 'inactive')}/>
    ));
