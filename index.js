// // npm install -g yarn
// // npm init
// // cài các thư viện :
// //  npm install mysql2
// // npm install sequelize 
// //  npm install sequelize-cli

// // tạo cấu trúc sequelize init:
// // npx sequelize-cli init

//     // npx sequelize-cli model:generate --name Ratings --attributes rating_id:integer,user_id:integer,story_id:integer,added_at:date

// // npx sequelize-cli model:generate --name Users --attributes username:string,email:string,password_hash:string,phone_number:string,full_name:string,date_of_birth:date,gender:string,avatar_url:string,is_admin:boolean,created_at:date
// // npx sequelize-cli model:generate --name Genres --attributes name:string
// // npx sequelize-cli model:generate --name Stories --attributes title:string,author:string,cover_image_url:string,summary:text,status:string,created_by_user_id:integer,rating_average:decimal,total_ratings:integer,view_count:integer,is_exclusive:boolean,published_at:date
// // npx sequelize-cli model:generate --name Chapters --attributes story_id:integer,chapter_number:integer,title:string,content:text,published_at:date
// // npx sequelize-cli model:generate --name Story_Genres --attributes story_id:integer,genre_id:integer
// // npx sequelize-cli model:generate --name Reading_History --attributes user_id:integer,story_id:integer,last_chapter_read_id:integer,last_read_at:date
// // npx sequelize-cli model:generate --name Favorites --attributes user_id:integer,story_id:integer,added_at:date



// // cài đặt express
// // npm install express
// // npm install dotenv nodemon
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppRouter from './routes/AppRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

AppRouter(app);

app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
