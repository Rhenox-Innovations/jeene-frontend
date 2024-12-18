import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";


const ErrorAlert = ({ message }) => {
  return (
    message && <div
      className="alert alert-danger bg-danger-100 text-danger-600 border-danger-100 px-24 py-11 fw-semibold text-md radius-8 d-flex align-items-center justify-content-between"
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        {message}
      </div>
    </div>
  );
};

export default ErrorAlert;