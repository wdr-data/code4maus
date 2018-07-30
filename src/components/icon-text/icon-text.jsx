import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InlineSvg from '../inline-svg/inline-svg.jsx';

import styles from './icon-text.css';

const IconWithText = (props) => {
    const {
        iconSrc,
        iconSvg,
        className,
        children,
        ...componentProps
    } = props;

    const icon = iconSvg
        ? <InlineSvg svg={iconSvg} className={styles.icon} />
        : iconSrc &&
            <img
                className={styles.icon}
                draggable={false}
                src={iconSrc}
            />
    ;

    return (
        <div className={classNames(className, styles.wrapper)} {...componentProps}>
            {icon}
            {children}
        </div>
    );
};

IconWithText.propTypes = {
    className: PropTypes.string,
    children: React.childrenOnly,
    iconSrc: PropTypes.string,
    iconSvg: PropTypes.string,
};

export default IconWithText;
