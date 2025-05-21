import React, { useState, useEffect } from 'react';
import LocationEditorCom from '../../../components/store/display/LocationEditorCom';
import {
  fetchDisplayLocations,
  saveDisplayLocations,
} from '../../../service/store/DisplayLocationService';
import { saveProductLocationMapping } from '../../../service/store/StockService';
import { useParams } from 'react-router-dom';

function LocationEditorCon({
  onClose,
  isEditMode,
  productLocationCode = [],     
  onConfirmSave,
}) {
  const { productId } = useParams();
  const [layouts, setLayouts] = useState([]);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState([]);

  useEffect(() => {
    fetchDisplayLocations().then((data) => {
      const initialLayouts = data.map((loc, i) => ({
        ...loc,
        i: loc.i || `${i}`,
      }));
      setLayouts(initialLayouts);
    });
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayouts((prevLayouts) =>
      prevLayouts.map((loc) => {
        const matched = newLayout.find((l) => l.i === loc.i);
        return matched
          ? { ...loc, x: matched.x, y: matched.y, width: matched.w, height: matched.h }
          : loc;
      })
    );
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
    setLayouts((prev) => [...prev, newLoc]);
  };

  const handleDelete = (index) => {
    setLayouts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveLayout = async () => {
    try {
      for (let loc of layouts) {
        const code = loc.locationCode?.trim();
        if (!code) {
          alert(`"${loc.label || '이름 없는 위치'}"의 위치 코드는 비워둘 수 없습니다.`);
          return;
        }
      }
      const fixed = layouts.map((l) => ({
        ...l,
        x: l.x ?? 0,
        y: l.y ?? 0,
        width: l.width ?? 2,
        height: l.height ?? 1,
      }));
      await saveDisplayLocations(fixed);
      alert('진열 구조 저장 완료');
      if (onConfirmSave) onConfirmSave();
      onClose();
    } catch (err) {
      alert('저장 실패: ' + err);
    }
  };

  const handleSelectLocation = (locationCode) => {
    setSelectedLocationCodes((prev) =>
      prev.includes(locationCode)
        ? prev.filter((code) => code !== locationCode)
        : [...prev, locationCode]
    );
  };

  const handleSaveMapping = async () => {
    try {
      if (!selectedLocationCodes.length) {
        alert('위치를 선택해주세요.');
        return;
      }

      const selectedIds = layouts
        .filter((l) => selectedLocationCodes.includes(l.locationCode))
        .map((l) => l.locationId)
        .filter((id) => !!id);

      if (!selectedIds.length) {
        alert('선택한 위치의 ID를 찾을 수 없습니다.');
        return;
      }

      await saveProductLocationMapping(Number(productId), selectedIds);
      alert('위치 매핑 저장 완료!');
      if (onConfirmSave) onConfirmSave();
      onClose();
    } catch (err) {
      alert('매핑 실패: ' + err);
    }
  };

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

export default LocationEditorCon;
