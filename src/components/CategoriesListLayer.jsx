import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";
import Paginator from "./child/Paginator";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { navigatePage, NavigatePage } from "../helper/common/Navigation";
import { useDispatch } from "react-redux";

const CategoriesListLayer = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesListOld, setCategoriesListOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiRequest.get(Endpoints.GET_CATEGORIES);
    setLoading(false);
    if (response && response.data) {
      setCategoriesList(response.data.data);
      setCategoriesListOld(response.data.data)
    }
  };

  const onSearchValueChange = (evt) => {
    let value = evt.target.value.toLowerCase();
    if (value && categoriesListOld?.length > 0) {
      let filtered = categoriesListOld?.filter(
        (x) =>
          x.name.toLowerCase().includes(value) ||
          x.description.toLowerCase().includes(value)
      );
      setCategoriesList(filtered);
    } else {
      setCategoriesList(categoriesListOld);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, categoriesList?.length);
    return categoriesList?.slice(startIndex, endIndex);
  };

  const openDeletePopup = (userId) => {
    setSelectedId(userId)
    setShowPopup(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setShowPopup(false)
  }

  const handleConfirm = async () => {
    setPopupLoading(true)
    const result = await apiRequest.post(Endpoints.DELETE_CATEGORIES, {categoryId: selectedId});
    setPopupLoading(false)
    if(result?.data?.success){
      deleteFromUserData(selectedId)
    }
    setShowPopup(false)
  }

  const deleteFromUserData = (id) => {
    const filteredOld = categoriesListOld.filter((i) => i?.id !== id);
    setCategoriesListOld(filteredOld)
    const filtered = categoriesList.filter((i) => i?.id !== id);
    setCategoriesList(filtered)
  }
  return (
    <>
    <Modal
        show={showPopup}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={popupLoading} className="d-flex align-items-center"> 
            <ThreeDots
                height="20"
                width="20"
                radius="5"
                color="#fff"
                ariaLabel="loading"
                wrapperStyle={{ marginRight: 5 }}
                wrapperClass=""
                visible={popupLoading}
              />Confirm</Button>
        </Modal.Footer>
      </Modal>
      
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
        <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                    </select>
          <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              onChange={onSearchValueChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
          {/* <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            onChange={onStatusChange}
            defaultValue="Select Status"
          >
            <option value="Select Status">Select Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select> */} 
        </div>
        <Link
          to="/add-category"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={() => navigatePage(navigate, dispatch, "/add-category")}
          
        >
          <Icon
            icon="ic:baseline-plus"
            className="icon text-xl line-height-1"
          />
          Add New Category
        </Link>
      </div>
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center">
              <ThreeDots
                height="80"
                width="80"
                radius="5"
                color="#487FFF"
                ariaLabel="loading"
                wrapperStyle={{ marginRight: 5 }}
                wrapperClass=""
                visible={loading}
              />
            </div>
          ) : (
            <>
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr key={-1}>
                    {/* <th scope="col">
                      <div className="d-flex align-items-center gap-10">
                        S.no
                      </div>
                    </th> */}
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Show on dashboard</th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData()?.map((data, index) =>
                    <CategoryRow key={index} data={data} index={index} openDeletePopup={openDeletePopup}/>
                  )}
                </tbody>
              </table>
              <Paginator
                totalRows={categoriesList?.length}
                pageSize={pageSize}
                onPageChange={(currentPage) => {
                  setCurrentPage(currentPage);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

const CategoryRow = ({data, index, openDeletePopup}) => {
    
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const permissions = useSelector(state => state?.auth?.permissions)

  const editUserClicked = () => {
    navigatePage(navigate, dispatch, "/edit-category", {state :  data})
  }

  return (
    <tr key={index}>
      {/* <td>
        <div className="d-flex align-items-center gap-10">{index + 1}</div>
      </td> */}
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.name}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.description}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.showOnDashboard ? "Yes" : "No"}
        </span>
      </td>
    
      <td className="text-center">
        <div className="d-flex align-items-center gap-10 justify-content-center">
          {
            permissions?.includes("/edit-category") && <button
            type="button"
            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={editUserClicked}
            title="Edit Category"
            >
              <Icon icon="lucide:edit" className="menu-icon" />
            </button>
          }
          {
            permissions?.includes("/delete-category") &&
            <button
              type="button"
              className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={() => openDeletePopup(data?.id)}
              title="Delete Category"

            >
              <Icon icon="fluent:delete-24-regular" className="menu-icon" />
            </button>
          }
        </div>
      </td>
    </tr>
  );
};

export default CategoriesListLayer;
