import { SIGN_IN_SUCCESS } from "../redux/actions/actionTypes";
import axios from "../axios/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import BaseLayout from "../layouts/BaseLayout";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get("/user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch({
        type: SIGN_IN_SUCCESS,
        user: {...data, token: localStorage.getItem("token")},
      });
    };

    if (localStorage.getItem("token")) {
      getUser();
    }
  }, []);

  return (
    <BaseLayout title="Homepage">
      <div className="Home">
        <h2>chat screen</h2>
      </div>
    </BaseLayout>
  );
}
