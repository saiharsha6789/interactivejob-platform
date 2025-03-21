import React, { useState } from "react";
import "../css/signin.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axiosapi from "../axiosapi";

const AdminSignIn = () => {
  const adminForm = useForm();
  const navigateTo = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const [otp, setOtp] = useState(""); // 🔹 Fix: Added OTP state

  // 🔹 Handle Admin Sign-In
  const signIn = async (data) => {
    try {
      const resp = await axiosapi.post("/admin/login", data);
      if (resp.data.success) {
        toast.success("Login successful. OTP sent to your email.");
        setEmail(data.email); // Save email for OTP verification
        setIsOtpSent(true); // Show OTP input form
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  // 🔹 Handle OTP Verification
  const verifyOtp = async () => {
    try {
      const resp = await axiosapi.post("/admin/verify-otp", {
        email: email,
        otp: otp,
      });
      if (resp.data.success) {
        toast.success("OTP verified successfully. You are logged in.");
        navigateTo("/adminhome"); // Redirect to admin home page
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during OTP verification");
    }
  };

  return (
    <div>
      <div className="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto mt-lg-5">
        <div className="card card0 border-0" style={{ marginTop: "30px" }}>
          <div className="row d-flex">
            <div className="col-lg-6">
              <div className="card1 pb-5">
                <div className="row">
                  <p className="logo text-danger">Admin Sign In</p>
                </div>
                <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                  <img src="./admin.jpg" className="image" alt="Admin" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {!isOtpSent ? (
                // 🔹 Sign In Form
                <form onSubmit={adminForm.handleSubmit(signIn)}>
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
                        type="email"
                        name="email"
                        placeholder="Enter a valid email address"
                        {...adminForm.register("email")}
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
                        {...adminForm.register("password")}
                      />
                    </div>
                    <div className="row mb-3 px-3">
                      <button type="submit" className="btn btn-blue text-center">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // 🔹 OTP Verification Form
                <div className="card2 card border-0 px-4 py-5">
                  <div className="row px-3 mb-4">
                    <div className="line" />
                    <small className="or text-center p">
                      <p>OTP Verification</p>
                    </small>
                    <div className="line" />
                  </div>
                  <div className="row px-3">
                    <label className="mb-1">
                      <h6 className="mb-0 text-sm">Enter OTP</h6>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP sent to your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)} // 🔹 Fix: Update OTP state
                    />
                  </div>
                  <div className="row mb-3 px-3">
                    <button
                      type="button"
                      className="btn btn-blue text-center"
                      onClick={verifyOtp} // 🔹 Fix: Call verifyOtp function correctly
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

export default AdminSignIn;
