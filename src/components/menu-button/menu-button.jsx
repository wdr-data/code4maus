import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'redux-little-router';

import styles from './menu-button.css';
import InlineSVG from '../inline-svg/inline-svg.jsx';

const MenuButtonComponent = ({
    className,
    iconClassName,
    iconSrc,
    iconSvg,
    children,
    linkTo,
    external,
    orientation,
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

    const buttonClassName = classNames(className, styles.button, {
        [styles.buttonVertical]: orientation==='vertical'
    })

    if (external) {
        return (
            <a
                href={linkTo || ''}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName}
                onClick={onClick}
                {...props}
            >
                {icon}
                <div className={styles.content}>{children}</div>
            </a>
        );
    }

    if (!linkTo) {
        return (
            <a
                className={buttonClassName}
                onClick={onClick}
                {...props}
            >
                {icon}
                <div className={styles.content}>{children}</div>
            </a>
        );
    }

    return (
        <Link
            href={linkTo}
            className={buttonClassName}
            onClick={onClick}
            {...props}
        >
            {icon}
            <div className={styles.content}>{children}</div>
        </Link>
    );
};

MenuButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    iconSvg: PropTypes.string,
    linkTo: PropTypes.string,
    external: PropTypes.bool,
    orientation: PropTypes.oneOf(['vertical', 'horizontal']),
    onClick: PropTypes.func,
};

export default MenuButtonComponent;
