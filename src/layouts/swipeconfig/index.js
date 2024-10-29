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
  const [timeServicePerformanceCpus, setTimeServicePerformanceCpus] = useState(dayjs('00:00', 'mm:ss'));
  const [timeServicePerformanceNonCpus, setTimeServicePerformanceNonCpus] = useState(dayjs('00:00', 'mm:ss'));
  const [timeSparepart, setTimeSparepart] = useState(dayjs('00:00', 'mm:ss'));
  const [timeOustandingWO, setTimeOustandingWO] = useState(dayjs('00:00', 'mm:ss'));
  const [timeOustandingSO, setTimeOustandingSO] = useState(dayjs('00:00', 'mm:ss'));
  const [timeWarehouse, setTimeWarehouse] = useState(dayjs('00:00', 'mm:ss'));
  const [timeImageDealerContent, setTimeImageDealerContent] = useState(dayjs('00:00', 'mm:ss'));
  const [timeDealerContent, setTimeDealerContent] = useState(dayjs('00:00', 'mm:ss'));
  const columns = [
    { name: "CPUS", align: "center" },
    { name: "NONCPUS", align: "center" },
    { name: "sparepart", align: "center" },
    { name: "oustanding wo", align: "center" },
    { name: "oustanding so", align: "center" },
    { name: "warehouse", align: "center" },
    { name: "DCB Image", align: "center" },
    { name: "DCB", align: "center" , onCell: (_, index) => ({
      colSpan: index === 1 ? 5 : 1,
    }),},
    { name: "Edit", align: "center",  },
  ];

  const handleOpen = () => {
    if (companyCode == "") {
      message.error("Please choose company code first");
    } else {
      setDefaultDate("");
      setSelectedDate("");
      setDescription("");
      setTimeServicePerformanceCpus(0);
      setTimeOustandingWO(0);
      setTimeOustandingSO(0);
      setTimeServicePerformanceNonCpus(0);
      setTimeSparepart(0);
      setTimeWarehouse(0);
      setTimeImageDealerContent(0);
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
              // "timer_service_performance_cpus": 5,
              // "timer_service_performance_noncpus": 10,
              // "timer_service_performance_noncpus": 60,
              // "timer_oustanding_wo": 30,
              // "timer_oustanding_so": 60,
              // "timer_warehouse": 30,
              // "timer_image_dealer_content": 60
    const article = {
      companycode: companyCode,
      timer_service_performance_cpus: await convertSecond(values.timer_service_performance_cpus),
      timer_service_performance_noncpus: await convertSecond(values.timer_service_performance_noncpus),
      timer_spare_part: await convertSecond(values.timer_spare_part),
      timer_oustanding_wo: await convertSecond(values.timer_oustanding_wo),
      timer_oustanding_so: await convertSecond(values.timer_oustanding_so),
      timer_warehouse: await convertSecond(values.timer_warehouse),
      timer_image_dealer_content: await convertSecond(values.timer_image_dealer_content),
      timer_dealer_content: await convertSecond(values.timer_dealer_content),
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
      .post(process.env.REACT_APP_MAIN_API + "/new/crudconfig_timer", article, {
        headers,
      })
      .then(async (response) => {
        if ((await response.data) != null) {
          if (response.status === 200) {
            setSelectedDate("");
            setDescription("");
            setTimeServicePerformanceCpus(dayjs('00:00', 'mm:ss'));
            setTimeOustandingWO(dayjs('00:00', 'mm:ss'));
            setTimeOustandingSO(dayjs('00:00', 'mm:ss'));
            setTimeServicePerformanceNonCpus(dayjs('00:00', 'mm:ss'));
            setTimeSparepart(dayjs('00:00', 'mm:ss'));
            setTimeWarehouse(dayjs('00:00', 'mm:ss'));
            setTimeImageDealerContent(dayjs('00:00', 'mm:ss'));
            setTimeDealerContent(dayjs('00:00', 'mm:ss'));
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

              const item = response.data;
              setDataGrid([
                {
                  CPUS: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_service_performance_cpus}
                    </ArgonTypography>
                  ),
                  NONCPUS: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_service_performance_noncpus}
                    </ArgonTypography>
                  ),
                  sparepart: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_spare_part}
                    </ArgonTypography>
                  ),
                  "oustanding wo": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_oustanding_wo}
                    </ArgonTypography>
                  ),
                  "oustanding so": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_oustanding_so}
                    </ArgonTypography>
                  ),
                  warehouse: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_warehouse}
                    </ArgonTypography>
                  ),
                  "DCB Image": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_image_dealer_content}
                    </ArgonTypography>
                  ),
                  "DCB": (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {item.timer_dealer_content}
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
    setDescription(item.description);
    let date = moment(item.holidays_date);
    setDefaultDate(date);
    setActive(item.active);
    setSelectedDate(date.format("YYYY-MM-DD"));
    setTimeServicePerformanceCpus(await convertTime(item.timer_service_performance_cpus));
    setTimeOustandingWO(await convertTime(item.timer_service_performance_noncpus));
    setTimeOustandingSO(await convertTime(item.timer_spare_part));
    setTimeServicePerformanceNonCpus(await convertTime(item.timer_oustanding_wo));
    setTimeSparepart(await convertTime(item.timer_oustanding_so));
    setTimeWarehouse(await convertTime(item.timer_warehouse));
    setTimeImageDealerContent(await convertTime(item.timer_image_dealer_content));
    setTimeDealerContent(await convertTime(item.timer_dealer_content));
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
            style={{height:"400px"}}
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
      <Modal open={open} title="Config Timer" onCancel={handleClose} key={keyHoliday} footer={null} maskClosable={false}>
        <Form
          name="basic"
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <Form.Item
            label="Service Proformance - CPUS"
            name="timer_service_performance_cpus"
            rules={[
              {
                required: true,
                message: "Please input the time Service Perfromance - CPUS",
              },
            ]}
            initialValue={timeServicePerformanceCpus}
          >
             <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>

          <Form.Item
            label="Service Perfromance - NON CPUS"
            name="timer_service_performance_noncpus"
            rules={[
              {
                required: true,
                message: "Please input the time Service Perfromance - NON CPUS",
              },
            ]}
            initialValue={timeServicePerformanceNonCpus}
          >
             <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>


          <Form.Item
            label="Spare Part"
            name="timer_spare_part"
            rules={[
              {
                required: true,
                message: "Please input the time Spare Part",
              },
            ]}
            initialValue={timeSparepart}
          >
             <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>


          <Form.Item
            label="Outstanding WO"
            name="timer_oustanding_wo"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding WO",
              },
            ]}
            initialValue={timeOustandingWO}
          >
            <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>


          <Form.Item
            label="Outstanding SO"
            name="timer_oustanding_so"
            rules={[
              {
                required: true,
                message: "Please input the time Outstanding SO",
              },
            ]}
            initialValue={timeOustandingSO}
          >
             <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>


          <Form.Item
            label="Warehouse "
            name="timer_warehouse"
            rules={[
              {
                required: true,
                message: "Please input the time Warehouse ",
              },
            ]}
            initialValue={timeWarehouse}
          >
            <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>


          <Form.Item
            label="Dealer Content Image"
            name="timer_image_dealer_content"
            rules={[
              {
                required: true,
                message: "Please input the time Dealer Content Image",
              },
            ]}
            initialValue={timeImageDealerContent}
          >
            <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
          </Form.Item>

          <Form.Item
            label="Dealer Content "
            name="timer_dealer_content"
            rules={[
              {
                required: true,
                message: "Please input the time Dealer Content",
              },
            ]}
            initialValue={timeDealerContent}
          >
            <TimePicker   format="mm:ss" showNow={false} needConfirm={false}/>
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

export default Swipe;
