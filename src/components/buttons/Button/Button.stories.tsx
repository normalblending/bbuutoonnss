import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';
// import { text } from '@storybook/addon-knobs';

const stories = storiesOf('Button', module);

stories.add('Button', () => <Button/>, {
   info: { inline: true },
   text: `

  ### Notes

  Simple Button component

  ### Usage
  ~~~js
  <Button/>
  <Button>text</Button>
  ~~~

`
});
