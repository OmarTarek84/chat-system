import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Form from '../components/AuthForm';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../redux/actions/user';
import { SIGN_IN_ERROR } from '../redux/actions/actionTypes';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';

const Auth = () => {
    const [authMode, setAuthMode] = useState('login');
    const [error, setError] = useState(null);

    const {loading, error: loginError} = useSelector(state => state.user);

    const dispatch = useDispatch();
    const router = useRouter();

    const defaultValues = authMode === 'register' ? {
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        password: "",
    }: {
        email: "",
        password: "",
    };

    useEffect(() => {
        if (loginError) {
            dispatch({
                type: SIGN_IN_ERROR,
                error: null
            });
        }
    }, [authMode]);

    const submitAuthForm = async formData => {
        if (authMode === 'register') {
            try {
                const {data} = await axios.post('/auth/signup', formData);
                if (data.message && data.message === 'success') {
                    setAuthMode('login');
                }
            } catch(err) {
                const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
                setError(errorMessage);
            }
        } else {
            const dispRes = await dispatch(signin(formData));
            if (dispRes && dispRes.type === "SIGN_IN_SUCCESS") {
                router.push('/');
            }
        }
    };

    const changeAuthMode = () => {
        if (authMode === 'register') {
            setAuthMode('login');
        } else {
            setAuthMode('register');
        }
    };

    

    return (
        <>
        <Head>
            <title>{authMode}</title>
        </Head>
        <div className="authParent">
            <div className="authImg">
                <Image src='/images/chat.png' alt="chat image" width={120} height={120} />
            </div>
            <div className="authCard">
                <h2>{authMode === 'register' ? 'Member Signup': 'Member Login'}</h2>
                {error && <p className="errorAuthMsgFromServer">{error}</p>}
                {loginError && <p className="errorAuthMsgFromServer">{loginError}</p>}
                <Form defaultValues={defaultValues} authMode={authMode} submitAuthForm={submitAuthForm} />
            </div>
            <div className="accountexist">
                <span>{authMode === 'register' ? 'Already Have an account?': 'Don\'t have an account?'}</span>
                <button type="button" disabled={loading} onClick={changeAuthMode}>{authMode === 'register' ? 'Login': 'Register'}</button>
            </div>
        </div>
        </>
    )
};

export default Auth;