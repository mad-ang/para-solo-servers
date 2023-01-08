# Momstown


## DB 서버 세팅
```jsx
git pull
```

```jsx
yarn install
yarn add global sequelize-cli   
```

```jsx

// 자신의 로컬 터미널에서 mysql 설치 및 mysql 실행
brew install mysql 
mysql.server start

```

```jsx
// 유저생성 및 DB 권한 부여, DB생성
mysql -u root -p 

엔터

mysql> create user 'rootroot'@'%' identified by 'root123';

mysql> grant all privileges on momstown.* to 'rootroot'@'%' with grant option; flush privileges;

mysql> flush privileges;

mysql> CREATE DATABASE momstown;

exit
```

```bash
cd server

sequelize db:migrate
// 또는 npx sequelize db:migrate
```

이렇게 나오면 성공!

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/17908bb6-fc43-427d-ba26-e9088e41d0a9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230107T164734Z&X-Amz-Expires=86400&X-Amz-Signature=0d2bc34b1ce7fd29855dfec838bf29253468031b6399508293641efd4551c339&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)