import React, { useEffect, useState } from "react";
import {
  PageWrapper,
  FilterActionRow,
  FilterGroup,
  ActionGroup,
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import StoreSearchBar from "../common/StoreSearchBar";
import styled from "styled-components";
import { MdPlaylistAddCheck } from "react-icons/md";
import Pagination from "../common/Pagination";
import LoadingLottie from '../../common/LoadingLottie.tsx';

const Input = styled.input`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 160px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const StyledSearchBar = styled.div`
  margin-bottom: -17px;

  svg {
    color: #444;
    font-size: 18px;
    vertical-align: middle;
  }
`;

const InventoryRegisterCom = ({
  loading,
  products = [],
  realQuantities = {},
  onQuantityChange,
  onRegister,
  partTimers = [],
  partTimerId,
  setPartTimerId,
  reason,
  setReason,
  onSearch,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  useEffect(() => {
    window.handleSearchInventory = (params) => {
      if (typeof onSearch === "function") {
        onSearch(params);
      }
    };
    return () => {
      delete window.handleSearchInventory;
    };
  }, [onSearch]);

  if (loading) {
    return <LoadingLottie />;
  }

  return (
    <PageWrapper>
        <h2 style={{ marginBottom: 16 }}>
        <MdPlaylistAddCheck style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        재고 실사 등록
        </h2>
      <FilterActionRow>
        <FilterGroup style={{ display: 'flex', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 500 }}>담당자</label><br />
            <select
              value={partTimerId}
              onChange={(e) => setPartTimerId(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', width: 160 }}
            >
              <option value="">담당자 선택</option>
              {partTimers.map((pt) => (
                <option key={pt.partTimerId} value={pt.partTimerId}>
                  {pt.partName} (ID: {pt.partTimerId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 500 }}>사유</label><br />
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="사유 입력"
            />
          </div>
        </FilterGroup>

        <SearchWrapper>
          <StyledSearchBar >
            <StoreSearchBar
              filterOptions={[
                {
                  key: "productName",
                  label: "상품명",
                  type: "text",
                  placeholder: "상품명 입력",
                },
                {
                  key: "barcode",
                  label: "바코드",
                  type: "text",
                  placeholder: "바코드 입력",
                },
              ]}
              onSearch={(params) => window.handleSearchInventory(params)}
            />
          </StyledSearchBar>
          <PrimaryButton onClick={onRegister} style={{ alignSelf: 'flex-end', marginTop: '26px' }}>
            <MdPlaylistAddCheck style={{ marginRight: '6px' }} /> 실사 등록
          </PrimaryButton>
        </SearchWrapper>
      </FilterActionRow>

      <Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>바코드</th>
            <th>현재 재고</th>
            <th>매장 실사</th>
            <th>창고 실사</th>
            <th>총 실사 수량</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const barcode = String(product.barcode);
            const storeValue = realQuantities[barcode]?.store || "";
            const warehouseValue = realQuantities[barcode]?.warehouse || "";
            const totalRealQty = (parseInt(storeValue || 0, 10)) + (parseInt(warehouseValue || 0, 10));

            return (
              <tr key={product.productId}>
                <td>{product.productName}</td>
                <td>{barcode}</td>
                <td>{product.totalQuantity}</td>
                <td>
                  <Input
                    type="number"
                    placeholder="매장"
                    value={storeValue}
                    onChange={(e) =>
                      onQuantityChange(barcode, "store", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    placeholder="창고"
                    value={warehouseValue}
                    onChange={(e) =>
                      onQuantityChange(barcode, "warehouse", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </td>
                <td style={{ fontWeight: "bold" }}>{totalRealQty}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <PaginationWrapper>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </PaginationWrapper>
    </PageWrapper>
  );
};

export default InventoryRegisterCom;
