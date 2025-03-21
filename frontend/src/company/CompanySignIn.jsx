import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosapi from "../axiosapi";
import toast from "react-hot-toast";

const CompanySignIn = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const [otp, setOtp] = useState(""); // Store OTP input
  const companySignInForm = useForm();
  const forgetCompanyForm = useForm();
  const navigateTo = useNavigate();

  const companysignin = async (data) => {
    try {
      const res = await axiosapi.post("company/login", data);
      console.log(res, "log data");
      const compId = res.data.checkUser._id;
      sessionStorage.setItem("compId", compId);
      if (res.status === 200) {
        toast.success(res.data.message);

        setEmail(data.email); // Save email for OTP verification
        setIsOtpSent(true); // Show OTP input form
      }
    } catch (error) {
      console.log(error, "msg");
      // toast.error(error.response.data.message);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const resp = await axiosapi.post("company/verify-otp", {
        email: email,
        otp: otp,
      });
      if (resp.data.success) {
        toast.success("OTP verified successfully. You are logged in.");
        navigateTo("/companyhome"); // Redirect to company home page
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during OTP verification");
    }
  };

  const companyForget = async (data) => {
    try {
      const myres = await axiosapi.put("company/forgot", {
        email: data.email,
        password: data.password,
      });
      console.log(myres);
      toast.success("Password Changed successfully");
      navigateTo("/");
      sessionStorage.setItem("compId", "");
    } catch (error) {
      toast.error("something went wrong.....?");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto mt-5 ">
        <div className="card card0 border-0" style={{ marginTop: "30px" }}>
          <div className="row d-flex">
            <div className="col-lg-6">
              <div className="card1 pb-5">
                <div className="row">
                  {" "}
                  <p className="logo text-warning ">Company Sign In </p>
                </div>
                <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                  <img src="./company.jpg" className="image" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {!isOtpSent ? (
                <form onSubmit={companySignInForm.handleSubmit(companysignin)}>

                  <div className="card2 card border-0 px-4 py-5">
                    <div className="row px-3 mb-4">
                      <div className="line" />
                      <small className="or text-center">Login</small>
                      <div className="line" />
                    </div>
                    <div className="row px-3">
                      <label className="mb-1">
                        <h6 className="mb-0 text-sm">Email Address</h6>
                      </label>
                      <input
                        className="mb-4"
                        type="text"
                        name="email"
                        placeholder="Enter a valid email address"
                        {...companySignInForm.register("email")}
                      />
                    </div>
                    <div className="row px-3">
                      <label className="mb-1">
                        <h6 className="mb-0 text-sm">Password</h6>
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        {...companySignInForm.register("password")}
                      />
                    </div>
                    <div className="row mb-3 px-3">
                      <button
                        type="submit"
                        className="btn btn-blue text-center"
                      >
                        Login
                      </button>
                    </div>
                    <div className="row mb-4 px-3">
                      <small className="font-weight-bold">
                        Don't have an account?{" "}
                        <Link to="/companySignUp" className="text-danger ">
                          Register
                        </Link>
                        {/*   
                        

                        */}
                      </small>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="card2 card border-0 px-4 py-5">
                  <div className="row px-3 mb-4">
                    <div className="line" />
                    <small className="or text-center p">
                      <p>OTP Verification</p>
                    </small>
                    <div className="line " />
                  </div>
                  <div className="row px-3">
                    <label className="mb-1">
                      <h6 className="mb-0 text-sm">Enter OTP</h6>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP sent to your email"
                      onChange={(e) => setOtp(e.target.value)} // Update OTP state
                    />
                  </div>
                  <div className="row mb-3 px-3">
                    <button
                      type="button"
                      className="btn btn-blue text-center"
                      onClick={() => verifyOtp(otp)} // Verify OTP
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignIn;
