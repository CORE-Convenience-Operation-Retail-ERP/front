import styled from 'styled-components';
import React from 'react';

export const PageWrapper = styled.div`
    padding: 40px 24px;
    background-color: #fff;
    min-height: 100%;
`;

export const PageTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    color: #111827;
`;

export const PageSection = styled.div`
    margin-bottom: 32px;
`;

export const FilterActionRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 24px;
`;

export const FilterGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
`;

export const ActionGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const SearchBarRow = styled.div`
    margin-bottom: 32px;
`;

export const TableWrapper = styled.div`
    margin-bottom: 32px;
`;

export const HighlightId = styled.span`
  font-weight: bold;
  color: #2563eb;
`;

export const FlexSectionWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: space-between;

  & > section {
    flex: 1 1 48%;
    min-width: 450px;
    display: flex;
    flex-direction: column;
    min-height: 600px;
  }
`;

export const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function PageLayout({ title, children }) {
    return (
        <PageWrapper>
            {title && <PageTitle>{title}</PageTitle>}
            {children}
        </PageWrapper>
    );
}