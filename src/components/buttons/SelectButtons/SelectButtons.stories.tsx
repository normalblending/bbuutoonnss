import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SelectButtons } from './SelectButtons';
// import { text } from '@storybook/addon-knobs';

const stories = storiesOf('SelectButtons', module);

stories.add('SelectButtons', () => <SelectButtons  items={[{text: 'a', value: 'a'}]}/>, {
   info: { inline: true },
   text: `

  ### Notes

  Simple Button component

  ### Usage
  ~~~js
  <SelectButtons items={[{text: 'a', value: 'a'}]}/>
  ~~~

`
});
