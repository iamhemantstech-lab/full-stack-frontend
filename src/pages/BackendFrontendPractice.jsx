import React, { useEffect, useState } from "react";

const BackendFrontendPractice = () => {
  const [userData, setUserData] = useState([]);

  // const API_ROUTE = import.meta.env.VITE_API_BASE_URL;
  const API_ROUTE = import.meta.env.VITE_API_BASE_URL_DEV;

  useEffect(() => {
    fetch(`${API_ROUTE}/users`)
      .then((data) => data.json())
      .then((myData) => setUserData(myData || []));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <h2>BackendFrontendPractice</h2>
      <div>
        {userData?.map((o) => (
          <div key={o.id} className="p-2">
            <div>{o.name}</div>
            <div>{o.email}</div>
            <div>{o.role}</div>
            <div>{o.salary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackendFrontendPractice;
