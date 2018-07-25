import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import greenFlagIcon from './play@2x.png';
import styles from './green-flag.css';

const GreenFlagComponent = function(props) {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.greenFlag,
                {
                    [styles.isActive]: active,
                }
            )}
            draggable={false}
            src={greenFlagIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};
GreenFlagComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};
GreenFlagComponent.defaultProps = {
    active: false,
    title: 'Go',
};
export default GreenFlagComponent;
