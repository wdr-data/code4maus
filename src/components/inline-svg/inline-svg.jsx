import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './inline-svg.css';

const InlineSVG = (props) => {
    const {
        svg,
        className,
        ...componentProps
    } = props;
    return (
        <span
            dangerouslySetInnerHTML={{ __html: svg }}
            className={classNames(styles.wrapper, className)}
            {...componentProps}
        />
    );
};

InlineSVG.propTypes = {
    svg: PropTypes.string.isRequired,
    className: PropTypes.string,
};

InlineSVG.defaultProps = {
    className: '',
};

export default InlineSVG;
