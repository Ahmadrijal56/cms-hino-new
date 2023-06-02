/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.0
=========================================================

* Product Page: cms
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import axios from 'axios';

// Data
import authorsTableData from "layouts/holidays/data/authorsTableData";

function Holidays() {
  const [companyCode,setComapnyCode] = useState("104040000");
  const [loading,setLoading] = useState(false);
  const [dataGrid,setDataGrid] = useState([]);
  const { rows } = authorsTableData;
  const   columns= [
    { name: "holidays_date", align: "left" },
    { name: "description", align: "left" },
  ]

  useEffect(() => {

    async function loadData() {
      setLoading(true);
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      };
  
        try {
              await axios
                .get(process.env.REACT_APP_MAIN_API + "/allholiday/"+companyCode, {
                  headers,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                      setDataGrid(response.data)
  
                      // response.data.map(function (item) {
  
                      // });
  
                      setLoading(false);
                    } else {
                      alert("Invalid query");
                      setLoading(false);
                    }
                });
            } catch(error) {
                alert(error)
                setLoading(false)
              }
    }

    loadData();

  })

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Authors table</ArgonTypography>
            </ArgonBox>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={dataGrid} />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Holidays;
