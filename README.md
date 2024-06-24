# identify

### Hosted end point
```
https://identify-20wa.onrender.com/identify
```


### curl
```
 curl --location 'https://identify-20wa.onrender.com/identify' \
--data-raw '{
"email": "cv@email.com",
"phoneNumber": "9207866458"
}'
```






# <h3>How to start</h3>
1 clone the repo <br/>
2 npm install <br/>
3 create your mysql db and add its details in .env file
4 npm start


.env file   

```
PORT=4000       
DB_NAME=your_db_name          
DB_USERNAME=root or your username          
DB_PASSWORD= your password   
DB_HOST=localhost or the host 
```



