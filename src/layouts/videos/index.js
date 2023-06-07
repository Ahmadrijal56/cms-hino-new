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
import { message,  Modal, Button, Form, Input, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

function Videos() {
  const [companyCode,setCompanyCode] = useState("");
  const [companyName,setCompanyName] = useState("");
  const [companyList,setCompanyList] = useState();
  const [loading,setLoading] = useState(false);
  const [dataGrid,setDataGrid] = useState([]);
  const [open, setOpen] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [fileList, setFileList] = useState([]);
  const   columns= [
    { name: "Description",  align: "center" },
    { name: "Path", align: "center" },
    { name: "Action", align: "center" },
  ]

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    onChange(info) {
      console.log(JSON.stringify(info))
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  
  const handleOpen = () => {
    if(companyCode==""){
      message.error("Please choose company code first")
    }else{
      setOpen(true);
      setKeyHoliday(keyHoliday+1);
      setFileList([]);
    }
  }
  const handleClose = () => setOpen(false);

  const onChangeDate=(date, dateString) => {
    setSelectedDate(dateString);
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Failed: '+ errorInfo);
  };

  //login via input
  const onFinish = async (values) => {
    if(fileList.length==0){
      message.error("Please choose video first")
      return
    }
    setLoading(true)
    const formData = new FormData();
    formData.append('companycode',companyCode)
    formData.append('description',values.description)
    fileList.forEach((file) => {
      formData.append('video', file);
    });
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      'crudtype': 'insert',
    };
    await axios
      .post(process.env.REACT_APP_MAIN_API + "/videos", formData, {
        headers,
      })
      .then(async (response) => {
        console.log(response)
        if (
          (await response.data) != null
        ) {
          if (response.status === 200)
           {
            setSelectedDate("");
            setOpen(false);
            setLoading(false)
            message.success(response.data.message)
           }
        }
      })
      .catch((error) => {
        console.log(error )
        setLoading(false)
        message.error("Error upload file : "+ error.message);
      });
     
 };

 const onDelete = async (id) => {
  setLoading(true)
  const headers = {
    "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + sessionStorage.getItem("token"),
    'crudtype': 'insert',
  };
  await axios
    .get(process.env.REACT_APP_MAIN_API + "/delete/video/"+id,{
      headers,
    })
    .then(async (response) => {
      console.log(response)
      if (
        (await response.data) != null
      ) {
        if (response.status === 200)
         {
          setSelectedDate("");
          setOpen(false);
          setLoading(false)
          message.success(response.data.message)
         }
      }
    })
    .catch((error) => {
      console.log(error )
      setLoading(false)
      message.error("Error delete file : "+ error.message);
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
                  <Option value={item} selected>
                    {company[1]}
                  </Option>
                );
              }
            });
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
                .get(process.env.REACT_APP_MAIN_API + "/get/video/"+selected, {
                  headers,
                })
                .then(async (response) => {
                    if (response.status === 200) {
                      //setDataGrid(response.data)
  
                      const resp =response.data.map(function ({item,onDelete}) {
                        return {
                          Description: (
                            <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                              {item.description}
                            </ArgonTypography>
                          ),
                          Path: <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                            {item.path}
                          </ArgonTypography>,
                          Action:
                          <ArgonButton color="info" size="small" onClick={()=>{onDelete(item.id)}}>
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

  },[open])


  

  

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
                 <ArgonTypography variant="h6">Videos</ArgonTypography>
                 { companyList >1 ?
                 (<Select
                  style={{ width: 320 }}
                  optionFilterProp="children"
                  onChange={async(value) => {
                    if (value != null) {
                      let select= await value[0].split("@==")
                      setCompanyCode(await select[0])
                      setCompanyName(await select[1])
                      loadData(select[0]);
                    }
                  }}
                >
                  {companyList}
                </Select>):(
                  <ArgonTypography variant="h5">{companyName}</ArgonTypography>
                )
                 }
                 
              </ArgonBox>
              <ArgonBox >
                <ArgonButton color="info" size="small" onClick={handleOpen} disabled={companyCode==""} >
                  Add a video
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
                    title="Video"
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
                    >
                      <Form.Item
                        label="Date"
                        name="date"
                      >
                        <Upload {...props} maxCount={1}>
                          <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
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
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                          Add a video
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
    </DashboardLayout>
  );
}

export default Videos;
