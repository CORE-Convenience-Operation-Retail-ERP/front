import React, { useState, useEffect } from "react";
import { updateHQStock, updateRegularInSettings, testProcessRegularIn } from "../../service/headquarters/HQStockService";
import Modal from "@mui/material/Modal";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button, CircularProgress } from "@mui/material";

const ProductsDetailCom = ({ detail, onBack, onEdit, onInOut }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdatingHQStock, setIsUpdatingHQStock] = useState(false);
  const [hqStockQuantity, setHqStockQuantity] = useState(0);
  const [showHQStockEditor, setShowHQStockEditor] = useState(false);
  const [regularInDay, setRegularInDay] = useState(1);
  const [regularInQuantity, setRegularInQuantity] = useState(0);
  const [regularInActive, setRegularInActive] = useState(false);
  const [isUpdatingRegularIn, setIsUpdatingRegularIn] = useState(false);
  const [isTestingRegularIn, setIsTestingRegularIn] = useState(false);
  const [inoutModalOpen, setInoutModalOpen] = useState(false);
  const [allInOut, setAllInOut] = useState([]);
  const [loadingInOut, setLoadingInOut] = useState(false);

  useEffect(() => {
    if (detail) {
      setHqStockQuantity(detail.hqStock || 0);
      setRegularInDay(detail.regularInDay || 1);
      setRegularInQuantity(detail.regularInQuantity || 0);
      setRegularInActive(detail.regularInActive || false);
    }
  }, [detail]);

  const handleHQStockUpdate = async () => {
    if (!detail || hqStockQuantity < 0) {
      alert("재고 수량은 0 이상이어야 합니다.");
      return;
    }
    
    setIsUpdatingHQStock(true);
    
    try {
      await updateHQStock(detail.productId, hqStockQuantity);
      alert("본사 재고가 업데이트되었습니다.");
      setShowHQStockEditor(false);
    } catch (error) {
      alert(`재고 업데이트 실패: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdatingHQStock(false);
    }
  };

  const handleRegularInUpdate = async () => {
    if (!detail || isUpdatingRegularIn) return;
    
    try {
      setIsUpdatingRegularIn(true);
      await updateRegularInSettings(
        detail.productId,
        regularInDay,
        regularInQuantity,
        regularInActive
      );
      alert("정기 입고 설정이 업데이트되었습니다.");
    } catch (error) {
      console.error("정기 입고 설정 업데이트 오류:", error);
      alert("정기 입고 설정 업데이트에 실패했습니다.");
    } finally {
      setIsUpdatingRegularIn(false);
    }
  };
  
  // 정기 입고 즉시 테스트 함수
  const handleTestRegularIn = async () => {
    if (isTestingRegularIn) return;
    
    try {
      setIsTestingRegularIn(true);
      await testProcessRegularIn(regularInDay);
      alert(`${regularInDay}일자 정기 입고가 즉시 처리되었습니다. 페이지를 새로고침하면 재고 변화를 확인할 수 있습니다.`);
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("정기 입고 테스트 오류:", error);
      alert("정기 입고 테스트에 실패했습니다.");
    } finally {
      setIsTestingRegularIn(false);
    }
  };

  // 전체 입출고 내역 불러오기
  const fetchAllInOut = async () => {
    setLoadingInOut(true);
    try {
      // 실제 API 엔드포인트에 맞게 수정 필요
      const res = await fetch(`/api/stockin/history?productId=${detail.productId}`);
      const data = await res.json();
      setAllInOut(data);
    } catch (e) {
      setAllInOut([]);
    }
    setLoadingInOut(false);
  };

  const handleOpenInOutModal = () => {
    setInoutModalOpen(true);
    fetchAllInOut();
  };

  const handleCloseInOutModal = () => {
    setInoutModalOpen(false);
    setAllInOut([]);
  };

  if (!detail) {
    return <div>로딩중...</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      {/* 상단 네비 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack}>← 제품 목록으로 돌아가기</button>
        <button onClick={onEdit}>상품 정보 수정</button>
      </div>
      {/* 제품 기본 정보 */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
        <img src={detail.proImage} alt="제품" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginRight: 32 }} />
        <div>
          <h1 style={{ margin: 0 }}>{detail.proName}</h1>
          <div>제품 코드: {detail.productId}</div>
          <div>
            카테고리: {detail.categoryPath ? detail.categoryPath.join(" > ") : ""}
          </div>
          <div>바코드: {detail.proBarcode}</div>
          <div>상태: {detail.status}</div>
          <div>
            이벤트 기간:{" "}
            {detail.eventStart && detail.eventEnd
              ? `${detail.eventStart} ~ ${detail.eventEnd}`
              : "없음"}
          </div>
        </div>
      </div>
      {/* 2x2 표 정보 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 24,
          marginTop: 32,
        }}
      >
        {/* 재고 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>재고 정보</h3>
          <div>매장 총 재고: {detail.totalStock}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <div>본사 재고: </div>
            {showHQStockEditor ? (
              <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                <input
                  type="number"
                  value={hqStockQuantity}
                  onChange={(e) => setHqStockQuantity(parseInt(e.target.value) || 0)}
                  style={{ width: 80, marginRight: 8 }}
                />
                <button 
                  onClick={handleHQStockUpdate}
                  disabled={isUpdatingHQStock}
                  style={{
                    padding: "4px 8px",
                    background: "#5bc0de",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    marginRight: 4
                  }}
                >
                  {isUpdatingHQStock ? "..." : "저장"}
                </button>
                <button 
                  onClick={() => setShowHQStockEditor(false)}
                  style={{
                    padding: "4px 8px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ 
                  color: detail.hqStock < 100 ? "orange" : "black",
                  marginLeft: 8,
                  marginRight: 8
                }}>
                  {detail.hqStock}
                </span>
                <button 
                  onClick={() => {
                    setHqStockQuantity(detail.hqStock || 0);
                    setShowHQStockEditor(true);
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#5bc0de",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px"
                  }}
                >
                  수정
                </button>
              </div>
            )}
          </div>
          <div>발주 임계치: {detail.proStockLimit}</div>
          <button onClick={() => setModalOpen(true)}>점포별 재고 조회</button>
          
          <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
            <h4>정기 입고 설정</h4>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div>매월</div>
              <select 
                value={regularInDay} 
                onChange={(e) => setRegularInDay(parseInt(e.target.value))}
                style={{ margin: "0 8px", padding: "4px 8px" }}
                disabled={isUpdatingRegularIn}
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <div>일에</div>
              <input
                type="number"
                value={regularInQuantity}
                onChange={(e) => setRegularInQuantity(parseInt(e.target.value) || 0)}
                style={{ width: 80, margin: "0 8px", padding: "4px 8px" }}
                disabled={isUpdatingRegularIn}
                min="0"
              />
              <div>개 자동 입고</div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
              <input
                type="checkbox"
                checked={regularInActive}
                onChange={(e) => setRegularInActive(e.target.checked)}
                id="regularInActive"
                disabled={isUpdatingRegularIn}
              />
              <label htmlFor="regularInActive" style={{ marginLeft: 8 }}>정기 입고 활성화</label>
              
              <button 
                onClick={handleRegularInUpdate}
                disabled={isUpdatingRegularIn}
                style={{
                  marginLeft: 16,
                  padding: "4px 8px",
                  background: "#5bc0de",
                  border: "none",
                  borderRadius: "4px",
                  color: "white"
                }}
              >
                {isUpdatingRegularIn ? "저장 중..." : "설정 저장"}
              </button>
              
              {/* 정기 입고 테스트 버튼 추가 */}
              <button 
                onClick={handleTestRegularIn}
                disabled={isTestingRegularIn || !regularInActive || regularInQuantity <= 0}
                style={{
                  marginLeft: 8,
                  padding: "4px 8px",
                  background: "#f0ad4e",
                  border: "none",
                  borderRadius: "4px",
                  color: "white"
                }}
              >
                {isTestingRegularIn ? "처리 중..." : "즉시 실행 테스트"}
              </button>
            </div>
          </div>
        </div>
        {/* 가격 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>가격 정보</h3>
          <div>공급가: {detail.proCost?.toLocaleString()}원</div>
          <div>판매가: {detail.proSellCost?.toLocaleString()}원</div>
          <div>이익률: {detail.profitRate?.toFixed(1)}%</div>
          <div>원가율: {detail.costRate?.toFixed(1)}%</div>
        </div>
        {/* 입출고 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>입출고 정보</h3>
          {Array.isArray(detail.recentStockIns) && detail.recentStockIns.length > 0 ? (
            detail.recentStockIns.slice(0, 3).map((s, i) => (
              <div key={i}>
                {s.storeName} | {s.date} | {s.quantity}개
              </div>
            ))
          ) : (
            <div>최근 입고 내역이 없습니다.</div>
          )}
          <button onClick={handleOpenInOutModal} style={{ marginTop: 8 }}>
            입출고 내역 확인
          </button>
        </div>
        {/* 부가 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>부가 정보</h3>
          {detail.productDetail ? (
            <>
              <div>제조사: {detail.productDetail.manufacturer}</div>
              <div>제조번호: {detail.productDetail.manuNum}</div>
              <div>유통기한: {detail.productDetail.shelfLife}</div>
              <div>알레르기 정보: {detail.productDetail.allergens}</div>
              <div>보관방법: {detail.productDetail.storageMethod}</div>
            </>
          ) : (
            <p>부가 정보가 없습니다.</p>
          )}
        </div>
      </div>
      {/* 제품 상세 분석 (공간만) */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginTop: 24,
        }}
      >
        <h3>제품 상세 분석</h3>
        <div
          style={{
            height: 180,
            background: "#f5f5f5",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          (분석/차트 등 공간)
        </div>
      </div>
      {/* 점포별 재고 모달 */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 32,
              minWidth: 320,
            }}
          >
            <h3>점포별 재고</h3>
            {detail.storeStocks?.map((s, i) => (
              <div key={i} style={{ color: s.quantity <= 5 ? "red" : "black" }}>
                {s.storeName} : {s.quantity}개
              </div>
            ))}
            <button onClick={() => setModalOpen(false)} style={{ marginTop: 16 }}>
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 입출고 내역 모달 */}
      <Modal open={inoutModalOpen} onClose={handleCloseInOutModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', p: 4, borderRadius: 3, minWidth: 700, maxHeight: '80vh', overflowY: 'auto'
        }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>전체 입출고 내역</Typography>
          {loadingInOut ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">매장명</TableCell>
                  <TableCell align="center">입고일</TableCell>
                  <TableCell align="center">수량</TableCell>
                  <TableCell align="center">비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allInOut.length > 0 ? allInOut.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="center">{row.storeName}</TableCell>
                    <TableCell align="center">{row.inDate}</TableCell>
                    <TableCell align="center">{row.inQuantity}</TableCell>
                    <TableCell align="center">{row.memo || '-'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>입출고 내역이 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseInOutModal} variant="outlined">닫기</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductsDetailCom;