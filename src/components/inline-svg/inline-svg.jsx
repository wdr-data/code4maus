import React from 'react';
import PropTypes from 'prop-types';

const InlineSVG = (props) => {
    const {
        svg,
        ...componentProps
    } = props;
    return (
        <span dangerouslySetInnerHTML={{ __html: svg }} {...componentProps} />
    );
};

InlineSVG.propTypes = {
    svg: PropTypes.string.isRequired,
};

export default InlineSVG;
