import React from 'react';
import { logError } from '../services/index.ts';
import { debugErrorStream } from '../services/index.ts';
import { SparklesIcon } from './icons.tsx';
import { MarkdownRenderer, LoadingSpinner } from './shared/index.tsx';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  aiHelp: string;
  isAiLoading: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, aiHelp: '', isAiLoading: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, { componentStack: errorInfo.componentStack });
  }
  
  handleRevert = () => {
    window.location.reload();
  };

  handleAskAi = async () => {
    if (!this.state.error) return;

    this.setState({ isAiLoading: true, aiHelp: '' });
    try {
        const stream = debugErrorStream(this.state.error);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            this.setState({ aiHelp: fullResponse });
        }
    } catch (e) {
        this.setState({ aiHelp: 'Sorry, the AI assistant could not be reached.' });
        logError(e as Error, { context: 'AI Error Debugging' });
    } finally {
        this.setState({ isAiLoading: false });
    }
};

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background text-text-primary">
            <div className="w-full max-w-4xl bg-surface border border-border rounded-lg p-6 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Error Details & Actions */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">An Unexpected Error Occurred</h1>
                    <p className="text-text-secondary mb-4">A component has crashed. You can try reloading or ask the AI for debugging help.</p>
                    
                    <details className="text-left bg-gray-50 p-2 rounded-md max-w-xl text-xs font-mono mb-4 flex-grow overflow-auto border border-border">
                        <summary className="cursor-pointer">Error Details</summary>
                        <pre className="mt-2 whitespace-pre-wrap">{this.state.error?.stack}</pre>
                    </details>
                    
                    <div className="flex gap-4 mt-auto">
                        <button
                            onClick={this.handleRevert}
                            className="flex-1 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-md hover:bg-yellow-300 transition-colors"
                        >
                            Reload Application
                        </button>
                         <button
                            onClick={this.handleAskAi}
                            disabled={this.state.isAiLoading}
                            className="btn-primary flex-1 px-4 py-2 flex items-center justify-center gap-2"
                        >
                            <SparklesIcon />
                            {this.state.isAiLoading ? 'Analyzing...' : 'Ask AI for Help'}
                        </button>
                    </div>
                </div>

                {/* Right Column: AI Help */}
                <div className="flex flex-col bg-gray-50 rounded-lg p-4 border border-border">
                    <h2 className="text-lg font-bold text-text-primary mb-2">AI Assistant</h2>
                    <div className="flex-grow overflow-y-auto">
                        {this.state.isAiLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                        {this.state.aiHelp && <MarkdownRenderer content={this.state.aiHelp} />}
                        {!this.state.isAiLoading && !this.state.aiHelp && <p className="text-text-secondary text-center pt-10">Click "Ask AI" to get debugging suggestions.</p>}
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}