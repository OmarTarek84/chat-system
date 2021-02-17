import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { SIGN_IN_SUCCESS } from "../redux/actions/actionTypes";
import axios from "../axios/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/router';


const BaseLayout = (props) => {

    const dispatch = useDispatch();
    const router = useRouter();

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
      } else {
        router.push('/auth');
      }
    }, []);

    const {title} = props;
    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/nprogress.css" />
                <title>{title}</title>
            </Head>
            <Navbar />
            <main>{props.children}</main>
        </>
    )
};

export default BaseLayout;