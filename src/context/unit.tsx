import { createContext, useState } from "react";
import { useFavorites } from "../hooks/favorites";
export const UnitContext = createContext<{
  unit: string;
  handleUnit: (newUnit: string) => void;
} | null>(null);

const UnitProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [unit, setUnit] = useState(
    () => localStorage.getItem("app_unit") ?? "metric"
  );
  const { dispatch: favoriteDispatch } = useFavorites();

  const handleUnit = (newUnit: string) => {
    setUnit(newUnit);
    localStorage.setItem("app_unit", newUnit);
    favoriteDispatch({ type: "UPDATE_FAVORITE_TEMP_UNIT", payload: newUnit });
  };

  return (
    <UnitContext.Provider value={{ unit, handleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export default UnitProvider;
