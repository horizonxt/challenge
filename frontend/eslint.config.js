import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import typescriptParser from '@typescript-eslint/parser';

export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'src/components/ui/**'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: typescriptParser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@typescript-eslint': typescriptPlugin,
            react: reactPlugin,
            'unused-imports': unusedImportsPlugin,
            import: importPlugin
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            semi: ['error', 'always'],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: ['parameter', 'variable'],
                    leadingUnderscore: 'require',
                    format: ['camelCase'],
                    modifiers: ['unused']
                },
                {
                    selector: ['parameter', 'variable'],
                    leadingUnderscore: 'allowDouble',
                    format: ['camelCase']
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],
            'no-case-declarations': 'off',
            'no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_'
                }
            ],

            'no-extra-semi': 'error',
            eqeqeq: 'error',
            camelcase: 'error',
            indent: ['error', 4],
            'linebreak-style': ['error', 'windows'],
            quotes: ['error', 'single', { avoidEscape: true }],
            curly: 'error',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true }
                }
            ]
        }
    }
);
