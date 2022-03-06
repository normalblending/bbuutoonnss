import { create } from '@storybook/theming/create';

export default create({
    base: 'light',

    colorPrimary: 'red',
    colorSecondary: 'red',

    // UI
    appBg: 'white',
    appContentBg: 'silver',
    appBorderColor: 'grey',
    appBorderRadius: 0,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: 'red',
    textInverseColor: 'rgba(255,255,255,0.9)',

    // Toolbar default and active colors
    barTextColor: 'silver',
    barSelectedColor: 'black',
    barBg: 'hotpink',

    // Form colors
    inputBg: 'white',
    inputBorder: 'silver',
    inputTextColor: 'black',
    inputBorderRadius: 4,

    brandTitle: 'My custom storybook',
    brandUrl: 'https://example.com',
    brandImage: 'https://placehold.it/350x150',
});