import axios from "axios"
import fs from "fs"
import { dirname } from "path"

const downloadFile = async (url: string, destination: string) => {
	const response = await axios.get(url, { responseType: "stream" })
	response.data.pipe(fs.createWriteStream(destination))
}

const fileUrl = "https://assets.ic10.dev/languages/EN/reagents.json"
const destinationPath = dirname(__dirname) + "/src/data/reagents.json"

downloadFile(fileUrl, destinationPath)
	.then(() => {
		console.log("File downloaded successfully!")
	})
	.catch((error) => {
		console.error("Error downloading file:", error)
	})
