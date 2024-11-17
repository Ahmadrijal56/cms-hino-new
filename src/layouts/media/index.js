

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
  Popover,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import Switch from "react-switch";

import qs from "qs";
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'
import ReactPlayer from "react-player";

const { Option } = Select;
const { confirm } = Modal;
var _ = require('lodash');

const columns = [
  {
    title: "Nama",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name - b.name,
    },
  },
  {
    title: "Tipe",
    dataIndex: "type",
    sorter: {
      compare: (a, b) => a.type - b.type,
    },
  },
  {
    title: "Lokasi",
    dataIndex: "location"
  },
  {
    title: "Tanggal Publikasi",
    dataIndex: "publishdate",
    sorter: {
      compare: (a, b) => a.publishdate - b.publishdate,
      multiple: 1,
    },
  },
  {
    title: "Tanggal Kedaluwarsa",
    dataIndex: "expireddate",
    sorter: {
      compare: (a, b) => a.expireddate - b.expireddate,
      multiple: 1,
    },
  },
  {
    title: "Tanggal Perubahan",
    dataIndex: "updated_at",
    sorter: {
      compare: (a, b) => a.updated_at - b.updated_at,
      multiple: 1,
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: (Math.random() + 1).toString(36).substring(7),
    sorter: {
      compare: (a, b) => a.status - b.status,
      multiple: 1,
    },
  },
  {
    title: "Tindakan",
    dataIndex: "action",
  },
];

const columnsDelete = [
  {
    title: "Nama",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name - b.name,
    },
  },
  {
    title: "Tipe",
    dataIndex: "type",
    sorter: {
      compare: (a, b) => a.type - b.type,
    },
  },
  // {
  //   title: "Content",
  //   dataIndex: "description",
  //   sorter: {
  //     compare: (a, b) => a.description - b.description,
  //   },
  // },
  {
    title: "Tanggal Publikasi",
    dataIndex: "publishdate",
    sorter: {
      compare: (a, b) => a.publishdate - b.publishdate,
      multiple: 2,
    },
  },
  {
    title: "Tanggal Kedaluwarsa",
    dataIndex: "expireddate",
    sorter: {
      compare: (a, b) => a.expireddate - b.expireddate,
      multiple: 1,
    },
  },
  {
    title: "Tanggal Perubahan",
    dataIndex: "updated_at",
    sorter: {
      compare: (a, b) => a.updated_at - b.updated_at,
      multiple: 1,
    },
  },
  {
    title: "Tindakan",
    dataIndex: "action",
  },
];

const { TextArea } = Input;
const optionsComp = [];
let optionsCategory = [];
let optionsLocations = [];

