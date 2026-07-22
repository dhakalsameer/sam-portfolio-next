export function cl(url: string, width: number, aspectRatio?: string) {
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}${aspectRatio ? `,ar_${aspectRatio},c_fill` : ",c_fill"}/`
  )
}
