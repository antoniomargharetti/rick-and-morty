import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Character } from "../models/ApiResponse";
import { AppDispatch, RootState } from "../redux/store";
import {
  setCurrentPage,
  fetchCharactersByName,
  fetchCharacters,
  setNameFilter,
} from "../redux/characterSlice";
import CharacterModal from "./CharacterModal";
import "./CharacterTable.css";

const CharacterTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const characters = useSelector(
    (state: RootState) => state.characters.characters
  );
  const loading = useSelector((state: RootState) => state.characters.loading);
  const error = useSelector((state: RootState) => state.characters.error);
  const currentPage = useSelector(
    (state: RootState) => state.characters.currentPage
  );
  const totalPages = useSelector(
    (state: RootState) => state.characters.totalPages
  );
  const nameFilter = useSelector(
    (state: RootState) => state.characters.nameFilter
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [pageInput, setPageInput] = useState<string>("");

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
    if (nameFilter) {
      dispatch(fetchCharactersByName({ name: nameFilter, page: newPage }));
    } else {
      dispatch(fetchCharacters({ page: newPage }));
    }
  };

  useEffect(() => {
    if (nameFilter) {
      dispatch(fetchCharactersByName({ name: nameFilter, page: currentPage }));
    } else {
      dispatch(fetchCharacters({ page: currentPage }));
    }
  }, [dispatch, currentPage, nameFilter]);

  const handleSearch = () => {
    dispatch(setNameFilter(searchTerm));
    dispatch(setCurrentPage(1));
    setCurrentPage(1);
    if (nameFilter) {
      dispatch(fetchCharactersByName({ name: nameFilter, page: 1 }));
    } else {
      dispatch(fetchCharacters({ page: 1 }));
    }
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="character-table">
      <h1>Rick and Morty</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      {loading === "pending" ? (
        <div>Loading Characters...</div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((character: Character) => (
                <tr key={character.id}>
                  <td>{character.id}</td>
                  <td>{character.name}</td>
                  <td>{character.status}</td>
                  <td>{character.species}</td>
                  <td>
                    <button
                      onClick={() => setSelectedCharacter(character)}
                      className="details-button"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="go-container">
            <input
              type="text"
              placeholder={`1 - ${totalPages}`}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="page-input"
            />
            <button onClick={handleGoToPage} className="go-button">
              Go
            </button>
          </div>
        </div>
      )}
      {error && <div>Error: {error}</div>}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CharacterTable;
