import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

it('Test test', () => {
  const tree = renderer
    .create(<Text>Open up App.tsx to start working on your app!</Text>)
    .toJSON();
  expect(tree.children).toContain(
    'Open up App.tsx to start working on your app!',
  );
});
