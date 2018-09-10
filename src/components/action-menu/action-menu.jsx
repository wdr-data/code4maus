import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import ReactTooltip from 'react-tooltip';

import styles from './action-menu.css';

const CLOSE_DELAY = 300; // ms

class ActionMenu extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'setButtonRef',
            'setContainerRef',
        ]);
    }
    shouldComponentUpdate(newProps, newState) {
        // This check prevents re-rendering while the project is updating.
        // @todo check only the state and the title because it is enough to know
        //  if anything substantial has changed
        // This is needed because of the sloppy way the props are passed as a new object,
        //  which should be refactored.
        return newProps.title !== this.props.title;
    }
    setButtonRef(ref) {
        this.buttonRef = ref;
    }
    setContainerRef(ref) {
        this.containerRef = ref;
    }
    render() {
        const {
            className,
            img: mainImg,
            title: mainTitle,
            moreButtons,
            onClick,
        } = this.props;

        const mainTooltipId = `tooltip-${Math.random()}`;

        return (
            <div
                className={classNames(styles.menuContainer, className)}
                ref={this.setContainerRef}
            >
                <button
                    aria-label={mainTitle}
                    className={classNames(styles.button, styles.mainButton)}
                    data-for={mainTooltipId}
                    data-tip={mainTitle}
                    ref={this.setButtonRef}
                    onClick={onClick}
                >
                    <img
                        className={styles.mainIcon}
                        draggable={false}
                        src={mainImg}
                    />
                </button>
                <ReactTooltip
                    className={styles.tooltip}
                    effect="solid"
                    id={mainTooltipId}
                    place="right"
                />
                {!moreButtons ? null :
                    <div className={styles.moreButtons}>
                        {(moreButtons || []).map(({ img, title, onClick: handleClick,
                            fileAccept, fileChange, fileInput }, keyId) => {
                            const isComingSoon = !handleClick;
                            const hasFileInput = fileInput;
                            const tooltipId = title;
                            return (
                                <div key={`${tooltipId}-${keyId}`}>
                                    <button
                                        aria-label={title}
                                        className={classNames(styles.button, styles.moreButton)}
                                        data-for={tooltipId}
                                        data-tip={title}
                                        onClick={handleClick}
                                    >
                                        <img
                                            className={styles.moreIcon}
                                            draggable={false}
                                            src={img}
                                        />
                                        {hasFileInput ?
                                            <input
                                                accept={fileAccept}
                                                className={styles.fileInput}
                                                ref={fileInput}
                                                type="file"
                                                onChange={fileChange}
                                            /> : null}
                                    </button>
                                    <ReactTooltip
                                        className={classNames(styles.tooltip, {
                                            [styles.comingSoonTooltip]: isComingSoon,
                                        })}
                                        effect="solid"
                                        id={tooltipId}
                                        place="right"
                                    />
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        );
    }
}

ActionMenu.propTypes = {
    className: PropTypes.string,
    img: PropTypes.string,
    moreButtons: PropTypes.arrayOf(PropTypes.shape({
        img: PropTypes.string,
        title: PropTypes.node.isRequired,
        onClick: PropTypes.func, // Optional, "coming soon" if no callback provided
        fileAccept: PropTypes.string, // Optional, only for file upload
        fileChange: PropTypes.func, // Optional, only for file upload
        fileInput: PropTypes.func, // Optional, only for file upload
    })),
    onClick: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired,
};

export default ActionMenu;
