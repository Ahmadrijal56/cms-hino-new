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


// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import moment from "moment";
import { message, Modal, Button, Form, InputNumber, Select, TimePicker } from "antd";

const { Option } = Select;

function Swipe() {
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
  const [getTimer, setTimer] = useState(dayjs('00:00', 'mm:ss'));
  const [getName, setName] = useState("");
  const [getColumn, setColumn] = useState("");
  const columns = [
    { name: "no", align: "center" },
    { name: "nama board", align: "left", },
    { name: "waktu tayang", align: "center" },
    { name: "Edit", align: "center",  },
  ];
  
  const handleClose = () => setOpen(false);

  const onFinishFailed = (errorInfo) => {
    message.error("Failed: " + errorInfo);
  };

  //login via input
  const onFinish = async (values) => {
    setLoading(true);
    const article = {
      companycode: companyCode,
    };
    article[getColumn]=  await convertSecond(values.timer);
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      crudtype: isUpdate ? "update" : "insert",
    };
    console.log(article)
    await axios
      .post(process.env.REACT_APP_MAIN_API + "/new/crudconfig_timer", article, {
        headers,
      })
      .then(async (response) => {
        if ((await response.data) != null) {
          if (response.status === 200) {
            setTimer(dayjs('00:00', 'mm:ss'));
            setName("");
            setColumn("");
            setOpen(false);
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
        .catch((error) => {
          if(error.response.status===401){
            localStorage.clear();
            message.error(error + " Sesi telah habis,silahkan login kembali !");
            window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
          }else{
            message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
          }
        });
  };

  const convertSecond = async (values) =>{
    let checkVal=values.format('mm:ss');
    if (checkVal.indexOf(":") > -1){
      let time =  checkVal.split(":");
      let minutes=parseInt(time[0])*60
      let second=parseInt(time[1])
      return minutes+second
    }
    return 0
  }

  const convertTime = async(val) =>{
    let values=parseInt(val)
    let second=await values>=60?values%60:values
    let minutes= await (values-second)>=60?(values-second)/60:0
    return dayjs(minutes+':'+second, 'mm:ss')
  }

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
        if(selected!=""){
        await axios
          .get(process.env.REACT_APP_MAIN_API + "/new/config_timer/"+selected, {
            headers,
          })
          .then(async (response) => {
            if (response.status === 200) {
              //console.log(response)
              //setDataGrid(response.data)
              let dataMapping=[]
              let i=1
              await response.data.forEach(function async(item) {
                dataMapping.push({
                  no: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {i++}
                    </ArgonTypography>
                  ),
                  "nama board": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.name}
                    </ArgonTypography>
                  ),
                  "waktu tayang": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.display}
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
                })
              });

              setDataGrid(dataMapping);

              setLoading(false);
            } else {
              message.error("Invalid query");
              setLoading(false);
            }
          }).catch((error) => {
            if(error.response.status===401){
              localStorage.clear();
              message.error(error + " Sesi telah habis,silahkan login kembali !");
              window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
            }else{
              message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
            }
          });
        }else{
          setLoading(false);
          setDataGrid([])
        }
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
    setActive(item.active);
    setTimer(await convertTime(item.timer));
    setName(item.name);
    setColumn(item.column);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3} >
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3} >
              <ArgonBox>
                <ArgonTypography variant="h6">Timer Configs</ArgonTypography>
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
            style={{height:"500px"}}
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
      <Modal open={open} title={getName} onCancel={handleClose} key={keyHoliday} footer={null} maskClosable={false}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <br></br>

          <Form.Item
            label="Waktu Tayang"
            name="timer"
            rules={[
              {
                required: true,
                message: "Please input the time Service Perfromance - CPUS",
              },
            ]}
            initialValue={getTimer}
          >
             <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>

          <br></br>


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

export default Swipe;
