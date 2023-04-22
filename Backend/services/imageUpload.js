import s3 from '../config/s3.config.js'


// All letter in capital 
export const s3FileUpload = async({bucketName, key, body})=>{
    return await s3.upload({
        Bucket: bucketName,
        Key: key, 
        Body: body
    })
}