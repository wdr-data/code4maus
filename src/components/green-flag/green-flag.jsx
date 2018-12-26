import PropTypes from 'prop-types';
import React from 'react';

import greenFlagIcon from './play@2x.png';

const GreenFlagComponent = function(props) {
    const {
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            draggable={false}
            src={greenFlagIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};
GreenFlagComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};
GreenFlagComponent.defaultProps = {
    title: 'Go',
};
export default GreenFlagComponent;
