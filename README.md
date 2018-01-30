# visual-asset-manager
#### Description
An online asset manager for teams producing a lot of visual content. 

#### MVP:
- Users will be able to sign in, upload images, and save them. The app will store the user data along with image metadata info in database, and store the image in S3. 
- Users can update their own content, but not other people's content. 
- Gallery of all contents shows up on sign in. 
- Flags in metadata for filtering 
- One flag will be 'public', which won't require signin to view. 

#### Stretch Goals:
- Movies
- Animated filtering/layout
- slack app integration 
- downloading with a button instead of right click
- keeping track of number of downloads
- upvoting/likes, comments
- save your own collection (ie pinterest boards)

#### server setup 
in `/`:
create a `.env` file: 
```shell
PORT=5000
DB_URL=mongodb://localhost:27017/visual_files_dev
APP_SECRET=[something super secret]
NODE_ENV=dev
API_URL=http://localhost:5000/api/v1
AUTH_URL=http://localhost:5000/api/v1
CORS_ORIGINS=http://localhost:8080
IMAGECLOUD_SECRET=[secrent thing again]
AWS_BUCKET=[name of bucket]
AWS_ACCESS_KEY_ID=[your access key]
AWS_SECRET_ACCESS_KEY=[your secret key]
```
in `server/`:

1. run `npm i`
2. run `npm run dev`
