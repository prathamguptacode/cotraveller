import styles from '../auth.module.css'
import clsx from 'clsx';
import { EyeOff, CircleQuestionMark, Eye } from 'lucide-react'
import { useState } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';


type FormInputProps<T extends FieldValues> = {
    error: string | undefined,
    type: 'text' | 'password' | 'number' | 'email',
    placeholder: string,
    autoComplete: React.HTMLInputAutoCompleteAttribute,
    requirements?: string[],
    register: UseFormRegister<T>,
    name: Path<T>
}



const FormInput = <T extends FieldValues,>({ error, type, placeholder, autoComplete, requirements, register, name }: FormInputProps<T>) => {

    const [currentType, setCurrentType] = useState(type)

    const toggleHidden = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setCurrentType(prev => prev === 'password' ? 'text' : 'password')
    }



    return (
        <>
            <div className={styles.inputWrapper}>
                <div className={clsx(styles.textFieldWrapper, error && styles.errorBorder)}>
                    <input {...register(name)} name={name} type={currentType} autoComplete={autoComplete} placeholder={placeholder} spellCheck="false" className={styles.textField} />
                    <label className={styles.placeholder}>{placeholder}</label>
                    {
                        type === 'password' && <button role='button' aria-label={currentType === 'password' ? 'Show' : 'Hide'} onClick={(toggleHidden)}>{currentType === 'password' ? <Eye size={28} /> : <EyeOff size={28} />}</button>
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

export default FormInput
