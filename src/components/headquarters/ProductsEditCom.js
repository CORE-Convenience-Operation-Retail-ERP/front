import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const promoOptions = [
  { value: 0, label: "판매중" },
  { value: 1, label: "단종" },
  { value: 2, label: "1+1 이벤트" },
  { value: 3, label: "2+1 이벤트" }
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

  React.useEffect(() => {
    if (detail && categoryTree.length) {
      setForm({
        productId: detail.productId,
        proName: detail.proName,
        proStockLimit: detail.proStockLimit,
        proCost: detail.proCost,
        proSellCost: detail.proSellCost,
        isPromo: detail.status === "판매중" ? 0 : detail.status === "단종" ? 1 : detail.status === "1+1 이벤트" ? 2 : 3,
        proImage: detail.proImage,
        eventStart: detail.eventStart || "",
        eventEnd: detail.eventEnd || "",
        manufacturer: detail.productDetail?.manufacturer || "",
        manuNum: detail.productDetail?.manuNum || "",
        shelfLife: detail.productDetail?.shelfLife || "",
        allergens: detail.productDetail?.allergens || "",
        storageMethod: detail.productDetail?.storageMethod || "",
        categoryId: detail.categoryId // 소분류 id
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePromoChange = (e) => {
    setForm(f => ({ ...f, isPromo: Number(e.target.value) }));
  };

  const handleDateChange = (name, date) => {
    setForm(f => ({ ...f, [name]: date ? date.toISOString().slice(0, 10) : "" }));
  };

  const handleImageChange = async (e) => {
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
    <div style={{ padding: 32 }}>
      <h2>상품 정보 수정</h2>
      <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
        {/* 상품 사진 */}
        <div>
          <img src={form.proImage} alt="제품" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginRight: 32 }} />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {/* 상품명, 상태, 임계치, 가격 */}
        <div>
          <label>상품명: <input name="proName" value={form.proName} onChange={handleChange} /></label>
          <label>상태: 
            <select name="isPromo" value={form.isPromo} onChange={handlePromoChange}>
              {promoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          <label>발주 임계치: <input name="proStockLimit" type="number" value={form.proStockLimit} onChange={handleChange} /></label>
          <label>공급가: <input name="proCost" type="number" value={form.proCost} onChange={handleChange} /></label>
          <label>판매가: <input name="proSellCost" type="number" value={form.proSellCost} onChange={handleChange} /></label>
        </div>
        {/* 이벤트 기간 */}
        <div>
          <label>이벤트 시작일: 
            <DatePicker
              selected={form.eventStart ? new Date(form.eventStart) : null}
              onChange={date => handleDateChange("eventStart", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일 선택"
              minDate={new Date()} // 오늘 이전 선택 불가
            />
          </label>
          <label>이벤트 종료일: 
            <DatePicker
              selected={form.eventEnd ? new Date(form.eventEnd) : null}
              onChange={date => handleDateChange("eventEnd", date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일 선택"
              minDate={form.eventStart ? new Date(form.eventStart) : new Date()} // 시작일 이전 선택 불가
            />
          </label>
        </div>
        {/* 카테고리 3단계 */}
        <div>
          <label>대분류:
            <select value={cat1 || ""} onChange={handleCat1}>
              <option value="">선택</option>
              {cat1List.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          {cat1 && (
            <label>중분류:
              <select value={cat2 || ""} onChange={handleCat2}>
                <option value="">선택</option>
                {cat2List.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          )}
          {cat2 && (
            <label>소분류:
              <select value={cat3 || ""} onChange={handleCat3}>
                <option value="">선택</option>
                {cat3List.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          )}
        </div>
        {/* 부가 정보 */}
        <div>
          <label>제조사: <input name="manufacturer" value={form.manufacturer} onChange={handleChange} /></label>
          <label>제조사 연락처: <input name="manuNum" value={form.manuNum} onChange={handleChange} /></label>
          <label>유통기한: <input name="shelfLife" value={form.shelfLife} onChange={handleChange} /></label>
          <label>알레르기: <input name="allergens" value={form.allergens} onChange={handleChange} /></label>
          <label>보관방법: <input name="storageMethod" value={form.storageMethod} onChange={handleChange} /></label>
        </div>
        <button type="submit">수정 완료</button>
        <button type="button" onClick={onCancel}>취소</button>
      </form>
    </div>
  );
};

export default ProductsEditCom;