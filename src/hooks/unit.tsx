import { useContext } from "react";
import { UnitContext } from "../context/unit";

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};
