import { useParams } from "react-router-dom";
import { ChangeEvent, useReducer, useState } from "react";
import { useGetCityWeather } from "../hooks/weather";
import { getAllNotes, notesReducer } from "../helpers/notes";
import { Note } from "../types";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const initialNote = { text: "", createdAt: "", coord: "" };

export default function CityDetails() {
  const params = useParams();
  const [allNotes, dispatch] = useReducer(notesReducer, getAllNotes());
  const [note, setNote] = useState(initialNote);
  const [notesToDelete, setNotesToDelete] = useState<Note[] | []>([]);

  const { data, isLoading, isError } = useGetCityWeather(
    params.cityId as string
  );

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
      payload: { notes: notesToDelete, coord: data?.coordinates },
    });

    setNotesToDelete([]);
  };

  const handleEditNote = (note: Note) => {
    setNote(note);
  };

  const notes = allNotes[data?.coordinates] ?? [];

  return isLoading ? (
    "Loading..."
  ) : isError ? (
    "Errored"
  ) : (
    <section className="flex mt-8 flex-col md:flex-row">
      <div className="flex justify-between flex-1 md:mr-8 mb-6 md:mb-0">
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

      <div className="basis-5/12 lg:basis-4/12 bg-[#202b3b] p-4 rounded-xl">
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
                <TrashIcon className="w-4 h-4" />
              </button>
            ) : null}
          </div>
          {notes.length ? (
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
                      <PencilSquareIcon className="w-4 h-4" />
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
