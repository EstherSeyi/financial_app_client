import { useParams } from "react-router-dom";
import { useGetCityWeather } from "../hooks/weather";

export default function CityDetails() {
  const params = useParams();

  const { data, isLoading, isError } = useGetCityWeather(
    params.cityId as string
  );

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Errored"
  ) : (
    <div className="mt-8 flex justify-between">
      <div>
        <h1 className="text-4xl text-[#dde0e4] mb-2 font-medium">
          {data.location.name}
        </h1>
        <p className="text-[#9399a2] font-light">
          {data.current.weather_descriptions[0]}
        </p>
        <p className="text-5xl font-semibold mt-8 text-[#dde0e4]">
          {data.current.temperature}
          <span className="ml-1">°</span>
        </p>
      </div>
      <div className="self-center">
        {data.current.weather_icons.map((icon: string) => (
          <div key={icon}>
            <img src={icon} alt="picture of the sun" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
