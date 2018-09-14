import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import InlineSVG from '../inline-svg/inline-svg.jsx';

import styles from './button-with-icon.css';

const ButtonWithIconComponent = React.forwardRef(({
    className,
    iconClassName,
    iconSrc,
    iconSvg,
    children,
    onClick,
    href,
    ...props
}, ref) => {
    const icon = iconSvg
        ? <InlineSVG svg={iconSvg} className={classNames(iconClassName, styles.icon)} />
        : iconSrc &&
            <img
                className={classNames(iconClassName, styles.icon)}
                draggable={false}
                src={iconSrc}
            />
    ;

    className = classNames(className, styles.button);
    const inner = (
        <React.Fragment>
            {icon}
            <div className={styles.content}>{children}</div>
        </React.Fragment>
    );

    if (href) {
        return (
            <a
                className={className}
                href={href}
                ref={ref}
                {...props}
            >
                {inner}
            </a>
        );
    }

    return (
        <button
            className={className}
            onClick={onClick}
            ref={ref}
            {...props}
        >
            {inner}
        </button>
    );
});

ButtonWithIconComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    iconSvg: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
};

export default ButtonWithIconComponent;
