// src/components/headquarters/ProductsRegisterCom.js
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../service/axiosInstance";

const labelStyle = { width: 140, fontWeight: 600, color: "#333" };
const inputStyle = { flex: 1, background: "#fff" };

const statusOptions = [
  { value: 0, label: "판매중" },
  { value: 1, label: "단종" },
  { value: 2, label: "1+1" },
  { value: 3, label: "2+1" }
];

function findCategoryPath(tree, id, path = []) {
  for (const node of tree) {
    if (node.id === id) return [...path, node];
    if (node.children && node.children.length) {
      const found = findCategoryPath(node.children, id, [...path, node]);
      if (found) return found;
    }
  }
  return null;
}

const initialState = {
  proName: "",
  proBarcode: "",
  categoryId: null,
  proCost: "",
  proSellCost: "",
  proStockLimit: "",
  proImage: "",
  isPromo: 0,
  manufacturer: "",
  manuNum: "",
  shelfLife: "",
  allergens: "",
  storageMethod: "",
};

const ProductsRegisterCom = ({ onCancel, onSuccess, categoryTree = [] }) => {
  const [form, setForm] = useState(initialState);
  const [imgFile, setImgFile] = useState(null);
  const [cat1, setCat1] = useState(null);
  const [cat2, setCat2] = useState(null);
  const [cat3, setCat3] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 카테고리 드롭다운 데이터
  const cat1List = categoryTree;
  const cat2List = cat1List.find(c => c.id === cat1)?.children || [];
  const cat3List = cat2List.find(c => c.id === cat2)?.children || [];

  // 카테고리 선택 핸들러
  const handleCat1 = e => {
    setCat1(Number(e.target.value));
    setCat2(null);
    setCat3(null);
    setForm(f => ({ ...f, categoryId: null }));
  };
  const handleCat2 = e => {
    setCat2(Number(e.target.value));
    setCat3(null);
    setForm(f => ({ ...f, categoryId: null }));
  };
  const handleCat3 = e => {
    setCat3(Number(e.target.value));
    setForm(f => ({ ...f, categoryId: Number(e.target.value) }));
  };

  // 카테고리 최종 선택값(소분류가 있으면 소분류, 없으면 중분류)
  const getSelectedCategoryId = () => {
    if (cat3) return cat3;
    if (cat2) return cat2;
    if (cat1) return cat1;
    return null;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(f => ({ ...f, proImage: url, proImageFile: file }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const selectedCategoryId = getSelectedCategoryId();
    // 필수값 체크
    if (!form.proName || !form.proBarcode || !selectedCategoryId || !form.proCost || !form.proSellCost) {
      setError("필수 입력값을 모두 입력해주세요.");
      return;
    }
    if (Number(form.proCost) < 0 || Number(form.proSellCost) < 0) {
      setError("공급가/판매가는 0 이상이어야 합니다.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "proImageFile" && v) {
          data.append("proImage", v);
        } else if (k !== "proImageFile" && v !== null && v !== undefined && v !== "") {
          data.append(k, v);
        }
      });
      data.set("categoryId", selectedCategoryId); // 최종 선택된 카테고리로 덮어쓰기
      const res = await axios.post("/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.productId) {
        if (onSuccess) onSuccess(res.data.productId);
      }
    } catch (err) {
      setError("등록에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ width: '90%', maxWidth: 1100, mx: 'auto', mt: 4, mb: 7, display: 'flex' }}>
        <Typography sx={{
          fontWeight: 'bold',
          fontSize: 30,
          color: '#2563A6',
          letterSpacing: '-1px',
        }}>
          상품 등록
        </Typography>
      </Box>
      <Box sx={{ p: 4, bgcolor: "#fafbfc", borderRadius: 2, maxWidth: 1100, mx: "auto", mt: 0, boxShadow: 2 }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
            <Box sx={{ width: 240, height: 240, bgcolor: "#eee", borderRadius: 2, overflow: "hidden", mr: 4 }}>
              <img src={form.proImage} alt="제품" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <Button component="label" variant="outlined" sx={{ mt: 1, width: "100%" }}>
                이미지 업로드
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>제품명</Typography>
                <TextField name="proName" value={form.proName} onChange={handleChange} size="small" sx={inputStyle} required />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>바코드</Typography>
                <TextField name="proBarcode" value={form.proBarcode} onChange={handleChange} size="small" sx={inputStyle} required />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>상태</Typography>
                <TextField
                  name="isPromo"
                  select
                  value={form.isPromo}
                  onChange={handleChange}
                  size="small"
                  sx={inputStyle}
                >
                  {statusOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>카테고리</Typography>
                <TextField
                  select
                  value={cat1 || ""}
                  onChange={handleCat1}
                  size="small"
                  sx={{ minWidth: 120, mr: 1 }}
                >
                  <MenuItem value="">대분류</MenuItem>
                  {cat1List.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  value={cat2 || ""}
                  onChange={handleCat2}
                  size="small"
                  sx={{ minWidth: 120, mr: 1 }}
                  disabled={!cat1}
                >
                  <MenuItem value="">중분류</MenuItem>
                  {cat2List.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  value={cat3 || ""}
                  onChange={handleCat3}
                  size="small"
                  sx={{ minWidth: 120 }}
                  disabled={!cat2}
                  name="categoryId"
                >
                  <MenuItem value="">소분류</MenuItem>
                  {cat3List.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>발주 임계치</Typography>
                <TextField name="proStockLimit" value={form.proStockLimit} onChange={handleChange} size="small" sx={inputStyle} type="number" />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>공급가</Typography>
                <TextField name="proCost" value={form.proCost} onChange={handleChange} size="small" sx={inputStyle} type="number" required />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>판매가</Typography>
                <TextField name="proSellCost" value={form.proSellCost} onChange={handleChange} size="small" sx={inputStyle} type="number" required />
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>제조사</Typography>
              <TextField name="manufacturer" value={form.manufacturer} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>제조번호</Typography>
              <TextField name="manuNum" value={form.manuNum} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>유통기한</Typography>
              <TextField name="shelfLife" value={form.shelfLife} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>알레르기</Typography>
              <TextField name="allergens" value={form.allergens} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>보관방법</Typography>
              <TextField name="storageMethod" value={form.storageMethod} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
          </Box>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={onCancel}>취소</Button>
            <Button variant="contained" type="submit" disabled={loading}>{loading ? "등록 중..." : "등록"}</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ProductsRegisterCom;