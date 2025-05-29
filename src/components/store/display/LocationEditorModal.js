import React from "react";
import LocationEditorCon from "../../../containers/store/display/LocationEditorCon";
import styled from "styled-components";

function LocationEditorModal({
  onClose,
  isEditMode,
  productLocationCode,
  selectedLocationCode,
  onSelectLocation,
  onSaveSuccess,
}) {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>close</CloseButton>
        <LocationEditorCon
          onClose={onClose}
          isEditMode={isEditMode}
          productLocationCode={productLocationCode}
          selectedLocationCode={selectedLocationCode}
          onSelectLocation={onSelectLocation}
          onConfirmSave={onSaveSuccess}
        />
      </ModalContent>
    </ModalOverlay>
  );
}

export default LocationEditorModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 95%;
  height: 90vh;
  max-width: 1400px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding-bottom: 16px;

    .actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;


