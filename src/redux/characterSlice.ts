import {
  createSlice,
  createAsyncThunk,
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
  favorites: Character[];
  totalPages: number; // New state to store total pages
}

const initialState: CharacterState = {
  characters: [],
  loading: "idle",
  error: null,
  currentPage: 1,
  nameFilter: "",
  favorites: [],
  totalPages: 1, 
};

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async ({ page }: { page: number }) => {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${page}`
    );
    return response.data as ApiResponse;
    // const allCharacters : Character[] = [];
    // while(characterUrl!=null) {
    //   const response = await axios.get(characterUrl);
    //   const data: ApiResponse = response.data;
    //   allCharacters.push(...data.results);
    //   characterUrl =data.info.next ;
    //   if(data.info.next==null){break;}
    // }
    // return allCharacters;
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
)

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
    addFavorites: (state, action: PayloadAction<Character>) => {
      state.favorites.filter((item) =>  {
        return item.id===action.payload.id
      });
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

export const { setCurrentPage, setNameFilter, addFavorites } =
  characterSlice.actions;

export default characterSlice.reducer;
