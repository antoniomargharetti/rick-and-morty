import React, { useEffect, useRef } from "react";
import { Character } from "../models/ApiResponse";
import "./CharacterModal.css";

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="character-modal">
      <div className="character-modal-content" ref={modalRef}>
        <button onClick={handleCloseClick} className="close-button">
          <i className="fas fa-times"></i>
        </button>
        <div className="character-details">
          <div className="character-image">
            <img src={character.image} alt={character.name} />
          </div>
          <div className="character-info">
            <h2>{character.name}</h2>
            <div className="detail-item">
              <span className="label">Gender:</span>
              <span>{character.gender}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location:</span>
              <span>{character.location.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Origin:</span>
              <span>{character.origin.name}</span>
            </div>
            {/* Add more character details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
