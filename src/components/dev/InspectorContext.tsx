import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InspectorContextType {
  inspectorEnabled: boolean;
  setInspectorEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleInspector: () => void;
  cleanSlateMode: boolean;
  setCleanSlateMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleCleanSlate: () => void;
  mockMode: boolean;
  setMockMode: (val: boolean) => void;
}

const InspectorContext = createContext<InspectorContextType>({
  inspectorEnabled: false,
  setInspectorEnabled: () => {},
  toggleInspector: () => {},
  cleanSlateMode: false,
  setCleanSlateMode: () => {},
  toggleCleanSlate: () => {},
  mockMode: true,
  setMockMode: () => {},
});

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [inspectorEnabled, setInspectorEnabledState] = useState(false);
  const [cleanSlateMode, setCleanSlateModeState] = useState(false);

  useEffect(() => {
    try {
      const storedInspector = localStorage.getItem('bf_dev_inspector') === 'true';
      setInspectorEnabledState(storedInspector);

      const storedCleanSlate = localStorage.getItem('bf_clean_slate') === 'true';
      setCleanSlateModeState(storedCleanSlate);
    } catch {
      // hydration safe
    }

    // Global tangentbordsgenväg: Alt + I (eller Option + I på Mac) för inspector
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        toggleInspector();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setInspectorEnabled = (val: boolean | ((prev: boolean) => boolean)) => {
    setInspectorEnabledState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('bf_dev_inspector', String(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  const toggleInspector = () => {
    setInspectorEnabled((prev) => !prev);
  };

  const setCleanSlateMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setCleanSlateModeState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('bf_clean_slate', String(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  const toggleCleanSlate = () => {
    setCleanSlateMode((prev) => !prev);
  };

  const setMockMode = (val: boolean) => {
    setCleanSlateMode(!val);
  };

  return (
    <InspectorContext.Provider value={{ 
      inspectorEnabled, 
      setInspectorEnabled, 
      toggleInspector, 
      cleanSlateMode,
      setCleanSlateMode,
      toggleCleanSlate,
      mockMode: !cleanSlateMode, 
      setMockMode 
    }}>
      {children}
    </InspectorContext.Provider>
  );
}

export const useInspector = () => useContext(InspectorContext);
