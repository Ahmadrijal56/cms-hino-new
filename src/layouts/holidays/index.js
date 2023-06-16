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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import axios from 'axios';
import moment from 'moment';
import { message,  Modal, Button, Form, Input, Select, DatePicker, Checkbox } from 'antd';


const { Option } = Select;

function Holidays() {
  const [companyCode,setCompanyCode] = useState("");
  const [companyName,setCompanyName] = useState("");
  const [companyList,setCompanyList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [dataGrid,setDataGrid] = useState([]);
  const [open, setOpen] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isActive, setActive] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const   columns= [
    { name: "Date",  align: "center" },
    { name: "Description", align: "center" },
    { name: "Edit", align: "center" },
    { name: "Delete", align: "center" },
  ]
  
  const handleOpen = () => {
    if(companyCode==""){
      message.error("Please choose company code first")
    }else{
      setDefaultDate("");
      setSelectedDate("");
      setDescription("");
      setActive(true);
      setIsUpdate(false);
      setOpen(true);
      setKeyHoliday(keyHoliday+1);
    }
  }
  const handleClose = () => setOpen(false);

  const onChangeDate=(date, dateString) => {
    console.log(dateString)
    setSelectedDate(dateString);
  };

  const onChangeStatus= (e) => {
    setActive(e.target.checked)
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Failed: '+ errorInfo);
  };

  //login via input
  const onFinish = async (values) => {
    setLoading(true)
    const article = {
      CompanyCode: companyCode,
      Description: values.description,
      Holidays_date: selectedDate,
      Active:isActive
    };
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      'crudtype': isUpdate ? 'update':'insert',
    };
    await axios
      .post(process.env.REACT_APP_MAIN_API + "/holiday", article, {
        headers,
      })
      .then(async (response) => {
        if (
          (await response.data) != null
        ) {
          if (response.status === 200)
           {
            setSelectedDate("");
            setDescription("");
            setOpen(false);
            setLoading(false)
            message.success(response.data.Message)
           }
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error + " (Accumulation Monthly) Token not valid !");
      });
     
 };

  useEffect(() => {

     async function loadCompany() {
        var list=await JSON.parse(sessionStorage.getItem("companyList") || "[]");
            if (Array.isArray(list)) {
            
            var selectCompany = list.map(function(item) {
              if(item.indexOf("@==")>-1){
                const company= item.split("@==")
                return (
                  <Option value={item} key={item}>
                    {company[1]}
                  </Option>
                );
              }
            });
            console.log(selectCompany)
            setCompanyList(selectCompany)
            if (await list.length == 1){
              let select= await list[0].split("@==")
              setCompanyCode(await select[0])
              setCompanyName(await select[1])
              loadData(select[0]);
            }
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
                        .get(process.env.REACT_APP_MAIN_API + "/allholiday/"+selected, {
                          headers,
                        })
                        .then(async (response) => {
                            if (response.status === 200) {
                              //setDataGrid(response.data)
          
                              const resp =response.data.map(function (item) {
                                return {
                                  Date: (
                                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                                      {moment(item.holidays_date).format("DD MMM yyyy")}
                                    </ArgonTypography>
                                  ),
                                  Description: <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                                  {item.description}
                                </ArgonTypography>,
                                 Edit:
                                    <ArgonButton color="info" size="small" onClick={()=>{onEdit(item)}} disabled={item.companycode!=selected}>
                                          Edit
                                    </ArgonButton>,
                                 Delete: 
                                    <ArgonButton color="warning"  size="small" onClick={()=>{onDelete(item)}} disabled={item.companycode!=selected}>
                                      Delete 
                                    </ArgonButton>
                                }
          
                              });
                              setDataGrid(resp);
          
                              setLoading(false);
                            } else {
                              message.error("Invalid query");
                              setLoading(false);
                            }
                        });
                    } catch(error) {
                        message.error(error)
                        setLoading(false)
                      }
            }
        
      if (!open){
          if(companyCode==""){
            loadCompany()
          }else{
            loadData(companyCode)
          }
      }
      
    console.log("componentDidUpdateFunction");

  },[open,companyCode, isDelete])
  

  const onEdit = async (item) => {
    console.log(companyCode)
    setKeyHoliday(keyHoliday+1);
    setIsUpdate(true);
    setDescription(item.description)
    let date=moment(item.holidays_date)
    setDefaultDate(date)
    setActive(item.active)
    setSelectedDate(date.format("YYYY-MM-DD"))
    setOpen(true)

  }

  const onDelete = async (item) => {
    setLoading(true)
    setIsDelete(true)
    const article = {
      CompanyCode: companyCode,
      Description: item.description,
      Holidays_date: item.holidays_date,
      Active:isActive
    };
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      'crudtype': 'delete',
    };
    await axios
      .post(process.env.REACT_APP_MAIN_API + "/holiday", article, {
        headers,
      })
      .then(async (response) => {
        console.log(response)
        if (
          (await response.data) != null
        ) {
          if (response.status === 200)
           {
            setIsDelete(false)
            setLoading(false)
            message.success("done")
           }
        }
      })
      .catch((error) => {
        console.log(error )
        setLoading(false)
        message.error("Error delete file : "+ error.message);
      });

  }
  

  return (
    <DashboardLayout>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
               <ArgonBox >
                 <ArgonTypography variant="h6">Holidays</ArgonTypography>
                 { companyList.length >1 ?
                 (<Select
                  style={{ width: 320 }}
                  optionFilterProp="children"
                  onChange={async(value) => {
                    if (value != null) {
                      let select= await value.split("@==")
                      setCompanyCode(await select[0])
                      setCompanyName(await select[1])
                      //loadData(select[0]);
                    }
                  }}
                  defaultValue=""
                  >
                     <Option value="" selected>
                      Choose a Company
                    </Option>
                    <Option value="Allcompany@==Admin" selected>
                      All Company
                    </Option>
                  {companyList}
                </Select>):(
                  <ArgonTypography variant="h5">{companyName}</ArgonTypography>
                )
                 }
                 
              </ArgonBox>
              <ArgonBox >
                <ArgonButton color="info" size="small" onClick={handleOpen} disabled={companyCode==""} >
                  Add Holiday
                </ArgonButton>
              </ArgonBox>
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
                 <Modal
                    open={open}
                    title="Holiday"
                    onCancel={handleClose}
                    key={keyHoliday}
                    footer={null}
                  >
                    <Form
                      name="basic"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Please input the date",
                          },
                        ]}
                        initialValue={defaultDate}
                      >
                        <DatePicker onChange={onChangeDate}  format="YYYY-MM-DD" />
                      </Form.Item>

                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: "Please input the description",
                          },
                        ]}
                        initialValue={description}
                      >
                        <Input/>
                      </Form.Item>


                      <Form.Item
                        label="isActive"
                        name="isactive"
                        //initialValue={isactive  }
                        initialValue={isActive}
                      >
                        <Checkbox onChange={onChangeStatus} checked={isActive}></Checkbox>
                      </Form.Item>

                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                          {isUpdate ? 'Update': 'Add'} Holiday
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
    </DashboardLayout>
  );
}

export default Holidays;
