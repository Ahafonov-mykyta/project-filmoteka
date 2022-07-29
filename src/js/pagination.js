import Pagination from 'tui-pagination';

const container = document.getElementById('tui-pagination-container');

export default function getPagination(total, perPage) {
    const options = {
        totalItems: total,
        itemsPerPage: perPage,
        visiblePages: 5,
        centerAlign: true,
    };
    return new Pagination(container, options);
}
