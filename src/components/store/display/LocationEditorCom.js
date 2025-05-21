import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PrimaryButton } from '../../../features/store/styles/common/Button.styled';
import {
  CardContainer,
  DeleteButton,
  DragHandle,
  StyledInput,
  StyledSelect
} from '../../../features/store/styles/LocationEditorCard.styled';

function LocationEditorCom({
  layouts,
  onAdd,
  onInputChange,
  onLayoutChange,
  onSave,
  onDelete,
  isEditMode,
  productLocationCode = [],
  selectedLocationCode = [],
  onSelectLocation = null,
}) {
  const safeLayouts = layouts.map((l) => ({
    i: l.i,
    x: l.x ?? 0,
    y: l.y ?? 0,
    w: l.width ?? 2,
    h: l.height ?? 1,
    ...l,
  }));

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 15
      }}>
        <h2 style={{ margin: 0 }}>
          📋 진열 위치 {isEditMode ? '편집기' : '보기'}
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isEditMode ? (
            <>
              <PrimaryButton onClick={onAdd}>➕ 위치 추가</PrimaryButton>
              <PrimaryButton onClick={onSave}>💾 진열 구조 저장</PrimaryButton>
            </>
          ) : (
            onSelectLocation && (
              <PrimaryButton onClick={onSave}>💾 위치 매핑 저장</PrimaryButton>
            )
          )}
        </div>
      </div>

      <div style={{ minHeight: '800px' }}>
        <GridLayout
          className="layout"
          layout={safeLayouts}
          cols={12}
          rowHeight={200}
          width={1200}
          useCSSTransforms={true}
          isResizable={isEditMode}
          isDraggable={isEditMode}
          onLayoutChange={isEditMode ? onLayoutChange : undefined}
          compactType={null}
          preventCollision={true}
          draggableHandle=".handle"
        >
          {safeLayouts.map((item, index) => {
            const isSaved = productLocationCode?.includes(item.locationCode);
            const isSelected = selectedLocationCode?.includes(item.locationCode);
            const backgroundColor = isSelected
              ? '#e6f0ff'
              : item.type === 0
              ? '#f0f9ff' 
              : '#fff8e6'; 

            return (
              <CardContainer
                key={item.i}
                isSaved={isSaved}
                isSelected={isSelected}
                clickable={!isEditMode && onSelectLocation}
                style={{ backgroundColor }}
                onClick={() => {
                  if (!isEditMode && onSelectLocation)
                    onSelectLocation(item.locationCode);
                }}
              >
                {isEditMode && (
                  <DeleteButton onClick={() => onDelete(index)}>✖</DeleteButton>
                )}

                <DragHandle className="handle" draggable={isEditMode}>
                  ⠿ 위치 {item.locationCode || '(미입력)'}
                </DragHandle>

                <StyledInput
                  placeholder="코드 (예: A1)"
                  value={item.locationCode}
                  onChange={(e) => onInputChange(index, 'locationCode', e.target.value)}
                  disabled={!isEditMode}
                />

                <StyledInput
                  placeholder="이름 (예: 음료 진열대)"
                  value={item.label}
                  onChange={(e) => onInputChange(index, 'label', e.target.value)}
                  disabled={!isEditMode}
                />

                <StyledSelect
                  value={item.type}
                  onChange={(e) => onInputChange(index, 'type', Number(e.target.value))}
                  disabled={!isEditMode}
                >
                  <option value={0}>진열대</option>
                  <option value={1}>창고</option>
                </StyledSelect>
              </CardContainer>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}

export default LocationEditorCom;
