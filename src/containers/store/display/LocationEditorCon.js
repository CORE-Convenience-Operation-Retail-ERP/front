import React, {
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import LocationEditorCom from '../../../components/store/display/LocationEditorCom';
import {
    fetchDisplayLocations,
    saveDisplayLocations
} from '../../../service/store/DisplayLocationService';
import { saveProductLocationMapping } from '../../../service/store/StockService';

const DEFAULT_SIZE = { width: 200, height: 200 };

const createNewItem = ({ x, y }) => ({
    i: Date.now().toString(),
    x,
    y,
    width: DEFAULT_SIZE.width,
    height: DEFAULT_SIZE.height,
    locationCode: '',
    label: '',
    type: 0,
});

export default function LocationEditorCon({ onClose, isEditMode, productLocationCode = [], onConfirmSave }) {
    const { productId } = useParams();
    const [layouts, setLayouts] = useState([]);
    const [selectedLocationCodes, setSelectedLocationCodes] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchDisplayLocations();
            const initial = data.map((loc, idx) => ({
                i: loc.i?.toString() || `${idx}`,
                x: loc.x ?? loc.positionX ?? 0,
                y: loc.y ?? loc.positionY ?? 0,
                width: loc.width ?? loc.w ?? DEFAULT_SIZE.width,
                height: loc.height ?? loc.h ?? DEFAULT_SIZE.height,
                locationCode: loc.locationCode,
                label: loc.label,
                type: loc.type,
                locationId: loc.locationId,
            }));
            setLayouts(initial);
        })();
    }, []);

    const handleLayoutChange = useCallback(newLayout => {
        setLayouts(prev =>
            prev.map(item => {
                const match = newLayout.find(l => l.i === item.i);
                return match ? { ...item, x: match.x, y: match.y, width: match.w, height: match.h } : item;
            })
        );
    }, []);

    const handleInputChange = useCallback((idx, field, value) => {
        setLayouts(prev => {
            const out = [...prev];
            out[idx] = { ...out[idx], [field]: value };
            return out;
        });
    }, []);

    const findFirstEmpty = useCallback(() => {
        const occupied = new Set(layouts.map(l => `${l.x},${l.y}`));
        for (let row = 0; row < 50; row++) {
            for (let col = 0; col < 12; col++) {
                if (!occupied.has(`${col},${row}`)) return { x: col, y: row };
            }
        }
        return { x: 0, y: (Math.max(...layouts.map(l => l.y)) || 0) + 1 };
    }, [layouts]);

    const handleAdd = useCallback(() => {
        const { x, y } = findFirstEmpty();
        setLayouts(prev => [...prev, createNewItem({ x, y })]);
    }, [findFirstEmpty]);

    const handleDelete = useCallback(idx => {
        setLayouts(prev => prev.filter((_, i) => i !== idx));
    }, []);

    const handleSelectLocation = useCallback(code => {
        setSelectedLocationCodes(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    }, []);

    const validate = useCallback(() => {
        for (const loc of layouts) {
            if (!loc.locationCode.trim()) {
                alert(`위치 코드가 비어 있습니다: ${loc.label || '(미입력)'}`);
                return false;
            }
        }
        return true;
    }, [layouts]);

    const selectedLocationIds = useMemo(() =>
            layouts
                .filter(l => selectedLocationCodes.includes(l.i))
                .map(l => l.locationId)
                .filter(Boolean),
        [layouts, selectedLocationCodes]);

    const handleSaveLayout = useCallback(async () => {
        if (!validate()) return;
        await saveDisplayLocations(layouts);
        alert('진열 구조 저장 완료');
        onConfirmSave?.();
        onClose();
    }, [layouts, validate, onConfirmSave, onClose]);

    const handleSaveMapping = useCallback(async () => {
        if (!selectedLocationIds.length) {
            alert('선택한 위치의 ID가 없습니다.');
            return;
        }
        await saveProductLocationMapping(Number(productId), selectedLocationIds);
        alert('위치 매핑 저장 완료');
        onConfirmSave?.();
        onClose();
    }, [selectedLocationIds, productId, onConfirmSave, onClose]);

    useEffect(() => {
        console.log('📦 전체 layouts:', layouts);
        console.log('🎯 선택된 locationCode (i):', selectedLocationCodes);
        console.log('🧩 추출된 locationId 목록:', selectedLocationIds);
    }, [layouts, selectedLocationCodes, selectedLocationIds]);


    return (
        <LocationEditorCom
            layouts={layouts}
            onAdd={handleAdd}
            onInputChange={handleInputChange}
            onLayoutChange={handleLayoutChange}
            onSave={isEditMode ? handleSaveLayout : handleSaveMapping}
            onDelete={handleDelete}
            isEditMode={isEditMode}
            productLocationCode={productLocationCode}
            selectedLocationCode={selectedLocationCodes}
            onSelectLocation={isEditMode ? null : handleSelectLocation}
        />
    );
}
