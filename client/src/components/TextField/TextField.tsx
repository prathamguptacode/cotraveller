import styles from './textField.module.css'
import clsx from 'clsx';
import { EyeOff, CircleQuestionMark, Eye } from 'lucide-react'
import { useState } from 'react';

type TextFieldProps = {
    error: string,
    type: 'text' | 'password' | 'number' | 'email',
    placeholder: string,
    autoComplete: React.HTMLInputAutoCompleteAttribute,
    value: string,
    requirements?: string[],
    setValue: React.Dispatch<React.SetStateAction<string>>
}


const TextField = ({ error, type, placeholder, autoComplete, value, setValue, requirements }: TextFieldProps) => {

    const [currentType, setCurrentType] = useState(type)

    const toggleHidden = () => {
        setCurrentType(prev => prev === 'password' ? 'text' : 'password')
    }


    return (
        <>
            <div className={styles.inputWrapper}>
                <div className={clsx(styles.textFieldWrapper, error && styles.errorBorder)}>
                    <input value={value} onChange={(e) => setValue(e.target.value)} type={currentType} autoComplete={autoComplete} placeholder={placeholder} spellCheck="false" className={styles.textField} />
                    <label className={styles.placeholder}>{placeholder}</label>
                    {
                        type === 'password' && <button aria-label={currentType === 'password' ? 'Show' : 'Hide'} onClick={toggleHidden}>{currentType === 'password' ? <Eye size={28} /> : <EyeOff size={28} />}</button>
                    }

                    {requirements && <div className={styles.helperWrapper}>
                        <CircleQuestionMark />
                        <ul className={styles.helper}>
                            {requirements.map((e, i) => {
                                return <li key={i} >{e}</li>
                            })}
                        </ul>
                    </div>}
                </div>

                {error && <div className={styles.error}>
                    {error}
                </div>}
            </div>
        </>
    )
}

export default TextField
