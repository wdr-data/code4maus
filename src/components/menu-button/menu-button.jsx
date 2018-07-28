import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './menu-button.css';
import InlineSVG from '../inline-svg/inline-svg.jsx';

const MenuButtonComponent = ({
    className,
    iconClassName,
    iconSrc,
    iconSvg,
    children,
    onClick,
    ...props
}) => {
    const icon = iconSvg
        ? <InlineSVG svg={iconSvg} className={classNames(iconClassName, styles.icon)} />
        : iconSrc &&
            <img
                className={classNames(iconClassName, styles.icon)}
                draggable={false}
                src={iconSrc}
            />
    ;

    return (
        <button
            className={classNames(className, styles.button)}
            onClick={onClick}
            {...props}
        >
            {icon}
            <div className={styles.content}>{children}</div>
        </button>
    );
};

MenuButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    iconSvg: PropTypes.string,
    onClick: PropTypes.func,
};

export default MenuButtonComponent;
