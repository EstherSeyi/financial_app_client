import { useMemo } from "react";
import { Link } from "react-router-dom";
import { StarIcon, TrashIcon } from "lucide-react";

import { City } from "../types/index";
import { getFavorites, isAFavorite } from "../helpers/favorites";
import { formatNumber } from "../utils/format";
import { useGetCityWeather } from "../hooks/weather";
import { useUnit } from "../hooks/unit";

const CityItem = ({
  city,
  handleFavorite,
  handleDeleteCity,
}: {
  city: City;
  handleFavorite: (city: City) => void;
  handleDeleteCity: (city: City) => void;
}) => {
  const isFav = useMemo(
    () => isAFavorite(getFavorites(), city),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [city?.fields?.geoname_id, getFavorites()?.length]
  );

  const { unit } = useUnit();
  const { data, isLoading } = useGetCityWeather(
    {
      lat: city?.fields?.latitude,
      lon: city?.fields?.longitude,
    },
    unit,
    city?.fields?.geoname_id
  );

  return (
    <div
      data-cy={`city-${city?.fields?.name}`}
      className="block mb-4 border-2 border-highlightBlue hover:bg-transparent focus:bg-transparent transition-all py-4 px-6 rounded-2xl bg-midBlue"
    >
      <div className="flex flex-wrap">
        {isLoading ? (
          <div className="animate-pulse rounded-full bg-slate-400 h-[100px] w-[100px] mr-6"></div>
        ) : (
          data?.weather?.length && (
            <div className="mr-6">
              <img
                data-cy="weather-icon"
                data-testid="weather-icon"
                src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}.png`}
                alt={data?.weather[0]?.description}
                className="rounded-full"
                width={100}
                height={100}
              />
            </div>
          )
        )}
        <div className="flex justify-between flex-1">
          <div className="flex flex-col justify-between">
            <div>
              <Link
                to={`/${city?.fields?.name.toLocaleLowerCase()}?lat=${
                  city?.fields?.latitude
                }&lon=${city?.fields?.longitude}&geoname_id=${
                  city?.fields?.geoname_id
                }`}
                className="font-semibold text-3xl text-textBright mb-1 hover:underline"
              >
                {city?.fields?.name}
              </Link>
              <p className="text-sm font-light">
                Population est.: {formatNumber(city?.fields?.population)}
              </p>
            </div>
            <button
              data-cy="delete-btn"
              className="text-sm self-start"
              onClick={() => handleDeleteCity(city)}
            >
              <TrashIcon
                data-cy="trash-icon"
                data-testid="trash-icon"
                className="w-5 h-5"
              />
            </button>
          </div>
          <div className="flex flex-col justify-between">
            <button
              data-cy="fave-btn"
              className="self-end"
              onClick={() => handleFavorite(city)}
            >
              <StarIcon
                data-cy="fave-icon"
                data-testid="star-icon"
                className={`w-8 h-8 ${
                  isFav ? "text-yellow-300 fill-yellow-300" : ""
                }`}
              />
            </button>
            <p className="text-textBright text-3xl font-light">
              {isLoading ? "..." : data?.main?.temp}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityItem;
