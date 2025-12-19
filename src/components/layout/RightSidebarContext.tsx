import { createContext, useContext, useState, ReactNode } from 'react';

interface RightSidebarContextType {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | null>(null);

export function RightSidebarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  return (
    <RightSidebarContext.Provider value={{ content, setContent }}>
      {children}
    </RightSidebarContext.Provider>
  );
}

export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error('useRightSidebar must be used within RightSidebarProvider');
  }
  return context;
}

export function RightSidebar() {
  const { content } = useRightSidebar();

  if (!content) return null;

  return (
    <aside className="w-96 shrink-0 border-l border-gray-200 bg-gray-50/50">
      <div className="sticky top-0 h-screen overflow-y-auto p-6">
        {content}
      </div>
    </aside>
  );
}
