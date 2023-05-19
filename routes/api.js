const express = require('express')
const router = express.Router()
const db = require('../connection')

//get all jobs
router.get('/jobs', (req,res,next)=> {
    db.query('SELECT * FROM jobListings',(err,results,fields)=> {
        if(!err) {
             res.json(results)
        }
        else res.json(err);
    }) 
})
//get one job
router.get("/job/:id", (req, res) => {
    let sql = `SELECT * FROM jobListings WHERE id= ${req.params.id}`;
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



//add new job
// router.post
//update job
// router.put
//delete job
// router.delete


module.exports = router