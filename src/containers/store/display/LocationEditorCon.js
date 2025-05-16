import React, { useEffect, useState } from 'react';
import LocationEditorCom from '../../../components/store/display/LocationEditorCom';
import { fetchDisplayLocations, saveDisplayLocations } from '../../../service/store/DisplayLocationService';

function LocationEditorCon({ onClose, isEditMode, productLocationCode, onSelectLocation }) {
    const [layouts, setLayouts] = useState([]);

    useEffect(() => {
        fetchDisplayLocations().then(data => {
            setLayouts(data.map((loc, i) => ({ ...loc, i: loc.i || `${i}` })));
        });
    }, []);

    const handleLayoutChange = (newLayout) => {
        setLayouts(prevLayouts => {
            const updated = prevLayouts.map((loc) => {
                const l = newLayout.find(l => l.i === loc.i);
                return l
                    ? { ...loc, x: l.x, y: l.y, width: l.w, height: l.h }
                    : loc;
            });

            const changed = updated.some((u, i) =>
                u.x !== prevLayouts[i].x ||
                u.y !== prevLayouts[i].y ||
                u.width !== prevLayouts[i].width ||
                u.height !== prevLayouts[i].height
            );

            return changed ? updated : prevLayouts;
        });
    };

    const handleInputChange = (index, field, value) => {
        const updated = [...layouts];
        updated[index][field] = value;
        setLayouts(updated);
    };

    const handleAdd = () => {
        const maxY = layouts.reduce((max, item) => Math.max(max, item.y || 0), 0);
        const newLoc = {
            i: `${Date.now()}`,
            x: 0,
            y: maxY + 1,
            width: 2,
            height: 1,
            locationCode: '',
            label: '',
            type: 0,
        };
        setLayouts(prev => [...prev, newLoc]);
    };

    const handleDelete = (index) => {
        const updated = layouts.filter((_, i) => i !== index);
        setLayouts(updated);
    };

    const handleSave = async () => {
        try {
            // 1. 유효성 검사: 빈 locationCode 방지
            for (let loc of layouts) {
                const code = loc.locationCode?.trim();
                if (!code) {
                    alert(`"${loc.label || "이름 없는 위치"}"의 위치 코드는 비워둘 수 없습니다.\n→ 예: "00" 처럼 입력해주세요.`);
                    return;
                }
            }

            // 2. 저장을 위한 좌표 보정
            const fixedLayouts = layouts.map(l => ({
                ...l,
                x: l.x ?? 0,
                y: l.y ?? 0,
                width: l.width ?? 2,
                height: l.height ?? 1
            }));

            // 3. 저장 요청
            await saveDisplayLocations(fixedLayouts);
            alert('저장되었습니다!');
            if (onClose) onClose();

        } catch (err) {
            if (typeof err === "string") {
                if (err.includes("존재하는 위치 코드")) {
                    alert("동일한 위치 코드가 이미 존재합니다. 변경해주세요.");
                } else if (err.includes("비워둘 수 없습니다")) {
                    alert("빈 위치 코드가 있습니다. '00'처럼 입력해주세요.");
                } else {
                    alert("저장 실패: " + err);
                }
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <LocationEditorCom
            layouts={layouts}
            onAdd={handleAdd}
            onInputChange={handleInputChange}
            onLayoutChange={handleLayoutChange}
            onSave={handleSave}
            onDelete={handleDelete}
            isEditMode={isEditMode}
            highlightLocationCode={productLocationCode}
            onSelectLocation={onSelectLocation}
        />
    );
}

export default LocationEditorCon;
