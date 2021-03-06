const Joi = require('joi')
const XLSX = require('xlsx')
const express = require('express')
const upload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const app = express();
const { promisify } = require('util')
app.use(express.json());
app.use(upload())
app.use('/upload', express.static('uploads'))



app.get('/', (req, res) => {
    // displaying our index page 
    res.sendFile(__dirname + '/index.html')
});

app.post('/uploads/file/', async (req, res) => {
 

if (req.files) {
    // checking the file from the req 
    console.log(req.files)
    // fetching the file from the req object 
    var file = req.files.file
    // getting the name of the file from the file object 
    var filename = file.name
    console.log(filename)

    // moving the .xlsx file to the uploads directory  
    await file.mv('./uploads/' + filename, function (err) {
        if (err) {
            res.send(err)
        } else {
            // creating the path to our uploaded xlsx file
            const xlsxPath = { dir: 'uploads', base: `${filename}` }
            const pathTo = path.format(xlsxPath)

            // reading our xlsx file we have uploaded 
            const workbook = XLSX.readFile(pathTo)
            const sheet_name_list = workbook.SheetNames;
            // converting our data to json format using the sheet_to_json 
            const results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
            // stringify json data to be written on the jsonfile 
            data = JSON.stringify(results)

            // spliting the filename into a array of the filename and its file type
            JsonFileFirst = filename.split('.')
            // placing our file name with the json extension on same array 
            nameArr = [JsonFileFirst[0], 'json']
            // joining the items in the nameArr to form our file.json 
            JsonFilename = nameArr.join('.')
            // creating a path to the json file 
            JsonFilePathname = { dir: 'uploads', base: `${JsonFilename}` }
            JsonFilePath = path.format(JsonFilePathname)

            // use the appendfile method to write data into our json file as well as create the file 
            fs.appendFile(JsonFilePath,data,function(err){
                if (err){
                    console.log(err)
                }
            })
            const urlPath = `/upload/${JsonFilename}`
            res.redirect(urlPath)
        }
    })

} else {
    res.redirect('/')
}


});

//port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))