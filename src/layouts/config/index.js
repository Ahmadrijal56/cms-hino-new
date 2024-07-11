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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import axios from "axios";
import moment from "moment";
import { message, Modal, Button, Form, InputNumber, Select, DatePicker, Checkbox } from "antd";

const { Option } = Select;

function Holidays() {
  const [companyDefault, setCompanyDefault] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataGrid, setDataGrid] = useState([]);
  const [open, setOpen] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState(0);
  const [outstandingWoLevel1, setOutstandingWoLevel1] = useState(0);
  const [outstandingWoLevel2, setOutstandingWoLevel2] = useState(0);
  const [outstandingSoLevel1, setOutstandingSoLevel1] = useState(0);
  const [outstandingSoLevel2, setOutstandingSoLevel2] = useState(0);
  const [warehouseLevel1, setWarehouseLevel1] = useState(0);
  const [warehouseLevel2, setWarehouseLevel2] = useState(0);
  const columns = [
    { name: "TIME_DISPLAY", align: "center" },
    { name: "OUTSTANDING_WO_LEVEL_1", align: "center" },
    { name: "OUTSTANDING_WO_LEVEL_2", align: "center" },
    { name: "OUTSTANDING_SO_LEVEL_1", align: "center" },
    { name: "OUTSTANDING_SO_LEVEL_2", align: "center" },
    { name: "WHAREHOUSE_LEVEL_1", align: "center" },
    { name: "WHAREHOUSE_LEVEL_2", align: "center" },
    { name: "Edit", align: "center" },
  ];

  const handleOpen = () => {
    if (companyCode == "") {
      message.error("Please choose company code first");
    } else {
      setDefaultDate("");
      setSelectedDate("");
      setDescription("");
      setTimeDisplay(0);
      setOutstandingSoLevel1(0);
      setOutstandingSoLevel2(0);
      setOutstandingWoLevel1(0);
      setOutstandingWoLevel2(0);
      setWarehouseLevel1(0);
      setWarehouseLevel2(0);
      setActive(true);
      setIsUpdate(false);
      setOpen(true);
      setKeyHoliday(keyHoliday + 1);
    }
  };
  const handleClose = () => setOpen(false);

  const onChangeDate = (date, dateString) => {
    console.log(dateString);
    setSelectedDate(dateString);
  };

  const onChangeStatus = (e) => {
    setActive(e.target.checked);
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Failed: " + errorInfo);
  };

  //login via input
  const onFinish = async (values) => {
    setLoading(true);
     // "companycode": 1234,
              // "time_display": 5,
              // "outstanding_wo_level_1": 10,
              // "outstanding_wo_level_1": 60,
              // "outstanding_so_level_1": 30,
              // "outstanding_so_level_2": 60,
              // "warehouse_level_1": 30,
              // "warehouse_level_2": 60
    const article = {
      companycode: companyCode,
      time_display: values.time_display,
      outstanding_wo_level_1: values.outstanding_wo_level_1,
      outstanding_wo_level_2: values.outstanding_wo_level_2,
      outstanding_so_level_1: values.outstanding_so_level_1,
      outstanding_so_level_2: values.outstanding_so_level_2,
      warehouse_level_1: values.warehouse_level_1,
      warehouse_level_2: values.warehouse_level_2,
    };
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      crudtype: isUpdate ? "insert" : "insert",
    };
    console.log(article)
    await axios
      .post(process.env.REACT_APP_MAIN_API_NEW + "/crudconfig", article, {
        headers,
      })
      .then(async (response) => {
        if ((await response.data) != null) {
          if (response.status === 200) {
            setSelectedDate("");
            setDescription("");
            setTimeDisplay(0);
            setOutstandingSoLevel1(0);
            setOutstandingSoLevel2(0);
            setOutstandingWoLevel1(0);
            setOutstandingWoLevel2(0);
            setWarehouseLevel1(0);
            setWarehouseLevel2(0);
            setOpen(false);
            setLoading(false);
            message.success(response.data.Message);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
        message.error(error + " (Config) Something Error !");
      });
  };

  useEffect(() => {
    async function loadCompany() {

      if (await companyDefault == "") {
        var compSession = await  sessionStorage.getItem("companyDefault");
        let select =  compSession.split("@==");
         setCompanyCode(select[0]);
         setCompanyName(select[1]);
         setCompanyDefault(compSession);
      } else {
        // alert(companyDefault)
        let select =  companyDefault.split("@==");
         setCompanyCode(select[0]);
         setCompanyName(select[1]);
        //loadData(select[0]);xs
      }
    }

    async function loadData(selected) {
      setLoading(true);
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };

      try {
        await axios
          .get(process.env.REACT_APP_MAIN_API_NEW + "/showconfig/" + selected, {
            headers,
          })
          .then(async (response) => {
            if (response.status === 200) {
              //console.log(response)
              //setDataGrid(response.data)

              const item = response.data;
              setDataGrid([
                {
                  TIME_DISPLAY: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.time_display}
                    </ArgonTypography>
                  ),
                  OUTSTANDING_WO_LEVEL_1: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.outstanding_wo_level_1}
                    </ArgonTypography>
                  ),
                  OUTSTANDING_WO_LEVEL_2: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.outstanding_wo_level_2}
                    </ArgonTypography>
                  ),
                  OUTSTANDING_SO_LEVEL_1: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.outstanding_so_level_1}
                    </ArgonTypography>
                  ),
                  OUTSTANDING_SO_LEVEL_2: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.outstanding_so_level_2}
                    </ArgonTypography>
                  ),
                  WHAREHOUSE_LEVEL_1: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.warehouse_level_1}
                    </ArgonTypography>
                  ),
                  WHAREHOUSE_LEVEL_2: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.warehouse_level_2}
                    </ArgonTypography>
                  ),
                  Edit: (
                    <ArgonButton
                      color="info"
                      size="small"
                      onClick={() => {
                        onEdit(item);
                      }}
                      disabled={item.companycode != selected}
                    >
                      Edit
                    </ArgonButton>
                  ),
                },
              ]);

              setLoading(false);
            } else {
              message.error("Invalid query");
              setLoading(false);
            }
          });
      } catch (error) {
        message.error(error);
        setLoading(false);
      }
    }

    if (!open) {
      if (companyCode == "") {
        loadCompany();
      }
        loadData(companyCode);
      
    }

    console.log("componentDidUpdateFunction");
  }, [open, companyCode, isDelete]);

  const onEdit = async (item) => {
    console.log(companyCode);
    setKeyHoliday(keyHoliday + 1);
    setIsUpdate(true);
    setDescription(item.description);
    let date = moment(item.holidays_date);
    setDefaultDate(date);
    setActive(item.active);
    setSelectedDate(date.format("YYYY-MM-DD"));
    setTimeDisplay(item.time_display);
    setOutstandingSoLevel1(item.outstanding_wo_level_1);
    setOutstandingSoLevel2(item.outstanding_wo_level_2);
    setOutstandingWoLevel1(item.outstanding_so_level_1);
    setOutstandingWoLevel2(item.outstanding_so_level_2);
    setWarehouseLevel1(item.warehouse_level_1);
    setWarehouseLevel2(item.warehouse_level_2);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonBox>
                <ArgonTypography variant="h6">Configs</ArgonTypography>
                 {companyList.length > 1 ? (
                  <Select
                    showSearch={true}
                    style={{ width: 320 }}
                    optionFilterProp="children"
                    onChange={async (value) => {
                      if (value != null) {
                        let select = await value.split("@==");
                        setCompanyCode(await select[0]);
                        setCompanyName(await select[1]);
                        //loadData(select[0]);
                      }
                    }}
                    defaultValue=""
                  >
                    <Option value="" selected>
                      Choose a Company
                    </Option>
                    {companyList}
                  </Select>
                ) : (
                  <ArgonTypography variant="h5">{companyName}</ArgonTypography>
                )}
              </ArgonBox>
              {/* <ArgonBox >
                <ArgonButton color="info" size="small" onClick={handleOpen} disabled={companyCode==""} >
                  Add Holiday
                </ArgonButton>
              </ArgonBox> */}
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
      <Modal open={open} title="Config" onCancel={handleClose} key={keyHoliday} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <Form.Item
            label="Time Display"
            name="time_display"
            rules={[
              {
                required: true,
                message: "Please input the time display",
              },
            ]}
            initialValue={timeDisplay}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Outstanding WO Level 1"
            name="outstanding_wo_level_1"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding WO Level 1",
              },
            ]}
            initialValue={outstandingWoLevel1}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item
            label="Outstanding WO Level 2"
            name="outstanding_wo_level_2"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding WO Level 2",
              },
            ]}
            initialValue={outstandingWoLevel2}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item
            label="Outstanding SO Level 1"
            name="outstanding_so_level_1"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding SO Level 1",
              },
            ]}
            initialValue={outstandingSoLevel1}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item
            label="Outstanding SO Level 2"
            name="outstanding_so_level_2"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding SO Level 2",
              },
            ]}
            initialValue={outstandingSoLevel2}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item
            label="Warehouse SO Level 1"
            name="warehouse_level_1"
            rules={[
              {
                required: true,
                message: "Please input the time Warehouse Level 1",
              },
            ]}
            initialValue={warehouseLevel1}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item
            label="Warehouse SO Level 2"
            name="warehouse_level_2"
            rules={[
              {
                required: true,
                message: "Please input the time Warehouse Level 2",
              },
            ]}
            initialValue={warehouseLevel2}
          >
            <InputNumber />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {isUpdate ? "Update" : "Add"} Config
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}

export default Holidays;
