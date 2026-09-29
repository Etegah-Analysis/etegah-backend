import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("React Error Boundary caught error:", error, errorInfo);
    // Silent auto-reset for transient rendering hiccups
    setTimeout(() => {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    }, 200);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return this.props.children || null;
    }
    return this.props.children;
  }
}
