import React, { useState } from 'react'
import styles from './textField.module.css'
import { IoIosCloseCircleOutline } from "react-icons/io";
import clsx from 'clsx';
import { EyeOff, EyeClosed } from 'lucide-react'


const TextField = ({ error,type, placeholder, autoComplete }) => {


    return (
        <>
            <div className={styles.inputWrapper}>
                <div className={clsx(styles.textFieldWrapper, error && styles.errorBorder)}>
                    <input type={type} autoComplete={autoComplete} placeholder={placeholder} spellCheck="false" className={styles.textField} />
                    <label className={styles.placeholder}>{placeholder}</label>


                    {error && <IoIosCloseCircleOutline className={styles.errorLogo} color='#FF3040' size={32} />}



                </div>

                {error && <div className={styles.error}>
                    {error}
                </div>}
            </div>
        </>
    )
}

export default TextField
