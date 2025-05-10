import { PaginationWrap, PageButton, PageNumber } from '../../../features/store/styles/common/StorePagination.styled';
import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;  // 페이지가 1개 이하면 안 보임

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <PaginationWrap>
            <PageButton
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ◀
            </PageButton>

            {pages.map((page) => (
                <PageNumber
                    key={page}
                    $active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </PageNumber>
            ))}

            <PageButton
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                ▶
            </PageButton>
        </PaginationWrap>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
