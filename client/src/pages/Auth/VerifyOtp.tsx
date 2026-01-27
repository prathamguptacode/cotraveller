import { useEffect, useState } from 'react'
import styles from './auth.module.css'
import TextField from '@/components/TextField/TextField'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { callAuthApi } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import type { AuthContextUser } from '@/types/auth.types'


//###LATER make this page non-navigable by user , only by us(using navigate thingy)
const VerifyOtp = () => {
    const location = useLocation()
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')

    const [isMounted, setIsMounted] = useState(false)

    const { updateUser, updateAccessToken } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isMounted) return setIsMounted(true)

        const timeout = setTimeout(() => {
            const regex = /^[0-9]{6}$/
            if (!regex.test(otp)) return setError('Invalid Format')
            setError('')
        }, 500);

        return () => {
            clearTimeout(timeout)
        }
    }, [otp])

    const handleSubmit = async () => {
        if (!otp || error) return
        const { status, data } = await callAuthApi<{ accessToken: string, user: AuthContextUser }>('post', '/auth/signup/verify', { otp })
        if (status >= 400) setError(data.message)
        else if (data.success) {
            const { accessToken, user } = data.data
            updateAccessToken(accessToken)
            updateUser(user)
            navigate('/', { replace: true })
        }
        else console.error("SOMETHING WENT WRONG!")
    }


    const handleResend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const { status, data } = await callAuthApi('post', '/auth/signup/resend')

        // ###LATER improve UX by auto redirect under certain conditions
        if (status >= 400) setError(data.message)
        else if (status == 200) alert('New OTP has been sent!') //###LATER make this also toast, and a lot of other thingies
        else console.error("SOMETHING WENT WRONG!")

    }

    return !location.state?.isAllowed ? <Navigate to={'/'} /> :
        <>  < form className={styles.form} onClick={(e) => e.preventDefault()}>
            <TextField autoComplete={'off'} error={error} value={otp} setValue={setOtp} type={'text'} placeholder={'OTP'} requirements={['No leading or trailing spaces', 'Numeric', 'Exactly 6 digits']} />
            <button aria-label='Continue' onClick={handleSubmit} className={styles.button}>Continue</button>
        </form >
            <div className={styles.switchPage}>
                <button aria-label='Resend OTP' onClick={handleResend} className={styles.anchors} >Resend OTP</button>
            </div>
        </>




}

export default VerifyOtp
