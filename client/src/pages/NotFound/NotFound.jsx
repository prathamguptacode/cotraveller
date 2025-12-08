import React from 'react'
import mystyle from './NotFound.module.css'
import { BiSolidError } from "react-icons/bi";
import Navbar from '../../components/homepage/Navbar';

function NotFound() {
    return (
        <div className={mystyle.wrapper}>
            <Navbar />
            <div className={mystyle.errorpage}>
                <div className={mystyle.can}>
                    <div className={mystyle.imgbx}>
                        <BiSolidError size={200} />
                    </div>
                    <div className={mystyle.content}>
                        <div className={mystyle.title}>
                            Something went wrong
                        </div>
                        <div className={mystyle.con}>
                            Cannot find the following page
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
