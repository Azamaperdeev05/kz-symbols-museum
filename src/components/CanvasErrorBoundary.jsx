import React from 'react';
import { FallbackView } from './FallbackView';

export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Museum 3D Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackView webGlFailed={true} />;
    }
    return this.props.children;
  }
}
