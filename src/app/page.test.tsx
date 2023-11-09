import { screen, render } from '@testing-library/react';
import Home from './page';

it('should render page correctly', () => {
  render(<Home />);

  const anchorTag = screen.queryByRole('link', { name: 'test' });

  expect(anchorTag).toBeInTheDocument();
});
