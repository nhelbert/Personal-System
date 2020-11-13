const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sql = require('mssql')
const mysql = require('mysql')
const router = express.Router();




router.use(cors()) //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
// ========================== connection ==============================//
// ========================== Knex ==============================//
// ========================== mssql ==============================//
const knexhrdsql = require('knex')({
  client: 'mssql',
  connection: {
    server: 'hrdsql',
    user: 'sa',
    password: '81at84',
    database: 'CompanyInformation',
    options: {
      "enableArithAbort": true
    }
  }
});
const knexmissql = require('knex')({
  client: 'mssql',
  connection: {
    server: 'mis_sql',
    user: 'sa',
    password: '81at84',
    database: 'Nhel',
    options: {
      "enableArithAbort": true
    }
  }
});
// ========================== mysql ==============================//
const knexmssql = require('knex')({
  client: 'mysql',
  connection: {
    host: '10.169.141.8',
    user: 'testuser',
    password: 'smdasg',
    database: 'ScadSystem',
    options: {
      "enableArithAbort": true
    }
  }
});

// ========================== nano ==============================//
const nano = require('nano')('http://root:admin@hrdapps48:5984')

const masterlist = nano.db.use('hrd_masteruser')


// ========================== your routes here ==============================//
router.get('/', (req, res) => {
  res.send('TYPE “C” OFFENSE C.22. Unauthorized possession or use of company materials, supplies, tools or equipment of another. ')
}),
  // ========================== CouchDB ==============================//
  router.get('/HRDEmployee', (req, res) => {
    masterlist.list({ include_docs: true }).then(body => {
      let toSendProject = body.rows.map(rec => {
        return rec.doc
      })
      let filterData = toSendProject.filter(rec => {
        return rec.section != undefined &&
          rec.department != undefined &&
          rec.team != undefined &&
          rec.designation != undefined &&
          rec.status != undefined
      })
      res.send(filterData)
    })
  })
// ========================== mssql ==============================//

