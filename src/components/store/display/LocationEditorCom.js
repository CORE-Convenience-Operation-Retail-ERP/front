import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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
      <h2>📋 진열 위치 {isEditMode ? '편집기' : '보기'}</h2>

      <div style={{ marginBottom: 10 }}>
        {isEditMode ? (
          <>
            <button onClick={onAdd}>➕ 위치 추가</button>
            <button onClick={onSave}>💾 진열 구조 저장</button>
          </>
        ) : (
          onSelectLocation && (
            <button onClick={onSave}>💾 위치 매핑 저장</button>
          )
        )}
      </div>

      <GridLayout
        className="layout"
        layout={safeLayouts}
        cols={12}
        rowHeight={80}
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

          return (
            <div
              key={item.i}
              style={{
                border: isSaved ? '2px solid gold' : '2px dashed #ccc',
                backgroundColor: isSelected ? '#cce5ff'
                  : item.type === 0 ? '#e6f7ff'
                  : '#fffbe6',
                height: '100%',
                padding: '8px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSaved ? '0 0 6px rgba(255, 215, 0, 0.5)' : '0 2px 6px rgba(0,0,0,0.1)',
                cursor: !isEditMode && onSelectLocation ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (!isEditMode && onSelectLocation) onSelectLocation(item.locationCode);
              }}
            >
              {isEditMode && (
                <button onClick={() => onDelete(index)}>🗑 삭제</button>
              )}
              <div
                className="handle"
                style={{
                  fontWeight: 'bold',
                  cursor: isEditMode ? 'move' : 'default',
                  marginBottom: '4px',
                }}
              >
                ⠿ 위치 {item.locationCode || '(미입력)'}
              </div>
              <input
                placeholder="코드 (예: A1)"
                value={item.locationCode}
                onChange={(e) => onInputChange(index, 'locationCode', e.target.value)}
                style={{ marginBottom: '4px' }}
                disabled={!isEditMode}
              />
              <input
                placeholder="이름 (예: 음료 진열대)"
                value={item.label}
                onChange={(e) => onInputChange(index, 'label', e.target.value)}
                style={{ marginBottom: '4px' }}
                disabled={!isEditMode}
              />
              <select
                value={item.type}
                onChange={(e) => onInputChange(index, 'type', Number(e.target.value))}
                disabled={!isEditMode}
              >
                <option value={0}>진열대</option>
                <option value={1}>창고</option>
              </select>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}

export default LocationEditorCom;