module.exports = {
    root: true,
    extends: ['scratch/react', 'scratch/es6'],
    env: {
        browser: true,
        jest: true
    },
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module"
    },
    rules: {
        'react/prop-types': 0
    }
};
