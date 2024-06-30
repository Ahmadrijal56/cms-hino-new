

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs, { Dayjs } from "dayjs";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";

import axios from "axios";
import moment from "moment";
import {
  message,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Tabs,
  Pagination,
  DatePicker,
  Table,
  Checkbox,
  Switch,
  Popover,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";


import qs from "qs";
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'

const { Option } = Select;

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    sorter: {
      compare: (a, b) => a.Date - b.Date,
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    sorter: {
      compare: (a, b) => a.description - b.description,
    },
  },
  // {
  //   title: "Publish Date",
  //   dataIndex: "publishdate",
  //   sorter: {
  //     compare: (a, b) => a.publishdate - b.publishdate,
  //     multiple: 1,
  //   },
  // },
  // {
  //   title: "Expiry Date",
  //   dataIndex: "expireddate",
  //   sorter: {
  //     compare: (a, b) => a.expireddate - b.expireddate,
  //     multiple: 1,
  //   },
  // },
  // {
  //   title: "Last Modify",
  //   dataIndex: "updated_at",
  //   sorter: {
  //     compare: (a, b) => a.updated_at - b.updated_at,
  //     multiple: 1,
  //   },
  // },
  // {
  //   title: "Status",
  //   dataIndex: "statusUpdate",
  //   sorter: {
  //     compare: (a, b) => a.status - b.status,
  //     multiple: 1,
  //   },
  // },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const columnsDelete = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name - b.name,
    },
  },
  {
    title: "Content",
    dataIndex: "description",
    sorter: {
      compare: (a, b) => a.description - b.description,
    },
  },
  {
    title: "Publish Date",
    dataIndex: "publishdate",
    sorter: {
      compare: (a, b) => a.publishdate - b.publishdate,
      multiple: 2,
    },
  },
  {
    title: "Last Modify",
    dataIndex: "updated_at",
    sorter: {
      compare: (a, b) => a.updated_at - b.updated_at,
      multiple: 1,
    },
  },
  {
    title: "Publish Date",
    dataIndex: "publishdate",
    sorter: {
      compare: (a, b) => a.publishdate - b.publishdate,
      multiple: 1,
    },
  },
  {
    title: "Expiry Date",
    dataIndex: "expireddate",
    sorter: {
      compare: (a, b) => a.expireddate - b.expireddate,
      multiple: 1,
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const { TextArea } = Input;
const optionsComp = [];

function Videos() {
  const [companyDefault, setCompanyDefault] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataGrid, setDataGrid] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState();
  const [orderBy, setOrderBy] = useState();
  const [orderField, setOrderField] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [publishDate, setPublishDate] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const [description, setDescription] = useState("");
  const [defaultComp, setDefaultComp] = useState([]);
  const [id, setId] = useState([]);
  const [isTrash, setIsTrash] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [updateStatusId, setIsUpdateStatusId] = useState("");
  const [itemsOrder, setItemsOrder] = useState([])
  const [typeOrder, setTypeOrder] = useState("");
  const [isActive, setActive] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: currentPage,
      pageSize: 5,
    },
  });

  const dateFormat = "YYYY-MM-DD";

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    sortBy: orderField,
    sortOrder: orderBy,
    //...params,
  });

  const onChange = (key) => {
    if (key == 2) {
      setIsTrash(true);
    } else {
      setIsTrash(false);
    }
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const onChangeTags = (pageNumber) => {
    console.log("Page: ", pageNumber);
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    setOrderField(sorter.field);
    setOrderBy((sorter.order ?? "").toString().replace("ascend", "asc").replace("descend", "desc"));
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    console.log("params", pagination, filters, sorter, extra);
  };

  const items = [
    // {
    //   key: "1",
    //   label: "MAIN",
    // },
    // {
    //   key: "2",
    //   label: "TRASH",
    // },
  ];

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
      console.log(JSON.stringify(info));
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleOpen = () => {
    if (sessionStorage.getItem("companyDefault") == "") {
      message.error("Please choose company code first");
    } else {
        setDefaultDate("");
        setSelectedDate("");
        setDescription("");
        setActive(true);
        setIsUpdate(false);
        setOpen(true);
        setKeyHoliday(keyHoliday+1);
    }
  };
  const handleClose = () => setOpen(false);

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

  const onFinishFailed = (errorInfo) => {
    message.error('Failed: '+ errorInfo);
  };

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

  const onChangeStatus = async (item,status) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("status", status);
    formData.append("id_media", item.id);

    console.log(!item.status);
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };

    await axios
      .post(process.env.REACT_APP_MAIN_API + "/update/media", formData, {
        headers,
      })
      .then(async (response) => {
        console.log(response);
        if ((await response.data) != null) {
          if (response.status === 200) {
            setIsUpdateStatusId(item.id);
            setSelectedDate("");
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        message.error("Error update : " + error.message);
      });
  };

  const onRestore = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("trash", false);
    formData.append("id_media", id);

    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };

    await axios
      .post(process.env.REACT_APP_MAIN_API + "/update/media", formData, {
        headers,
      })
      .then(async (response) => {
        console.log(response);
        if ((await response.data) != null) {
          if (response.status === 200) {
            setIsUpdateStatusId(id + "restore");
            setSelectedDate("");
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        message.error("Error update : " + error.message);
      });
  };

  const onTrash = async (id) => {
    setLoading(true);
    setIsDelete(true);
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };
    await axios
      .get(process.env.REACT_APP_MAIN_API + "/delete/media/" + id, {
        headers,
      })
      .then(async (response) => {
        console.log(response);
        if ((await response.data) != null) {
          if (response.status === 200) {
            setIsDelete(false);
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        message.error("Error delete file : " + error.message);
      });
  };

  const fetchData = () => {
    if (companyCode != "") {
      var urlTrash = isTrash ? "/trash" : "";
      var query = "";
      if (dateFrom != "") {
        query += "&from_date=" + dateFrom;
      }
      if (dateTo != "") {
        query += "&to_date=" + dateTo;
      }
      if (searchText != "") {
        query += "&description=" + searchText;
      }
      setLoading(true);
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };
      axios
        .get(
          process.env.REACT_APP_MAIN_API +
            `/allholiday${urlTrash}/${companyCode}?${qs.stringify(
              getRandomuserParams(tableParams)
            )}` +
            query,
          {
            headers,
          }
        )
        .then(async (response) => {
          const resp = await response.data.map(function (item) {
            return {
              ...item,
              Date: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                  {moment(item.holidays_date).format("DD MMM yyyy")}
                </ArgonTypography>
              ),
              Description: <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
              {item.description}
            </ArgonTypography>,
              Description: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                  {item.description}
                </ArgonTypography>
              ),
              // statusUpdate: isTrash ? (
              //   <></>
              // ) : (
              //   <ArgonTypography variant="caption" color="secondary" fontWeight="small" >

              //     {item.status.toString() == "true"  ? ( <Switch
              //       checkedChildren="Active"
              //       unCheckedChildren="Inactive"
              //       size="small"
              //       checked
              //       key={item.id_media}
              //       onChange={() => {
              //         onChangeStatus(item, false);
              //       }}
              //     />):(<Switch
              //       checkedChildren="Active"
              //       unCheckedChildren="Inactive"
              //       size="small"
              //       value={item.status.toString() == "true" || item.status  ? true : false}
              //       key={item.id_media}
              //       onChange={() => {
              //         onChangeStatus(item, true);
              //       }}
              //     />)}
              //   </ArgonTypography>
              // ),
              action: isTrash ? (
                <>
                  <Icon
                    fontSize="small"
                    className="iconAction"
                    onClick={() => {
                      onRestore(item.id);
                    }}
                  >
                    recycling
                  </Icon>
                  <Icon
                    fontSize="small"
                    className="iconAction"
                    onClick={() => {
                      onTrash(item.id);
                    }}
                  >
                    delete
                  </Icon>
                </>
              ) : (
                <>
                  <Icon
                    fontSize="small"
                    className="iconAction"
                    onClick={() => {
                      onEdit(item);
                    }}
                  >
                    edit
                  </Icon>
                  <Icon
                    fontSize="small"
                    className="iconAction"
                    onClick={() => {
                      onDelete(item);
                    }}
                  >
                    delete
                  </Icon>
                  {/* <Icon fontSize="small" className="iconAction" onClick={() => {}}>
                    visibility
                  </Icon> */}
                </>
              ),
            };
          });
          setData(resp);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: response.data.rowCount,
            },
          });
        });
    }
  };

  const contentFile = (
    <div>
      <p>Max 100 Mb</p>
      <p>Image(jpeg,png) and video (mp4)</p>
    </div>
  );

  const contentAll = (
    <div>
      <p>Apply to All Vendors/ Branchs</p>
    </div>
  );

  useEffect(() => {
    console.log(sessionStorage.getItem("companyDefault"));
    async function loadCompany() {
      var list = await JSON.parse(sessionStorage.getItem("companyList") || "[]");
      if (Array.isArray(list)) {
        var selectCompany = list.map(function (item) {
          if (item.indexOf("@==") > -1) {
            const company = item.split("@==");

            optionsComp.push({
              value: company[1] + "@==" + company[0],
              label: company[1],
            });
            return (
              <Option value={item} selected>
                {company[1]}
              </Option>
            );
          }
        });
        setCompanyList(selectCompany);
        if ((await list.length) == 1) {
          let select = await list[0].split("@==");
          setCompanyCode(await select[0]);
          setCompanyName(await select[1]);
          //loadData(select[0]);
        }
      }
    }

    if (!open) {
      if (companyDefault == "") {
        var compSession = sessionStorage.getItem("companyDefault");
        setCompanyDefault(compSession);
      } else {
        // alert(companyDefault)
        let select = companyDefault.split("@==");
        setCompanyCode(select[0]);
        setCompanyName(select[1]);
        //loadData(select[0]);xs
      }
      fetchData();
      loadCompany();
    }

    setLoading(false);
  }, [
    open,
    isDelete,
    companyCode,
    companyDefault,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    orderBy,
    isTrash,
    dateFrom,
    dateTo,
    searchText,
    updateStatusId,
  ]);

  useEffect(() => {
    if (companyDefault != "") {
      let select = companyDefault.split("@==");
      //loadData(select);
      setLoading(false);
    }

    console.log("componentDidUpdateFunction");
  }, [companyDefault]);

  const onChangeDateStart = (date, dateString) => {
    setDateFrom(dateString);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const onChangeDateTo = (date, dateString) => {
    setDateTo(dateString);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const clickSearch = (e) => {
    setSearchText(e.target.value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const onChangeFileSort = async (value) => {
    //setTypeMedia(value);
    if(value!=""){
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };
      await axios
        .get(process.env.REACT_APP_MAIN_API + "/get/media/104040000?type=" + value.toLowerCase(), {
          headers,
        })
        .then(async (response) => {
          console.log(response);
          if ((await response.data) != null) {
            if (response.status === 200) {
              setLoading(false);
              var mediaValue=[]
              response.data.forEach((item) => {
                mediaValue.push(item);
              });
              setItemsOrder(mediaValue)
              setTypeOrder(value.toLowerCase())
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          message.error("Error delete file : " + error.message);
        });
    }else{
      setItemsOrder([])
    }
  };

  const onChangeDate=(date, dateString) => {
    console.log(dateString)
    setSelectedDate(dateString);
  };


  return (
    <DashboardLayout>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card class="scroll">
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonBox>
                <ArgonTypography variant="h5" fontWeight="bold">
                  Holidays
                </ArgonTypography>
                <ArgonTypography variant="h6">List of Date</ArgonTypography>
              </ArgonBox>
              <ArgonBox>
                <ArgonButton
                  color="info"
                  size="small"
                  onClick={handleOpen}
                  disabled={sessionStorage.getItem("companyDefault") == ""}
                  className="iconAction"
                >
                  Add Date
                </ArgonButton>
              </ArgonBox>
            </ArgonBox>
            <ArgonBox p={3} pt={0} pb={0}>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} itemActiveColor="$ccc" />
            </ArgonBox>
            <ArgonBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              pt={0}
            >
              <ArgonBox p={3} pt={0} pl={0}>
                <span className="titleDate">From </span>
                <DatePicker onChange={onChangeDateStart} format={dateFormat} size="large" />
                <span className="titleDate"> To </span>
                <DatePicker onChange={onChangeDateTo} format={dateFormat} size="large" />
              </ArgonBox>
              <ArgonBox p={3} pt={0}>
                <Input
                  size="large"
                  placeholder="Cari"
                  prefix={<SearchOutlined />}
                  onPressEnter={clickSearch}
                />
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
              height="35vw"
            >
              {/* <Table columns={columns} rows={dataGrid} /> */}
              <Table
                columns={isTrash ? columnsDelete : columns}
                dataSource={data}
                onChange={onChangeTable}
                display={false}
                pagination={tableParams.pagination}
              />
              {/* <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChangePage} className={dataGrid.length==0?"pageNumberEmpty":"pageNumber"}  disabled={dataGrid.length==0? true:false}/> */}
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
                          {isUpdate ? 'Save Update': 'Add'} Holiday
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
    </DashboardLayout>
  );
}

export default Videos;
