"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container flex flex-1 flex-col justify-center items-center mt-28 mb-10 gap-10">
          <h1 className="text-2xl font-bold text-rivalz-text-primary">
            Oh no! Something went wrong.
          </h1>
          <a href="/">
            <Button variant="outlineGreen">Go home !</Button>
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
