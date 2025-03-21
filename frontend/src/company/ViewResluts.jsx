import React, { useEffect, useState } from "react";
import axiosapi from "../axiosapi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ViewResults = () => {
  const compId = sessionStorage.getItem("compId");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resp = await axiosapi.get(`user/examresults/${compId}`);
        console.log(resp.data.data);
        setResults(resp.data.data);
      } catch (error) {
        toast.error("Failed to fetch exam results");
      } finally {
        setLoading(false);
      }
    };
    if (compId) fetchResults();
  }, [compId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Exam Results</h2>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-10">
          <p>No results available for the given company.</p>
        </div>
      ) : (
        <div className="overflow-x-auto ml">
          <table className="min-w-full bg-white shadow-md rounded-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Intern Title</th>
                <th className="px-4 py-2 border-b">Company Name</th>
                <th className="px-4 py-2 border-b">Job Type</th>
                <th className="px-4 py-2 border-b">Submission Time</th>
                <th className="px-4 py-2 border-b">Total Marks</th>
                <th className="px-4 py-2 border-b">User Name</th>
                <th className="px-4 py-2 border-b">User Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="px-4 py-2 border-b">{result.internId.title}</td>
                  <td className="px-4 py-2 border-b">{result.internId.companyname}</td>
                  <td className="px-4 py-2 border-b">{result.internId.jobtype}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(result.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b">{result.totalMarks}</td>
                  <td className="px-4 py-2 border-b">{result.userId.fullname}</td>
                  <td className="px-4 py-2 border-b">{result.userId.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewResults;
