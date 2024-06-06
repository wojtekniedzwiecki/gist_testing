const fs = require("fs");
const path = require("path");


export function createFileContent(fileName: string) {
    const filePath = `test_data/${fileName}.txt`; // Replace with your file path
    // const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent;
}
