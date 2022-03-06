import { configure, addParameters } from '@storybook/react';
import { addons } from '@storybook/addons';
import { addDecorator } from '@storybook/react';
// import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { create } from '@storybook/theming';

const theme = create({ base: 'light', colorPrimary: '#FF4785', colorSecondary: '#e9fd76',
   brandTitle: 'bbuutoonnss'});
addParameters({ options: { theme } });

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /\.stories\.tsx$/);

function loadStories() {
   req.keys().forEach(req);
}

configure(loadStories, module);

// addDecorator(withInfo);
addDecorator(withKnobs);

