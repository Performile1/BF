import React, { createContext, useContext, useState, useEffect } from 'react';

interface InspectorContextType {
  inspectorEnabled: boolean;
  setInspectorEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleInspector: () => void;
  mockMode: boolean;
  setMockMode: (val: boolean) => void;
}

const InspectorContext = createContext<InspectorContextType>({
  inspectorEnabled: false,
  setInspectorEnabled: () => {},
  toggleInspector: () => {},
  mockMode: false,
  setMockMode: () => {},
});

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [inspectorEnabled, setInspectorEnabledState] = useState(false);
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bf_dev_inspector') === 'true';
      setInspectorEnabledState(stored);
    } catch {
      // hydration safe
    }

    // Global tangentbordsgenväg: Alt + I (eller Option + I på Mac)
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

  return (
    <InspectorContext.Provider value={{ 
      inspectorEnabled, 
      setInspectorEnabled, 
      toggleInspector, 
      mockMode, 
      setMockMode 
    }}>
      {children}
    </InspectorContext.Provider>
  );
}

export const useInspector = () => useContext(InspectorContext);
