import { getImgURL } from '@/lib/cloudinary'
import AvatarWrapper from './AvatarWrapper'

type AvatarProps = {
    title: string,
    avatar: {
        publicId: string,
        version: number
    },
    imgSize: number,
    className?: string,
    alt: string,
    asChild?: true,
}

const Avatar = ({ title, avatar, imgSize, className, alt }: AvatarProps) => {
    const avatarURL = getImgURL(avatar, imgSize)

    return (
        <AvatarWrapper avatarURL={avatarURL} className={className}>
            {avatarURL ?
                <img src={avatarURL} alt={alt} /> :
                title.charAt(0).toUpperCase()
            }
        </AvatarWrapper>
    )
}

export default Avatar
