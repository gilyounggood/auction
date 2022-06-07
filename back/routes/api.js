const express = require('express')
const passport = require('passport')
//const { json } = require('body-parser')
const router = express.Router()
const cors = require('cors')
router.use(cors())
router.use(express.json())

const crypto = require('crypto')
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { checkLevel, getSQLnParams, getUserPKArrStrWithNewPK,
    isNotNullOrUndefined, namingImagesPath, nullResponse,
    lowLevelResponse, response, removeItems
} = require('../util')
const {
    getRowsNumWithKeyword, getRowsNum, getAllDatas,
    getDatasWithKeywordAtPage, getDatasAtPage,
    getKioskList, getItemRows, getItemList, dbQueryList, dbQueryRows
} = require('../query-util')

const db = require('../config/db')
const { upload } = require('../config/multerConfig')
const { Console } = require('console')
const { abort } = require('process')
//const { pbkdf2 } = require('crypto')
const salt = "435f5ef2ffb83a632c843926b35ae7855bc2520021a73a043db41670bfaeb722"
const saltRounds = 10
const pwBytes = 64
const jwtSecret = "djfudnsqlalfKeyFmfRkwu"

const geolocation = require('geolocation')

router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});



//회원추가
router.post('/signup', (req, res, next) => {
    // 값 받아올 때, id, pw, userLevel, brandList
    try {

        //logRequest(req)
        const id = req.body.id
        const pw = req.body.pw
        const nickName = req.body.nickName
        const phoneNumber = req.body.phoneNumber
        const userLevel = req.body.userLevel


        if (isNotNullOrUndefined([id, pw, userLevel, nickName, phoneNumber])) {
            //중복 체크 
            let sql = "SELECT * FROM user_table WHERE id=?"

            db.query(sql, [id], (err, result) => {
                if (result.length > 0)
                    response(req, res, -200, "ID가 중복됩니다.", [])
                else {
                    console.log(salt)
                    crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                        // bcrypt.hash(pw, salt, async (err, hash) => {
                        let hash = decoded.toString('base64')

                        if (err) {
                            console.log(err)
                            response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                        }

                        sql = 'INSERT INTO user_table (id, pw, nick_name , phone_number, user_level) VALUES (?, ?, ?, ?, ?)'
                        await db.query(sql, [id, hash, nickName, phoneNumber, userLevel], (err, result) => {

                            if (err) {
                                console.log(err)
                                response(req, res, -200, "회원 추가 실패", [])
                            }
                            else {
                                response(req, res, 200, "회원 가입 성공", [])
                            }
                        })
                    })
                }
            })
        }
        else {
            nullResponse(req, res)
        }

    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//비밀번호 변경
router.post('/changepassword', (req, res, next) => {
    // 값 받아올 때, id, pw, userLevel, brandList
    try {

        const pk = req.body.pk
        const pw = req.body.pw
        const newPw = req.body.newPw

        if (isNotNullOrUndefined([pk, pw, newPw])) {
            //중복 체크 
            let sql = "SELECT pw FROM user_table WHERE pk=?"

            db.query(sql, [pk], (err, result) => {
                if (err) {
                    console.log(err)
                    response(req, res, -200, "비빌번호 변경 실패", [])
                }
                else {

                    crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                        // bcrypt.hash(pw, salt, async (err, hash) => {
                        let hash = decoded.toString('base64')

                        if (err) {
                            console.log(err)
                            response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                        }
                        else {
                            if (result[0].pw != hash) {
                                response(req, res, -200, "비밀번호가 일치하지 않습니다.", [])
                            }
                            else {
                                await crypto.pbkdf2(newPw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                                    // bcrypt.hash(pw, salt, async (err, hash) => {
                                    let hash2 = decoded.toString('base64')

                                    if (err) {
                                        console.log(err)
                                        response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                                    }
                                    else {
                                        await db.query('UPDATE user_table SET pw=? WHERE pk=?', [hash2, pk], (err, result) => {
                                            if (err) {
                                                console.log(err)
                                                response(req, res, -200, "비밀번호 변경 실패", [])
                                            } else {
                                                response(req, res, 200, "비밀번호 변경 성공", [])
                                            }
                                        })
                                    }


                                })
                            }
                        }


                    })
                }


            })
        }
        else {
            nullResponse(req, res)
        }

    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
// 권한 체크
router.get('/auth', (req, res, next) => {
    try {
        const decode = checkLevel(req.cookies.token, 0)

        if (decode) {
            let id = decode.id
            let pk = decode.code
            let nick_name = decode.nick_name
            let phone_number = decode.phone_number
            let first = decode.user_level >= 40
            let second = decode.user_level >= 0
            let level = decode.user_level
            res.send({ id, first, second, pk, nick_name, level, phone_number })
        }
        else {
            res.send({
                id: decode.id,
                first: false,
                second: false
            })
        }
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/login', (req, res, next) => {
    try {

        passport.authenticate('local', { session: false }, async (err, user, info) => {

            if (!user)
                return response(req, res, -200, "해당 계정이 존재하지 않습니다.", []);

            try {
                var expiresTime;

                if (user.userLevel < 40) {
                    expiresTime = '3600m'
                } else {
                    expiresTime = '3600m'
                }

                const token = jwt.sign({
                    code: user.pk,
                    id: user.id,
                    nick_name: user.nick_name,
                    user_level: user.user_level,
                    phone_number: user.phone_number
                },
                    jwtSecret,
                    {
                        expiresIn: '3600m',
                        issuer: 'fori',
                    });



                res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 60 * 1000 });



                return response(req, res, 200, user.id + '(' + user.nick_name + ')님 환영합니다.', []);
            }
            catch (err) {
                console.log(err);
                return response(req, res, -200, "로그인 중 오류 발생", [])
            }
        })(req, res, next);
    }
    catch (err) {
        console.log(err);
        response(req, res, -200, "로그인 중 오류 발생", [])
    }
})
router.post('/info', (req, res, next) => {
    try {
        const pk = req.body.pk;
        let data = {};
        db.query('SELECT * FROM user_table WHERE pk=?', [pk], async (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                data.info = result;
                await db.query(`SELECT * FROM item_table WHERE seller_pk=? OR (buyer_pk=? AND buy_count=1) ORDER BY pk DESC`, [pk, pk],async (err, result2) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        data.auction = result2
                        await db.query(`SELECT * FROM community_table WHERE user_pk=? ORDER BY pk DESC`, [pk], (err, result3) => {
                            if (err) {
                                console.log(err)
                                response(req, res, -200, "fail", [])
                            } else {
                                data.community = result3
                                response(req, res, 200, "sucess", data)
        
                            }
                        })
                    }
                })

            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
});
router.post('/logout', (req, res, next) => {
    try {
        res.clearCookie('token')
        //res.clearCookie('rtoken')
        response(req, res, 200, "로그아웃 성공", [])
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
});
router.post('/home', async (req, res, next) => {
    try {
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
        await db.query('UPDATE item_table SET  buy_count=1 WHERE end_date < ?', [moment], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            }
        })
        let sql = 'SELECT * FROM item_table WHERE buy_count=0 ORDER BY RAND() LIMIT 20'
        await db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "success", result)
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.post('/searchauction', (req, res, next) => {
    try {
        const keyword = req.body.keyword ? req.body.keyword  :  "";
        let sql = `SELECT * FROM item_table WHERE buy_count=0 AND(name LIKE '%${keyword}%' OR category_list LIKE '%${keyword}%')`
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "success", result)
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/item', (req, res, next) => {
    try {
        const pk = req.body.pk
        let data = {};
        db.query('SELECT * FROM item_table WHERE pk=?', [pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                data.item = result[0]
                db.query('SELECT * FROM favorite_table WHERE auction_pk=?', [pk], (err, result2) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        data.favorite = result2
                        response(req, res, 200, "success", data)
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})



//낙찰된 상품
router.post('/endauctionlist', (req, res, next) => {
    try {
        console.log(req.body)
        let page = req.body.page ? req.body.page : false;
        let sql1 = `SELECT COUNT(*) FROM item_table WHERE buy_count=1 `;
        let sql2 = `SELECT * FROM item_table WHERE buy_count=1 ORDER BY pk DESC`;
        if (page) {
            sql2 += ` LIMIT ${(page - 1) * 10}, 10`;
        }

        db.query(sql1, async (err, result1) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                await db.query(sql2, (err, result2) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        let maxPage = result1[0]['COUNT(*)'];
                        if (maxPage % 10) {
                            maxPage = (maxPage - maxPage % 10) / 10 + 1
                        }
                        else {
                            maxPage = maxPage / 10
                        }
                        response(req, res, 200, "성공", { maxPage: maxPage, result: result2 })
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.post('/communitylist', (req, res, next) => {
    try {
        console.log(req.body)
        let page = req.body.page ? req.body.page   :false;
        let kind = req.body.kind;
        let sql1 = `SELECT COUNT(*) FROM community_table WHERE kind=${kind} `;
        let sql2 = `SELECT * FROM community_table WHERE kind=${kind} ORDER BY pk DESC`;
        if (page) {
            sql2 += ` LIMIT ${(page - 1) * 10}, 10 `;
        }

        db.query(sql1, async (err, result1) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                await db.query(sql2, (err, result2) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        let maxPage = result1[0]['COUNT(*)'];
                        console.log(sql1)
                        console.log(result1)
                        if (maxPage % 10) {
                            maxPage = (maxPage - maxPage % 10) / 10 + 1
                        }
                        else {
                            maxPage = maxPage / 10
                        }
                        response(req, res, 200, "성공", { maxPage: maxPage, result: result2 })
                    }
                })
            }
        })

    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.post('/addcommunity', (req, res, next) => {
    try {
        const kind = req.body.kind
        const title = req.body.title
        const content = req.body.content
        const userPk = req.body.userPk
        const nickname = req.body.nickname
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
        db.query(`INSERT INTO community_table (kind, title, content, user_pk, create_time, user_nickname ) VALUES (?,?,?,?, ?, ?)`, [kind, title, content, userPk, moment, nickname], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "업로드 실패", [])
            } else {
                console.log(err)
                response(req, res, 200, "업로드 성공", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/delete', (req, res, next) => {
    try {
        console.log(req.body)
        const tableName = req.body.tableName
        const pk = req.body.pk
        db.query(`DELETE FROM ${tableName}_table WHERE pk=?`, [pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "삭제 실패", [])
            } else {
                console.log(err)
                response(req, res, 200, "삭제 성공", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.get('/ranking', (req, res, next) => {
    try {

        db.query(`SELECT * FROM user_table ORDER BY reliability DESC LIMIT 10`, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "가져오기 실패", [])
            } else {
                console.log(err)
                response(req, res, 200, "가져오기 성공", result)
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//커뮤니티 하나 불러오기
router.post('/community', (req, res) => {
    try {
        const pk = req.body.pk

        let sql = 'SELECT * FROM '
        sql += 'community' + '_table '
        sql += ` WHERE pk=${pk}`
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "실패", [])
            } else {
                response(req, res, 200, "성공", result[0])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//======================================
//채팅 추가
router.post('/addchat', (req, res) => {
    try {
        console.log(req.body)
        const nickname = req.body.nickname
        const userPk = req.body.userPk
        const content = req.body.content
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
        const itemPk = req.body.itemPk;
        db.query('INSERT INTO chat_table (user_nickname, user_pk, content, create_time, item_pk) VALUES (?,?,?,?,?)',[nickname,userPk,content,moment,itemPk],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "입력성공", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//채팅 불러오기
router.post('/chat', (req, res) => {
    try {
        const itemPk = req.body.itemPk
        db.query('SELECT * FROM chat_table WHERE item_pk=? ORDER BY pk ASC', [itemPk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "채팅 불러오기 성공", result)
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//시작가 변경
router.post('/changebid', (req, res) => {
    try {
        const price = req.body.price
        const itemPk = req.body.itemPk
        db.query('UPDATE item_table SET min_price=?, bid_price=? WHERE pk=?', [price,price, itemPk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "시작가 변경 완료", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//가격 올리기
router.post('/upbid',async (req, res) => {
    try {
        const price = req.body.price
        const itemPk = req.body.itemPk
        const nickname = req.body.nickname
        const userPk = req.body.userPk
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
        
        await db.query('UPDATE item_table SET bid_price=?, buyer_pk=?, buyer_nickname=? WHERE pk=?', [price, userPk, nickname, itemPk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
            }
        })
        let content = `낙찰가를 ${price}로 올렸습니다.`
        await db.query('INSERT INTO chat_table (user_nickname, user_pk, content, create_time, item_pk) VALUES (?,?,?,?,?)',[nickname,userPk,content,moment,itemPk],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "가격 올리기 완료", [])

            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//낙찰하기
router.post('/successfulbid', async (req, res) => {
    try {
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
        const itemPk = req.body.itemPk
        const sellerPk = req.body.sellerPk
        const buyerPk = req.body.buyerPk
        await db.query('UPDATE item_table SET buy_count=1, end_date=? WHERE pk=?',[moment,itemPk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
            }
        })
        await db.query('UPDATE user_table SET reliability=reliability+1 WHERE pk IN (?,?)',[sellerPk,buyerPk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "낙찰완료", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.post('/updatefavorite', async (req, res) => {
    try {
        const status = req.body.status
        const userPk = req.body.userPk
        const itemPk = req.body.itemPk
        let sql = '';
        if(status>0){
            sql = `INSERT INTO favorite_table (user_pk, auction_pk) VALUES (?, ?)`
        } else {
            sql = `DELETE FROM favorite_table WHERE user_pk=? AND auction_pk=? `
        }
        db.query(sql,[userPk, itemPk],(err, result) =>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "즐겨찾기 업데이트 완료", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
router.post('/myfavorite', async (req, res) => {
    try {
        const pk = req.body.pk
        db.query('SELECT * FROM favorite_table WHERE user_pk=?',[pk],async(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                let data = []
                for(var i =0;i<result?.length;i++){
                    data.push(result[i]?.auction_pk)
                }
                let join = (data ?? []).join()
                await db.query(`SELECT * FROM item_table WHERE pk IN (${join})`,(err, result2)=>{
                    if(err){
                        console.log(err)
                        response(req, res, -200, "서버 에러 발생", [])
                    } else {
                        console.log(result2)
                        response(req, res, 200, "즐겨찾기 불러오기 성공", result2)
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
module.exports = router;        