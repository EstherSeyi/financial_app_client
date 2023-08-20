import { useParams, useLocation } from "react-router-dom";
import { ChangeEvent, useMemo, useReducer, useState } from "react";
import { useGetCityWeather } from "../hooks/weather";
import { getAllNotes, notesReducer } from "../helpers/notes";
import { Note } from "../types";
import {
  Cloud,
  Trash2Icon,
  PenSquareIcon,
  WindIcon,
  ThermometerIcon,
  DropletsIcon,
  SunIcon,
  Star,
} from "lucide-react";
import DetailBox from "../components/WeatherItemDetail";
import {
  favoriteReducer,
  getFavorites,
  isAFavorite,
} from "../helpers/favorites";
import { formatCoord } from "../utils/format";
import { useGetSingleCity } from "../hooks/city";

const initialNote = { text: "", createdAt: "", coord: "" };
function useURLQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function CityDetails() {
  const params = useParams();
  const [note, setNote] = useState(initialNote);
  const [notesToDelete, setNotesToDelete] = useState<Note[] | []>([]);

  const [allNotes, dispatch] = useReducer(notesReducer, getAllNotes());
  const [, favoriteDispatch] = useReducer(favoriteReducer, getFavorites());
  const urlQuery = useURLQuery();
  const coord =
    urlQuery.get("lat") && urlQuery.get("lon")
      ? formatCoord(urlQuery.get("lat"), urlQuery.get("lon"))
      : null;

  const { data: singleCityData } = useGetSingleCity(params.cityId as string);
  const cityPopulation = useMemo(
    () => singleCityData && singleCityData[0]?.fields?.population,
    [singleCityData]
  );

  const { data, isLoading, isError } = useGetCityWeather(
    coord ?? (params.cityId as string)
  );

  const isFav = useMemo(
    () => {
      if (data) return isAFavorite(getFavorites(), data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.coordinates, getFavorites()?.length]
  );

  const handleFavorite = () => {
    if (data)
      favoriteDispatch(
        cityPopulation
          ? {
              type: "TOGGLE_FAVORITE",
              payload: { ...data, population: cityPopulation },
            }
          : {
              type: "TOGGLE_FAVORITE",
              payload: data,
            }
      );
  };

  const handleSaveNotes = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (note.createdAt === "") {
      dispatch({
        type: "ADD_NOTE",
        payload: note,
      });
    } else {
      dispatch({
        type: "EDIT_NOTE",
        payload: note,
      });
    }
    setNote(initialNote);
  };

  const handleSelect = (event: ChangeEvent<HTMLInputElement>, note: Note) => {
    const { checked } = event.target;
    if (checked) {
      setNotesToDelete((prevState) => [...prevState, note]);
    } else {
      setNotesToDelete((prevState) =>
        prevState.filter((item) => item.createdAt !== note.createdAt)
      );
    }
  };

  const handleDeleteNote = () => {
    dispatch({
      type: "DELETE_NOTE",
      payload: { notes: notesToDelete, coord: data?.coordinates ?? "" },
    });

    setNotesToDelete([]);
  };

  const handleEditNote = (note: Note) => {
    setNote(note);
  };

  const notes = data ? allNotes[data.coordinates] : [];

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Errored"
  ) : (
    <section className="flex mt-8 flex-col md:flex-row">
      <div className="flex-1 md:mr-8 md:self-start">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="flex items-center gap-2 text-4xl text-[#dde0e4] mb-0 font-medium">
              {data.location.name}

              <button onClick={handleFavorite}>
                <Star
                  className={`${
                    isFav ? "text-yellow-300 fill-yellow-300" : ""
                  }`}
                  size={24}
                />
              </button>
            </h1>
            <h2 className="mb-2 text-[#dde0e4]">{data.location.country}</h2>
            <p className="text-[#9399a2] font-light">
              {data.current.weather_descriptions[0]}
            </p>
            <p className="text-5xl font-semibold mt-8 text-[#dde0e4]">
              {data.current.temperature}
              <span className="ml-1">°</span>
            </p>
          </div>
          <div className="self-start">
            {data.current.weather_icons.map((icon: string) => (
              <div key={icon}>
                <img
                  src={icon}
                  alt="picture of the sun"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#202b3b] p-4 rounded-xl mb-6 md:mb-0 md:pb-8">
          <p className="mb-4">
            <span className="mr-1 font-light">Observation Time:</span>{" "}
            <span className=" text-[#c4cad3]">
              {data.current.observation_time}
            </span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <DetailBox
              value={data.current.feelslike}
              unit="°"
              label="Feels Like"
              icon={ThermometerIcon}
            />
            <DetailBox
              value={data.current.wind_speed}
              unit="km/hr"
              label="Wind Speed"
              icon={WindIcon}
            />

            <DetailBox
              value={data.current.uv_index}
              unit="°C"
              label="UV Index"
              icon={SunIcon}
            />

            <DetailBox
              value={data.current.wind_dir}
              unit=""
              label="Wind Direction"
              icon={WindIcon}
            />

            <DetailBox
              value={data.current.humidity}
              unit="%"
              label="Humidity"
              icon={DropletsIcon}
            />

            <DetailBox
              value={data.current.cloudcover}
              unit="%"
              label="Cloud Cover"
              icon={Cloud}
            />
          </div>
        </div>
      </div>

      <div className="basis-5/12 lg:basis-4/12 bg-[#202b3b] p-4 rounded-xl md:self-start">
        <form onSubmit={handleSaveNotes}>
          <textarea
            value={note.text}
            className="w-full bg-transparent border border-highlightBlue rounded-lg p-2 text-[#c4cad3ff] font-light focus:outline-none focus:border-2"
            rows={5}
            onChange={({ target }) => {
              setNote((note) => ({
                ...note,
                text: target.value,
                coord: data?.coordinates,
              }));
            }}
          />
          <button
            type="submit"
            disabled={!note.text}
            className="block ml-auto bg-highlightBlue px-2 rounded py-1 text-white text-sm hover:scale-105 focus:scale-105 transition-all disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-300"
          >
            save
          </button>
        </form>

        <ul className="mt-6 ">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm mb-4">NOTES</h2>

            {notesToDelete?.length ? (
              <button
                className="text-sm self-start flex"
                onClick={handleDeleteNote}
              >
                <span className="mr-2">Delete</span>
                <Trash2Icon className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          {notes && notes.length ? (
            <>
              {notes.map((item) => (
                <li
                  key={item.createdAt}
                  className="border-b border-[#31445b] mb-4 flex"
                >
                  <input
                    type="checkbox"
                    className="mr-3"
                    onChange={(e) => handleSelect(e, item)}
                  />
                  <div className="mb-2 flex-1">
                    <span className="text-xs font-light">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                        hour12: false,
                      }).format(new Date(Number(item.createdAt)))}
                    </span>
                    <p className="text-sm text-[#c4cad3ff]">{item.text}</p>
                    <button
                      className="block ml-auto"
                      onClick={() => handleEditNote(item)}
                    >
                      <PenSquareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </>
          ) : (
            <div>
              <span>No Notes Yet</span>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
}
