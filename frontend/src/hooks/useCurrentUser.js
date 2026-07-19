import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../main";

const useCurrentUser = () => {

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/me`, {
          withCredentials: true,
        });
        console.log(result.data.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);
};

export default useCurrentUser;
