import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CategoriesListLayer from "../components/CategoriesListLayer";


const CategoriesListPage = () => {
  

  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Categories List" />

        {/* UsersListLayer */}
        <CategoriesListLayer />

      </MasterLayout>

    </>
  );
};

export default CategoriesListPage; 
