import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Modal from '../modal/modal.jsx';

import styles from './content-wrapper.css';

const ContentWrapper = ({ children, backToHome, style, title, splitSections }) => (
    <Modal
        fullScreen
        contentLabel={title}
        className={classNames(styles.page, styles[`style-${style}`], { [styles.splitSections]: splitSections })}
        headerClassName={styles.header}
        onRequestClose={backToHome}
    >
        <div className={styles.wrapper}>{children}</div>
    </Modal>
);

ContentWrapper.propTypes = {
    backToHome: PropTypes.func.isRequired,
    children: React.childrenOnly,
    style: PropTypes.string,
    title: PropTypes.string,
    splitSections: PropTypes.boolean,
};

ContentWrapper.defaultProps = {
    style: 'blue',
    title: '',
};

export default ContentWrapper;
