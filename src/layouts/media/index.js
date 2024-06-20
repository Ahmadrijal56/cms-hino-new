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
import dayjs from "dayjs";

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
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";


import qs from "qs";
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'

const { Option } = Select;

const columns = [
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
      multiple: 1,
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
    title: "Expiry Date",
    dataIndex: "expireddate",
    sorter: {
      compare: (a, b) => a.expireddate - b.expireddate,
      multiple: 1,
    },
  },
  {
    title: "Status",
    dataIndex: "statusUpdate",
    sorter: {
      compare: (a, b) => a.status - b.status,
      multiple: 1,
    },
  },
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
  const [openSort, setOpenSort] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState();
  const [orderBy, setOrderBy] = useState();
  const [orderField, setOrderField] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [publishDate, setPublishDate] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [typeMedia, setTypeMedia] = useState("");
  const [isApplyAll, setIsApplyAll] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaDesc, setMediaDesc] = useState("");
  const [isUpdate, setUpdate] = useState(false);
  const [defaultComp, setDefaultComp] = useState([]);
  const [id, setId] = useState([]);
  const [isTrash, setIsTrash] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [updateStatusId, setUpdateStatusId] = useState("");
  const [itemsOrder, setItemsOrder] = useState([])
  const [typeOrder, setTypeOrder] = useState("");
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

  const onSortEnd = (oldIndex, newIndex) => {
    setItemsOrder((array) => arrayMoveImmutable(array, oldIndex, newIndex))
  }


  const saveSort = async() => {
    var items=""
    itemsOrder.map((item) => {
      items+=item.id+","
    })

    const formData = new FormData();
    formData.append("companycode", companyCode);
    formData.append(typeOrder, "["+items.substring(0, items.length - 1)+"]");

    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };

    await axios
      .post(process.env.REACT_APP_MAIN_API + "/update_playing_media", formData, {
        headers,
      })
      .then(async (response) => {
        console.log(response);
        if ((await response.data) != null) {
          if (response.status === 200) {
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        message.error("Error upload file : " + error.message);
      });
  }



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

  const onChangeApply = (e) => {
    setIsApplyAll(e.target.checked);
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
    {
      key: "1",
      label: "MAIN",
    },
    {
      key: "2",
      label: "TRASH",
    },
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
      setKeyHoliday(keyHoliday + 1);
      setOpen(true);
      setUpdate(false);
      setIsApplyAll(false);
      setFileList([]);
      setMediaName("");
      setMediaDesc("");
      setTypeMedia("");
      // setDescription(item.description)
      // let date=moment(item.holidays_date)
      // setDefaultDate(date)
      setIsApplyAll(false);
      setPublishDate("");
      setExpiredDate("");
      setDefaultComp([]);
    }
  };
  const handleClose = () => setOpen(false);
  const handleCloseSort = () => setOpenSort(false);

  const onEdit = async (item) => {
    setId(item.id);
    setUpdate(true);
    setKeyHoliday(keyHoliday + 1);
    setMediaName(item.name);
    setMediaDesc(item.description);
    setTypeMedia(item.type);
    // setDescription(item.description)
    // let date=moment(item.holidays_date)
    // setDefaultDate(date)
    setIsApplyAll(item.applytoall);
    //let datePublish = moment(item.publishdate);
    setPublishDate(item.publishdate);
    //let dateExpired = moment(item.expireddate);
    setExpiredDate(item.expireddate);
    // setExpiredDate(item.expireddate.toString())

    let defaultCompValue = [];
    if (item.forcompanycode != null) {
      await item.forcompanycode.map(function (comp) {
        if (comp != null) {
          defaultCompValue.push(comp["companyname"] + "@==" + comp["companycode"]);
        }
      });
    }
    setDefaultComp(defaultCompValue);
    setOpen(true);
  };

  //login via input
  const onFinish = async (values) => {
    if (fileList.length == 0 && values.type != "text" && !isUpdate) {
      message.error("Please select file first");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("name", values.name);
    formData.append("text", values.description);
    formData.append("publishdate", moment(publishDate).format("YYYY-MM-DD"));
    formData.append("expireddate", moment(expiredDate).format("YYYY-MM-DD"));
    formData.append("status", true);
    formData.append("trash", false);
    formData.append("companycode", "Allcompany");
    if (values.type != "text") {
      fileList.forEach((file) => {
        formData.append("file", file);
      });
    }
    if (isApplyAll) {
      formData.append("applytoall", true);
    } else {
      var compActive = [];
      values.company.forEach((item) => {
        const company = item.split("@==");
        compActive.push(company[1].toString());
      });
      var text = JSON.stringify(compActive);
      formData.append("applytoall", false);
      formData.append("forcompanycode", text);
    }
    if (isUpdate) {
      formData.append("id_media", id);
    }

    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };
    var flag = isUpdate ? "update" : "upload";

    await axios
      .post(process.env.REACT_APP_MAIN_API + "/" + flag + "/media", formData, {
        headers,
      })
      .then(async (response) => {
        console.log(response);
        if ((await response.data) != null) {
          if (response.status === 200) {
            setSelectedDate("");
            setOpen(false);
            setLoading(false);
            message.success(response.data.message);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        message.error("Error upload file : " + error.message);
      });
  };

  const onDelete = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("trash", true);
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
            setUpdateStatusId(id + "-delete");
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
            setUpdateStatusId(item.id);
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
            setUpdateStatusId(id + "restore");
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
        query += "&dateFrom=" + dateFrom;
      }
      if (dateTo != "") {
        query += "&dateTo=" + dateTo;
      }
      if (searchText != "") {
        query += "&search=" + searchText;
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
            `/get/allmedia${urlTrash}/${companyCode}?${qs.stringify(
              getRandomuserParams(tableParams)
            )}` +
            query,
          {
            headers,
          }
        )
        .then(async (response) => {
          console.log(
            process.env.REACT_APP_MAIN_API +
              `/get/allmedia${urlTrash}/${companyCode}?${qs.stringify(
                getRandomuserParams(tableParams)
              )}` +
              query
          );
          const resp = await response.data.data.map(function (item) {
            return {
              ...item,
              Description: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                  {item.description}
                </ArgonTypography>
              ),
              statusUpdate: isTrash ? (
                <></>
              ) : (
                <ArgonTypography variant="caption" color="secondary" fontWeight="small" >

                  {item.status.toString() == "true"  ? ( <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    size="small"
                    checked
                    key={item.id_media}
                    onChange={() => {
                      onChangeStatus(item, false);
                    }}
                  />):(<Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    size="small"
                    value={item.status.toString() == "true" || item.status  ? true : false}
                    key={item.id_media}
                    onChange={() => {
                      onChangeStatus(item, true);
                    }}
                  />)}
                </ArgonTypography>
              ),
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
                      onDelete(item.id);
                    }}
                  >
                    delete
                  </Icon>
                  <Icon fontSize="small" className="iconAction" onClick={() => {}}>
                    visibility
                  </Icon>
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

  const onChangeType = (value) => {
    setTypeMedia(value);
  };

  const onChangePublishDate = (_, dateString) => {
    setPublishDate(dateString);
  };

  const onChangeExpiredDate = (_, dateString) => {
    setExpiredDate(dateString);
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
                  Media
                </ArgonTypography>
                <ArgonTypography variant="h6">List of Media</ArgonTypography>
              </ArgonBox>
              <ArgonBox>
              <ArgonButton
                  color="info"
                  size="small"
                  onClick={()=>{
                    setOpenSort(true);
                  }}
                >
                 Reorder Content
                </ArgonButton>
                <ArgonButton
                  color="info"
                  size="small"
                  onClick={handleOpen}
                  disabled={sessionStorage.getItem("companyDefault") == ""}
                  className="iconAction"
                >
                  Add Media
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
                  placeholder="Cari Media"
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
      <Modal open={openSort} title="Change order of Contents" onCancel={handleCloseSort}  footer={null} >
        <div class="sortModal">
        <Select onChange={onChangeFileSort} className="sortChoose" defaultValue="">
              <Select.Option value="" >Choose type</Select.Option>
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="image">Image</Select.Option>
              <Select.Option value="video">Video</Select.Option>
            </Select>
            
            <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
            {itemsOrder.map((item) => (
              <SortableItem key={item.id} >
                <div className="itemSort" key={item.id} value={item.id}>{item.name}</div>
              </SortableItem>
            ))}
          </SortableList>

          <Button type="primary" style={{marginTop:"20px"}} onClick={saveSort} disabled={itemsOrder.length ==0}>
              Save
            </Button>

        </div>
        
      </Modal>
      <Modal open={open} title="Media" onCancel={handleClose} key={keyHoliday} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name",
              },
            ]}
            initialValue={mediaName}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please input the type",
              },
            ]}
            initialValue={typeMedia}
          >
            <Select onChange={onChangeType}>
              <Select.Option value="text">Text</Select.Option>
              <Select.Option value="image">Image</Select.Option>
              <Select.Option value="video">Video</Select.Option>
            </Select>
          </Form.Item>

          {typeMedia == "text" ? (
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input the description",
                },
              ]}
              initialValue={mediaDesc}
            >
              <TextArea rows={4} />
            </Form.Item>
          ) : (
            <Form.Item label="File" name="video">
              <Upload {...props} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item
            label="Publish Date"
            name="publish_date"
            rules={[
              {
                required: true,
                message: "Please input the publish date",
              },
            ]}
            initialValue={publishDate==""?"":dayjs(publishDate, dateFormat)}
          >
            <DatePicker
              format={dateFormat}
              onChange={onChangePublishDate}
              defaultValue={publishDate==""?"":dayjs(publishDate, dateFormat)}
            />
          </Form.Item>

          <Form.Item
            label="Expired Date"
            name="expired_date"
            rules={[
              {
                required: true,
                message: "Please input the expired date",
              },
            ]}
            initialValue={expiredDate==""?"":dayjs(expiredDate, dateFormat)}
          >
            <DatePicker
              format={dateFormat}
              onChange={onChangeExpiredDate}
              defaultValue={expiredDate==""?"":dayjs(expiredDate, dateFormat)}
            />
          </Form.Item>

          <Form.Item label="Apply to All" name="applytoall">
            <Checkbox onChange={onChangeApply} checked={isApplyAll}></Checkbox>
          </Form.Item>

          {!isApplyAll ? (
            <Form.Item label="Company" name="company" initialValue={defaultComp}>
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
                placeholder="Company"
                onChange={onChangeTags}
                options={optionsComp}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {isUpdate ? "Edit" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}

export default Videos;
