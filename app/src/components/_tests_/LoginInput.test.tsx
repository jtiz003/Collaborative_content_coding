import React from 'react';
import { render } from '@testing-library/react';
import {LoginInput} from '../LoginInput';

test('renders without crashing', () => {
    const { baseElement } = render(<LoginInput />);
    expect(baseElement).toBeDefined();
});
  