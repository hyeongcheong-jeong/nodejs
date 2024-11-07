const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv'); 
const path = require('path');

dotenv.config();
const indexRouter = require('./router/');
const app = express();
app.set('port', process.env.PROT || 3000);
//middleware
app.use(morgan('dev'));// 요청과 응답에 대한 정보를 콘솔에 기록함 인수로 dev, combined, common, short, tiny등이 있음
app.use('/', express.static(path.join(__dirname, 'public')));// 정적 파일경로를 지정해주는 역활을 함. 파일경로, 폴더명으로 작성

app.use(express.json());//요청의 본문에 있는 데이터(res.body)를 객치로 만들어 주는 미들웨어 폼데이터나 AJAX요청의 데이터 처리.(멀티파트 이미지, 동영상, 파일은 처리하지 못함);
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));
app.use((req, res, next) => {
  console.log('모든 요청에 다실행됩니다.');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/user', indexRouter);
app.use((req, res, next) => {
  console.log(res.status);
  res.status(404).send('not Found');
  next();
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} 포트에서 서버 실행되었습니다.`);
});