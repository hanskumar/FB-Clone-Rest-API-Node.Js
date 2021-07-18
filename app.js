import express from 'express'
import { APP_PORT, DB_URL } from './config';
import routes from './routes'
import mongoose from 'mongoose';
import errorHandler from './midllewares/errorHandler';


const app = express();


// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDB Database connected...');
});



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api',routes);
/* app.use('/', (req, res) => {
    res.send(`
  <h1>Welcome to FB-Clone Node Rest APIs</h1>`);
}); */

app.use(errorHandler);
const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));