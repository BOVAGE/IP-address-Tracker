import 'dotenv/config';
import express, { response } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

const apiKey = process.env.apiKey;
const mapboxToken = process.env.mapboxToken;
const baseUrl = `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`;

// geo.ipify api does not return lat and long alongside its response 
// I used another api to get the lat and long https://ip-api.com/

app.get("/", async (req, res) => {

    const resp = await fetch(baseUrl);
    let  data = await resp.json();
    const ipAddress = data.ip;
    const latLongUrl = `http://ip-api.com/json/${ipAddress}?fields=lat,lon`;
    const latLongResp = await fetch(latLongUrl);
    const latLongData = await latLongResp.json();
    data.mapboxToken = mapboxToken;
    data = {...data, ...latLongData};
    res.render("index.ejs", data);
});

app.post("/", async (req, res) => {
    const resp = await fetch(baseUrl + `&ipAddress=${req.body.ip_address}`);
    if (resp.status === 200){
        let data = await resp.json();
        const ipAddress = data.ip;
        const latLongUrl = `http://ip-api.com/json/${ipAddress}?fields=lat,lon`;
        const latLongResp = await fetch(latLongUrl);
        const latLongData = await latLongResp.json();
        data.mapboxToken = mapboxToken;
        data = {...data, ...latLongData};
        res.render("index.ejs", data);
    } else{
        res.redirect("/");
    }
    
})



console.log(apiKey);

app.listen('3000', () => {
    console.log("Server listening on Port 3000");
});