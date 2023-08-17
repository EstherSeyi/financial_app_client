import { CityNotes, NoteAction, Note, DeleteNotePayload } from "../types";

export const getAllNotes = () => {
  const NotesString = localStorage.getItem("all_notes");
  return NotesString ? JSON.parse(NotesString) : [];
};

const addNote = (state: CityNotes, payload: Note) => {
  let newAllNotes;

  const notesOfCurrentCity = state[payload.coord];
  if (notesOfCurrentCity && notesOfCurrentCity?.length !== 0) {
    newAllNotes = {
      ...state,
      [payload.coord]: [
        ...notesOfCurrentCity,
        { ...payload, createdAt: Date.now().toString() },
      ],
    };
  } else {
    newAllNotes = {
      ...state,
      [payload.coord]: [{ ...payload, createdAt: Date.now().toString() }],
    };
  }
  localStorage.setItem("all_notes", JSON.stringify(newAllNotes));
  return newAllNotes;
};

const deleteNote = (state: CityNotes, payload: DeleteNotePayload) => {
  const notesOfCurrentCity = state[payload.coord];
  let newAllNotes;
  if (payload.notes.length === notesOfCurrentCity?.length) {
    newAllNotes = {
      ...state,
      [payload.coord]: [],
    };
  } else {
    const newCityNotes =
      notesOfCurrentCity?.filter((item) => {
        const note = payload.notes.find(
          (note) => note.createdAt === item.createdAt
        );
        return note ? false : true;
      }) ?? [];

    newAllNotes = {
      ...state,
      [payload.coord]: newCityNotes,
    };
  }
  localStorage.setItem("all_notes", JSON.stringify(newAllNotes));
  return newAllNotes;
};

const editNote = (state: CityNotes, payload: Note) => {
  const notesOfCurrentCity = state[payload.coord];
  const newCityNotes =
    notesOfCurrentCity?.map((note) => {
      if (note.createdAt === payload.createdAt) {
        note.text = payload.text;
      }
      return note;
    }) ?? [];
  const newAllNotes = {
    ...state,
    [payload.coord]: newCityNotes,
  };
  localStorage.setItem("all_notes", JSON.stringify(newAllNotes));
  return newAllNotes;
};

export const notesReducer = (
  state: CityNotes,
  { type, payload }: NoteAction
) => {
  switch (type) {
    case "ADD_NOTE":
      return addNote(state, payload as Note);
    case "DELETE_NOTE":
      return deleteNote(state, payload as DeleteNotePayload);
    case "EDIT_NOTE":
      return editNote(state, payload as Note);
    default:
      return state;
  }
};
