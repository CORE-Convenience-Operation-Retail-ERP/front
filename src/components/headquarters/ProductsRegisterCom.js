// src/components/headquarters/ProductsRegisterCom.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const initialState = {
  proName: "",
  proBarcode: "",
  categoryId: "",
  proCost: "",
  proSellCost: "",
  proStockLimit: "",
  proImage: null,
  manufacturer: "",
  manuNum: "",
  shelfLife: "",
  allergens: "",
  storageMethod: "",
};

const ProductsRegisterCom = ({ onCancel, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [categoryFlat, setCategoryFlat] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 카테고리 트리 → flat 변환
  const flattenCategories = (tree, arr = []) => {
    tree.forEach((node) => {
      arr.push({ id: node.id, name: node.name });
      if (node.children && node.children.length > 0) {
        flattenCategories(node.children, arr);
      }
    });
    return arr;
  };

  useEffect(() => {
    axios.get("/api/categories/tree").then((res) => {
      setCategories(res.data);
      setCategoryFlat(flattenCategories(res.data));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proImage") {
      setForm({ ...form, proImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // 필수값 체크
    if (!form.proName || !form.proBarcode || !form.categoryId || !form.proCost || !form.proSellCost) {
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
        if (v !== null && v !== undefined) data.append(k, v);
      });
      // 이벤트 상태/기간은 기본값(판매중/없음)으로 백엔드에서 처리
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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
      <h2>제품 등록</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>제품명* </label>
          <input name="proName" value={form.proName} onChange={handleChange} required />
        </div>
        <div>
          <label>바코드* </label>
          <input name="proBarcode" value={form.proBarcode} onChange={handleChange} required />
        </div>
        <div>
          <label>카테고리* </label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">선택</option>
            {categoryFlat.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>공급가* </label>
          <input name="proCost" type="number" min="0" value={form.proCost} onChange={handleChange} required />
        </div>
        <div>
          <label>판매가* </label>
          <input name="proSellCost" type="number" min="0" value={form.proSellCost} onChange={handleChange} required />
        </div>
        <div>
          <label>재고 임계치 </label>
          <input name="proStockLimit" type="number" value={form.proStockLimit} onChange={handleChange} />
        </div>
        <div>
          <label>이미지 </label>
          <input name="proImage" type="file" accept="image/*" onChange={handleChange} />
        </div>
        <div>
          <label>제조사 </label>
          <input name="manufacturer" value={form.manufacturer} onChange={handleChange} />
        </div>
        <div>
          <label>제조사 연락처 </label>
          <input name="manuNum" value={form.manuNum} onChange={handleChange} />
        </div>
        <div>
          <label>유통기한 </label>
          <input name="shelfLife" value={form.shelfLife} onChange={handleChange} />
        </div>
        <div>
          <label>알레르기 </label>
          <input name="allergens" value={form.allergens} onChange={handleChange} />
        </div>
        <div>
          <label>보관방법 </label>
          <input name="storageMethod" value={form.storageMethod} onChange={handleChange} />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={loading}>등록</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default ProductsRegisterCom;