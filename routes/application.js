const express = require('express')
const application = express.Router()
const db = require('../connection')
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

application.post('/submit',upload.single('cv'), (req, res) => {
  // Extract the necessary data from the request body
  const data = [ req.body.jobID,req.body.cover_letter,req.file.buffer ];

  db.query('INSERT INTO applications (jobID, cover_letter, cv) VALUES (?, ?, ?)',data, (error, results) => {
    if (error) {
      console.error('Error occurred during job application submission:', error);
      res.status(500).json({ message: 'Job application submission failed.' });
    } else {
      res.status(200).json({ message: 'Job application submitted successfully.' });
    }
  });
});

application.get('/', (req,res,next)=> {
    db.query('SELECT * FROM applications',(err,results,fields)=> {
        if(!err) {
             res.json(results)
        }
        else res.json(err);
    }) 
})

application.get("/job/:id", (req, res, next) => {
    let sql = `SELECT * FROM applications WHERE jobID= ${req.params.id}`;
    if(req.params.id!==undefined)  {
    db.query(sql, (err, result) => {
      if (err) res.json(err); 
      else {
      res.json(result)
      }
    });
       }
    else next()
  });



module.exports = application