router.get('/Departments', (req, res) => {
  knexhrdsql.select()
    .from("Departments")
    .where("DeletedDate", null)
    .then(data => {
      res.send(data)
    }).catch(err => { res.send(err) })
}),
  router.get('/Sections', (req, res) => {
    knexhrdsql.select()
      .from("Sections")
      .where("DeletedDate", null)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),
  router.get('/Teams', (req, res) => {
    knexhrdsql.select()
      .from("Teams")
      .where("DeletedDate", null)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),
  router.get('/SectionRelation', (req, res) => {
    knexhrdsql.select("DepartmentSectionRelations.DepartmentCode", "Sections.SectionCode", "Sections.SectionName")
      .from("DepartmentSectionRelations")
      .innerJoin("Sections", "DepartmentSectionRelations.SectionCode", "Sections.SectionCode")
      .where("Sections.DeletedDate", null)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),
  router.get('/TeamRelation', (req, res) => {
    knexhrdsql.select("SectionTeamRelations.DepartmentCode", "SectionTeamRelations.SectionCode", "Teams.TeamCode", "Teams.TeamName")
      .from("SectionTeamRelations")
      .innerJoin("Teams", "SectionTeamRelations.TeamCode", "Teams.TeamCode")
      .where("Teams.DeletedDate", null)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/Designations', (req, res) => {
    knexhrdsql.select()
      .from("Designations")
      .where("DeletedDate", null)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/Employees/:dept', (req, res) => {
    knexhrdsql.select()
      .from("Employees")
      .where("RetiredDate", null)
      .andWhere("DepartmentCode", req.params.dept)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/cutoff0620', (req, res) => {
    knexhrdsql.raw(cutoff0620(req))
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/cutoff2105', (req, res) => {
    knexhrdsql.raw(cutoff2105(req))
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  // ========================== mssql ==============================//

  router.get('/Check_User/:EmpIp', (req, res) => {
    knexmissql.select()
      .from("M_Users")
      .where("EmployeeCode", req.params.EmpIp)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })

  }),
  router.get('/Check_NewUser', (req, res) => {
    knexmissql.select()
      .from("M_Users")
      .where("Approved", false)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })

  }),
  router.get('/AllUser', (req, res) => {
    knexmissql.select()
      .from("M_Users")
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/M_NotesTitle', (req, res) => {
    knexmissql.select()
      .from("M_NotesTitle")
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  router.get('/T_CalendarNotes/:EmpCode', (req, res) => {
    knexmissql.select()
      .from("T_CalendarNotes")
      .where("EmployeeCode", req.params.EmpCode)
      .then(data => {
        res.send(data)
      }).catch(err => { res.send(err) })
  }),

  // ========================== Nhel router Post here ==============================//
  router.post('/M_Users_Update', (req, res) => {
    let objData = req.body
    knexmissql('M_Users')
      .where('EmployeeCode', objData.EmployeeCode)
      .update(objData)
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),
  router.post('/M_Users_Delete', (req, res) => {
    let objData = req.body
    knexmissql('M_Users')
      .where('EmployeeCode', objData.EmployeeCode)
      .del()
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),
  router.post('/M_Users_Insert', (req, res) => {
    let objData = req.body
    knexmissql('M_Users')
      .insert(objData)
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),

  router.post('/T_CalendarNotes_Update', (req, res) => {
    let objData = req.body
    knexmissql('T_CalendarNotes')
      .where('Seq', objData.Seq)
      .update({
        TitleID: objData.TitleID,
        Descriptions: objData.Descriptions
      })
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),
  router.post('/T_CalendarNotes_Delete', (req, res) => {
    let objData = req.body
    knexmissql('T_CalendarNotes')
      .where('Seq', objData.Seq)
      .del()
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),
  router.post('/T_CalendarNotes_Insert', (req, res) => {
    let objData = req.body
    knexmissql('T_CalendarNotes')
      .insert(objData)
      .then(data => {
        res.send(objData)
      }).catch(err => { res.send(err) })
  }),

  module.exports = router;

// ========================== your routes here ==============================//
function cutoff0620(req) {
  return `SELECT EmployeeCode, convert(char(10), LogDate, 111) LogDate,
  DepartmentCode, SectionCode, TeamCode,convert(char(8), TimeIn, 108) TimeIn,
  convert(char(8), TimeOut, 108) TimeOut, TransIn, TransOut,
  convert(char(8), StartTime, 108) StartTime,convert(char(8), EndTime, 108) EndTime,
  (CASE WHEN convert(char(8), TimeOut, 108)>convert(char(8), EndTime, 108) 
  THEN
	  (CASE when convert(char(10), TimeOut-EndTime, 108)>='00:30:00' 
	  THEN DATEPART(hour,TimeOut-EndTime) + 
		  (CASE WHEN (DATEPART(minute,TimeOut-EndTime)/60.0)>=0.5 THEN 0.5
		  ELSE  0 END)
	  END )
  ELSE NULL END) OT FROM LogTime
  WHERE month(LogDate)=(CASE when (SELECT day(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') BETWEEN 6 AND 20
  THEN (SELECT month(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')
  ELSE (CASE WHEN (SELECT day(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') BETWEEN 1 AND 5 THEN 
      (CASE when (SELECT month(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')=1 THEN 12
          ELSE (SELECT month(max(LogDate))-1 FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') END )
    ELSE (SELECT month(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') END )
  END )
  AND day(LogDate) BETWEEN 6 AND 20
  AND EmployeeCode='${req.query.EmpID}'`
}
function cutoff2105(req) {
  return `  SELECT EmployeeCode, convert(char(10), LogDate, 111) LogDate,
    DepartmentCode, SectionCode, TeamCode,convert(char(8), TimeIn, 108) TimeIn,
    convert(char(8), TimeOut, 108) TimeOut, TransIn, TransOut,
    convert(char(8), StartTime, 108) StartTime,convert(char(8), EndTime, 108) EndTime,
    (CASE WHEN convert(char(8), TimeOut, 108)>convert(char(8), EndTime, 108) 
    THEN
      (CASE when convert(char(10), TimeOut-EndTime, 108)>='00:30:00' 
      THEN DATEPART(hour,TimeOut-EndTime) + 
        (CASE WHEN (DATEPART(minute,TimeOut-EndTime)/60.0)>=0.5 THEN 0.5
        ELSE  0 END)
      END )
    ELSE NULL END) OT FROM LogTime
    WHERE 
    month(LogDate) =
       (CASE when (SELECT day(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') IN (21,22,23,24,25,26,27,28,29,30,31)
       THEN (SELECT month(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')
       ELSE (SELECT CASE WHEN month(max(LogDate))=1 THEN 12
          ELSE month(max(LogDate))-1 end FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')
       END)
    AND day(LogDate) IN (21,22,23,24,25,26,27,28,29,30,31)
    AND EmployeeCode='${req.query.EmpID}'
  UNION all
  SELECT EmployeeCode, convert(char(10), LogDate, 111) LogDate,
    DepartmentCode, SectionCode, TeamCode,convert(char(8), TimeIn, 108) TimeIn,
    convert(char(8), TimeOut, 108) TimeOut, TransIn, TransOut,
    convert(char(8), StartTime, 108) StartTime,convert(char(8), EndTime, 108) EndTime,
    (CASE WHEN convert(char(8), TimeOut, 108)>convert(char(8), EndTime, 108) 
    THEN
      (CASE when convert(char(10), TimeOut-EndTime, 108)>='00:30:00' 
      THEN DATEPART(hour,TimeOut-EndTime) + 
        (CASE WHEN (DATEPART(minute,TimeOut-EndTime)/60.0)>=0.5 THEN 0.5
        ELSE  0 END)
      END )
    ELSE NULL END) OT FROM LogTime
    WHERE 
    month(LogDate) =
      (CASE when (SELECT day(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}') IN (21,22,23,24,25,26,27,28,29,30,31)
       THEN (SELECT CASE WHEN month(max(LogDate))=12 THEN 1
          ELSE month(max(LogDate))+1 end FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')
       ELSE (SELECT month(max(LogDate)) FROM LogTime WHERE EmployeeCode='${req.query.EmpID}')
       END ) 
    AND day(LogDate) IN (1,2,3,4,5)
    AND EmployeeCode='${req.query.EmpID}'`
}