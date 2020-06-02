const Joi = require('joi')
const XLSX = require('xlsx')
const express = require('express')
const upload = require('express-fileupload')
const app = express();
app.use(express.json());
app.use(upload())
const path = require('path')



app.get('/', (req, res) => {
    // displaying our index page 
    res.sendFile(__dirname + '/index.html')
});

app.post('/api/testy/', (req, res) => {
    if (req.files) {
        // checking the file from the req 
        console.log(req.files)
        // fetching the file from the req object 
        var file = req.files.file
        // getting the name of the file from the file object 
        var filename = file.name
        console.log(filename)

        // moving the .xlsx file to the uploads directory  
        file.mv('./uploads/' + filename, function (err) {
            if (err) {
                res.send(err)
            } else {
                // creating the path to our uploaded xlsx file
                const xlsxPath = { dir: 'uploads',base:`${filename}`}
                const pathTo = path.format(xlsxPath)
                
                // reading our xlsx file we have uploaded 
                const workbook = XLSX.readFile(pathTo)
                const sheet_name_list = workbook.SheetNames;
                // converting our data to json format using the sheet_to_json 
                const results = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
                res.status(200).send(results)
            }
        })

    }else{
        res.redirect('/')
    }
});


//port
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))