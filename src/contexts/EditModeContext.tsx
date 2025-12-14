import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });

  const setEditMode = (enabled: boolean) => {
    setIsEditMode(enabled);
    sessionStorage.setItem('editMode', enabled ? 'true' : 'false');
  };

  const setAdminAuthenticated = (auth: boolean) => {
    setIsAdminAuthenticated(auth);
    sessionStorage.setItem('adminAuth', auth ? 'true' : 'false');
    if (!auth) {
      setEditMode(false);
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode, isAdminAuthenticated, setAdminAuthenticated }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
};
