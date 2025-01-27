import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Paginator = ({ totalRows, pageSize, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalRows / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li className="page-item" key={i}>
          <Link
            className={`page-link ${
              i === currentPage
                ? "bg-primary-600 text-white"
                : "bg-neutral-200 text-secondary-light"
            } fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md`}
            to="#"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pages;
  };

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
      <span>
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalRows)} of {totalRows} entries
      </span>
      <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
        <li className="page-item">
          <Link
            className={`page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md ${
              currentPage === 1 ? "disabled" : ""
            }`}
            to="#"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            <Icon icon="ep:d-arrow-left" />
          </Link>
        </li>
        {renderPageNumbers()}
        <li className="page-item">
          <Link
            className={`page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            to="#"
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
          >
            <Icon icon="ep:d-arrow-right" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Paginator;