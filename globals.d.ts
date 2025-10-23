// globals.d.ts
declare global {
  /**
   * Loads the Pyodide WebAssembly module.
   * @param config Optional configuration for Pyodide.
   */
  function loadPyodide(config?: { indexURL?: string }): Promise<any>;

  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
        };
        // Fix: Add oauth2 property to the google.accounts type definition to resolve TypeScript error in googleAuthService.ts.
        oauth2: {
          initTokenClient: (config: any) => any;
          revoke: (token: string, callback: (response: any) => void) => void;
        };
      };
    };
  }
}

// This export statement is required to make the file a module.
export {};