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
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Playlist Downloader</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 30px;
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 24px;
            text-align: center;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        label {
            font-size: 18px;
            color: #555;
            margin-bottom: 5px;
            display: block;
        }
        input[type="text"] {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            border-color: #007bff;
            outline: none;
        }
        input[type="submit"] {
            background-color: #007bff;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 12px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
            transform: scale(1.02);
        }
        input[type="submit"]:active {
            background-color: #004494;
            transform: scale(0.98);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>YouTube Playlist Downloader</h1>
        <form action="/download" method="post">
            <label for="playlistUrl">Enter YouTube Playlist URL:</label>
            <input type="text" id="playlistUrl" name="playlistUrl" placeholder="https://www.youtube.com/playlist?list=...">
            <input type="submit" value="Download Playlist">
        </form>
    </div>
</body>
</html>
    `);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});