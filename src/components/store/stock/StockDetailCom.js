import React, { useState } from "react";
import { FiEdit3, FiArrowRightCircle } from "react-icons/fi";
import { MdInventory, MdLocationOn } from "react-icons/md";
import StockTransferModalCon from "../../../containers/store/stock/StockTransferModalCon";
import StockHistorySummaryCom from "./StockHistorySummaryCom";
import { MdHistory } from "react-icons/md";
import {
  PageWrapper,
  PageSection,
  PageTitle,
} from '../../../features/store/styles/common/PageLayout';
import { PrimaryButton } from '../../../features/store/styles/common/Button.styled';
import { Table } from '../../../features/store/styles/common/Table.styled';

function StockDetailCom({
  productDetail,
  historyList,
  onReload,
  onClickOpenView,
  onClickOpenEdit
}) {
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (!productDetail) return <div>로딩 중...</div>;

  const {
    proName,
    proBarcode,
    status,
    storeExpectedQty,
    storeRealQty,
    warehouseExpectedQty,
    warehouseRealQty,
    totalExpectedQty,
    totalRealQty,
    locationCode,
    productId,
    storeId,
  } = productDetail;

  const calculateDiff = (real, expected) => {
    if (real == null || expected == null) return null;
    return real - expected;
  };

  const renderRow = (label, expected, real, rowStyle = {}) => {
    const diff = calculateDiff(real, expected);
    const diffStyle = diff > 0 ? { color: "green" } : diff < 0 ? { color: "red" } : {};
    return (
      <tr style={rowStyle}>
        <td>{label}</td>
        <td>{expected ?? "-"}</td>
        <td>{real ?? "-"}</td>
        <td style={diffStyle}>{diff != null ? (diff >= 0 ? `+${diff}` : diff) : "-"}</td>
      </tr>
    );
  };

  return (
    <PageWrapper>
      <PageTitle><MdInventory style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 상품 상세 정보</PageTitle>

      <PageSection>
        <p><strong>상품명:</strong> {proName}</p>
        <p><strong>바코드:</strong> {proBarcode}</p>
        <p><strong>판매 상태:</strong> {status}</p>
      </PageSection>

      <PageSection>
        <h3><MdLocationOn style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 위치 정보</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            title="클릭 시 진열 위치 보기"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={onClickOpenView}
          >
            <div>
              <strong>매장 위치 코드:</strong>{" "}
              {Array.isArray(locationCode) && locationCode.length > 0 ? (
                locationCode.map((code) => (
                  <span key={code} style={{ marginRight: "6px", fontWeight: "bold" }}>
                    {code}
                  </span>
                ))
              ) : (
                <span>미지정</span>
              )}
            </div>
          </span>
          <PrimaryButton onClick={onClickOpenEdit}>
            <FiEdit3 style={{ marginRight: "4px" }} /> 위치 수정
          </PrimaryButton>
        </div>
      </PageSection>

      <PageSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}><FiArrowRightCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 재고 실사 비교</h3>
          <PrimaryButton onClick={() => setShowTransferModal(true)}>
            <FiArrowRightCircle style={{ marginRight: '6px' }} /> 재고 이동
          </PrimaryButton>
        </div>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>구분</th>
              <th style={{ width: '25%' }}>기존 수량</th>
              <th style={{ width: '25%' }}>실사 수량</th>
              <th style={{ width: '25%' }}>오차</th>
            </tr>
          </thead>
          <tbody>
            {renderRow("매장", storeExpectedQty, storeRealQty)}
            {renderRow("창고", warehouseExpectedQty, warehouseRealQty)}
            {renderRow("총합", totalExpectedQty, totalRealQty, { backgroundColor: '#f9f9fc', fontWeight: 'bold' })}
          </tbody>
        </Table>
      </PageSection>

      {showTransferModal && (
        <StockTransferModalCon
          product={{ productId, storeId }}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            alert("이동 완료");
            setShowTransferModal(false);
            onReload();
          }}
        />
      )}

      <PageSection>
        <h3><MdHistory style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 수량 변화 로그</h3>
        <StockHistorySummaryCom
          historyList={historyList}
          productId={productId}
          enableFilter={true}
          highlightDiff={true}
        />
      </PageSection>
    </PageWrapper>
  );
}

export default StockDetailCom;