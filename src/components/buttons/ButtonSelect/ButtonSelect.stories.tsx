import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ButtonSelect } from './ButtonSelect';
// import { text } from '@storybook/addon-knobs';

const stories = storiesOf('ButtonSelect', module);

stories.add('ButtonSelect', () => <ButtonSelect/>, {
   info: { inline: true },
   text: `

  ### Notes

  Simple Button component

  ### Usage
  ~~~js
  <ButtonSelect/>
  ~~~

`
});
