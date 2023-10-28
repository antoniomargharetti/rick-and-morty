import {
  createSlice,
  createAsyncThunk,
  createAction,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ApiResponse, Character } from "../models/ApiResponse";

interface CharacterState {
  characters: Character[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  nameFilter: string;
  totalPages: number; // New state to store total pages
}

const initialState: CharacterState = {
  characters: [],
  loading: "idle",
  error: null,
  currentPage: 1,
  nameFilter: "",
  totalPages: 1, // Set an initial value
};

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async ({ page }: { page: number }) => {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${page}`
    );
    return response.data as ApiResponse;
  }
);

export const fetchCharactersByName = createAsyncThunk(
  "characters/fetchCharactersByName",
  async ({ name, page }: { name: string; page: number }) => {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`
    );
    return response.data as ApiResponse;
  }
);

export const setTotalPages = createAction<number>("characters/setTotalPages");

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.characters = action.payload.results;
        state.totalPages = action.payload.info.pages;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred.";
      })
      .addCase(fetchCharactersByName.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchCharactersByName.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.characters = action.payload.results;
        state.totalPages = action.payload.info.pages;
      })
      .addCase(fetchCharactersByName.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "An error occurred.";
      });
  },
});

export const { setCurrentPage, setNameFilter } =
  characterSlice.actions;

export default characterSlice.reducer;
