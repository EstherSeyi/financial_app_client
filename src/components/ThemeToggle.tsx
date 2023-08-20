const ThemeToggle = () => {
  return (
    <div className="mb-4">
      <div className="ml-auto w-fit">
        <p>Toggle Unit</p>
        <select>
          <option>Fahrenheit</option>
          <option>Metric</option>
          <option>Scientific</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeToggle;
