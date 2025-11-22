'use client';

import { ReactNode, Component, ReactElement } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#b96a82] mb-4">Oops! Something went wrong</h1>
            <p className="text-[#4b2e2b]/70 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-[#b96a82] text-white rounded-full hover:bg-[#a05670] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
