import { Cloudinary } from '@cloudinary/url-gen'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality'
import { auto as fAuto } from '@cloudinary/url-gen/qualifiers/format'

const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
})


export const getImgURL = (publicId: string, version: number, width: number) => {
    const url = cld.image(publicId).resize(fill().width(width)).delivery(quality(qAuto())).delivery(format(fAuto())).setVersion(version).toURL()
    return url
}