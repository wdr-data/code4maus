import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button.jsx';

import styles from './button-primary.css';

const ButtonPrimary = (props) => {
    const {
        arrowLeft,
        arrowRight,
        className,
        grey,
        wiggle,
        disabled,
        ...componentProps
    } = props;

    return <Button
        className={classNames(
            className,
            styles.button,
            {
                [styles.arrowLeft]: arrowLeft,
                [styles.arrowRight]: arrowRight,
                [styles.disabled]: disabled,
                [styles.grey]: grey,
                [styles.wiggle]: wiggle,
            },
        )}
        disabled={disabled}
        {...componentProps}
    />;
};

ButtonPrimary.propTypes = {
    className: PropTypes.string,
    arrowLeft: PropTypes.bool,
    arrowRight: PropTypes.bool,
    disabled: PropTypes.bool,
    grey: PropTypes.bool,
    wiggle: PropTypes.bool,
};

ButtonPrimary.defaultProps = {
    className: '',
};

export default ButtonPrimary;
