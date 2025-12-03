import React from 'react'
import mystyle from './homepage.module.css'
import clsx from 'clsx'
import { FaLocationDot } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

function Searchbox() {
    return (
        <div>
            <div className={mystyle.searchbox}>
                <div className={clsx(mystyle.location, mystyle.inhover)}>
                    <FaLocationDot />
                    Where from?
                </div>
                <div className={clsx(mystyle.mode, mystyle.inhover)}>
                    <FaPaperPlane />
                    Transport?
                </div>
                <div className={clsx(mystyle.date, mystyle.inhover)}>Date?</div>
                <div className={clsx(mystyle.month, mystyle.inhover)}>Month?</div>
                <div className={clsx(mystyle.year, mystyle.inhover)}>Year?</div>
            </div>
            <div className={mystyle.btnbox}>
                <button className={mystyle.searchbtn}>
                    <IoMdSearch size="20px" />
                    Find groups
                    </button>
            </div>
        </div>
    )
}

export default Searchbox
