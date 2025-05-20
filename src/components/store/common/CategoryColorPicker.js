import React, { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

function CategoryColorPicker({ categoryName, currentColor, onColorChange, onClose }) {
    const [color, setColor] = useState(currentColor || "#aabbcc");
    const pickerRef = useRef(null);

    // 색상 선택 처리
    const handleChange = (newColor) => {
        setColor(newColor);
        onColorChange(categoryName, newColor);
    };

    // 외부 클릭 시 picker 닫기
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                onClose?.(); // 부모의 닫기 핸들러 호출
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={pickerRef}
            style={{
                position: "relative",
                padding: "1rem",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                width: "220px"
            }}
        >
            {/* X 버튼 */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    color: "#888"
                }}
                aria-label="닫기"
            >
                ×
            </button>

            <h4 style={{ marginTop: 0 }}>{categoryName}</h4>
            <HexColorPicker color={color} onChange={handleChange} />
            <div
                style={{
                    marginTop: "0.5rem",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "1px solid #ccc"
                }}
            />
        </div>
    );
}

export default CategoryColorPicker;
