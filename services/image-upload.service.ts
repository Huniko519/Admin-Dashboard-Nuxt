import { generateId } from '../utils'
import axios from 'axios'

export class ImageUploadService {

  private static alreadyOnCdnRegex: RegExp = /^(http|https).*?$/

  private static getOptionsConfig() {
    return {
      headers: {
        authorization: localStorage.getItem("token"),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'multipart/form-data',
      },
    }
  }

    private static async sendToAPIFile(form: FormData): Promise<Array<string>> {
        return await axios
      .post(`${(process.env.BASE_URL || 'https://api.yalladealz.com/api')}/upload/image`, form, this.getOptionsConfig())
      .then(data => {
        console.log('data', data)
        console.log('data response', data.data.dataimages && data.data.dataimages.map(i => i.imageUrl) || [])
        return data.data.dataimages && data.data.dataimages.map(i => i.imageUrl) || []
      }
      )
      .catch((error) => {
        console.log(error)
        return []
      })
  }

    private static async uploadFile(file: File) {
        console.log("uploading function");
        if (!file) return
        console.log("uploading start function");
    const formData = new FormData()
        formData.append("image", file)
        let result = await this.sendToAPIFile(formData);
        console.log(result);
        return result;
  }

  private static isValidToSend (file: File | string) {
    return file && typeof file !== 'string'
  }

  private static alreadyUploaded(file: string) {
    return typeof file === 'string' &&
    this.alreadyOnCdnRegex.test(file)
  }

  private static notUploaded (file: string) {
    return !this.alreadyUploaded(file)
  }

  private static transformToFile(file: File | string): File | string {
    return typeof file === 'string'
      ? this.alreadyUploaded(file)
        ? file
        : /^data:image.*?$/.test(file)
          ? this.dataURLtoFile(file)
          : null
      : file
  }

    public static async uploadImage(file: File | string) {
        console.log("file information recieved");
        console.log(typeof file)
    if (typeof file === 'string')
      if (this.alreadyUploaded(file))
        return file
      else return (await this.uploadFile(this.dataURLtoFile(file)))[0]
    else {
      const result = (await this.uploadFile(file))
      console.log('on result', result)
      return (result || []).pop()
    }
  }

  public static async uploadMultipleImages(files: Array<File | string>) {
    const validFiles = files.map(this.transformToFile.bind(this)).filter(elm => !!elm)
    const filesToSend = validFiles.filter(file => this.notUploaded(file as string))
    if (!filesToSend.length) return validFiles

    const filesAlreadySent: Array<string> = validFiles.filter(file => this.alreadyUploaded(file as string)) as Array<string>
    const formData = new FormData()
    formData.append("deal", new Blob(filesToSend as BlobPart[]))
    return (await this.sendToAPIFile(formData) || []).concat(filesAlreadySent)
  }

  private static dataURLtoFile(dataUrl: string, fileName: string = generateId()): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1])
    let n = bstr.length,
      u8arr = new Uint8Array(n);
    while(n--)
      u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], fileName, {type:mime});
  }

  static async readImage(file: File): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader
        .onload = (evt: ProgressEvent<FileReader>) => (
          resolve(Object.assign(new Image(), { src: evt.target.result }))
        )
      fileReader
        .onerror = (evt: ProgressEvent<FileReader>) => (
          reject(evt.target.error)
        )
      fileReader
        .readAsDataURL(file)
    })
  }
}
