import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Character } from "../models/ApiResponse";
import { AppDispatch, RootState } from "../redux/store";
import {
  setCurrentPage,
  fetchCharactersByName,
  fetchCharacters,
  setNameFilter,
  addFavorites
} from "../redux/characterSlice";
import CharacterModal from "./CharacterModal";
import "./CharacterTable.css";

const CharacterTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const characters = useSelector(
    (state: RootState) => state.characters.characters
  );
  const favoriteCharacters = useSelector(
    (state: RootState) => state.characters.favorites
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
  const [displayFavorites, setDisplayFavorites] = useState<boolean>(false);

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
    setPageInput("1");
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

  // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // const [sortColumn, setSortColumn] = useState<"name" | "id">("name");
  // const handleSort = (column: "name" | "id") => {
  //   if (column === sortColumn) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortColumn(column);
  //     setSortOrder("asc");
  //   }
  // };
  // const sortedCharacters = [...characters].sort((a, b) => {
  //   if (sortColumn === "name") {
  //     return sortOrder === "asc"
  //       ? a.name.localeCompare(b.name)
  //       : b.name.localeCompare(a.name);
  //   } else if (sortColumn === "id") {
  //     return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  //   }
  // });
  // const [currPage, setCurrPage] = useState<number>(1);
  // const itemsPerPage: number = 20;

  // const startIndex = (currPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  // const itemsToDisplay: Character[] = characters.slice(startIndex, endIndex);

  // const numPages = Math.ceil(characters.length / itemsPerPage);

  // const nextPage = () => {
  //   if(currPage<numPages) {
  //     setCurrPage(currPage+1);
  //   }
  // }

  // const prevPage = () => {
  //   if(currPage>1) {
  //     setCurrPage(currPage-1);
  //   }
  // }

  // const filterCharacters = (characters: Character[], term: string) => {
  //   return characters.filter((character) =>
  //     character.name.toLowerCase().includes(term.toLowerCase())
  //   );
  // };

  const handleFavoritesClick =() => {
    if(displayFavorites) {
      setDisplayFavorites(false);
    } else {
      setDisplayFavorites(true);
    }
  }

  // const addToFavorite = () => {

  // }


  const checkFavorite = (character: Character) => {
    if(character.favorite==true) {return true;}
    else{
      return false;
    }
  }

  const displayedFavorites = favoriteCharacters.filter(checkFavorite);

  return (
    <div className="character-table">
      <h1>Rick and Morty</h1>
      <button onClick={handleFavoritesClick}>Display favorites</button>
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
      ) : loading === "succeeded" ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
                <th>Details</th>
                <th>Favorites</th>
              </tr>
            </thead>
            <tbody>
              {displayFavorites === false
                ? characters.map((character: Character) => (
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
                      <td>
                        <button
                          onClick={() => {
                            if(character.favorite===true){
                              character.favorite=false;
                            } else {
                              dispatch(addFavorites(character));
                              character.favorite=true;
                            }
                          }}
                        >
                        {(character.favorite===true) ? <p>Remove</p> : <p>Add</p>}
                        </button>
                      </td>
                    </tr>
                  ))
                : displayedFavorites.map((character: Character) => (
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
                      <td>
                        <button
                          onClick={() => {
                            character.favorite=false;}}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {/* <div>
            <button onClick={prevPage} disabled={currPage === 1}>
              Previous
            </button>
            <button onClick={nextPage} disabled={currPage === numPages}>
              Next
            </button>
          </div> */}
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
      ) : (
        <div>Error: {error}</div>
      )}
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
