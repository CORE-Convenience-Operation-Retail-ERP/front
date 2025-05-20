import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Pagination, CircularProgress, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { InputBase, IconButton, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// 검색어 하이라이트 함수
const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const parts = String(text).split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? 
          <span key={index} style={{ backgroundColor: '#D0EBFF', fontWeight: 'bold' }}>
            {part}
          </span> : part
      )}
    </>
  );
};

// 상품 상태에 따른 라벨과 스타일 반환 함수
const getStatusInfo = (product) => {
  let status = "판매중";
  if (product.isPromo === 1) status = "단종";
  else if (product.isPromo === 2) status = "1+1";
  else if (product.isPromo === 3) status = "2+1";

  const styles = {
    "판매중": { bgColor: "#D0EBFF", textColor: "#1D5795" },
    "단종": { bgColor: "#FFAFAF", textColor: "#A02929" },
    "1+1": { bgColor: "#C8E6C9", textColor: "#1B5E20" },
    "2+1": { bgColor: "#FFECB3", textColor: "#B36A00" }
  };

  return {
    label: status,
    backgroundColor: styles[status]?.bgColor || "#D0EBFF",
    color: styles[status]?.textColor || "#1D5795"
  };
};

const ProductsAllCom = ({ 
  products = [], 
  onRegister, 
  onEdit, 
  onDetail,
  currentPage = 0,
  totalPages = 0,
  totalItems = 0,
  onPageChange,
  onUpdateHQStock,
  isRecalculating = false,
  search = "",
  onSearch,
  filters = { sort: "", order: "asc" },
  onSortChange,
  error = null
}) => {
  // products가 배열인지 확인하고, 아니면 빈 배열로 설정
  const productList = Array.isArray(products) ? products : [];
  
  // 본사 스타일 기준 컬럼 정의
  const productColumns = [
    { id: 'productId', label: '제품번호', minWidth: 50 },
    { id: 'proName', label: '제품명', minWidth: 150 },
    { id: 'proStock', label: '매장재고', minWidth: 100 },
    { id: 'hqStock', label: '본사재고', minWidth: 100 },
    { id: 'proBarcode', label: '바코드', minWidth: 120 },
    { id: 'categoryName', label: '카테고리', minWidth: 120 },
    { id: 'recentStockInDate', label: '최근입고일', minWidth: 120 },
    { id: 'proCost', label: '공급가', minWidth: 100 },
    { id: 'proSellCost', label: '판매가', minWidth: 100 },
    { id: 'actions', label: '관리', minWidth: 150 }
  ];
  
  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  
  // 검색어 초기화 핸들러
  const handleClearSearch = () => {
    if (onSearch) onSearch('');
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ width: '90%', maxWidth: 2200, mx: 'auto', mt: 4, mb: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#2563A6',
            letterSpacing: '-1px',
            ml: 15
          }}>
            전체 제품 관리
            {isRecalculating && (
              <Typography component="span" sx={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                ml: 1,
                fontWeight: 'normal' 
              }}>
                (본사 재고 계산 중...)
              </Typography>
            )}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onRegister}
            sx={{
              backgroundColor: '#2563A6',
              '&:hover': { backgroundColor: '#1E5187' },
              borderRadius: '30px',
              px: 3,
              height: 40
            }}
          >
            상품 등록
          </Button>
        </Box>
      </Box>
      
      {/* 검색바 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'center', mb: 5 }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '30px',
            boxShadow: '0 2px 8px 0 rgba(85, 214, 223, 0.15)',
            border: '2px solid #55D6DF',
            bgcolor: '#fff',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 18 }}
            placeholder="제품명, 바코드, 카테고리 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            inputProps={{ 'aria-label': '검색' }}
          />
          {search && (
            <IconButton
              onClick={handleClearSearch}
              sx={{ p: '10px', color: '#55D6DF' }}
              aria-label="clear"
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton
            type="submit"
            sx={{ p: '10px', color: '#55D6DF' }}
            aria-label="search"
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Box>

      {/* 로딩 또는 에러 표시 */}
      {isRecalculating && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography variant="h6" sx={{ color: '#A02929' }}>{error}</Typography>
        </Box>
      )}

      {/* 데이터가 없을 때 */}
      {!isRecalculating && !error && productList.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {search ? '검색 결과가 없습니다.' : '제품 데이터가 없습니다.'}
          </Typography>
        </Box>
      )}

      {/* 테이블 */}
      {!isRecalculating && !error && productList.length > 0 && (
        <Box sx={{ width: '100%', maxWidth: 1300, mx: 'auto' }}>
          <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto', minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                {productColumns.map((column, idx) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: '#2563A6',
                      borderBottom: '1px solid #F5F5F5',
                      borderRight: idx < productColumns.length - 1 ? '1px solid #F5F5F5' : undefined,
                      bgcolor: '#fff',
                      px: 2,
                      minWidth: column.minWidth,
                      cursor: column.id !== 'actions' && onSortChange ? 'pointer' : 'default'
                    }}
                    onClick={() => column.id !== 'actions' && onSortChange && onSortChange(column.id)}
                  >
                    {column.label}
                    {filters && filters.sort === column.id && (
                      filters.order === 'asc' ? 
                        <ArrowUpwardIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} /> : 
                        <ArrowDownwardIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product, idx) => (
                <TableRow 
                  key={product.productId}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#f9fafc' },
                    '&:hover': { backgroundColor: '#F0F5FF' },
                  }}
                >
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {highlightText(String(product.productId), search)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => onDetail(product.productId)}>
                      {highlightText(product.proName, search)}
                    </span>
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {product.proStock}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {product.hqStock}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {highlightText(product.proBarcode, search)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {highlightText(product.categoryName || '-', search)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {product.recentStockInDate ? product.recentStockInDate.substring(0, 10) : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {product.proCost?.toLocaleString() || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    {product.proSellCost?.toLocaleString() || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2, borderBottom: '1px solid #F5F5F5' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={getStatusInfo(product).label}
                        sx={{
                          minWidth: 80,
                          justifyContent: 'center',
                          backgroundColor: getStatusInfo(product).backgroundColor,
                          color: getStatusInfo(product).color,
                          fontWeight: 'bold',
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(product.productId)}
                        sx={{
                          minWidth: 'unset',
                          px: 1,
                          py: 0.5,
                          fontSize: 12,
                          borderRadius: '12px',
                          borderColor: '#2563A6',
                          color: '#2563A6',
                          ml: 1,
                          '&:hover': {
                            borderColor: '#1E5187',
                            backgroundColor: 'rgba(37, 99, 166, 0.1)',
                          },
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onDetail(product.productId)}
                        sx={{
                          minWidth: 'unset',
                          px: 1,
                          py: 0.5,
                          fontSize: 12,
                          borderRadius: '12px',
                          borderColor: '#55D6DF',
                          color: '#2563A6',
                          ml: 1,
                          '&:hover': {
                            borderColor: '#1E5187',
                            backgroundColor: 'rgba(85, 214, 223, 0.1)',
                          },
                        }}
                      >
                        상세보기
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3} mb={2}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={(_, value) => onPageChange(value - 1)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
          
          {totalItems > 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              mt: 1,
              mb: 3,
              color: '#666',
              fontSize: 14
            }}>
              총 {totalItems}개의 제품 중 {(currentPage * 10) + 1} - {Math.min((currentPage + 1) * 10, totalItems)}번째 제품을 보고 있습니다.
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductsAllCom;