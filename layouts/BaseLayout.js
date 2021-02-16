import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

const BaseLayout = (props) => {
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