function Videos() {
  const [companyDefault, setCompanyDefault] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
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
  const [typeMedia, setTypeMedia] = useState("text");
  const [location, setLocation] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [category, setCategory] = useState("");
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
  const [openView, setOpenView] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: currentPage,
      pageSize: 5,
    },
  });
  const [getSettingMaxFileImage, setSettingMaxFileImage] = useState("")
  const [getSettingMaxFileVideo, setSettingMaxFileVideo] = useState("")
  const [getSettingTooltipImage, setSettingMaxTooltipImage] = useState("")
  const [getSettingTooltipVideo, setSettingMaxTooltipVideo] = useState("")
  const [getMaxText, setMaxText] = useState(100)
  const [userType, setUserType] = useState("");

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
    formData.append((locationFilter=="Ruang Admin")?"allmedia":typeOrder, "["+items.substring(0, items.length - 1)+"]");

    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };

    let url= (locationFilter=="Ruang Admin")?"/update_playing_media_dcb":"/update_playing_media";
    await axios
      .post(process.env.REACT_APP_MAIN_API + url, formData, {
        headers,
      })
      .then(async (response) => {
        if ((await response.data) != null) {
          if (response.status === 200) {
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
    setOrderBy((sorter.order ?? "ascend").toString().replace("ascend", "asc").replace("descend", "desc"));
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
      label: "UTAMA",
    },
    {
      key: "2",
      label: "SAMPAH",
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
      var isErr=false
      const getMax= parseInt((typeMedia=="video" ? getSettingMaxFileVideo : getSettingMaxFileImage) ?? 1);
      const isLt2M = file.size / 1024 / 1024 < getMax;
      if (!isLt2M) {
        isErr=true
        message.error('File must smaller than '+( typeMedia =="video" ? getSettingMaxFileVideo : getSettingMaxFileImage )+' MB !');
      }else{
        if(typeMedia =="video"){
          const isPNG = file.type === 'video/mpeg';
          const isJPEG = file.type === 'video/mp4';
          const isJPG = file.type === ' video/*';
          if (!isPNG && !isJPEG && !isJPG) {
            isErr=true
            message.error(`${file.name} is not a video file`);
          }
        }else{
          const isPNG = file.type === 'image/png';
          const isJPEG = file.type === 'image/jpeg';
          const isJPG = file.type === 'image/jpg';
          if (!isPNG && !isJPEG && !isJPG) {
            isErr=true
            message.error(`${file.name} is not a (png/jpeg) file`);
          }
        }
      }
      if(!isErr){
        setFileList([file]);
      }
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

  const handleOpen = async() => {
    if (sessionStorage.getItem("companyDefault") == "") {
      message.error("Please choose company code first");
    } else {
      setKeyHoliday(keyHoliday + 1);
      setOpen(true);
      setUpdate(false);
      setFileList([]);
      setMediaName("");
      setMediaDesc("");
      setTypeMedia("text");
      setCategory("");
      setLocation("")
      // setDescription(item.description)
      // let date=moment(item.holidays_date)
      // setDefaultDate(date)
      setIsApplyAll(false);
      setPublishDate(moment().format("YYYY-MM-DD"));
      setExpiredDate(moment().add(1,'days').format("YYYY-MM-DD"));
      setDefaultComp([]);
      
      let defaultCompValue = [];
      if (userType.toString().toUpperCase()=='DEALER') {
            defaultCompValue.push(companyCode);
      }
      setDefaultComp(defaultCompValue);
    }
  };
  const handleClose = () => setOpen(false);
  const handleCloseSort = () => setOpenSort(false);
  const handleCloseView = () => setOpenView(false);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const onEdit = async (item) => {
    setId(item.id);
    setUpdate(true);
    setKeyHoliday(keyHoliday + 1);
    setMediaName(item.name);
    setMediaDesc(item.description);
    setTypeMedia(item.type);
    setLocation(item.content_location_media)
    setCategory(item.category_media)
    // setDescription(item.description)
    // let date=moment(item.holidays_date)
    // setDefaultDate(date)
    await setIsApplyAll(item.applytoall);
    //let datePublish = moment(item.publishdate);
    await setPublishDate(item.publishdate);
    //let dateExpired = moment(item.expireddate);
    await setExpiredDate(item.expireddate);
    // setExpiredDate(item.expireddate.toString())

    let defaultCompValue = [];
    if(item.applytoall=="false"){
      if (item.forcompanycode != null) {
        await item.forcompanycode.map(function (comp) {
          if (comp != null) {
            defaultCompValue.push(comp["companycode"]+"@=="+comp["companyname"]);
          }
        });
      }
    }
    setDefaultComp(defaultCompValue);

    let defaultLocValue = [];
    if (item.content_location_media!= null) {
      await item.content_location_media.map(function (comp) {
        if (comp != null) {
          defaultLocValue.push(comp["id"]);
        }
      });
    }
    setLocation(defaultLocValue);

    setOpen(true);
  };

  const onView = async (item) => {
    setId(item.id);
    setKeyHoliday(keyHoliday + 1);
    setMediaName(item.name);
    setMediaDesc(item.description);
    setTypeMedia(item.type);
    setOpenView(true);
  };

  //login via input
  const onFinish = async (values) => {
    if (fileList.length == 0 && values.type != "text" && !isUpdate) {
      message.error("Please select file first");
      return;
    }

    if(dayjs(expiredDate, dateFormat)<dayjs(publishDate, dateFormat)){
      message.error("Please input expiry date greather than publish date");
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
    formData.append("companycode", companyCode);
    formData.append("category_media", values.category);
    formData.append("content_location_media", JSON.stringify(values.location));
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
        let company = item.split("@==");
        compActive.push(company[0]);
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
        if(error.response.status===401){
          localStorage.clear();
          message.error(error + " Sesi telah habis,silahkan login kembali !");
          window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
        }else{
          message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
        }
      });
  };

  const onConfirm = async (id) => {
    confirm({
      title: 'Anda yakin ingin menghapus konten ini?',
      content: 'Data yang dihapus tidak akan kembali lagi',
      onOk() {
        onTrash(id);
      },
      onCancel() {
      },
    });
  }

  const onDelete = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("trash", true);
    formData.append("companycode", companyCode);
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
        if(error.response.status===401){
          localStorage.clear();
          message.error(error + " Sesi telah habis,silahkan login kembali !");
          window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
        }else{
          message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
        }
      });
  };

  const onChangeStatus = async (item,status) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("companycode", companyCode);
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
            fetchData()
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

  const onRestore = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("companycode", companyCode);
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
        if(error.response.status===401){
          localStorage.clear();
          message.error(error + " Sesi telah habis,silahkan login kembali !");
          window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
        }else{
          message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
        }
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
        if(error.response.status===401){
          localStorage.clear();
          message.error(error + " Sesi telah habis,silahkan login kembali !");
          window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
        }else{
          message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
        }
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
          const resp = await response.data.data.map(function  (item) {

            const switchChecked=  item.status.toString() =="true"  ? ( <Switch
              checked={true}
              key={item.id_media+moment()}
              onChange={() => {
                onChangeStatus(item, false);
              }}
            />
            ):(
              <><Switch
              checked={false}
              key={item.id_media+moment()}
              onChange={() => {
                onChangeStatus(item, true);
              }}
            />
            </>
            )

            var test=""
            item.content_location_media.map(function (comp) {
                test+=comp.description+", "
            })

            return {
              ...item,
              type: (
                <ArgonTypography variant="caption"  fontWeight="medium">
                  {item.type.toString().replace("text","Text").replace("image","Image").replace("video","Video")}
                </ArgonTypography>
              ),
              location: (
                <ArgonTypography variant="caption"  fontWeight="medium">
                  {test.slice(0, -2)}
                </ArgonTypography>
              ),
              Description: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                  {item.description}
                </ArgonTypography>
              ),
              publishdate: (
                <ArgonTypography variant="caption" fontWeight="medium">
                  {moment(item.publishdate).format("DD MMM yyyy")}
                </ArgonTypography>
              ),
              expireddate: (
                <ArgonTypography variant="caption" fontWeight="medium">
                  {moment(item.expireddate).format("DD MMM yyyy")}
                </ArgonTypography>
              ),
              updated_at: (
                <ArgonTypography variant="caption" fontWeight="medium">
                  {moment(item.updated_at).format("DD MMM yyyy")}
                </ArgonTypography>
              ),
              status: isTrash ? (
                <></>
              ) : (
                <>

                  {switchChecked}
                </>
              ),
              action: isTrash ? (
                <>
                 { item.created_by.toString().toUpperCase()=='HO' && userType.toString().toUpperCase()=='DEALER'  ? (<></>): (
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
                      onConfirm(item.id);;
                    }}
                  >
                    delete
                  </Icon>
                  </>)}
                </>
              ) : (
                <>
                { item.created_by.toString().toUpperCase()=='HO' && userType.toString().toUpperCase()=='DEALER'  ? (<></>): (
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
                  </>
                )
              }
                 
                  <Icon fontSize="small" className="iconAction" onClick={() => { onView(item);}}>
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
        }).catch((error) => {
          if(error.response.status===401){
            localStorage.clear();
            message.error(error + " Sesi telah habis,silahkan login kembali !");
            window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
          }else{
            message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
          }
        });;
    }
  };

  const contentFile = (
    <div>
      <p>Maksimal Ukuran File: { typeMedia =="video" ? getSettingMaxFileVideo : getSettingMaxFileImage } MB</p>
      <p> { typeMedia =="video" ? getSettingTooltipVideo : getSettingTooltipImage }</p>
    </div>
  );

  const contentAll = (
    <div>
      <p>Jika dicentang, konten dapat dilihat oleh semua perusahaan</p>
    </div>
  );

  useEffect(() => {
    async function loadCompany() {
      optionsComp.pop([]);
      var list = await JSON.parse(sessionStorage.getItem("companyList") || "[]");
      if (Array.isArray(list)) {
        if(optionsComp.length==0){
          var selectCompany = list.map(function (item) {
            if (item.indexOf("@==") > -1) {
              const company = item.split("@==");

              optionsComp.push({
                value: item,
                label: company[1],
              });
              // return (
              //   <Option value={item} selected>
              //     {company[1]}
              //   </Option>
              // );
            }
          });
          setCompanyList(selectCompany);
        } 
        if ((await list.length) == 1) {
          let select = await list[0].split("@==");
          setCompanyCode(await select[0]);
          setCompanyName(await select[1]);
          //loadData(select[0]);
        }
      }
    }

    async function loadCategory() {
     var valuesCat=[]
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };
      await axios
        .get(process.env.REACT_APP_MAIN + "/hmsi/board/api/category_media", {
          headers,
        })
        .then(async (response) => {
          console.log(response);
          if ((await response.data) != null) {
            if (response.status === 200) {
              await response.data.forEach((item) => {
                valuesCat.push({
                  value: item["category"],
                  label: item["category"],
                });
              });
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
        optionsCategory=valuesCat
    }

    async function loadLocation() {
      var valuesLoc=[]
       const headers = {
         "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
         "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
         "Content-Type": "multipart/form-data",
         Authorization: "Bearer " + sessionStorage.getItem("token"),
       };
       await axios
         .get(process.env.REACT_APP_MAIN + "/hmsi/board/api/location/getlist", {
           headers,
         })
         .then(async (response) => {
           console.log(response);
           if ((await response.data) != null) {
             if (response.status === 200) {
               await response.data.forEach((item) => {
                 valuesLoc.push({
                   value: item["id"],
                   label: item["description"],
                 });
               });
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
         optionsLocations=valuesLoc
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
      loadLocation();
    }



    if(optionsCategory.length==0){
      loadCategory();
    }

    if (getSettingMaxFileImage==""){
      callSettings();
    }

    if(userType==""){
      setUserType(sessionStorage.getItem("usertype"))
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
        .get(process.env.REACT_APP_MAIN_API + "/get/media/"+companyCode+"?type=" + value.toLowerCase(), {
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
          if(error.response.status===401){
            localStorage.clear();
            message.error(error + " Sesi telah habis,silahkan login kembali !");
            window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
          }else{
            message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
          }
        });
    }else{
      setItemsOrder([])
    }
  };

  const onChangeDcbSort = async (value) => {
    //setTypeMedia(value);
    if(value!=""){
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };
      await axios
        .get(process.env.REACT_APP_MAIN_API + "/get/media/dcb/"+companyCode+"?type=" + value.toLowerCase(), {
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
    }else{
      setItemsOrder([])
    }
  };

  const callSettings = async () => {
    //setTypeMedia(value);
      const headers = {
        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // this states the allowed methods
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      };
      await axios
        .get(process.env.REACT_APP_MAIN_API + "/media-config/all", {
          headers,
        })
        .then(async (response) => {
          console.log(response);
          if ((await response.data) != null) {
            if (await response.status === 200) {
              response.data.forEach(async (dataSetting) => {
                if (dataSetting.name_config=="MAX_FILE_IMAGE"){
                  setSettingMaxFileImage(await dataSetting.value.toString().replace("MB",""))
                  return
                }
                if (dataSetting.name_config=="MAX_FILE_VIDEO"){
                  setSettingMaxFileVideo(await dataSetting.value.toString().replace("MB",""))
                  return
                }
                if (dataSetting.name_config=="TOOLTIPS_IMAGE"){
                  setSettingMaxTooltipImage(dataSetting.value)
                  return
                }
                if (dataSetting.name_config=="TOOLTIPS_VIDEO"){
                  setSettingMaxTooltipVideo(dataSetting.value)
                  return
                }
                if (dataSetting.name_config=="MAX_TEXT"){
                  setMaxText(parseInt(dataSetting.value))
                  return
                }


              });
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

  const onChangeType = (value) => {
    setTypeMedia(value);
  };

  const onChangeLocation = (value) => {
    setLocation(value);
  };

  const onChangeLocationFilter = (value) => {
    setLocationFilter(value);
    setItemsOrder([])
    if (value=="Ruang Admin"){
      onChangeDcbSort(value)
    }
  };

  const onChangeCategory = (value) => {
    setCategory(value);
  };

  const onChangePublishDate = (_, dateString) => {
    setPublishDate(dateString);
  };

  const onChangeExpiredDate = (_, dateString) => {
    setExpiredDate(dateString);
  };

  const disabledDatePub = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().add(-1,'days').endOf('day');
  };

  const disabledDateExp= (current) => {
    // Can not select days before today and today
    return current && current < dayjs(publishDate, dateFormat).endOf('day');
  };

  const disabledDateTo= (current) => {
    // Can not select days before today and today
    return current && current < dayjs(dateFrom, dateFormat).endOf('day');
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
                <ArgonTypography variant="h6">Daftar Media</ArgonTypography>
              </ArgonBox>
              <ArgonBox>
              <ArgonButton
                  color="warning"
                  size="small"
                  onClick={()=>{
                    setOpenSort(true);
                  }}
                >
                Urutan Konten
                </ArgonButton>
                <ArgonButton
                  color="info"
                  size="small"
                  onClick={handleOpen}
                  disabled={sessionStorage.getItem("companyDefault") == ""}
                  className="iconAction"
                >
                 Tambah Media
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
                <span className="titleDate">Dari </span>
                <DatePicker onChange={onChangeDateStart} format={dateFormat} size="large" placeholder="Pilih Tanggal"/>
                <span className="titleDate"> Ke </span>
                <DatePicker onChange={onChangeDateTo} format={dateFormat} size="large"  disabledDate={disabledDateTo} placeholder="Pilih Tanggal"/>
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
                dataSource={_.cloneDeep(data)}
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
      <Modal open={openConfirm} title="Konfirmasi" onCancel={handleCloseConfirm} onOk={handleCloseConfirm} footer={null}  maskClosable={false}>
          Apakah anda yakin akan hapus data ini?
      </Modal>
      <Modal open={openSort} title="Pengaturan urutan kontent" onCancel={handleCloseSort}  footer={null} maskClosable={false} >
        <div class="sortModal">

           <Select onChange={onChangeLocationFilter} className="sortChoose" defaultValue=""  >
              <Select.Option value="" >Pilih Lokasi</Select.Option>
              <Select.Option value="Ruang Admin">Ruang Admin</Select.Option>
              <Select.Option value="Ruang Tunggu">Ruang Tunggu</Select.Option>
            </Select>

              {
                locationFilter==="Ruang Tunggu"  ?(
              <Select onChange={onChangeFileSort} className="sortChoose" defaultValue="">
                        <Select.Option value="" >Pilh Type</Select.Option>
                        <Select.Option value="text">Text</Select.Option>
                        <Select.Option value="image">Image</Select.Option>
                        <Select.Option value="video">Video</Select.Option>
                      </Select>
                  ): locationFilter=="" ? (<></>):(<div style={{width:450, marginTop:20, fontWeight:"bold"}}>Dealer Content Board</div>)
               } 
            
            
            <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
            {itemsOrder.map((item) => (
              <SortableItem key={item.id} >
                <div className="itemSort" key={item.id} value={item.id}>{item.name + (locationFilter==="Ruang Tunggu"? "" : " - ("+ item.type.toUpperCase()+")")}</div>
              </SortableItem>
            ))}
          </SortableList>

          <Button type="primary" style={{marginTop:"20px"}} onClick={saveSort} disabled={itemsOrder.length ==0}>
              Save
            </Button>

        </div>
        
      </Modal>
      <Modal open={open} title="Media" onCancel={handleClose} key={keyHoliday} footer={null} maskClosable={false}>
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

          <Form.Item label="Kategori" name="category" 
            rules={[
              {
                required: true,
                message: "Mohon Pilih Kategori",
              },
            ]}
            initialValue={category}>
              <Select
                style={{
                  width: "100%",
                }}
                onChange={onChangeCategory}
                options={optionsCategory}
              />
            </Form.Item>

            <Form.Item
            label={"Lokasi"}
            name="location"
            rules={[
              {
                required: true,
                message: "Mohon Pilih Lokasi",
              },
            ]}
            initialValue={isUpdate ? location : []}
          >
            <Select onChange={onChangeLocation} options={optionsLocations}
             mode="tags">
            </Select>
          </Form.Item>

          <Form.Item
            label="Tipe"
            name="type"
            rules={[
              {
                required: true,
                message: "Mohon Pilih Tipe",
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
            <>

<span style={{marginLeft:"33%", }}>Panjang Maksimal Deskripsi : {getMaxText}</span>
            <Form.Item
              label="Deskripsi"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Mohon isi data deskripsi",
                },
                {
                  max: getMaxText,
                  message: "Isi deksripsi harus dibawah "+getMaxText+" karakter huruf",
                },
              ]}
              initialValue={mediaDesc}
            >
              <TextArea rows={4}  />
            
            </Form.Item>
            </>
          ) : (
            <Form.Item label="File" name="video">
              <Popover content={contentFile} title="File" trigger="hover">
                <Upload {...props} maxCount={1} disabled={typeMedia==""}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Popover>
            </Form.Item>
          )}

          <Form.Item
            label="Tanggal Publikasi"
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
                      disabledDate={disabledDatePub}
                      defaultValue={publishDate==""?"":dayjs(publishDate, dateFormat)}
                    />
          </Form.Item>

          <Form.Item
            label="Tanggal Kedaluwarsa"
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
              disabledDate={disabledDateExp}
              value={dayjs(expiredDate, dateFormat)}
              defaultValue={expiredDate==""?"":dayjs(expiredDate, dateFormat)}
            />
          </Form.Item>

          {userType.toString().toUpperCase()=='DEALER' ? (<></>):(
            <Form.Item label="Terapkan ke semua" name="applytoall" >
           <Popover content={contentAll} title="Terapkan ke semua?" trigger="hover">
              <Checkbox onChange={onChangeApply} checked={isApplyAll.toString().toLowerCase()=="true"}></Checkbox>
            </Popover>
          </Form.Item>
          )}

          

          {!(isApplyAll.toString().toLowerCase()=="true") ? (
            <Form.Item label="Perusahaan" name="company" initialValue={defaultComp}>
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
                placeholder="Perusahaan"
                onChange={onChangeTags}
                options={optionsComp}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {isUpdate ? "Save Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={openView} title="Media" onCancel={handleCloseView} key={keyHoliday} footer={null} width={800} maskClosable={false}>
       

          {typeMedia == "video" ? (
            <>
            <ReactPlayer
                                      url={process.env.REACT_APP_MAIN+"/"+mediaDesc}
                                      playing={true}
                                      muted={true}
                                      loop={false}
                                      controls={true}
                                      width="100%"
                                      height="100%"
                                    />
            </>

          ) : typeMedia == "image" ? (
            <>
            <img src={process.env.REACT_APP_MAIN+"/"+mediaDesc} alt="person"  width="100%"/>
            </>

          ) : (
            <marquee>{mediaDesc}</marquee>
          )}

          
      </Modal>
    </DashboardLayout>
  );
}

export default Videos;
