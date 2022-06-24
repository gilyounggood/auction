const fs = require('fs')
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const db = require('./config/db')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https')
const port = 8001;
app.use(cors());

require('dotenv').config()
//passport, jwt
const jwt = require('jsonwebtoken')
const { checkLevel, logRequestResponse, isNotNullOrUndefined, namingImagesPath, nullResponse, lowLevelResponse, response } = require('./util')
const passport = require('passport');
const passportConfig = require('./passport');

//multer
const {upload} = require('./config/multerConfig')

//express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

const path = require('path');
app.set('/routes', __dirname + '/routes');
app.use('/config', express.static(__dirname + '/config'));
//app.use('/image', express.static('./upload'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});


app.post('/api/addauction', upload.single('image'), (req, res) =>{
        try{
                              
                        const sql = 'INSERT INTO item_table (name, min_price, bid_price, category_list, seller_pk, seller_nickname, end_date, create_time, main_image) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ?)'
                        var today = new Date();
                        var year = today.getFullYear();
                        var month = ('0' + (today.getMonth() + 1)).slice(-2);
                        var day = ('0' + today.getDate()).slice(-2);
                        var dateString = year + '-' + month + '-' + day;
                        var hours = ('0' + today.getHours()).slice(-2);
                        var minutes = ('0' + today.getMinutes()).slice(-2);
                        var seconds = ('0' + today.getSeconds()).slice(-2);
                        var timeString = hours + ':' + minutes + ':' + seconds;
                        let moment = dateString + ' ' + timeString;
                        const name = req.body.name
                        const minPrice = req.body.minPrice
                        const categoryList = req.body.categoryList ? JSON.stringify(req.body.categoryList) : '[]'
                        const sellerPk = req.body.sellerPk
                        const sellerNickname = req.body.sellerNickname
                        const endDate = req.body.endDate

                        const {image, isNull} = namingImagesPath("ad", req.file)
                        const param = [name, minPrice,minPrice,categoryList, sellerPk, sellerNickname, endDate, moment, image]
                                db.query(sql, param, (err, rows, feild)=>{
                                        if (err) {
                                                
                                                console.log(err)
                                                response(req, res, -200, "경매 추가 실패", [])
                                        }
                                        else {
                                                
                                                response(req, res, 200, "경매 추가 성공", [])
                                        }
                                })
               
        }
        catch(err)
        {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
        }
})
//가게 사진 추가


app.listen(port, '0.0.0.0', () => {
        console.log("Server running on port " + port)
})

