export async function uploadToIPFS(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: process.env.PINATA_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET!,
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Pinata upload failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return { cid: data.IpfsHash as string, url: `https://ipfs.io/ipfs/${data.IpfsHash}` }
}
