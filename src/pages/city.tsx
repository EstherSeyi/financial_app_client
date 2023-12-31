import { useLocation, useParams } from "react-router-dom";
import { ChangeEvent, useMemo, useReducer, useState } from "react";
import { useGetCityWeather } from "../hooks/weather";
import { getAllNotes, notesReducer } from "../helpers/notes";
import { City, Note } from "../types";
import {
  Cloud,
  Trash2Icon,
  PenSquareIcon,
  WindIcon,
  ThermometerIcon,
  DropletsIcon,
  Star,
  SunIcon,
} from "lucide-react";
import DetailBox from "../components/WeatherItemDetail";
import {
  favoriteReducer,
  getFavorites,
  isAFavorite,
} from "../helpers/favorites";
import { formatCoord } from "../utils/format";
import { useGetSingleCity } from "../hooks/city";
import { useUnit } from "../hooks/unit";

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

  const geonameId = urlQuery.get("geoname_id") as string;

  const { data: singleCityData } = useGetSingleCity(
    (geonameId as string) ?? params?.cityId,
    urlQuery.get("country_code")
  );

  const singleCity = useMemo(
    () => singleCityData && singleCityData?.fields,
    [singleCityData]
  );
  const { unit } = useUnit();

  const { data, isLoading, isError } = useGetCityWeather(
    {
      lat: urlQuery.get("lat"),
      lon: urlQuery.get("lon"),
    },
    unit,
    (singleCityData && singleCityData?.fields?.geoname_id) ?? null
  );

  const isFav = useMemo(() => {
    if (singleCityData)
      return isAFavorite(getFavorites(), singleCityData as City);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCityData?.fields?.geoname_id, getFavorites()?.length]);

  const coord = useMemo(
    () =>
      formatCoord(
        data?.coord?.lat as number,
        data?.coord?.lon as number
      ) as string,
    [data?.coord?.lat, data?.coord?.lon]
  );

  const handleFavorite = () => {
    if (singleCityData)
      favoriteDispatch({
        type: "TOGGLE_FAVORITE",
        payload: singleCityData as City,
      });
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
      payload: {
        notes: notesToDelete,
        coord,
      },
    });

    setNotesToDelete([]);
  };

  const handleEditNote = (note: Note) => {
    setNote(note);
  };

  const notes = data ? allNotes[coord] : [];

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Errored"
  ) : (
    <section
      data-cy={`city_${params?.cityId}`}
      className="flex mt-8 flex-col md:flex-row"
    >
      <div className="flex-1 md:mr-8 md:self-start">
        <div className="flex justify-between mb-6">
          <div>
            <h1
              data-cy="city_name"
              className="flex items-center gap-2 text-4xl text-textBright mb-0 font-medium"
            >
              {data?.name}

              <button onClick={handleFavorite}>
                <Star
                  className={`${
                    isFav ? "text-yellow-300 fill-yellow-300" : ""
                  }`}
                  size={24}
                />
              </button>
            </h1>
            <h2 className="mb-2 text-textBright">{singleCity?.country}</h2>
            <p className="text-primary font-light">
              {data?.weather[0]?.description}
            </p>
            <p className="text-5xl font-semibold mt-8 text-textBright">
              {data?.main?.temp}
              <span className="ml-1">°</span>
            </p>
          </div>
          <div className="self-start">
            {isLoading ? (
              <div className="animate-pulse rounded-full bg-slate-200 h-[100px] w-[100px]"></div>
            ) : (
              data?.weather?.map((item) => (
                <div key={item.id}>
                  <img
                    src={`https://openweathermap.org/img/wn/${item?.icon}.png`}
                    alt={item.description}
                    width={100}
                    height={100}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-midBlue p-4 rounded-xl mb-6 md:mb-0 md:pb-8">
          {data?.dt && (
            <p className="mb-4">
              <span className="mr-1 font-light">Last Update:</span>{" "}
              <span className=" text-[#c4cad3]">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(data?.dt * 1000)}
              </span>
            </p>
          )}

          <div
            data-cy="weather-dets-section"
            className="grid justify-center  sm:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <DetailBox
              value={data?.main?.feels_like}
              unit="°"
              label="Feels Like"
              icon={ThermometerIcon}
            />
            <DetailBox
              value={data?.wind?.speed}
              unit={unit === "metric" ? "m/sec" : "miles/hr"}
              label="Wind Speed"
              icon={WindIcon}
            />

            <DetailBox
              value={data?.visibility ? data?.visibility / 1000 : 0}
              unit="km"
              label="Visibility"
              icon={SunIcon}
            />

            <DetailBox
              value={data?.wind?.deg}
              unit="°"
              label="Wind Direction"
              icon={WindIcon}
            />

            <DetailBox
              value={data?.main?.humidity}
              unit="%"
              label="Humidity"
              icon={DropletsIcon}
            />

            <DetailBox
              value={data?.clouds?.all}
              unit="%"
              label="Cloud Cover"
              icon={Cloud}
            />
          </div>
        </div>
      </div>

      <div className="basis-5/12 lg:basis-4/12 bg-midBlue p-4 rounded-xl md:self-start">
        <form data-cy="notes-form" onSubmit={handleSaveNotes}>
          <textarea
            data-cy="note-input"
            value={note.text}
            className="w-full bg-transparent border border-highlightBlue rounded-lg p-2 text-[#c4cad3ff] font-light focus:outline-none focus:border-2"
            rows={5}
            onChange={({ target }) => {
              setNote((note) => ({
                ...note,
                text: target.value,
                coord: coord,
              }));
            }}
          />
          <button
            data-cy="note-submit-btn"
            type="submit"
            disabled={!note.text}
            className="block ml-auto bg-highlightBlue px-2 rounded py-1 text-white text-sm hover:scale-105 focus:scale-105 transition-all disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-300"
          >
            save
          </button>
        </form>

        <div data-cy="notes-list" className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm mb-4">NOTES</h2>

            {notesToDelete?.length ? (
              <button
                data-cy="del-btn"
                className="text-sm self-start flex"
                onClick={handleDeleteNote}
              >
                <span className="mr-2">Delete</span>
                <Trash2Icon className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          {notes && notes.length ? (
            <ul>
              {notes?.map((item) => (
                <li
                  key={item.createdAt}
                  className="border-b border-[#31445b] mb-4 flex"
                >
                  <input
                    data-cy="del-checkbox"
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
                      data-cy="edit-btn"
                      className="block ml-auto"
                      onClick={() => handleEditNote(item)}
                    >
                      <PenSquareIcon data-cy="edit-icon" className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div data-cy="no-notes">
              <span>No Notes Yet</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
