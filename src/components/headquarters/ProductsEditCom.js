import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const labelStyle = { width: 140, fontWeight: 600, color: "#333" };
const inputStyle = { flex: 1, background: "#fff" };

const statusOptions = [
  { value: "판매중", label: "판매중" },
  { value: "단종", label: "단종" },
  { value: "1+1", label: "1+1" },
  { value: "2+1", label: "2+1" }
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

const ProductsEditCom = ({ detail, categoryTree, onSubmit, onImageUpload, onCancel }) => {
  const [form, setForm] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [cat1, setCat1] = useState(null);
  const [cat2, setCat2] = useState(null);
  const [cat3, setCat3] = useState(null);

  useEffect(() => {
    if (detail) {
      setForm({
        proName: detail.proName,
        proCost: detail.proCost,
        proSellCost: detail.proSellCost,
        proStockLimit: detail.proStockLimit,
        status: detail.status,
        proImage: detail.proImage,
        eventStart: detail.eventStart || "",
        eventEnd: detail.eventEnd || "",
        manufacturer: detail.productDetail?.manufacturer || "",
        manuNum: detail.productDetail?.manuNum || "",
        shelfLife: detail.productDetail?.shelfLife || "",
        allergens: detail.productDetail?.allergens || "",
        storageMethod: detail.productDetail?.storageMethod || "",
        categoryId: detail.categoryId,
        hqStock: detail.hqStock,
        regularInDay: detail.regularInDay || 1,
        regularInQuantity: detail.regularInQuantity || 0,
        regularInActive: detail.regularInActive || false
      });
      // 카테고리 경로 자동 선택
      const path = findCategoryPath(categoryTree, detail.categoryId);
      setCat1(path?.[0]?.id || null);
      setCat2(path?.[1]?.id || null);
      setCat3(path?.[2]?.id || null);
    }
  }, [detail, categoryTree]);

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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      const url = await onImageUpload(file);
      setForm(f => ({ ...f, proImage: url }));
    }
  };

  if (!form) return <div>로딩중...</div>;

  // 카테고리 드롭다운 데이터
  const cat1List = categoryTree;
  const cat2List = cat1List.find(c => c.id === cat1)?.children || [];
  const cat3List = cat2List.find(c => c.id === cat2)?.children || [];

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
          상품 정보 수정
        </Typography>
      </Box>
      <Box sx={{ p: 4, bgcolor: "#fafbfc", borderRadius: 2, maxWidth: 1100, mx: "auto", mt: 0, boxShadow: 2 }}>
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          <Box sx={{ width: 240, height: 240, bgcolor: "#eee", borderRadius: 2, overflow: "hidden", mr: 4 }}>
            <img src={form.proImage} alt="제품" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Button component="label" variant="outlined" sx={{ mt: 1, width: "100%" }}>
              이미지 변경
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>제품명</Typography>
              <TextField name="proName" value={form.proName} onChange={handleChange} size="small" sx={inputStyle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>상태</Typography>
              <TextField
                name="status"
                select
                value={form.status}
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
              <Typography sx={labelStyle}>발주 임계치</Typography>
              <TextField name="proStockLimit" value={form.proStockLimit} onChange={handleChange} size="small" sx={inputStyle} type="number" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>공급가</Typography>
              <TextField name="proCost" value={form.proCost} onChange={handleChange} size="small" sx={inputStyle} type="number" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>판매가</Typography>
              <TextField name="proSellCost" value={form.proSellCost} onChange={handleChange} size="small" sx={inputStyle} type="number" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>본사 재고</Typography>
              <TextField name="hqStock" value={form.hqStock} onChange={handleChange} size="small" sx={inputStyle} type="number" />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>정기 입고 정보</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고일</Typography>
            <TextField
              name="regularInDay"
              value={form.regularInDay}
              onChange={handleChange}
              size="small"
              sx={inputStyle}
              type="number"
              inputProps={{ min: 1, max: 31 }}
            />
            <Typography sx={{ ml: 1 }}>일</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고수량</Typography>
            <TextField
              name="regularInQuantity"
              value={form.regularInQuantity}
              onChange={handleChange}
              size="small"
              sx={inputStyle}
              type="number"
              inputProps={{ min: 0 }}
            />
            <Typography sx={{ ml: 1 }}>개</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고 활성화</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="regularInActive"
                  checked={!!form.regularInActive}
                  onChange={handleChange}
                />
              }
              label="활성화"
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>이벤트 시작일</Typography>
            <DatePicker
              selected={form.eventStart ? new Date(form.eventStart) : null}
              onChange={date => setForm(f => ({ ...f, eventStart: date ? date.toISOString().slice(0, 10) : "" }))}
              dateFormat="yyyy-MM-dd"
              customInput={<TextField size="small" sx={inputStyle} />}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>이벤트 종료일</Typography>
            <DatePicker
              selected={form.eventEnd ? new Date(form.eventEnd) : null}
              onChange={date => setForm(f => ({ ...f, eventEnd: date ? date.toISOString().slice(0, 10) : "" }))}
              dateFormat="yyyy-MM-dd"
              customInput={<TextField size="small" sx={inputStyle} />}
            />
          </Box>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={onCancel}>취소</Button>
          <Button variant="contained" onClick={() => onSubmit(form)}>저장</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductsEditCom;