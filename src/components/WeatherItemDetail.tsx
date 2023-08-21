import { DetailType } from "../types";

const DetailBox = ({ label, value, icon, unit }: DetailType) => {
  const Icon = icon;
  return (
    <div className="flex">
      <Icon className="w-5 h-5 mr-2 shrink-0" />
      <div>
        <p data-testid="label" className="font-light text-sm">
          {label}
        </p>
        <p data-testid="label" className="text-2xl font-medium text-[#c4cad3]">
          {value}
          {unit}
        </p>
      </div>
    </div>
  );
};

export default DetailBox;
