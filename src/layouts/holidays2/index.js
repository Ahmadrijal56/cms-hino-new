

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

const { Option } = Select;

const columns = [
  {
    title: "Tanggal",
    dataIndex: "holidays_date",
    sorter: {
      compare: (a, b) => a.Date - b.Date,
    },
  },
  {
    title: "Deskripsi",
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
    title: "Tindakan",
    dataIndex: "action",
  },
];

const columnsDelete = [
  {
    title: "",
    dataIndex: "name",
  },
  {
    title: "SERVICE",
    dataIndex: "service",
    align: 'center',
  },
  {
    title: "SPAREPART",
    dataIndex: "sparepart",
    align: 'center',
  },
  {
    title: "SALES",
    dataIndex: "sales",
    align: 'center',
  }
];

const optionsComp = [];

function Videos() {
  const arrMonth=['Bulan','January','February','March','April','May','June','July','August','September','October','November','December']                    
  const resetData={
        "service": {
            "january": {
                "sabtu": false,
                "minggu": false
            },
            "february": {
                "sabtu": false,
                "minggu": false
            },
            "march": {
                "sabtu": false,
                "minggu": false
            },
            "april": {
                "sabtu": false,
                "minggu": false
            },
            "may": {
                "sabtu": false,
                "minggu": false
            },
            "june": {
                "sabtu": false,
                "minggu": false
            },
            "july": {
                "sabtu": false,
                "minggu": false
            },
            "august": {
                "sabtu": false,
                "minggu": false
            },
            "september": {
                "sabtu": false,
                "minggu": false
            },
            "october": {
                "sabtu": false,
                "minggu": false
            },
            "november": {
                "sabtu": false,
                "minggu": false
            },
            "december": {
                "sabtu": false,
                "minggu": false
            }
        },
        "sparepart": {
            "january": {
                "sabtu": false,
                "minggu": false
            },
            "february": {
                "sabtu": false,
                "minggu": false
            },
            "march": {
                "sabtu": false,
                "minggu": false
            },
            "april": {
                "sabtu": false,
                "minggu": false
            },
            "may": {
                "sabtu": false,
                "minggu": false
            },
            "june": {
                "sabtu": false,
                "minggu": false
            },
            "july": {
                "sabtu": false,
                "minggu": false
            },
            "august": {
                "sabtu": false,
                "minggu": false
            },
            "september": {
                "sabtu": false,
                "minggu": false
            },
            "october": {
                "sabtu": false,
                "minggu": false
            },
            "november": {
                "sabtu": false,
                "minggu": false
            },
            "december": {
                "sabtu": false,
                "minggu": false
            }
        },
        "sales": {
            "january": {
                "sabtu": false,
                "minggu": false
            },
            "february": {
                "sabtu": false,
                "minggu": false
            },
            "march": {
                "sabtu": false,
                "minggu": false
            },
            "april": {
                "sabtu": false,
                "minggu": false
            },
            "may": {
                "sabtu": false,
                "minggu": false
            },
            "june": {
                "sabtu": false,
                "minggu": false
            },
            "july": {
                "sabtu": false,
                "minggu": false
            },
            "august": {
                "sabtu": false,
                "minggu": false
            },
            "september": {
                "sabtu": false,
                "minggu": false
            },
            "october": {
                "sabtu": false,
                "minggu": false
            },
            "november": {
                "sabtu": false,
                "minggu": false
            },
            "december": {
                "sabtu": false,
                "minggu": false
            }
        },
        "totalwork_service": {
            "january": "0",
            "february": "0",
            "march": "0",
            "april": "0",
            "may": "0",
            "june": "0",
            "july": "0",
            "august": "0",
            "september": "0",
            "october": "0",
            "november": "0",
            "december": "30"
        },
        "totalwork_sparepart": {
            "january": "0",
            "february": "0",
            "march": "0",
            "april": "0",
            "may": "0",
            "june": "0",
            "july": "0",
            "august": "0",
            "september": "0",
            "october": "0",
            "november": "0",
            "december": "30"
        },
        "totalwork_sales": {
            "january": "0",
            "february": "0",
            "march": "0",
            "april": "0",
            "may": "0",
            "june": "0",
            "july": "0",
            "august": "0",
            "september": "0",
            "october": "0",
            "november": "0",
            "december": "30"
        }
    }
  const [allData, setAllData] = useState(resetData);
  const [companyDefault, setCompanyDefault] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [keyHoliday, setKeyHoliday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [data, setData] = useState();
  const [orderBy, setOrderBy] = useState();
  const [orderField, setOrderField] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [defaultDate, setDefaultDate] = useState("");
  const [description, setDescription] = useState("");
  const [defaultComp, setDefaultComp] = useState([]);
  const [idHoliday, setIdHoliday] = useState(0);
  const [id, setId] = useState([]);
  const [isTrash, setIsTrash] = useState(false);
  const [isWeekday, setIsWeekday] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [yearFrom, setYearFrom] = useState(moment().format("YYYY"));
  const [dateTo, setDateTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [updateStatusId, setIsUpdateStatusId] = useState("");
  const [isActive, setActive] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isChanges, setIsChanges] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: currentPage,
      pageSize: 5,
    },
  });
  const [bottom, SetBottom] = useState('none');

  const dateFormat = "YYYY-MM-DD";
  const dateFormatYear = "YYYY";

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    sortBy: orderField,
    sortOrder: orderBy,
    //...params,
  });

  const onChange = (key) => {
    if (key == 2) {
      setIsWeekday(true);
    } else {
      setIsWeekday(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
    }
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    if( sorter.field !=undefined){
      setOrderField(sorter.field);
    }
    setOrderBy((sorter.order ?? "ascend").toString().replace("ascend", "asc").replace("descend", "desc"));
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const items = [
    {
      key: "1",
      label: "NATIONAL / COMPANY HOLIDAY",
    },
    {
      key: "2",
      label: "Work Day",
    },
  ];


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
    setKeyHoliday(keyHoliday+1);
    setIsUpdate(true);
    setDescription(item.description)
    let date=moment(item.holidays_date)
    setIdHoliday(item.id)
    setDefaultDate(date)
    setActive(item.active)
    setSelectedDate(date.format("YYYY-MM-DD"))
    setOpen(true)

  }

  //login via input
  const onFinish = async (values) => {
    setLoading(true)
    const article = {
      id: idHoliday,
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
        if(error.response.status===401){
          localStorage.clear();
          message.error(error + " Sesi telah habis,silahkan login kembali !");
          window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
        }else{
          message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
        }
      });
  };


  //login via input
  const onUpdateHoliday = async () => {
    setLoading(true)
    const article = {
      companycode: companyCode,
      tahun: yearFrom,
      service: {
        january: "["+(allData["service"]["january"]["sabtu"]?"sabtu":"")+","+(allData["service"]["january"]["minggu"]?"minggu":"")+"]",
        february:  "["+(allData["service"]["february"]["sabtu"]?"sabtu":"")+","+(allData["service"]["february"]["minggu"]?"minggu":"")+"]",
        march:  "["+(allData["service"]["march"]["sabtu"]?"sabtu":"")+","+(allData["service"]["march"]["minggu"]?"minggu":"")+"]",
        april:  "["+(allData["service"]["april"]["sabtu"]?"sabtu":"")+","+(allData["service"]["april"]["minggu"]?"minggu":"")+"]",
        may:  "["+(allData["service"]["may"]["sabtu"]?"sabtu":"")+","+(allData["service"]["may"]["minggu"]?"minggu":"")+"]",
        june:  "["+(allData["service"]["june"]["sabtu"]?"sabtu":"")+","+(allData["service"]["june"]["minggu"]?"minggu":"")+"]",
        july:  "["+(allData["service"]["july"]["sabtu"]?"sabtu":"")+","+(allData["service"]["july"]["minggu"]?"minggu":"")+"]",
        august:  "["+(allData["service"]["august"]["sabtu"]?"sabtu":"")+","+(allData["service"]["august"]["minggu"]?"minggu":"")+"]",
        september:  "["+(allData["service"]["september"]["sabtu"]?"sabtu":"")+","+(allData["service"]["september"]["minggu"]?"minggu":"")+"]",
        october:  "["+(allData["service"]["october"]["sabtu"]?"sabtu":"")+","+(allData["service"]["october"]["minggu"]?"minggu":"")+"]",
        november:  "["+(allData["service"]["november"]["sabtu"]?"sabtu":"")+","+(allData["service"]["november"]["minggu"]?"minggu":"")+"]",
        december:  "["+(allData["service"]["december"]["sabtu"]?"sabtu":"")+","+(allData["service"]["december"]["minggu"]?"minggu":"")+"]",
      },
      sparepart: {
        january: "["+(allData["sparepart"]["january"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["january"]["minggu"]?"minggu":"")+"]",
        february:  "["+(allData["sparepart"]["february"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["february"]["minggu"]?"minggu":"")+"]",
        march:  "["+(allData["sparepart"]["march"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["march"]["minggu"]?"minggu":"")+"]",
        april:  "["+(allData["sparepart"]["april"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["april"]["minggu"]?"minggu":"")+"]",
        may:  "["+(allData["sparepart"]["may"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["may"]["minggu"]?"minggu":"")+"]",
        june:  "["+(allData["sparepart"]["june"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["june"]["minggu"]?"minggu":"")+"]",
        july:  "["+(allData["sparepart"]["july"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["july"]["minggu"]?"minggu":"")+"]",
        august:  "["+(allData["sparepart"]["august"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["august"]["minggu"]?"minggu":"")+"]",
        september:  "["+(allData["sparepart"]["september"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["september"]["minggu"]?"minggu":"")+"]",
        october:  "["+(allData["sparepart"]["october"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["october"]["minggu"]?"minggu":"")+"]",
        november:  "["+(allData["sparepart"]["november"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["november"]["minggu"]?"minggu":"")+"]",
        december:  "["+(allData["sparepart"]["december"]["sabtu"]?"sabtu":"")+","+(allData["sparepart"]["december"]["minggu"]?"minggu":"")+"]",
      },
      sales: {
        january: "["+(allData["sales"]["january"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["january"]["minggu"]?"minggu":"")+"]",
        february:  "["+(allData["sales"]["february"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["february"]["minggu"]?"minggu":"")+"]",
        march:  "["+(allData["sales"]["march"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["march"]["minggu"]?"minggu":"")+"]",
        april:  "["+(allData["sales"]["april"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["april"]["minggu"]?"minggu":"")+"]",
        may:  "["+(allData["sales"]["may"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["may"]["minggu"]?"minggu":"")+"]",
        june:  "["+(allData["sales"]["june"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["june"]["minggu"]?"minggu":"")+"]",
        july:  "["+(allData["sales"]["july"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["july"]["minggu"]?"minggu":"")+"]",
        august:  "["+(allData["sales"]["august"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["august"]["minggu"]?"minggu":"")+"]",
        september:  "["+(allData["sales"]["september"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["september"]["minggu"]?"minggu":"")+"]",
        october:  "["+(allData["sales"]["october"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["october"]["minggu"]?"minggu":"")+"]",
        november:  "["+(allData["sales"]["november"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["november"]["minggu"]?"minggu":"")+"]",
        december:  "["+(allData["sales"]["december"]["sabtu"]?"sabtu":"")+","+(allData["sales"]["december"]["minggu"]?"minggu":"")+"]",
      }
    };
    const headers = {
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": "POST", // this states the allowed methods
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    };
    await axios
      .post(process.env.REACT_APP_MAIN_API + "/holidays/new", article, {
        headers,
      })
      .then(async (response) => {
        if (
          (await response.data) != null
        ) {
          if (response.status === 200 || response.status === 201)
           {
            fetchData(yearFrom,true);
            setOpen(false);
            setLoading(false)
            message.success(response.data.message)
            setIsChanges(false)
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
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      'crudtype': 'delete',
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
            setIsDelete(false)
            setLoading(false)
            message.success("done")
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

  const onChangeCheckBox = async(e, type, month, week,showData) => {
    setLoading(true);
    let data=showData;
    data[type][month][week]=e.target.checked;
    setAllData(data)
     await fetchData(yearFrom,false,data)
     setLoading(false);
     setIsChanges(true);
  };


  const onChangeCheckBoxAll = async(e, type, week,showData) => {
    setLoading(true);
    let data=showData;
    arrMonth.map(function (item) {
      if(item!="Bulan"){
        data[type][item.toLowerCase()][week]=e.target.checked;
      }
    });
    setAllData(data)
     await fetchData(yearFrom,false,data)
     setLoading(false);
     setIsChanges(true);
  };

  const fetchData = async(date, isLoad, showAll) => {
    if (companyCode != "") {
      if (isWeekday){

        let dataShow=showAll;
        if(isLoad){
              setAllData(resetData)
              const article = {
                companycode: companyCode,
                tahun: date,
              };
              const headers = {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              };
              await axios
                .post(
                  process.env.REACT_APP_MAIN_API +`/holidays/new/get`,
                  article,
                  {
                    headers,
                  }
                )
                .then(async (response) => {
                    setAllData(await response.data.data);
                    dataShow=response.data.data;
                });
        }


        let countServiceSabtu=0
        let countServiceMinggu=0
        let countSparepartSabtu=0
        let countSparepartMinggu=0
        let countSalesSabtu=0
        let countSalesMinggu=0
        arrMonth.map(function (item) {
          if(item!="Bulan"){

            if(dataShow["service"][item.toLowerCase()]["sabtu"]==true){
              countServiceSabtu++
            }
            if(dataShow["service"][item.toLowerCase()]["minggu"]==true){
              countServiceMinggu++
            }
            if(dataShow["sparepart"][item.toLowerCase()]["sabtu"]==true){
              countSparepartSabtu++
            }
            if(dataShow["sparepart"][item.toLowerCase()]["minggu"]==true){
              countSparepartMinggu++
            }
            if(dataShow["sales"][item.toLowerCase()]["sabtu"]==true){
              countSalesSabtu++
            }
            if(dataShow["sales"][item.toLowerCase()]["minggu"]==true){
              countSalesMinggu++
            }

          }
        });
              
                     const resp =   arrMonth.map(function (item) {
                        return {
                          name: <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                            <b>{item}</b>
                          </ArgonTypography>,
                          service: <>
                          {item=="Bulan"? (<div >
                              <Checkbox onChange={(e) =>onChangeCheckBoxAll(e,"service","sabtu",dataShow)}  className="textHeader" checked={countServiceSabtu==12}>Sabtu</Checkbox>
                              <Checkbox  onChange={(e) =>onChangeCheckBoxAll(e,"service","minggu",dataShow)}  className="textHeader" checked={countServiceMinggu==12}>Minggu</Checkbox>
                              <div className="totalhk">Total HK</div>
                            </div>):(<>
                              <Checkbox onChange={(e) =>onChangeCheckBox(e,"service",item.toLocaleLowerCase(),"sabtu",dataShow)} className="textWhite"   checked={dataShow["service"][item.toLocaleLowerCase()]["sabtu"]==undefined?false:dataShow["service"][item.toLocaleLowerCase()]["sabtu"]}>sabtu</Checkbox>
                              <Checkbox  onChange={(e) =>onChangeCheckBox(e,"service",item.toLocaleLowerCase(),"minggu",dataShow)} className="textWhite" checked={dataShow["service"][item.toLocaleLowerCase()]["minggu"]==undefined?false:dataShow["service"][item.toLocaleLowerCase()]["minggu"]}>Minggu</Checkbox>
                              <div className="totalhk2">{dataShow["totalwork_service"][item.toLocaleLowerCase()]}</div>
                            </>)}
                          </>,
                          sparepart: <>
                          {item=="Bulan"? (<div >
                            <Checkbox onChange={(e) =>onChangeCheckBoxAll(e,"sparepart","sabtu",dataShow)}  className="textHeader" checked={countSparepartSabtu==12} >Sabtu</Checkbox>
                            <Checkbox  onChange={(e) =>onChangeCheckBoxAll(e,"sparepart","minggu",dataShow)}  className="textHeader" checked={countSparepartMinggu==12} >Minggu</Checkbox>
                              <div className="totalhk">Total HK</div>
                            </div>):(<>
                              <Checkbox onChange={(e) =>onChangeCheckBox(e,"sparepart",item.toLocaleLowerCase(),"sabtu",dataShow)} className="textWhite"   checked={dataShow["sparepart"][item.toLocaleLowerCase()]["sabtu"]==undefined?false:dataShow["sparepart"][item.toLocaleLowerCase()]["sabtu"]}>sabtu</Checkbox>
                              <Checkbox  onChange={(e) =>onChangeCheckBox(e,"sparepart",item.toLocaleLowerCase(),"minggu",dataShow)} className="textWhite" checked={dataShow["sparepart"][item.toLocaleLowerCase()]["minggu"]==undefined?false:dataShow["sparepart"][item.toLocaleLowerCase()]["minggu"]}>Minggu</Checkbox>
                              <div className="totalhk2">{dataShow["totalwork_sparepart"][item.toLocaleLowerCase()]}</div>
                            </>)}
                          </>,
                          sales: <>
                          {item=="Bulan"? (<div >
                            <Checkbox onChange={(e) =>onChangeCheckBoxAll(e,"sales","sabtu",dataShow)}  className="textHeader" checked={countSalesSabtu==12} >Sabtu</Checkbox>
                            <Checkbox  onChange={(e) =>onChangeCheckBoxAll(e,"sales","minggu",dataShow)}  className="textHeader" checked={countSalesMinggu==12} >Minggu</Checkbox>
                              <div className="totalhk">Total HK</div>
                            </div>):(<>
                              <Checkbox onChange={(e) =>onChangeCheckBox(e,"sales",item.toLocaleLowerCase(),"sabtu",dataShow)} className="textWhite"   checked={dataShow["sales"][item.toLocaleLowerCase()]["sabtu"]==undefined?false:dataShow["sales"][item.toLocaleLowerCase()]["sabtu"]}>sabtu</Checkbox>
                              <Checkbox  onChange={(e) =>onChangeCheckBox(e,"sales",item.toLocaleLowerCase(),"minggu",dataShow)} className="textWhite" checked={dataShow["sales"][item.toLocaleLowerCase()]["minggu"]==undefined?false:dataShow["sales"][item.toLocaleLowerCase()]["minggu"]}>Minggu</Checkbox>
                              <div className="totalhk2">{dataShow["totalwork_sales"][item.toLocaleLowerCase()]}</div>
                            </>)}
                          </>,
                        };
                      });
                      setData(resp);
                      setLoading(false);
                      setTableParams({
                        pagination: {
                          current: 1,
                          total: 20,
                        },
                      });

      }else{

      var urlTrash = isWeekday ? "/trash" : "";
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
              Holidays_date: (
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
              // statusUpdate: isWeekday ? (
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
              action: isWeekday ? (
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
        }).catch((error) => {
          if(error.response.status===401){
            localStorage.clear();
            message.error(error + " Sesi telah habis,silahkan login kembali !");
            window.location.href = process.env.REACT_APP_URL_DASH+"/login?token=logoutcms";
          }else{
            message.error(error + " Ups! Terjadi kesalahan saat mengambil data. Silakan coba lagi dalam beberapa saat. ");
          }
        });
      }
    }
  };

  useEffect(() => {
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
      fetchData(yearFrom,true);
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
    isWeekday,
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

  }, [companyDefault]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isChanges) {
        event.preventDefault();
        event.returnValue = 'Aaasada'; // Pesan default di beberapa browser
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listener ketika komponen unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isChanges]);

  const onChangeDateStart = async(date, dateString) => {
    if(isWeekday){
      if(dateString!="" && dateString!=undefined){
         setYearFrom(dateString)
        await fetchData(dateString,true,allData);
      }
    }else{
      setDateFrom(dateString);
    }
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


  const onChangeDate=(date, dateString) => {
    setSelectedDate(dateString);
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
                  Holidays
                </ArgonTypography>
                <ArgonTypography variant="h6">Daftar Hari Libur</ArgonTypography>
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
              pb={0}
            >
              <ArgonBox p={3} pt={isWeekday ?3:10} pl={0}>
                <span className="titleDate">{isWeekday ? "Tahun" :"Dari"} </span>
                <DatePicker onChange={onChangeDateStart} value={isWeekday ? dayjs(yearFrom, dateFormatYear):null} format={isWeekday ? dateFormatYear:dateFormat} size="large" placeholder="Pilih Tanggal" picker={isWeekday ? "year" :""}/>
                {isWeekday ? "" :
                  (<>
                    <span className="titleDate">Ke </span>
                    <DatePicker onChange={onChangeDateTo} format={dateFormat} size="large"  disabledDate={disabledDateTo} placeholder="Pilih Tanggal"/>         
                    </>)
                } 
              </ArgonBox>
              {isWeekday ?  <ArgonBox >
                {isChanges ?  <ArgonButton
                      color="info"
                      size="small"
                      onClick={onUpdateHoliday}
                      disabled={sessionStorage.getItem("companyDefault") == ""}
                      className="iconAction"
                    >
                      Apply
                    </ArgonButton> :""}

                    <div style={{height:20, backgroundColor:"#FFF"}}></div>
                    </ArgonBox>
                :
                  (<>
              <ArgonBox >
                  <ArgonButton
                      color="info"
                      onClick={handleOpen}
                      disabled={sessionStorage.getItem("companyDefault") == ""}
                      className="iconAction2"
                    >
                      Tambah Tanggal
                    </ArgonButton>
                    <Input
                          size="large"
                          placeholder="Cari"
                          prefix={<SearchOutlined />}
                          onChange={clickSearch}
                          style={{marginTop:20}}
                        />
              </ArgonBox>
              </>)}
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
                columns={isWeekday ? columnsDelete : columns}
                dataSource={data}
                onChange={onChangeTable}
                display={false}
                //pagination={tableParams.pagination}
                pagination={isWeekday ? {...tableParams.pagination, pageSize: 50, position: [bottom] }:tableParams.pagination}
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
                    maskClosable={false}
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
                        label="Tanggal"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Please input the date",
                          },
                        ]}
                        initialValue={dayjs(defaultDate)}
                      >
                        <DatePicker onChange={onChangeDate}  format="YYYY-MM-DD"  />
                      </Form.Item>

                      <Form.Item
                        label="Deskripsi"
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


                      {/* <Form.Item
                        label="Status Aktif"
                        name="isactive"
                        //initialValue={isactive  }
                        initialValue={isActive}
                      >
                        <Checkbox onChange={onChangeStatus} checked={isActive}></Checkbox>
                      </Form.Item> */}

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
