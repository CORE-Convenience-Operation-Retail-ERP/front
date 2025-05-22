import React, { useState, useEffect } from "react";
import { updateHQStock, updateRegularInSettings, testProcessRegularIn } from "../../service/headquarters/HQStockService";
import Modal from "@mui/material/Modal";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button, Divider, TextField, Checkbox, CircularProgress } from "@mui/material";

const labelStyle = { width: 140, fontWeight: 600, color: "#333" };
const inputStyle = { flex: 1, background: "#f7f7f7" };

const ProductsDetailCom = ({ detail, onBack, onEdit }) => {
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
      alert("정기 입고 설정 업데이트에 실패했습니다.");
    } finally {
      setIsUpdatingRegularIn(false);
    }
  };

  const handleTestRegularIn = async () => {
    if (isTestingRegularIn) return;
    try {
      setIsTestingRegularIn(true);
      await testProcessRegularIn(regularInDay);
      alert(`${regularInDay}일자 정기 입고가 즉시 처리되었습니다. 페이지를 새로고침하면 재고 변화를 확인할 수 있습니다.`);
      window.location.reload();
    } catch (error) {
      alert("정기 입고 테스트에 실패했습니다.");
    } finally {
      setIsTestingRegularIn(false);
    }
  };

  // 전체 입출고 내역 불러오기
  const fetchAllInOut = async () => {
    setLoadingInOut(true);
    try {
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

  if (!detail) return <div>로딩중...</div>;
  const extra = detail.productDetail || {};

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
          상품 상세 정보
        </Typography>
      </Box>
      <Box sx={{ p: 4, bgcolor: "#fafbfc", borderRadius: 2, maxWidth: 1100, mx: "auto", mt: 0, boxShadow: 2 }}>
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          <Box sx={{ width: 240, height: 240, bgcolor: "#eee", borderRadius: 2, overflow: "hidden", mr: 4 }}>
            <img src={detail.proImage} alt="제품" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            {[
              { label: "제품명", value: detail.proName },
              { label: "제품번호", value: detail.productId },
              { label: "카테고리", value: detail.categoryPath?.join(" > ") },
              { label: "바코드", value: detail.proBarcode },
              { label: "상태", value: detail.status },
              { label: "이벤트 기간", value: detail.eventStart && detail.eventEnd ? `${detail.eventStart} ~ ${detail.eventEnd}` : "없음" }
            ].map((row, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={labelStyle}>{row.label}</Typography>
                <TextField
                  value={row.value || ""}
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={{ ...inputStyle, background: "#fff" }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        {/* 1. 공급가, 판매가, 이익률, 원가율 */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>공급가</Typography>
            <TextField
              value={detail.proCost?.toLocaleString() + "원"}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>판매가</Typography>
            <TextField
              value={detail.proSellCost?.toLocaleString() + "원"}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>이익률</Typography>
            <TextField
              value={detail.profitRate?.toFixed(1) + "%"}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>원가율</Typography>
            <TextField
              value={detail.costRate?.toFixed(1) + "%"}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* 2. 제조사, 제조번호, 유통기한, 알레르기, 보관방법 */}
        <Box>
          {[
            { label: "제조사", value: extra.manufacturer },
            { label: "제조번호", value: extra.manuNum },
            { label: "유통기한", value: extra.shelfLife },
            { label: "알레르기", value: extra.allergens },
            { label: "보관방법", value: extra.storageMethod }
          ].map((row, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={labelStyle}>{row.label}</Typography>
              <TextField
                value={row.value || ""}
                size="small"
                InputProps={{ readOnly: true }}
                sx={{ ...inputStyle, background: "#fff" }}
              />
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* 3. 발주 임계치, 매장 총재고, 본사 재고 */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>발주 임계치</Typography>
            <TextField
              value={detail.proStockLimit}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>매장 총 재고</Typography>
            <TextField
              value={detail.totalStock}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ ...inputStyle, background: "#fff" }}
            />
            <Button sx={{ ml: 1 }} variant="outlined" onClick={() => setModalOpen(true)}>매장별 재고</Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>본사 재고</Typography>
            {showHQStockEditor ? (
              <>
                <TextField
                  value={hqStockQuantity}
                  onChange={e => setHqStockQuantity(Number(e.target.value))}
                  size="small"
                  sx={{ ...inputStyle, background: "#fff" }}
                  type="number"
                />
                <Button sx={{ ml: 1 }} variant="contained" onClick={handleHQStockUpdate} disabled={isUpdatingHQStock}>
                  {isUpdatingHQStock ? "저장중..." : "저장"}
                </Button>
                <Button sx={{ ml: 1 }} variant="outlined" onClick={() => setShowHQStockEditor(false)}>취소</Button>
              </>
            ) : (
              <>
                <TextField
                  value={detail.hqStock}
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={{ ...inputStyle, background: "#fff" }}
                />
                <Button sx={{ ml: 1 }} variant="outlined" onClick={() => {
                  setHqStockQuantity(detail.hqStock || 0);
                  setShowHQStockEditor(true);
                }}>수정</Button>
              </>
            )}
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* 4. 정기입고일, 정기입고수량, 정기입고 활성화, 최근 입고내역 */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고일</Typography>
            <TextField
              value={regularInDay}
              size="small"
              InputProps={{ readOnly: false }}
              sx={{ ...inputStyle, background: "#fff" }}
              type="number"
              onChange={e => setRegularInDay(Number(e.target.value))}
              disabled={isUpdatingRegularIn}
            />
            <Typography sx={{ ml: 1 }}>일</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고수량</Typography>
            <TextField
              value={regularInQuantity}
              size="small"
              InputProps={{ readOnly: false }}
              sx={{ ...inputStyle, background: "#fff" }}
              type="number"
              onChange={e => setRegularInQuantity(Number(e.target.value))}
              disabled={isUpdatingRegularIn}
            />
            <Typography sx={{ ml: 1 }}>개</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>정기입고 활성화</Typography>
            <Checkbox
              checked={!!regularInActive}
              onChange={e => setRegularInActive(e.target.checked)}
              disabled={isUpdatingRegularIn}
            />
            <Button
              sx={{ ml: 2 }}
              variant="contained"
              onClick={handleRegularInUpdate}
              disabled={isUpdatingRegularIn}
            >
              {isUpdatingRegularIn ? "저장 중..." : "설정 저장"}
            </Button>
            <Button
              sx={{ ml: 1 }}
              variant="outlined"
              onClick={handleTestRegularIn}
              disabled={isTestingRegularIn || !regularInActive || regularInQuantity <= 0}
            >
              {isTestingRegularIn ? "처리 중..." : "즉시 실행 테스트"}
            </Button>
          </Box>
          {/* 최근 입고 내역 */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={labelStyle}>최근 입고내역</Typography>
            <Box sx={{ flex: 1 }}>
              {Array.isArray(detail.recentStockIns) && detail.recentStockIns.length > 0 ? (
                detail.recentStockIns
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬(필요시)
                  .slice(0, 3)
                  .map((s, i) => (
                    <Box key={i} sx={{ fontSize: 14, color: "#333" }}>
                      {s.storeName} | {s.date} | {s.quantity}개
                    </Box>
                  ))
              ) : (
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>최근 입고 내역이 없습니다.</Typography>
              )}
            </Box>
            <Button sx={{ ml: 1 }} variant="outlined" onClick={handleOpenInOutModal}>입출고 내역</Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={onBack}>목록</Button>
          <Button variant="contained" onClick={onEdit}>상품 정보 수정</Button>
        </Box>
        {/* 매장별 재고 모달 */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', p: 4, borderRadius: 3, minWidth: 400, maxHeight: '80vh', overflowY: 'auto'
          }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>매장별 재고</Typography>
            {detail.storeStocks?.length > 0 ? detail.storeStocks.map((s, i) => (
              <Box key={i} sx={{ color: s.quantity <= 5 ? "red" : "black", mb: 1 }}>
                {s.storeName} : {s.quantity}개
              </Box>
            )) : <Typography>데이터 없음</Typography>}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={() => setModalOpen(false)} variant="outlined">닫기</Button>
            </Box>
          </Box>
        </Modal>
        {/* 입출고 내역 모달 */}
        <Modal open={inoutModalOpen} onClose={handleCloseInOutModal}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', p: 4, borderRadius: 3, minWidth: 700, maxHeight: '80vh', overflowY: 'auto'
          }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>전체 입출고 내역</Typography>
            {Array.isArray(detail.recentStockIns) && detail.recentStockIns.length > 0 ? (
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
                  {detail.recentStockIns
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center">{row.storeName}</TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center">{row.quantity}</TableCell>
                        <TableCell align="center">{row.memo || '-'}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>입출고 내역이 없습니다.</Typography>
            )}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseInOutModal} variant="outlined">닫기</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProductsDetailCom;