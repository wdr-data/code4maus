import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.css';

const ButtonComponent = ({
    className,
    disabled,
    iconClassName,
    iconSrc,
    onClick,
    children,
    arrowLeft,
    arrowRight,
    grey,
    wiggle,
    outlined,
    ...props
}) => {
    if (disabled) {
        onClick = function() {};
    }

    const icon = iconSrc &&
        <img
            className={classNames(iconClassName, styles.icon)}
            draggable={false}
            src={iconSrc}
        />
    ;

    return <button
        className={classNames(
            styles.button,
            {
                [styles.arrowLeft]: arrowLeft,
                [styles.arrowRight]: arrowRight,
                [styles.disabled]: disabled,
                [styles.grey]: grey,
                [styles.wiggle]: wiggle,
                [styles.outlined]: outlined,
            },
            className,
        )}
        disabled={disabled}
        onClick={onClick}
        {...props}
    >
        {icon}
        <span className={styles.content}>{children}</span>
    </button>;
};

ButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    onClick: PropTypes.func,
    arrowLeft: PropTypes.bool,
    arrowRight: PropTypes.bool,
    grey: PropTypes.bool,
    wiggle: PropTypes.bool,
    outlined: PropTypes.bool,
};

export default ButtonComponent;
