import { useMemo } from "react";
import { Link } from "react-router-dom";
import { StarIcon, TrashIcon } from "lucide-react";

import { CityWeatherResponse2 } from "../types/index";
import { getFavorites, isAFavorite } from "../helpers/favorites";
import { formatNumber } from "../utils/format";
import { useGetCityWeather } from "../hooks/weather";
import { useUnit } from "../hooks/unit";

const CityItem = ({
  city,
  handleFavorite,
  handleDeleteCity,
}: {
  city: CityWeatherResponse2;
  handleFavorite: (city: CityWeatherResponse2) => void;
  handleDeleteCity: (city: CityWeatherResponse2) => void;
}) => {
  const isFav = useMemo(
    () => isAFavorite(getFavorites(), city),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [city.id, getFavorites()?.length]
  );

  const { unit } = useUnit();
  const { data } = useGetCityWeather(
    {
      lat: city.coord.lat.toString(),
      lon: city.coord.lon.toString(),
    },
    unit
  );

  return (
    <div className="block mb-4 border-2 border-highlightBlue hover:bg-transparent focus:bg-transparent transition-all py-4 px-6 rounded-2xl bg-[#202b3b]">
      <div className="flex flex-wrap">
        {city?.weather?.length && (
          <div className="mr-6">
            <img
              src={`https://openweathermap.org/img/wn/${city?.weather[0]?.icon}.png`}
              alt={city?.weather[0]?.description}
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
                to={`/${city?.name.toLocaleLowerCase()}?lat=${
                  city?.coord?.lat
                }&lon=${city?.coord?.lon}&geoname_id=${city.geoname_id}`}
                className="font-semibold text-3xl text-[#dde0e4ff] mb-1 hover:underline"
              >
                {city?.name}
              </Link>
              <p className="text-sm font-light">
                Population est.: {formatNumber(city.population)}
              </p>
            </div>
            <button
              className="text-sm self-start"
              onClick={() => handleDeleteCity(city)}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col justify-between">
            <button className="self-end" onClick={() => handleFavorite(data!)}>
              <StarIcon
                className={`w-8 h-8 ${
                  isFav ? "text-yellow-300 fill-yellow-300" : ""
                }`}
              />
            </button>
            <p className="text-[#dde0e4ff] text-3xl font-light">
              {data?.main?.temp}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityItem;
