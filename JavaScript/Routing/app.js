const express = require("express");
//admin.js 가져오기
const admin = require("./routes/admin");
//nunjucks를 이용한 template 구성(출력담당)
const nunjucks = require("nunjucks");
//morgan 사용하기(사용자의 url request를 보여준다)
const logger = require("morgan");
//bodyparser, 바로 내장함수로 사용가능
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

//app.js -> admin -> render -> template -> admin/products. ->..
nunjucks.configure("template", {
  //코딩오기를 자동적으로 인식하고 관련 문자로 치환
  authoescape: true,
  //express 객체지정
  express: app,
});

//미들웨어1_morgan
app.use(logger("dev"));
//미들웨어2_bodyparser
//bodyparser 지정을 해줘야 입력받은 데이터 제출의 객체화가 가능해진다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app함수에서 url요청을 받고 이후에 함수 로직이 실행되도록 설정
//req, res를 통해 사용자에게 보여주도록 설정
//사용자 출력 설정

//정적파일설정
//정적파일은 uploads/1.jpeg로 주소를 입력해줘야 사진이 나옴
app.use("/uploads", express.static("uploads"));

//Global Variable
app.use((req, res, next) => {
  app.locals.isLogin = true;
  next();
});

app.get("/", (req, res) => {
  res.send("hello express!");
});

//미들웨어
//아래 url 요청이 들어온다면, 관련 인자(admin)을 참고하라
///hyokyun이후에 추가적인 url이(아래에선 admin) 온다면 app.js에서는 관련 로직이 없으므로
//admin 인자를 참고하여, admin.js 로직을 참고하는 것임
app.use("/admin", admin);

//ROuting 로직이 완료된 후에 404error가 나온다면
//404 error handling
app.use((req, res, _) => {
  res.status(400).render("common/404.html");
});
//505 error handling
app.use((req, res, _) => {
  res.status(500).render("common/500.html");
});

// 웹서버 로직 구성
// 여기서는 port가 잘 설정되었는지 확인
// 포트 등
app.listen(port, () => {
  console.log("Express listened on port No", port);
});

//node http_response.js
//package.json의 script에서 별도 설정시 npm ~ 입력 안해도 됨
