import React from 'react'
import styles from './secondary.module.css'
import Navbar from '../../components/homepage/Navbar'
import { Outlet } from 'react-router-dom'

const SecondaryLayout = () => {
    return (
        <div style={{ marginTop: "65px" }}>
            <Navbar pageIsWide={true} />
            <Outlet />
        </div>
    )
}

export default SecondaryLayout
