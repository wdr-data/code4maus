import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';

import styles from './monitor.css';
import { List } from 'react-virtualized';

class ListMonitorScroller extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'rowRenderer',
            'noRowsRenderer',
            'handleEventFactory',
        ]);
    }
    handleEventFactory(index) {
        return () => this.props.onActivate(index);
    }
    noRowsRenderer() {
        return (
            <div className={classNames(styles.listRow, styles.listEmpty)}>
                {'(leer)' /* TODO waiting for design before translation */}
            </div>
        );
    }
    rowRenderer({ index, key, style }) {
        return (
            <div
                className={styles.listRow}
                key={key}
                style={style}
            >
                <div className={styles.listIndex}>{index + 1 /* one indexed */}</div>
                <div
                    className={styles.listValue}
                    dataIndex={index}
                    style={{ background: this.props.categoryColor }}
                    onClick={this.props.draggable ? this.handleEventFactory(index) : null}
                >
                    {this.props.draggable && this.props.activeIndex === index ?
                        <div className={styles.inputWrapper}>
                            <input
                                autoFocus
                                autoComplete={false}
                                className={classNames(styles.listInput, 'no-drag')}
                                spellCheck={false}
                                type="text"
                                value={this.props.activeValue}
                                onBlur={this.props.onDeactivate}
                                onChange={this.props.onInput}
                                onFocus={this.props.onFocus}
                                onKeyDown={this.props.onKeyPress} // key down to get ahead of blur
                            />
                            <div
                                className={styles.removeButton}
                                onMouseDown={this.props.onRemove} // mousedown to get ahead of blur
                            >
                                {'✖︎'}
                            </div>
                        </div>

                        :
                        <div className={styles.valueInner}>{this.props.values[index]}</div>
                    }
                </div>
            </div>
        );
    }
    render() {
        const { height, values, width, activeIndex, activeValue } = this.props;
        // Keep the active index in view if defined, else must be undefined for List component
        const scrollToIndex = activeIndex === null ? undefined : activeIndex; /* eslint-disable-line no-undefined */
        return (
            <List
                activeIndex={activeIndex}
                activeValue={activeValue}
                height={height - 44 /* Header/footer size, approx */}
                noRowsRenderer={this.noRowsRenderer}
                rowCount={values.length}
                rowHeight={24 /* Row size is same for all rows */}
                rowRenderer={this.rowRenderer}
                scrollToIndex={scrollToIndex} /* eslint-disable-line no-undefined */
                values={values}
                width={width}
            />
        );
    }
}

ListMonitorScroller.propTypes = {
    activeIndex: PropTypes.number,
    activeValue: PropTypes.string,
    categoryColor: PropTypes.string,
    draggable: PropTypes.bool,
    height: PropTypes.number,
    onActivate: PropTypes.func,
    onDeactivate: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onKeyPress: PropTypes.func,
    onRemove: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])),
    width: PropTypes.number,
};
export default ListMonitorScroller;
