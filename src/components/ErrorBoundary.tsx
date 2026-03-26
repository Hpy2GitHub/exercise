// ErrorBoundary.tsx
import  { Component, type ErrorInfo, type ReactNode } from 'react';
import './error-boundary.css'; // Import the stylesheet

// Define the props interface for the ErrorBoundary component
interface ErrorBoundaryProps {
  /**
   * The child components that this error boundary will wrap.
   * If an error occurs in any of these children, the error boundary will catch it.
   */
  children: ReactNode;
  
  /**
   * Optional custom fallback UI to display when an error is caught.
   * If not provided, a default error UI will be shown.
   */
  fallback?: ReactNode;
  
  /**
   * Optional callback function that will be invoked when an error is caught.
   * Useful for logging errors to external services (e.g., Sentry, LogRocket).
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /**
   * Optional callback function that will be invoked when the user clicks the reset button.
   * Can be used to reset application state or perform cleanup.
   */
  onReset?: () => void;
  
  /**
   * Optional key to force reset the error boundary when the key changes.
   * Useful when you want to reset the boundary based on route changes or other conditions.
   */
  resetKey?: string;
}

// Define the state interface for the ErrorBoundary component
interface ErrorBoundaryState {
  /**
   * The error that was caught by the error boundary, or null if no error has occurred.
   */
  hasError: boolean;
  
  /**
   * The error object containing details about what went wrong.
   */
  error: Error | null;
  
  /**
   * Information about where in the component tree the error occurred.
   * Contains componentStack which shows the component hierarchy.
   */
  errorInfo: ErrorInfo | null;
  
  /**
   * Optional counter that can be used to track retry attempts or show retry options.
   */
  retryCount: number;
}

