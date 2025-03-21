import React, { useEffect, useState } from "react";
import "../css/viewjobs.css";
import { useNavigate } from "react-router-dom";
import axiosapi from "../axiosapi";

const ViewJobs = () => {
  const [showDetails, setShowDetails] = useState("");
  const [postedJobData, setPostedJobData] = useState([]);
  const [filter, setFilter] = useState(""); // New state to manage filter
  const navigatingTo = useNavigate();

  const applyJob = (id) => {
    sessionStorage.setItem("jobid", id);
    navigatingTo(`/applyform/${id}`);
  };

  const id = sessionStorage.getItem("id");

  const getData = async () => {
    try {
      let url = `user/intern/${id}`; // Default API endpoint for all jobs
      if (filter === "intern") {
        url = `user/jobs/${id}?jobtype=intern`; // API endpoint for internships only
      }
      else if( filter === "job") {
        url = `user/jobs/${id}?jobtype=job`; // API endpoint for jobs
      }
      const res = await axiosapi.get(url);
      setPostedJobData(res.data.jobs || res.data.internships);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [filter]); // Re-fetch data when the filter changes

  const viewDetails = (id) => {
    setShowDetails(id);
  };
 console.log(postedJobData);
 
  return (
    <div>
      {/* Select dropdown for filtering */}
      <div className="filter-dropdown">
        <label htmlFor="jobFilter">Filter Jobs: </label>
        <select 
          id="jobFilter" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Show All Jobs</option>
          <option value="intern">Show Internships Only</option>
          <option value="job">Show Jobs Only</option>

        </select>
      </div>

      {/* Displaying job listings */}
      {postedJobData &&
        postedJobData
          .filter(item => filter === "" || item.jobtype === filter) // Filter jobs based on the selected filter
          .map((item) => (
            <div className="container mycontainer mt-5 p-2" key={item._id}>
              <img src="./degree1.png" alt="no photo" />
              <div className="container__text">
                <h1>{item.title}</h1>
                <p>{item.companyname}</p>
                <p className="text-primary">
                  <a onClick={() => viewDetails(item._id)}>view Details</a>
                </p>
                {showDetails === item._id && (
                  <div>
                    <ul>
                      <li>Role: {item.role}</li>
                      <li>Total Vacancies: {item.opening}</li>
                      <li>Education Required: {item.Education}</li>
                      <li>Key Skills: {item.Key_Skills}</li>
                      <li>Experience: {item.experience} months</li>
                      <li>
                        Salary/Stipend: {item.salary}
                        <span className="h6">&#8377;/month</span>
                      </li>
                      <li>Job Description: {item.description}</li>
                    </ul>
                    <ul>
                      <li>
                        <h4>Company Details</h4>
                      </li>
                      <li>Industry Type: {item.Industry_Type}</li>
                      <li>Branch Name/Location: {item.location}</li>
                      <li>Shift Timing: {item.Shifts}</li>
                      <li>Hired to be in Department: {item.Department}</li>
                      <li>Employment Type: {item.Employment_Type}</li>
                      <li>Main Branch Address: {item.Address}</li>
                    </ul>
                  </div>
                )}

                <button className="btn" onClick={() => applyJob(item._id)}>
                  Apply <i className="fa fa-arrow-right" />
                </button>
              </div>
            </div>
          ))}
    </div>
  );
};

export default ViewJobs;
