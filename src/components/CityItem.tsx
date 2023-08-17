import { Link } from "react-router-dom";
import { StarIcon, TrashIcon } from "@heroicons/react/24/solid";

import { CityWeatherResponse } from "../types/index";

const CityItem = ({
  city,
  handleFavourite,
}: {
  city: CityWeatherResponse;
  handleFavourite: (city: CityWeatherResponse) => void;
}) => {
  return (
    <div className="block mb-4 border-2 border-highlightBlue hover:bg-transparent focus:bg-transparent transition-all py-4 px-6 rounded-2xl bg-[#202b3b]">
      <div className="flex flex-wrap">
        {city.current.weather_icons.length && (
          <div className="mr-6">
            <img
              src={city.current.weather_icons[0]}
              alt="picture of the sun"
              className="rounded-full"
              width={100}
              height={100}
            />
          </div>
        )}
        <div className="flex justify-between flex-1">
          <div className="flex flex-col justify-between">
            <div>
              <Link
                to={`/${city.coordinates.toLocaleLowerCase()}`}
                className="font-semibold text-3xl text-[#dde0e4ff] mb-1 hover:underline"
              >
                {city.location.name}
              </Link>
              <p>10:23</p>
            </div>
            <button className="text-sm self-start">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col justify-between">
            <button
              className={`self-end ${city.favourite ? "text-yellow-300" : ""}`}
              onClick={() => handleFavourite(city)}
            >
              <StarIcon className="w-8 h-8" />
            </button>
            <p className="text-[#dde0e4ff] text-3xl font-light">
              {city.current.temperature}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityItem;
