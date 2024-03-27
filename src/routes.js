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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Argon Dashboard 2 MUI layouts
import Holidays from "layouts/holidays";
import Videos from "layouts/videos";
import SignIn from "layouts/authentication/sign-in";
import Config from "layouts/config";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";

const routes = [
  {
    type: "route",
    name: "Holidays",
    key: "holidays",
    route: "/holidays",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-calendar-grid-58" />
    ),
    component: <Holidays />,
  },
  {
    type: "route",
    name: "Videos",
    key: "videos",
    route: "/videos",
    icon: (
      <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />
    ),
    component: <Videos />,
  },
  {
    type: "route",
    name: "Configs",
    key: "config",
    route: "/configs",
    icon: (
      <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-settings" />
    ),
    component: <Config />,
  },
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    display:"none",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
    ),
    component: <SignIn />,
  }
];

export default routes;
