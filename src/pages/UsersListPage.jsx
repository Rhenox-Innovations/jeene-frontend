import React, { useEffect, useState } from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersListLayer from "../components/UsersListLayer";
import { Endpoints } from "../helper/common/Endpoint";
import apiRequest from "../helper/axios";


const UsersListPage = () => {
  

  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users List" />

        {/* UsersListLayer */}
        <UsersListLayer />

      </MasterLayout>

    </>
  );
};

export default UsersListPage; 
