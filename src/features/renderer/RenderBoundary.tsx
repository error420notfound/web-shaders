import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
export class RenderBoundary extends Component<
  { children: ReactNode; onError: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: Error, _info: ErrorInfo) {
    this.props.onError(e.message);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
