import PropTypes from 'prop-types';
import React from 'react';

import stopAllIcon from './stop@2x.png';

const StopAllComponent = function(props) {
    const {
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            draggable={false}
            src={stopAllIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

StopAllComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};

StopAllComponent.defaultProps = {
    title: 'Stop',
};

export default StopAllComponent;
