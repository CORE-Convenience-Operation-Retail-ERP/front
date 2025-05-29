import React, { useRef, useMemo } from 'react';
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

export default function LocationEditorCom({
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
    const gridWidth = 3000;
    const containerRef = useRef(null);

    const gridLayouts = useMemo(() => (
        layouts.map(l => ({
            i: l.i,
            x: l.x,
            y: l.y,
            w: l.width || 189,
            h: l.height || 172,
        }))
    ), [layouts]);



    const renderCard = (item, idx) => {
        const saved = productLocationCode.includes(item.locationCode); // 또는 item.i
        const selected = selectedLocationCode.includes(item.i);

        let bgColor = '#fff';
        if (selected) bgColor = '#e6f0ff';
        else if (saved) bgColor = '#ffe6e6';
        else bgColor = item.type === 0 ? '#f0f9ff' : '#fff8e6';


        return (
            <CardContainer
                key={item.i}
                isSaved={saved}
                isSelected={selected}
                clickable={!isEditMode && onSelectLocation}
                style={{ backgroundColor: bgColor }}
                onClick={() => !isEditMode && onSelectLocation(item.i)}
            >

                {isEditMode && <DeleteButton onClick={() => onDelete(idx)}>✖</DeleteButton>}
                <DragHandle className="handle">⠿ 위치 {item.locationCode || item.i}</DragHandle>

                <StyledInput
                    placeholder="코드 (예: A1)"
                    value={item.locationCode}
                    onChange={e => onInputChange(idx, 'locationCode', e.target.value)}
                    disabled={!isEditMode}
                />
                <StyledInput
                    placeholder="이름 (예: 음료 진열대)"
                    value={item.label}
                    onChange={e => onInputChange(idx, 'label', e.target.value)}
                    disabled={!isEditMode}
                />
                <StyledSelect
                    value={item.type}
                    onChange={e => onInputChange(idx, 'type', Number(e.target.value))}
                    disabled={!isEditMode}
                >
                    <option value={0}>진열대</option>
                    <option value={1}>창고</option>
                </StyledSelect>
            </CardContainer>
        );
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                overflowX: 'auto',
                padding: '16px',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                }}
            >
                <h2 style={{ margin: 0 }}>📋 진열 위치 {isEditMode ? '편집기' : '보기'}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    {isEditMode ? (
                        <>
                            <PrimaryButton onClick={onAdd}>➕ 위치 추가</PrimaryButton>
                            <PrimaryButton onClick={onSave}>💾 진열 구조 저장</PrimaryButton>
                        </>
                    ) : (
                        onSelectLocation && <PrimaryButton onClick={onSave}>💾 위치 매핑 저장</PrimaryButton>
                    )}
                </div>
            </div>

            <div style={{ width: `${gridWidth}px`, height: `${gridWidth}px`, paddingTop: '16px' }}>
                <GridLayout
                    layout={gridLayouts}
                    cols={gridWidth}
                    width={gridWidth}
                    rowHeight={1}
                    margin={[0, 0]}
                    containerPadding={[0, 0]}
                    useCSSTransforms
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    draggableHandle=".handle"
                    compactType={null}
                    preventCollision={false}
                    allowOverlap={true}
                    onDragStop={isEditMode ? onLayoutChange : undefined}
                    onResizeStop={isEditMode ? onLayoutChange : undefined}
                >
                    {layouts.map((item, idx) => renderCard(item, idx))}
                </GridLayout>
            </div>
        </div>
    );
}
