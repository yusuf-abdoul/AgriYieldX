import axios from "axios";

export async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
}
