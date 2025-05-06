import React, { useState, createContext, useContext } from "react";

// Button
export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}

// Badge
export function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs bg-gray-200 rounded-full ${className}`}>
      {children}
    </span>
  );
}

// Card
export function Card({ children, className = "" }) {
  return <div className={`border rounded-lg shadow p-4 bg-white ${className}`}>{children}</div>;
}
export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

// Tabs
const TabsContext = createContext();

export function Tabs({ defaultValue = "", children }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex space-x-2 mb-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      className={`px-3 py-1 rounded ${active === value ? "bg-blue-600 text-white" : "bg-gray-200"} ${className}`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const { active } = useContext(TabsContext);
  return active === value ? <div className={className}>{children}</div> : null;
}

// Sidebar
const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className = "", children }) {
  const { isOpen } = useContext(SidebarContext);
  return isOpen ? (
    <div className={`w-64 bg-gray-100 h-screen p-4 space-y-2 ${className}`}>{children}</div>
  ) : null;
}

export function SidebarTrigger({ children, className = "" }) {
  const { setIsOpen } = useContext(SidebarContext);
  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className={`px-2 py-1 bg-gray-300 rounded ${className}`}
    >
      {children}
    </button>
  );
}

export function SidebarHeader({ children, className = "" }) {
  return <div className={`font-bold text-lg mb-2 ${className}`}>{children}</div>;
}

export function SidebarContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SidebarFooter({ children, className = "" }) {
  return <div className={`mt-auto ${className}`}>{children}</div>;
}

export function SidebarGroup({ children, className = "" }) {
  return <div className={`border-t pt-2 ${className}`}>{children}</div>;
}

export function SidebarGroupContent({ children, className = "" }) {
  return <div className={`pl-2 ${className}`}>{children}</div>;
}

export function SidebarMenu({ children, className = "" }) {
  return <nav className={`flex flex-col space-y-1 ${className}`}>{children}</nav>;
}

export function SidebarMenuItem({ children, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function SidebarMenuButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-300 ${className}`}
    >
      {children}
    </button>
  );
}
