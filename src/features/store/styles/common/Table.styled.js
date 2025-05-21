import styled from 'styled-components';

export const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0,0,0,0.05);

    th, td {
        border-bottom: 1px solid #eaeaea;
        padding: 14px 10px;
        text-align: center;
    }

    thead {
        background-color: #f5f7fa;
        font-weight: bold;
        border-bottom: 2px solid #dcdcdc;
    }

    tbody tr:hover {
        background-color: #f9fbff;
    }

    td {
        word-break: keep-all;
    }

    td:first-child, th:first-child {
        padding-left: 12px;
    }

    td:last-child, th:last-child {
        padding-right: 12px;
    }
`;
