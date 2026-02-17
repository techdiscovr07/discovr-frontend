import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { CardBody } from './Card';
import { Button } from './Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <Card className="error-boundary-card">
                        <CardBody>
                            <div className="error-boundary-content">
                                <div className="error-boundary-icon">
                                    <AlertTriangle size={48} />
                                </div>
                                <h1 className="error-boundary-title">Something went wrong</h1>
                                <p className="error-boundary-message">
                                    We encountered an unexpected error. Please try refreshing the page.
                                </p>
                                
                                {import.meta.env.DEV && this.state.error && (
                                    <details className="error-boundary-details">
                                        <summary>Error Details (Development Only)</summary>
                                        <pre className="error-boundary-stack">
                                            {this.state.error.toString()}
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </details>
                                )}

                                <div className="error-boundary-actions">
                                    <Button onClick={this.handleReset} variant="secondary">
                                        <RefreshCw size={18} />
                                        Try Again
                                    </Button>
                                    <Button onClick={this.handleReload}>
                                        Reload Page
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => window.location.href = '/'}
                                    >
                                        <Home size={18} />
                                        Go Home
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
