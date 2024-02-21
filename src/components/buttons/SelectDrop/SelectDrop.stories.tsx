import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SelectDrop } from './SelectDrop';
import {SelectButtons} from "../SelectButtons";
// import { text } from '@storybook/addon-knobs';

const stories = storiesOf('SelectDrop', module);

stories.add('SelectDrop', () => <SelectDrop   items={[{text: 'a', value: 'a'}]}/>, {
   info: { inline: true },
   text: `

  ### Notes

  Simple Button component

  ### Usage
  ~~~js
  <SelectDrop   items={[{text: 'a', value: 'a'}]}/>
  ~~~

`
});
