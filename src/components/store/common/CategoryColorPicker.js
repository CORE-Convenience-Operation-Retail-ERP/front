import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

function CategoryColorPicker({ categoryName, currentColor, onColorChange }) {
    const [color, setColor] = useState(currentColor || "#aabbcc");

    const handleChange = (newColor) => {
        setColor(newColor);
        onColorChange(categoryName, newColor);
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            <h4>{categoryName}</h4>
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