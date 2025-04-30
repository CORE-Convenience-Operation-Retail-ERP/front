import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  width: 130px;
  height: 120px;
  margin-right: 18.75px;
  border-radius: 12px;
  background-color: #f9fafb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #ede9fe;
    transform: translateY(-4px);
  }
`;

const IconWrap = styled.div`
  font-size: 28px;
  margin-bottom: 10px;
  color: #6b7280;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const MenuCard = ({ icon, label, to }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(to)}>
      <IconWrap>{icon}</IconWrap>
      <Label>{label}</Label>
    </Card>
  );
};

export default MenuCard;
