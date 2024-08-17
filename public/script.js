const express = require('express');
const bodyParser = require('body-parser');
const youtubeDl = require('youtube-dl-exec');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/download', async (req, res) => {
    const playlistUrl = req.body.playlistUrl;

    if (!playlistUrl) {
        return res.send('Please provide a playlist URL.');
    }

    // مسار التنزيل هو نفس مسار المشروع
    const savePath = __dirname;

    try {
        console.log('Starting download...');
        await youtubeDl(playlistUrl, {
            output: path.join(savePath, '%(title)s.%(ext)s')
        });
        console.log('Download completed.');
        res.send('Playlist downloaded successfully.');
    } catch (err) {
        console.error('Error during download:', err);
        res.send('An error occurred while downloading the playlist.');
    }
});

app.get('/', (req, res) => {
    res.send(`
        <form action="/download" method="post">
            <label for="playlistUrl">YouTube Playlist URL:</label><br>
            <input type="text" id="playlistUrl" name="playlistUrl"><br><br>
            <input type="submit" value="Download Playlist">
        </form>
    `);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
