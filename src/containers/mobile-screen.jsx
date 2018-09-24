import React from 'react';
import ReactDOM from 'react-dom';

import MobileScreenComponent from '../components/mobile-screen/mobile-screen.jsx';
import indexStyles from '../playground/index.css';

class MobileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.el.className = indexStyles.mobileOverlayRoot;
    }

    componentDidMount() {
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            <MobileScreenComponent />,
            this.el,
        );
    }
}

export default MobileScreen;
