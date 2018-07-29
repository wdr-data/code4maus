import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title',
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title',
    },
});

const Controls = function(props) {
    const {
        active,
        className,
        intl,
        isFullScreen,
        onGreenFlagClick,
        onStopAllClick,
        turbo,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.controlsContainer, className, { [styles.isFullScreen]: isFullScreen })}
            {...componentProps}
        >
            <GreenFlag
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
                className={classNames(styles.control, { [styles.isActive]: active })}
            />
            <StopAll
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
                className={classNames(styles.control, { [styles.isActive]: !active })}
            />
            {turbo ?
                <TurboMode />
                : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    isFullScreen: PropTypes.bool,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool,
};

Controls.defaultProps = {
    active: false,
    turbo: false,
};

export default injectIntl(Controls);
