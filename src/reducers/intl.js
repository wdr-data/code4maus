import { intlReducer } from 'react-intl-redux';

const intlInitialState = {
    intl: {
        defaultLocale: 'de',
        locale: 'de',
        messages: {},
    },
};

export {
    intlReducer as default,
    intlInitialState,
};