/**
 * ErrorBoundary is a React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
 * 
 * IMPORTANT: Error boundaries do NOT catch errors for:
 * - Event handlers (use try/catch instead)
 * - Asynchronous code (e.g., setTimeout, requestAnimationFrame callbacks)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself (rather than its children)
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initialize the component state.
   * The error boundary starts in a "no error" state.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  /**
   * Static lifecycle method that is called when an error is thrown in a child component.
   * This method updates the state so the next render will show the fallback UI.
   * 
   * @param error - The error that was thrown
   * @returns An object to update the state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error: error
    };
  }

  /**
   * Lifecycle method that is called after an error has been thrown by a descendant component.
   * This is where you would typically log error information to an external service.
   * 
   * @param error - The error that was thrown
   * @param errorInfo - An object with information about which component threw the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info for detailed error display
    this.setState({
      errorInfo: errorInfo
    });

    // Call the optional onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Example of logging to console (in production, you'd send to an error tracking service)
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
    
    // You could also send to an error tracking service here:
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  /**
   * Lifecycle method that runs when the component receives new props.
   * This allows us to reset the error boundary when the resetKey prop changes.
   * 
   * @param prevProps - The previous props before the update
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // If the resetKey has changed, reset the error boundary
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.resetErrorBoundary();
    }
  }

  /**
   * Resets the error boundary to its initial state, clearing the error.
   * This is typically called when the user clicks a "Try again" button.
   */
  resetErrorBoundary = (): void => {
    // Clear the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });

    // Call the optional onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    console.log('Error boundary has been reset. Retry count:', this.state.retryCount + 1);
  };

  /**
   * Refreshes the current page as a last resort recovery method.
   * Use this when the application state might be too corrupted to recover.
   */
  refreshPage = (): void => {
    console.log('Refreshing page to recover from error...');
    window.location.reload();
  };

  /**
   * Renders the component. If an error has been caught, it renders the fallback UI.
   * Otherwise, it renders the children normally.
   */
  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    // If an error has been caught, render the fallback UI
    if (hasError) {
      console.log(hasError);
      console.log(error);
      console.log(errorInfo);
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise, render the default error UI
      return this.renderDefaultErrorUI();
    }

    // If no error has been caught, render children normally
    return children;
  }

  /**
   * Renders the default error UI when no custom fallback is provided.
   * This UI shows error details and provides recovery options.
   */
  private renderDefaultErrorUI(): ReactNode {
    const { error, errorInfo, retryCount } = this.state;

    return (
      <div className="error-boundary-container">
        <div className="error-boundary-card">
          {/* Error Icon */}
          <div className="error-boundary-icon-container">
            <div className="error-boundary-icon">⚠️</div>
          </div>

          {/* Error Title */}
          <h1 className="error-boundary-title">Something went wrong</h1>
          
          {/* Error Message */}
          <p className="error-boundary-message">
            The application encountered an unexpected error. This could be due to:
          </p>
          <ul className="error-boundary-list">
            <li>A temporary network issue</li>
            <li>Corrupted data in the application</li>
            <li>A bug in the code</li>
          </ul>

          {/* Detailed Error Information (collapsible for cleaner UI) */}
          {error && (
            <details className="error-boundary-details">
              <summary className="error-boundary-summary">Show error details</summary>
              <div className="error-boundary-error-details">
                <h4 className="error-boundary-error-title">Error Message:</h4>
                <code className="error-boundary-error-message">{error.toString()}</code>
                
                {errorInfo && errorInfo.componentStack && (
                  <>
                    <h4 className="error-boundary-error-title">Component Stack:</h4>
                    <pre className="error-boundary-stack-trace">
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
                
                {error.stack && (
                  <>
                    <h4 className="error-boundary-error-title">Stack Trace:</h4>
                    <pre className="error-boundary-stack-trace">
                      {error.stack}
                    </pre>
                  </>
                )}
              </div>
            </details>
          )}

          {/* Recovery Actions */}
          <div className="error-boundary-actions">
            <button
              onClick={this.resetErrorBoundary}
              className="error-boundary-primary-button"
              aria-label="Try to recover from the error"
            >
              Try Again
              {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
            </button>
            
            <button
              onClick={this.refreshPage}
              className="error-boundary-secondary-button"
              aria-label="Refresh the entire page"
            >
              Refresh Page
            </button>
            
            {/* Optional: Report Error Button */}
            <button
              onClick={() => {
                // In a real app, this would open a bug report form or email
                const subject = encodeURIComponent(`Bug Report: ${error?.message || 'Unknown error'}`);
                const body = encodeURIComponent(
                  `Error Details:\n\n${error?.toString()}\n\nComponent Stack:\n${errorInfo?.componentStack || 'N/A'}`
                );
                window.open(`mailto:support@example.com?subject=${subject}&body=${body}`, '_blank');
              }}
              className="error-boundary-tertiary-button"
              aria-label="Report this error to support"
            >
              Report Error
            </button>
          </div>

          {/* Help Text */}
          <p className="error-boundary-help-text">
            If the problem persists, please contact support or try clearing your browser cache.
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

/**
 * USAGE EXAMPLES:
 * 
 * 1. Basic usage:
 *    <ErrorBoundary>
 *      <YourComponent />
 *    </ErrorBoundary>
 * 
 * 2. With custom fallback:
 *    <ErrorBoundary fallback={<div>Custom error message</div>}>
 *      <YourComponent />
 *    </ErrorBoundary>
 * 
 * 3. With error logging:
 *    <ErrorBoundary onError={(error, errorInfo) => {
 *      // Send to error tracking service
 *      console.error('Caught error:', error, errorInfo);
 *    }}>
 *      <YourComponent />
 *    </ErrorBoundary>
 * 
 * 4. With reset on route change:
 *    <ErrorBoundary resetKey={location.pathname}>
 *      <YourComponent />
 *    </ErrorBoundary>
 * 
 * 5. Wrap specific error-prone components:
 *    <ErrorBoundary>
 *      <NetworkDeviceTracker />
 *    </ErrorBoundary>
 *    <OtherComponent /> {/* This won't be affected by errors in NetworkDeviceTracker *\/
 */
