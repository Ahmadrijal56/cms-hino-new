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

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Image
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

function Illustration() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [Loading,setLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token')

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  useEffect(() => {

    const checkToken = async (token) => {

      if(token){
        try{
          const headers = { 
            "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
            "Access-Control-Allow-Methods": 'OPTIONS,POST,GET', // this states the allowed methods
            "Content-Type": "application/json",
            'Authorization': 'Bearer '+token
          };
        await axios
        .get(process.env.REACT_APP_MAIN_API + "/checklogin", {
          headers,
        })
        .then(async (response) => {
          if (response.data.status === 200) {

            sessionStorage.setItem("username", "admin@hino.id");
            sessionStorage.setItem("token", response.data.token);

                console.log(response)
                let companyList=[]
                if( await response.data.values.length>1){
                    await response.data.values.map(function(item) {
                        companyList.push(item.CompanyCode+"@=="+item.CompanyName)
                    })
                }else{
                  companyList.push(response.data.values["CompanyCode"]+"@=="+response.data.values["CompanyName"])
                }
                sessionStorage.setItem("companyList", JSON.stringify(companyList));

                //TEMP
                sessionStorage.setItem("companyDefault",response.data.default_values["CompanyCode"]+"@=="+response.data.default_values["CompanyName"])
                sessionStorage.setItem("companyUser",response.data.default_values["CompanyCode"])
              
                navigate('/holidays');

            setLoading(false);
          } else {
            setLoading(false);
          }
        });
          
        } catch(error) {
            console.log(error)
            setLoading(false)
          }
        }

    }

    const items = sessionStorage.getItem('token');
    if (items) {
      navigate('/holidays');
    }else{
      checkToken(token);
    }

  },[]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);

    // At request level
  //   const agent = new https.Agent({  
  //     rejectUnauthorized: false
  // });
  const article = {
      "EmployeeNo": data.get('email'),
      "Password": data.get('password')
      };
  const headers = { 
      "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": 'OPTIONS,POST,GET', // this states the allowed methods
      "Content-Type": "application/json",
  };
  try {
        await axios
          .post(process.env.REACT_APP_MAIN_API + "/login", article, {
            headers,
            // httpsAgent: agent,
          })
          .then(async (response) => {
              if (response.data.status === 200) {
                sessionStorage.setItem("username", data.get("email"));
                sessionStorage.setItem("token", response.data.token);

                console.log(response)
                let companyList=[]
                if( await response.data.values.length>1){
                    await response.data.values.map(function(item) {
                        companyList.push(item.CompanyCode+"@=="+item.CompanyName)
                    })
                }else{
                  companyList.push(response.data.values["CompanyCode"]+"@=="+response.data.values["CompanyName"])
                }
                sessionStorage.setItem("companyList", JSON.stringify(companyList));

                //TEMP
                sessionStorage.setItem("companyDefault",response.data.default_values["CompanyCode"]+"@=="+response.data.default_values["CompanyName"])
                sessionStorage.setItem("companyUser",response.data.default_values["CompanyCode"])
              
                navigate('/holidays');

                setLoading(false);
              } else {
                alert("Invalid user or password");
                setLoading(false);
              }
          });
      } catch(error) {
          alert(error)
          setLoading(false)
        }

  }

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your user and password to sign in"
      illustration={{
        image: bgImage,
        title: '"Attention is the new currency"',
        description:
          "The more effortless the writing looks, the more effort the writer actually put into the process.",
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={Loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ArgonBox component="form" role="form"  onSubmit={handleSubmit} >
        <ArgonBox mb={2}>
          <ArgonInput name="email"  placeholder="User" size="large" />
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput name="password" type="password" placeholder="Password" size="large" />
        </ArgonBox>
        <ArgonBox mt={4} mb={1}>
          <ArgonButton color="info" size="large" type="submit" fullWidth>
            Sign In
          </ArgonButton>
        </ArgonBox>
      </ArgonBox>
    </IllustrationLayout>
  );
}

export default Illustration;
