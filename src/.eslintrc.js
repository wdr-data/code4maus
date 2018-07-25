module.exports = {
    root: true,
    plugins: [
        "import",
        "react",
        "node",
        "es",
    ],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "no-extra-parens": "error",
        "curly": "error",
        "guard-for-in": "error",
        "no-caller": "error",
        "no-console": "warn",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-invalid-this": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-new-wrappers": "error",
        "no-throw-literal": "error",
        "no-with": "error",
        "no-unused-vars": [
            "error",
            {
                args: "none"
            }
        ],
        "array-bracket-newline": [
            "error",
            {
                multiline: true
            }
        ],
        "array-bracket-spacing": [
            "error",
            "always"
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "brace-style": "error",
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "comma-spacing": "error",
        "comma-style": "error",
        "computed-property-spacing": "error",
        "eol-last": "error",
        "func-call-spacing": "error",
        "indent": [
            "error",
            4
        ],
        "key-spacing": "error",
        "keyword-spacing": "error",
/*        "max-len": [
            "error",
            {
                code: 100,
                ignoreUrls: true,
                ignoreRegExpLiterals: true
            }
        ],*/
        "new-cap": "error",
        "no-array-constructor": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                max: 2
            }
        ],
        "no-new-object": "error",
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "padded-blocks": [
            "error",
            "never"
        ],
        "quotes": [
            "error",
            "single",
            {
                avoidEscape: true,
                allowTemplateLiterals: true
            }
        ],
        "require-jsdoc": 0,
        "semi": "error",
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            {
                asyncArrow: "always",
                anonymous: "never",
                named: "never"
            }
        ],
        "spaced-comment": "error",
        "switch-colon-spacing": "error",
        "arrow-parens": [
            "error",
            "always"
        ],
        "constructor-super": "error",
        "generator-star-spacing": "error",
        "no-this-before-super": "error",
        "no-var": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "rest-spread-spacing": "error",
        "yield-star-spacing": "error",
        "eqeqeq": "error",
        "import/no-commonjs": "warn",
    }
}
