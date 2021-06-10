import PropTypes from 'prop-types'
import React from 'react'
import Input from '../forms/input.jsx'
import styles from './question.css'

const QuestionComponent = (props) => {
  const { answer, question, onChange, onClick, onKeyPress } = props
  return (
    <div className={styles.questionWrapper}>
      <div className={styles.questionContainer}>
        {question ? (
          <div className={styles.questionLabel}>{question}</div>
        ) : null}
        <div className={styles.questionInput}>
          <Input
            autoFocus
            value={answer}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <button className={styles.questionSubmitButton} onClick={onClick}>
            {'✔︎' /* @todo should this be an image? */}
          </button>
        </div>
      </div>
    </div>
  )
}

QuestionComponent.propTypes = {
  answer: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  question: PropTypes.string,
}

export default QuestionComponent
