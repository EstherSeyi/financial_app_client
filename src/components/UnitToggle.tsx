import { useUnit } from "../hooks/unit";

import { ChangeEvent } from "react";

const UnitToggle = () => {
  const { unit, handleUnit } = useUnit();

  console.log({ unit });
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleUnit(event.target.value);
  };
  return (
    <div className="mb-4">
      <div className="ml-auto w-fit">
        <p>Toggle Unit</p>
        <select onChange={handleChange} value={unit}>
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit </option>
        </select>
      </div>
    </div>
  );
};

export default UnitToggle;
