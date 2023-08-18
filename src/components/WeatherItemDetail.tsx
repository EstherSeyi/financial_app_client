import { DetailType } from "../types";

const DetailBox = ({ label, value, icon, unit }: DetailType) => {
  const Icon = icon;
  return (
    <div className="flex">
      <Icon className="w-5 h-5 mr-2" />
      <div>
        <p className="font-light text-sm">{label}</p>
        <p className="text-2xl font-medium text-[#c4cad3]">
          {value}
          {unit}
        </p>
      </div>
    </div>
  );
};

export default DetailBox;
