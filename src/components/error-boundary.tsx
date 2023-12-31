import * as React from 'react';

export type ErrorBoundaryProps = {
  fallbackUI: React.ReactNode;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallbackUI;
    }

    return this.props.children;
  }
}
