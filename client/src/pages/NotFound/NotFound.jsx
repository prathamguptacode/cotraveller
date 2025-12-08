import React from 'react'
import mystyle from './NotFound.module.css'
import { BiSolidError } from "react-icons/bi";

function NotFound() {
    return (
        <div className={mystyle.errorpage}>
            <div className={mystyle.can}>
                <div className={mystyle.imgbx}>
                    <BiSolidError />
                </div>
                <div className={mystyle.content}>
                    <div className={mystyle.title}>
                        Something went wrong
                    </div>
                    <div className={mystyle.content}>
                        Cannot find the following page
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
