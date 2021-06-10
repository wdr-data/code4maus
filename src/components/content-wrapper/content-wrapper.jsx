import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Modal from '../modal/modal.jsx'

import styles from './content-wrapper.css'

function capitalize(word) {
  const lower = word.toLowerCase()
  return word.charAt(0).toUpperCase() + lower.slice(1)
}

const ContentWrapper = ({
  children,
  backToHome,
  style,
  title,
  splitSections,
}) => (
  <Modal
    fullScreen
    contentLabel={title}
    headerClassName={styles.header}
    onRequestClose={backToHome}
    style={style}
  >
    <div
      className={classNames(
        styles.wrapper,
        styles[`style${capitalize(style)}`],
        {
          [styles.splitSections]: splitSections,
        }
      )}
    >
      {children}
    </div>
  </Modal>
)

ContentWrapper.propTypes = {
  backToHome: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.string,
  title: PropTypes.string,
  splitSections: PropTypes.bool,
}

ContentWrapper.defaultProps = {
  style: 'blue',
  title: '',
}

export default ContentWrapper
