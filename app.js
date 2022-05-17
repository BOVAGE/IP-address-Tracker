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

app.get("/", async (req, res) => {
    const resp = await fetch(baseUrl);
    const data = await resp.json();
    data.mapboxToken = mapboxToken;
    res.render("index.ejs", data);
});

app.post("/", async (req, res) => {
    const resp = await fetch(baseUrl + `&ipAddress=${req.body.ip_address}`);
    const data = await resp.json();
    data.mapboxToken = mapboxToken;
    res.render("index.ejs", data);
})



console.log(apiKey);

app.listen('3000', () => {
    console.log("Server listening on Port 3000");
});