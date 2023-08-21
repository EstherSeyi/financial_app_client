import { createContext, useState } from "react";
export const UnitContext = createContext<{
  unit: string;
  handleUnit: (newUnit: string) => void;
} | null>(null);

const UnitProvider = ({ children }: { children: React.ReactNode }) => {
  const [unit, setUnit] = useState(
    () => localStorage.getItem("app_unit") ?? "metric"
  );

  const handleUnit = (newUnit: string) => {
    setUnit(newUnit);
    localStorage.setItem("app_unit", newUnit);
  };

  return (
    <UnitContext.Provider value={{ unit, handleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export default UnitProvider;
