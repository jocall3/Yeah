import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { useGlobalState } from './contexts/GlobalStateContext.tsx';
import { logEvent } from './services/telemetryService.ts';
import type { ViewType, AppUser } from './types.ts';
import { CommandPalette } from './components/CommandPalette.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { VaultProvider } from './components/vault/VaultProvider.tsx';
import { initGoogleAuth } from './services/googleAuthService.ts';
import { LoginView } from './components/LoginView.tsx';
import { DesktopView } from './components/desktop/DesktopView.tsx';
import { isApiKeyConfigured, initializeAiClient } from './services/aiService.ts';
import { ApiKeyPromptModal } from './components/ApiKeyPromptModal.tsx';
import { OctokitProvider } from './contexts/OctokitContext.tsx';
import { useVaultModal } from './contexts/VaultModalContext.tsx';
import { isVaultInitialized } from './services/vaultService.ts';


export const LoadingIndicator: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-text-secondary ml-2">Loading...</span>
        </div>
    </div>
);

interface LocalStorageConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const LocalStorageConsentModal: React.FC<LocalStorageConsentModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center fade-in">
      <div 
        className="bg-surface border border-border rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md m-4 p-8 text-center animate-pop-in"
      >
        <h2 className="text-2xl mb-4">Store Data Locally?</h2>
        <p className="text-text-secondary mb-6">
          This application uses your browser's local storage to save your settings and remember your progress between sessions. This data stays on your computer and is not shared.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-surface border border-border text-text-primary font-bold rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="btn-primary px-6 py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
    const { state, dispatch } = useGlobalState();
    const { activeView } = state;
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              setCommandPaletteOpen(isOpen => !isOpen);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
  
    const handleViewChange = useCallback((view: ViewType, props: any = {}) => {
      logEvent('view_changed', { view });
      dispatch({ type: 'SET_VIEW', payload: { view, props } });
      setCommandPaletteOpen(false);
    }, [dispatch]);
  
    return (
        <OctokitProvider>
            <div className="relative flex h-full w-full bg-slate-800" style={{
                backgroundImage: 'radial-gradient(circle at top left, var(--color-primary), transparent 60%), radial-gradient(circle at bottom right, #38bdf8, transparent 50%)',
                backgroundBlendMode: 'multiply',
            }}>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingIndicator />}>
                        <DesktopView openFeatureId={activeView} onNavigate={handleViewChange} />
                    </Suspense>
                </ErrorBoundary>
                <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} onSelect={handleViewChange} />
            </div>
        </OctokitProvider>
    )
}

const AppShell: React.FC = () => {
    const [consent, setConsent] = useState<'pending' | 'granted' | 'denied'>();
    const { state, dispatch } = useGlobalState();
    const { user, vaultState, isApiKeyMissing } = state;
    const { requestCreation } = useVaultModal();
    useTheme();

    useEffect(() => {
      try {
          const consentStatus = localStorage.getItem('devcore_ls_consent');
          if (!consentStatus) {
              setConsent('pending');
          } else {
              setConsent(consentStatus as 'granted' | 'denied');
          }
      } catch (e) {
          console.warn("Could not access localStorage.", e);
          setConsent('denied');
      }
    }, []);
    
    // Onboarding flow effect
    useEffect(() => {
        const runOnboardingChecks = async () => {
            if (consent !== 'granted' || !user) return;
            
            // Check if vault needs to be created
            const vaultExists = await isVaultInitialized();
            if (!vaultExists) {
                dispatch({ type: 'SET_VAULT_STATE', payload: { isInitialized: false, isUnlocked: false } });
                const created = await requestCreation();
                if (created) {
                     dispatch({ type: 'SET_VAULT_STATE', payload: { isInitialized: true, isUnlocked: true } });
                } else {
                    return; // Stop flow if vault creation is cancelled
                }
            } else {
                 dispatch({ type: 'SET_VAULT_STATE', payload: { isInitialized: true } });
            }

            // After vault is confirmed to exist/be created, check for API key
            const keyConfigured = await isApiKeyConfigured();
            if (!keyConfigured) {
                dispatch({ type: 'SET_API_KEY_MISSING', payload: true });
            } else {
                dispatch({ type: 'SET_API_KEY_MISSING', payload: false });
                initializeAiClient(); // Attempt initialization
            }
        };
        runOnboardingChecks();

    }, [consent, user, requestCreation, dispatch]);


    useEffect(() => {
        const handleUserChanged = (appUser: AppUser | null) => {
            dispatch({ type: 'SET_APP_USER', payload: appUser });
        };

        const initAuth = () => {
            if (window.google) {
                initGoogleAuth(handleUserChanged);
            }
        };

        const gsiScript = document.getElementById('gsi-client');
        if (window.google) {
            initAuth();
        } else if (gsiScript) {
            gsiScript.addEventListener('load', initAuth);
            return () => gsiScript.removeEventListener('load', initAuth);
        }
    }, [dispatch]);
  
    const handleAcceptConsent = () => {
      try {
          localStorage.setItem('devcore_ls_consent', 'granted');
          window.location.reload(); // Reload to re-evaluate storage access
      } catch (e) {
          console.error("Could not write to localStorage.", e);
          setConsent('denied');
      }
    };
  
    const handleDeclineConsent = () => {
      try {
          localStorage.setItem('devcore_ls_consent', 'denied');
      } catch (e) {
          console.error("Could not write to localStorage.", e);
      }
      setConsent('denied');
    };
    
    const renderContent = () => {
        if (consent === 'pending') {
            return <LocalStorageConsentModal onAccept={handleAcceptConsent} onDecline={handleDeclineConsent} />;
        }
        if (consent === 'denied') {
            return <div className="w-full h-full flex items-center justify-center p-8 text-center">Local storage access is required for this application to function. Please reload and accept the prompt.</div>
        }
        if (!user) {
            return <LoginView />;
        }
        if (!vaultState.isInitialized || !vaultState.isUnlocked) {
             // The VaultProvider modals will handle prompting for creation/unlock
             return <LoadingIndicator />;
        }
        if (isApiKeyMissing) {
            return <ApiKeyPromptModal />;
        }
         // Only show main app if user is logged in, vault is handled, and key is present.
        if (user && vaultState.isUnlocked && !isApiKeyMissing) {
            return <AppContent />;
        }
        // Default to a loading state while checks are running
        return <LoadingIndicator />;
    };

    return renderContent();
};


const App: React.FC = () => {
    return (
        <div className="h-screen w-screen font-sans overflow-hidden bg-background">
            <NotificationProvider>
                <VaultProvider>
                    <AppShell />
                </VaultProvider>
            </NotificationProvider>
        </div>
    );
};

export default App;