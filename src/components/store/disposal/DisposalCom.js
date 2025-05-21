import React from "react";
import { Table } from "../../../features/store/styles/common/Table.styled";
import Pagination from "../common/Pagination";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import {
  PageWrapper,
  PageTitle,
  PageSection,
  FlexSectionWrapper,
} from "../../../features/store/styles/common/PageLayout";
import styled from "styled-components";

const SectionInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  table {
    flex: 1;
  }
`;

function DisposalCom({
                       expiredList,
                       disposalList,
                       loading,
                       onCancel,
                       expiredPage,
                       expiredTotalPages,
                       onExpiredPageChange,
                       disposalPage,
                       disposalTotalPages,
                       onDisposalPageChange,
                     }) {
  const handleCancelClick = (id) => {
    if (window.confirm(`폐기 ID ${id}를 정말 취소하시겠습니까?`)) {
      onCancel(id);
    }
  };

  return (
      <PageWrapper>
        <PageTitle>🗑️ 폐기 관리</PageTitle>
        <PageSection>
          <FlexSectionWrapper>
            {/* 좌측: 폐기 대상 자동 조회 */}
            <section>
              <h3 style={{marginBottom:"1rem"}}>폐기 대상 조회</h3>
              <SectionInner>
                <Table>
                  <thead>
                  <tr>
                    <th>재고ID</th>
                    <th>상품명</th>
                    <th>보유 수량</th>
                    <th>입고일</th>
                    <th>유통기한</th>
                  </tr>
                  </thead>
                  <tbody>
                  {expiredList.length > 0 ? (
                      expiredList.map((item) => (
                          <tr key={item.stockId}>
                            <td>{item.stockId}</td>
                            <td>{item.proName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.lastInDate?.slice(0, 10)}</td>
                            <td>{item.expiredDate?.slice(0, 10)}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan="5">폐기 대상 상품이 없습니다.</td>
                      </tr>
                  )}
                  </tbody>
                </Table>
                <Pagination
                    currentPage={expiredPage}
                    totalPages={expiredTotalPages}
                    onPageChange={onExpiredPageChange}
                />
              </SectionInner>
            </section>

            {/* 우측: 폐기 내역 전체 조회 */}
            <section>
              <h3 style={{marginBottom:"1rem"}} >폐기 내역 조회</h3>
              <SectionInner>
                <Table>
                  <thead>
                  <tr>
                    <th>폐기ID</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>사유</th>
                    <th>등록자</th>
                    <th>폐기일시</th>
                    <th>취소</th>
                  </tr>
                  </thead>
                  <tbody>
                  {disposalList.length > 0 ? (
                      disposalList.map((item) => (
                          <tr key={item.disposalId}>
                            <td>{item.disposalId}</td>
                            <td>{item.productName}</td>
                            <td>{item.disposalQuantity}</td>
                            <td>{item.disposalReason}</td>
                            <td>{item.processedBy}</td>
                            <td>{item.disposalDate?.slice(0, 16).replace("T", " ")}</td>
                            <td>
                              <PrimaryButton onClick={() => handleCancelClick(item.disposalId)}>
                                취소
                              </PrimaryButton>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan="7">등록된 폐기 내역이 없습니다.</td>
                      </tr>
                  )}
                  </tbody>
                </Table>
                <Pagination
                    currentPage={disposalPage}
                    totalPages={disposalTotalPages}
                    onPageChange={onDisposalPageChange}
                />
              </SectionInner>
            </section>
          </FlexSectionWrapper>
        </PageSection>
      </PageWrapper>
  );
}

export default DisposalCom;
