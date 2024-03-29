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

const nodemailer = require('nodemailer')

let current_time = require('../data/current_time')

router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});



//회원추가
router.post('/signup', (req, res, next) => {
    try {

        const id = req.body.id
        const pw = req.body.pw
        const user_name = req.body.user_name
        const nickName = req.body.nickName
        const phoneNumber = req.body.phoneNumber
        const userLevel = req.body.userLevel
        const userPoint = req.body. userPoint
        const user_email = req.body.user_email;

        if (isNotNullOrUndefined([id, pw, userLevel, nickName, phoneNumber, userPoint, user_email], user_name)) {
            let sql = "SELECT * FROM user_table WHERE id=?"
            let sql2 = "SELECT * FROM user_table WHERE nick_name=?"

            db.query(sql, [id], (err, result) => {  
                if (result.length > 0)
                    response(req, res, -200, "중복되는 아이디 입니다.", [])
                else {
                    db.query(sql2, [nickName], (err, result2) => {  
                    if (result2.length > 0)
                        response(req, res, -200, "중복되는 닉네임 입니다.")
                    else {
                    console.log(salt)
                    crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                        // bcrypt.hash(pw, salt, async (err, hash) => {
                        let hash = decoded.toString('base64')

                        if (err) {
                            console.log(err)
                            response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                        }

                        sql = 'INSERT INTO user_table (id, pw, nick_name , phone_number, user_level, user_point, user_email, user_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                        await db.query(sql, [id, hash, nickName, phoneNumber, userLevel, userPoint, user_email, user_name], (err, result) => {

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
                }
              )}
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
    try {

        const pk = req.body.pk
        const pw = req.body.pw
        const newPw = req.body.newPw

        if (isNotNullOrUndefined([pk, pw, newPw])) {
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

// 회원가입 이메일 인증 추가

router.post('/checkemail', async (req, res) => {
    try {
            const user_email = req.body.user_email;

            db.query('SELECT pk FROM user_table WHERE user_email=?', [user_email], async (err, result) => {
                if(err) {
                    console.log(err)
                    response(req, res, -200, "이메일 조회 실패", [])
                } else {
                    if(result.length>0) {
                        response(req, res, 200, "이메일 중복", 300)
                    } else {
                        const mailPoster  = nodemailer.createTransport({
                            service: 'naver',              
                            prot: 587,
                            host: 'smtp.naver.com',
                            auth: {
                                user: process.env.REACT_APP_ID,           
                                pass: process.env.REACT_APP_PASSWORD                 
                            }
                        });
                    
                        let number = Math.floor(Math.random() * 1000000)+100000; 
                        if(number>1000000){                                      
                           number = number - 100000;                            
                        }
                    
                        await mailPoster .sendMail({   
                            from: process.env.REACT_APP_ADDRESS,             
                            to: user_email,                        
                            subject: 'auction 회원가입 이메일 인증입니다.',                  
                            text: '인증 칸에 아래의 숫자를 입력해주세요. \n'+number                      
                        });   
                        response(req, res, 200 ,"메일 전송 성공", number)
                    }
                }
            })

    } catch (err) {
        console.log(err)
        response(req, res, -200 ,"서버 에러 발생", [])
    }
})

// 아이디 찾기

router.post('/findid', (req, res) => {
    try {
        const user_name = req.body.user_name;
        const user_email = req.body.user_email;

        db.query('SELECT id FROM user_table WHERE user_name=? AND user_email=?', [user_name, user_email], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "아이디 조회 실패", [])
            } else {
                response(req, res, 200, "아이디 조회 성공", result[0])
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 비밀번호 찾기

router.post('/findpw', (req, res) => {
    try {
        const id = req.body.id;
        const user_name = req.body.user_name;
        const user_email = req.body.user_email;

        db.query('SELECT pk FROM user_table WHERE id=? AND user_name=? AND user_email=?', [id, user_name, user_email], async (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "아이디 조회 실패", [])
            } else {
                if (result.length<1) {
                    response(req, res, 200, "조회 된 아이디 없음", 300)
                } else {
                    let number = Math.floor(Math.random() * 1000000)+100000; 
                    if(number>1000000){                                      
                       number = number - 100000;                            
                    }
                
                    const mailPoster  = nodemailer.createTransport({
                        service: 'naver',              
                        prot: 587,
                        host: 'smtp.naver.com',
                        auth: {
                            user: process.env.REACT_APP_ID,           
                            pass: process.env.REACT_APP_PASSWORD                 
                        }
                    });
                            
                    await mailPoster .sendMail({   
                        from: process.env.REACT_APP_ADDRESS,             
                        to: user_email,                        
                        subject: 'auction 비밀번호 임시 변경 알림입니다.',                  
                        text: `가입하신 회원님 아이디(${id})의 비밀번호가 아래 6자리 숫자로 임시 변경되었습니다. 내정보에서 반드시 비밀번호를 변경해주세요 \n`+number                      
                    });

                    const num = number.toString();

                    crypto.pbkdf2(num, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                        if (err) {
                            console.log(err)
                            response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                        }

                        let hash = decoded.toString('base64')

                        db.query('UPDATE user_table SET pw=? WHERE id=?', [hash, id], (err, result) => {
                            if(err) {
                                console.log(err)
                                response(req, res, -200 ,"비밀번호 임시 변경 실패", [])
                            } else {
                                response(req, res, 200, "비밀번호 임시 변경", [])
                            }
                        })
                    })
                }
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 회원 탈퇴
router.post('/singout', (req, res, next) => {
    try {
        const pk = req.body.pk
        const pw = req.body.pw

        if (isNotNullOrUndefined([pk, pw])) {
            let sql = "SELECT pw FROM user_table WHERE pk=?"

            db.query(sql, [pk], (err, result) => {
                if (err) {
                    console.log(err)
                    response(req, res, -200, "비밀번호 조회 실패", [])
                }
                else {

                    crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
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
                                db.query('DELETE FROM user_table WHERE pk =?', [pk], (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        response(req, res, -200, "회원 탈퇴 실패", [])
                                    } else {
                                        response(req, res, 200, "회원 탈퇴 성공", [])
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
            let reliability = decode.reliability
            let user_point = decode.user_point
            let user_icon = decode.user_icon
            let user_use_icon = decode.user_use_icon
            let level = decode.user_level
            let user_email = decode.user_email
            let user_name = decode.user_name
            res.send({ id, first, second, pk, nick_name, level, phone_number, reliability, user_point, user_icon, user_use_icon, user_email, user_name })
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
                return response(req, res, -200, "아이디나 비밀번호가 일치하지 않습니다.", []);

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
                    phone_number: user.phone_number,
                    reliability: user.reliability,
                    user_point: user.user_point,
                    user_icon: user.user_icon,
                    user_use_icon: user.user_use_icon,
                    user_email: user.user_email,
                    user_name: user.user_name
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
// 홈 화면
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
        let sql = 'SELECT * FROM item_table WHERE buy_count=0 ORDER BY RAND() LIMIT 12'
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

router.post('/home2', (req, res, next) => {
    try {
        const params = req.body.params;
        let sql = 'SELECT * FROM community_table WHERE kind=? ORDER BY pk DESC LIMIT 5'
        if(params===3) {
            sql = 'SELECT * FROM item_table WHERE buy_count=1 ORDER BY pk DESC LIMIT 5' 
        }
        db.query(sql, [params], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "홈 불러오기 실패", [])
            } else {
                response(req, res, 200, "홈 불러오기 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/searchauction', (req, res, next) => {
    try {
        const keyword = req.body.keyword ? req.body.keyword  :  "";
        const kind = req.body.kind ? req.body.kind : "";
        let sql = ''
        if(kind==="auction") {
            sql = `SELECT * FROM item_table WHERE buy_count=0 AND(name LIKE '%${keyword}%' OR category_list LIKE '%${keyword}%')`
        } else if (kind==="community") {
            sql = `SELECT * FROM community_table WHERE title LIKE '%${keyword}%' OR content LIKE '%${keyword}%'`
        } else if (kind==="username") {
            sql = `SELECT * FROM item_table WHERE buy_count=0 AND(seller_nickname LIKE '%${keyword}%')`
        }
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
// 경매 불러오기
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
        db.query('UPDATE item_table SET views=views+1 WHERE pk=?',[pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/auctionlist', async (req, res, next) => {
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
        let page = req.body.page ? req.body.page :false;
        let sql1 = `SELECT COUNT(*) FROM item_table WHERE buy_count=0`;
        let sql2 = `SELECT * FROM item_table WHERE buy_count=0 ORDER BY pk DESC`;
        if (page) {
            sql2 += ` LIMIT ${(page - 1) * 12}, 12 `;
        }
        db.query(sql1, async (err, result1) => {
            if (err) {
                response(req, res, -200, "fail", [])
            } else {
                await db.query(sql2, (err, result2) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        let maxPage = result1[0]['COUNT(*)'];
                        if (maxPage % 12) {
                            maxPage = (maxPage - maxPage % 12) / 12 + 1
                        }
                        else {
                            maxPage = maxPage / 12
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
        let page = req.body.page ? req.body.page   :false;
        let kind = req.body.kind;
        let sql1 = `SELECT COUNT(*) FROM community_table WHERE kind=${kind} `;
        let sql2 = `SELECT * FROM community_table WHERE kind=${kind} ORDER BY pk DESC`;
        let sql3 = 'SELECT pk FROM community_table'
        if (page) {
            sql2 += ` LIMIT ${(page - 1) * 10}, 10 `;
        }

        db.query(sql1, async (err, result1) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else if(kind===4) {
                db.query(sql3, (err, result) => {
                    if(err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    } else {
                        response(req, res, 200, "success", result)
                    }
                })
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

router.post('/addcommunity', (req, res, next) => {
    try {
        const kind = req.body.kind
        const title = req.body.title
        const content = req.body.content
        const userPk = req.body.userPk
        const nickname = req.body.nickname
        const user_reliability = req.body.user_reliability
        const user_icon = req.body.user_icon
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
        db.query(`INSERT INTO community_table (kind, title, content, user_pk, create_time, user_nickname, views, user_reliability, user_icon) VALUES (?,?,?,?,?,?,?,?,?)`, [kind, title, content, userPk, moment, nickname,0,user_reliability, user_icon], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "업로드 실패", [])
            } else {
            }
        })
        db.query(`UPDATE user_table SET user_point=user_point+5 WHERE pk=?`, [userPk], (err, result) => {
            if (err) {
                response(req, res, -200, "포인트 추가 실패", [])
            } else {
                response(req, res, 200, "업로드 성공")
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/editcommunity', (req, res, next) => {
    try {
        const pk = req.body.pk;
        const title = req.body.title;
        const content = req.body.content

        db.query(`UPDATE community_table SET title=?, content=? WHERE pk=?`, [title, content, pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "업로드 실패", [])
            } else {
                response(req, res, 200, "업로드 성공")
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

// 커뮤니티 댓글 추가
router.post('/addcomment', (req, res, next) => {
    try {
        const community_pk = req.body.pk;
        const comment_user_pk = req.body.user_pk;
        const comment_user_nickname = req.body.user_nickname;
        const comment_content = req.body.comment_content
        const user_reliability= req.body.user_reliability
        const user_icon= req.body.user_icon
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

        const sql = 'INSERT INTO community_comment (community_pk, comment_user_pk, comment_user_nickname, comment_content, create_time, comment_user_reliability, comment_user_icon) VALUES (?,?,?,?,?,?,?)'

        db.query(sql, [community_pk, comment_user_pk, comment_user_nickname, comment_content, moment, user_reliability, user_icon], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "댓글 추가 실패", [])
            } else {
                response(req, res, 200, "댓글 추가 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/comment', (req, res, next) => {
    try {
        const pk = req.body.pk
    
        db.query('SELECT * FROM community_comment WHERE community_pk=?', [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "댓글 불러오기 실패", [])
            } else {
                response(req, res, 200, "댓글 불러오기 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/commentinfo', (req, res, next) => {
    try {
        const pk = req.body.pk;

        db.query('SELECT comment_content FROM community_comment WHERE pk=?', [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "댓글 정보 불러오기 실패", [])
            } else {
                response(req, res, 200, "댓글 정보 불러오기 성공", result[0])
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.put('/commentedit', (req, res, next) => {
    try {
        const pk = req.body.pk
        const comment_content = req. body.comment_content

        db.query('UPDATE community_comment SET comment_content=? WHERE pk=?', [comment_content, pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "댓글 수정 실패", [])
            } else {
                response(req, res, 200,"댓글 수정 성공")
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/deletecomment', (req, res, next) => {
    try {
        const pk = req.body.pk;

        db.query('DELETE FROM community_comment WHERE pk=?', [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "댓글 삭제 실패", [])
            } else {
                response(req, res, 200, "댓글 삭제 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 커뮤니티 답글 추가

router.post('/addreply', (req, res, next) => {
    try {
        const comment_pk = req.body.comment_pk 
        const user_pk = req.body.user_pk
        const user_nickname = req.body.user_nickname
        const reply_content = req.body.reply_content
        const user_icon = req.body.user_icon
        const user_reliability = req.body.user_reliability
        const community_pk = req.body.community_pk

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
        
        let sql = 'INSERT INTO community_reply (community_comment_pk, reply_user_pk, reply_user_nickname, reply_content, create_time, reply_user_icon, reply_user_reliability, community_pk) VALUES (?,?,?,?,?,?,?,?)'

        db.query(sql, [comment_pk, user_pk, user_nickname, reply_content, moment, user_icon, user_reliability, community_pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, '답글 등록 실패', [])
            } else {
                response(req, res, 200, '답글 등록 성공', result)
            }
        })

    } catch (err) {
        console.log(err)
        response(req, res, -200, '서버 에러 발생', [])
    }
})

router.post('/reply', (req, res, next) => {
    try {
        const pk = req.body.pk

        db.query('SELECT * FROM community_reply WHERE community_pk=?', [pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "답글 불러오기 실패", [])
            } else {
                response(req, res, 200, "답글 불러오기 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/replyinfo', (req, res, next) => {
    try {
        const pk = req.body.pk

        db.query('SELECT reply_content FROM community_reply WHERE pk=?', [pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "답글 정보 불러오기 실패", [])
            } else {
                response(req, res, 200, "답글 정보 불러오기 성공", result[0])
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.put('/editreply', (req, res, next) => {
    try {
        const pk = req.body.pk
        const reply_content = req.body.reply_content

        db.query('UPDATE community_reply SET reply_content=? WHERE pk=?', [reply_content, pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "답글 수정 실패", [])
            } else {
                response(req, res, 200, "답글 수정 성공")
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/deletereply', (req, res, next) => {
    try {
        const pk = req.body.pk

        db.query('DELETE FROM community_reply WHERE pk=?', [pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "답글 삭제 실패", [])
            } else {
                response(req, res, 200, "답글 삭제 성공", result)
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 랭킹 불러오기

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
        db.query('UPDATE community_table SET views= views+1 WHERE pk=?',[pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "실패", [])
            } else {
            }
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 커뮤니티 추천 반대 추가

router.post('/addup_down', (req, res) => {
    try {
        const community_pk = req.body.community_pk;
        const comment_pk = req.body.comment_pk;
        const reply_pk = req.body.reply_pk;
        const user_pk = req.body.user_pk;
        const up_down = req.body.up_down;
        
        let sql = '';
        let params = [];

        if (comment_pk) {
            sql = `INSERT INTO up_down_table (community_pk, comment_pk, user_pk, up_down) VALUES (?,?,?,?)`;
            params = [community_pk, comment_pk, user_pk, up_down];
        } else if (reply_pk) {
            sql = `INSERT INTO up_down_table (community_pk, reply_pk, user_pk, up_down) VALUES (?,?,?,?)`;
            params = [community_pk, reply_pk, user_pk, up_down];
        } else {
            sql = `INSERT INTO up_down_table (community_pk, user_pk, up_down) VALUES (?,?,?)`;
            params = [community_pk, user_pk, up_down];
        }

        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200 ,"추천 반대 실패", [])
            } else {
                response(req, res, 200, "추천 반대 성공", [])
            }
        })
    } 
    catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 추천 반대 조회
router.post('/up_down', (req, res) => {
    try {
        const community_pk = req.body.community_pk;

        db.query(`SELECT * FROM up_down_table WHERE community_pk=?`,[community_pk] ,(err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200 ,"추천 반대 실패", [])
            } else {
                response(req, res, 200, "추천 반대 성공", result)
            }
        })
    } 
    catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//경매 로그 추가
router.post('/addchat', (req, res) => {
    try {
        console.log(req.body)
        const nickname = req.body.nickname
        const userPk = req.body.userPk
        const content = req.body.content
        const reliability = req.body.reliability
        const icon = req.body.icon
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
        db.query('INSERT INTO chat_table (user_nickname, user_pk, content, create_time, item_pk, user_reliability, user_icon) VALUES (?,?,?,?,?,?,?)',[nickname,userPk,content,moment,itemPk,reliability,icon],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
            }
        })
        const post_id = req.body.post_id
        const postName = req.body.post_name
        const postTitle = req.body.post_title
        db.query('INSERT INTO messenger (chat_message, post_id, post_name, user_name, create_time, postTitle, notice) VALUES (?,?,?,?,?,?,?)',[content,post_id,postName,nickname,moment,postTitle,1],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "입력 성공", [])
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
        const reliability = req.body.reliability
        const icon = req.body.icon
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
        let content = `낙찰가를 ${price}원으로 올렸습니다.`
        await db.query('INSERT INTO chat_table (user_nickname, user_pk, content, create_time, item_pk, user_reliability, user_icon) VALUES (?,?,?,?,?,?,?)',[nickname,userPk,content,moment,itemPk,reliability,icon],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
            }
        })
        const post_id = req.body.post_id
        const post_name = req.body.post_name
        const postTitle = req.body.post_title
        await db.query('INSERT INTO messenger (chat_message, post_id, post_name, user_name, create_time, postTitle, notice) VALUES (?,?,?,?,?,?,?)',[content,post_id,post_name,nickname,moment,postTitle,1],(err, result)=>{
            if(err){
                console.log(err)
                response(req, res, -200, "서버 에러 발생", [])
            } else {
                response(req, res, 200, "메신저 입력 성공", [])
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
        await db.query('UPDATE user_table SET reliability=reliability+1, user_point=user_point+20 WHERE pk IN (?,?)',[sellerPk,buyerPk], (err, result) => {
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

// 유저 메신저 추가
router.post('/messengerinfo', async (req, res, next) => {
    try {
        const user_name = req.body.user_name;
        await db.query('SELECT * FROM messenger ORDER BY pk DESC;', (err, result) => {
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

//메신저 알람 추가

router.post('/messengernotice', async (req, res, next) => {
    try {
        const user_name = req.body.user_name;
        const user_tag = req.body.user_tag ? req.body.user_tag : "" ;

        await db.query(`SELECT * FROM messenger WHERE post_name=? OR chat_message LIKE '%${user_tag}%'`, [user_name], (err, result) => {
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

router.post('/deletenotice', async (req, res, next) => {
    try {
        const pk = req.body.pk
        
        await db.query('UPDATE messenger SET notice =? WHERE pk =?', [0, pk], (err, result) => {
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

// 유저 태그 추가
router.post('/usertag', (req, res, next) => {
    try {
        const nickname = req.body.nickname
        const userTag = req.body.userTag

        db.query('SELECT pk FROM user_tag WHERE user_name=?', [nickname], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "태그 조회 실패", [])
            } else {
                let sql = '';
                let params = [userTag, nickname]
                if (result.length<1) {
                    sql = `INSERT INTO user_tag ( userTag, user_name ) VALUES (?,?)`;
                } else {
                    sql = 'UPDATE user_tag SET userTag=? WHERE user_name=?'
                }
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "태그 등록 실패", [])
                    } else {
                        response(req, res, 200, "태그 등록 성공", [])
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

router.post('/usertaginfo', async (req, res, next) => {
    try {
        const user_name = req.body.user_name;

        await db.query('SELECT * FROM user_tag WHERE user_name=?', [user_name], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result[0])
            } 
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 메신저 관리자 문의 추가
router.post('/addadminchat', (req, res, next) => {
    try {
        const chat_name = req.body.chat_name
        const chat_message = req.body.chat_message
        const chat_id = req.body.chat_id

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

        db.query(`INSERT INTO admin_chat (chat_name, chat_message, create_time, chat_id) VALUES (?,?,?,?)`, [chat_name, chat_message, moment, chat_id], (err, result) => {
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

router.get('/adminchatinfo', async (req, res, next) => {
    try {
        const user_name = req.body.user_name;
        await db.query('SELECT * FROM admin_chat', (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result)
            } 
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.get('/userinfo', async (req, res, next) => {
    try {
        await db.query(`SELECT * FROM user_table`, (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result)
            }
        })
    } catch {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/adminchatinfo/user', async (req, res, next) => {
    try {
        const chat_name = req.body.chat_name;
        await db.query('SELECT * FROM admin_chat WHERE chat_id=?', [chat_name], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result)
            } 
        })
    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 관리자 유저 관리 추가

router.post('/userinfo/user', async (req, res, next) => {
    try {
        const pk = req.body.pk
        
        await db.query(`SELECT * FROM user_table WHERE pk=?`, [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result[0])
            }
        })
    } catch {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/useredit', async (req, res, next) => {
    try {
        const pk = req.body.pk
        const nick_name = req.body.nick_name
        const phone_number = req.body.phone_number
        const reliability = req.body.reliability
        const user_point = req.body.user_point

        const user_name = req.body.user_name;

        let sql ='';
        let params = [];

        if(!user_name) {
            sql= `UPDATE user_table SET nick_name=?,phone_number=?,reliability=?,user_point=?  WHERE pk=?`
            params = [nick_name,phone_number,reliability,user_point, pk];
        } else {
            sql = 'UPDATE user_table SET user_name=?, phone_number=? WHERE pk =?'
            params = [user_name, phone_number, pk]
        }

        await db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result)
            }
        })
    } catch {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 아이콘 상점 추가

router.post('/buyicon', async (req, res) => {
try {
    const pk = req.body.pk
    const iconName = req.body.name
    const iconPoint = req.body.point

    await db.query(`UPDATE user_table SET user_icon=IFNULL(CONCAT(user_icon, "${iconName}"), "${iconName}"), user_point=user_point-${iconPoint} WHERE pk=?`, [pk], (err, result)=> {
        if(err) {
            console.log(err)
            response(req, res, -200, "fail", [])
        } else {
            response(req, res, 200, "sucess", result)
        }
    })
    
 } catch {
    console.log(err)
    response(req, res, -200, "서버 에러 발생", [])
 }
})

router.post('/applyicon', async (req, res) => {
    try {
        const pk = req.body.pk
        const name = req.body.name

        await db.query('UPDATE user_table SET user_use_icon =? WHERE pk =?', [name, pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            } else {
                response(req, res, 200, "sucess", result)
            }
        })
    } catch {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 쪽지 추가
router.post('/addnote', (req, res) => {
    try {
        const send_user = req.body.send_user;
        const receive_user = req.body.receive_user;
        const title = req.body.title;
        const content = req.body.content;

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

        db.query('SELECT pk FROM user_table WHERE nick_name=?', [receive_user], (err, result) => {
            if(err) {
                console.log(err)
            } else if(result.length < 1) {
                response(req, res, -200, `${receive_user}님을 찾을 수 없습니다. 닉네임을 확인해주세요.`, [])
            } else {
                let sql = 'INSERT INTO note_table (send_user, receive_user, title, content, create_time) VALUES (?, ? ,? ,? , ?)';
                db.query(sql, [send_user, receive_user, title, content, moment], (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "쪽지 전송 실패", [])
                    } else {
                        response(req, res, 200, "쪽지 전송 성공", [])
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/note', (req, res) => {
    try {
        const user_nickname = req.body.user_nickname

        db.query('SELECT * FROM note_table WHERE send_user=? OR receive_user=? ORDER BY pk DESC', [user_nickname, user_nickname], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200 , "쪽지 조회 실패", [])
            } else {
                response(req, res, 200, "쪽지 조회 성공", result)
            }
        })

    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/notelist', (req, res) => {
    const receive_user = req.body.receive_user;

    db.query('SELECT pk FROM note_table WHERE receive_user=? AND notice=1', [receive_user], (err, result) => {
        if(err) {
            console.log(err)
            response(req, res, -200, "받은 쪽지 조회 실패", [])
        } else {
            response(req, res, 200, "받은 쪽지 조회 성공", result.length)
        }
    })
})

router.post('/updatenote', (req, res) => {
    try {
        const pk = req.body.pk;
        const delete_kind = req.body.delete_kind;

        db.query(`UPDATE note_table SET ${delete_kind}=1 WHERE pk=?`, [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "쪽지 업데이트 실패", [])
            } else {
                response(req, res, 200, "쪽지 업데이트 성공", [])

                db.query(`DELETE FROM note_table WHERE send_delete='1' AND receive_delete='1'`, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "쪽지 삭제 실패", [])
                    }
                })
            }
        })
    } catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/readnote', (req, res) => {
    try {
        const pk = req.body.pk
        const kind = req.body.kind;

        db.query('SELECT * FROM note_table WHERE pk=?', [pk], (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "쪽지 조회 실패"), []
            } else {
                response(req, res, 200, "쪽지 조회 성공", result[0])
            }
        })

        if(kind == 1) {
            db.query('UPDATE note_table SET notice=0 WHERE pk=?', [pk], (err, result) => {
                if(err) {
                    console.log(err)
                }
            })
        }


    } catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//경매 자동 매수 시스템 추가

router.post('/autosystem', (req, res) => {
    try {
        const auction_pk = req.body.auction_pk;
        const user_pk = req.body.user_pk;
        const max_price = req.body.max_price;
        const purchase_price = req.body.purchase_price;
        const kind = req.body.kind;
        
        let sql = ''
        let params = []
        if(kind==='add') {
            sql = 'INSERT INTO auto_auction_system (auction_pk, user_pk, max_price, purchase_price) VALUES (?,?,?,?)';
            params = [auction_pk, user_pk, max_price, purchase_price]
        } else {
            sql = 'UPDATE auto_auction_system SET max_price=?, purchase_price=? WHERE auction_pk=? AND user_pk=?'
            params = [max_price, purchase_price, auction_pk, user_pk]
        }

        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200 , "시스템 등록 실패", [])
            } else {
                response(req, res, 200 , "시스템 등록 성공", [])
            }
        })
    } catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/autosysteminfo', (req, res) => {
    try {
        const {auction_pk, user_pk, kind} = req.body;

        let sql = '';
        let params = [];

        if(kind === 'all') {
            sql = 'SELECT user_pk, max_price, purchase_price FROM auto_auction_system WHERE auction_pk=? ORDER BY pk DESC';
            params = [auction_pk];
        } else {
            sql = 'SELECT max_price, purchase_price FROM auto_auction_system WHERE auction_pk=? AND user_pk=?';
            params = [auction_pk, user_pk]
        }

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err)
                response(req, res, -200, "매수 시스템 조회 실패", [])
            } else {
                response(req, res, 200, "매수 시스템 조회 성공", kind === 'all' ? result : result[0])
            }
        })
    } catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    } 
})

router.post('/autosystem/message', (req, res) => {
    try{
        const item_pk = req.body.item_pk;
        const item_title = req.body.item_title;
        const user_pk = req.body.user_pk;
        const max_price = req.body.max_price

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

        let sql = 'INSERT INTO messenger (chat_message, post_id, post_name, user_name, create_time, postTitle, notice) VALUES (?, ?, ? , ?, ?, ?, ?)';

        db.query(sql, [max_price, item_pk, '-', user_pk, moment, item_title, 1], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "메신저 전송 실패", [])
            } else {
                response(req, res, 200, "메신저 전송 성공", [])
            }
        })

    } catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/autosystem/notice', (req, res) => {
    try {
        const user_pk = req.body.user_pk;

        db.query('SELECT * FROM messenger WHERE user_name=?', [user_pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200 , "알림 조회 실패", [])
            } else {
                response(req, res, 200, "알림 조회 성공", result)
            }
        })
    }catch(err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

module.exports = router;        