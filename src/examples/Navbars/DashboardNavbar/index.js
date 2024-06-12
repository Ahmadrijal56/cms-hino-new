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

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";

// Argon Dashboard 2 MUI example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { message,  Modal, Button, Form, Input, Select, DatePicker, Checkbox } from 'antd';


import moment from "moment";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Argon Dashboard 2 MUI context
import {
  useArgonController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import { useNavigate } from "react-router-dom";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import { colors } from "@mui/material";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  const [companyList,setCompanyList] = useState([]);
  const [companyCode,setCompanyCode] = useState("");
  const [companyName,setCompanyName] = useState("");
  const [companyDefault,setCompanyDefault] = useState("");
  const [showSetting, setShowSetting] = useState(false);

  useEffect(() => {
    const items = sessionStorage.getItem("token");
    if (!items) {
      navigate("/authentication/sign-in");
    }

    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();


    async function loadCompany() {
      setCompanyDefault(sessionStorage.getItem("companyDefault"))
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
            //loadData(select[0]);
          }
        }

    }

   loadCompany();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);

    
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/authentication/sign-in");
  };

  const linkCMS = async () => {
    window.location.href = process.env.REACT_APP_URL_DASH+"/login?token="+localStorage.getItem("token");
  }

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme, { navbarType })} style={{padding:0}}>
        <div className="headerPanel">
          <div className="headerBreadcumn">
          <Breadcrumbs
              icon="home"
              title={route[route.length - 1]}
              route={route}
              light={transparentNavbar ? light : false}
            />
          </div>
          <div style={{float:"left", display:"none" }}>
              <Icon fontSize="medium" onClick={handleMiniSidenav}>
                {miniSidenav ? "menu_open" : "menu"}
              </Icon>
            </div>
          <div className="headerCompanyList">
          { companyList.length >1 ?
                 (<Select
                  howSearch={true}
                  style={{ width: 320 }}
                  optionFilterProp="children"
                  onChange={async(value) => {
                    if (value != null) {
                      let select= await value.split("@==")
                      setCompanyCode(await select[0])
                      setCompanyName(await select[1])
                      sessionStorage.setItem("companyDefault",value)
                      window.location.reload();
                      //loadData(select[0]);
                    }
                  }}
                  defaultValue={sessionStorage.getItem("companyDefault")??""}
                  >
                     <Option value="" selected>
                      Choose a Company
                    </Option>
                  {companyList}
                </Select>):(
                  <ArgonTypography variant="h5">{companyName}</ArgonTypography>
                )
                 }
          </div> 
          <div style={{ float: "right" }}>
          <Icon className="headerIcon" fontSize="large" onClick={()=>{
            !showSetting ? setShowSetting(true) : setShowSetting(false)
          }}>settings</Icon>
            {/* <Link to="/authentication/sign-in" onClick={handleLogout}>
              <IconButton sx={navbarIconButton} size="small">
                <Icon
                  sx={({ palette: { dark, white } }) => ({
                    color: light && transparentNavbar ? white.main : dark.main,
                  })}
                >
                  account_circle
                </Icon>
                <ArgonTypography
                  variant="button"
                  fontWeight="medium"
                  color={light && transparentNavbar ? "red" : "dark"}
                >
                  Sign Out
                </ArgonTypography>
              </IconButton>
            </Link> */}
          </div>
          <div className="headerDate">
          {moment().format('DD MMMM YYYY')}
          </div>
        </div>
        
      </Toolbar>

      {showSetting ?(<div className="blockMenu">
        <div className="settingsBlock" onClick={()=>{
            setShowSetting(false)
          }}>
          <Icon className="settingsIcon" >settings</Icon>
          <div className="title">BACK</div>
        </div>
        <div className="settingsBlock">
          <Icon className="settingsIcon" >settings</Icon>
          <div className="title">BACK</div>
        </div>
        <div className="settingsBlock"  onClick={linkCMS}>
          <Icon className="settingsIcon" >settings</Icon>
          <div className="title">To Dashboard</div>
        </div>
        <div className="settingsBlock" onClick={handleLogout}>
          <Icon className="settingsIcon" >settings</Icon>
          <div className="title">Log Out</div>
        </div>
      </div>)
      :null}
      
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: true,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
