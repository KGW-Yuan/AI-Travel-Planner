import crypto from 'crypto';
import WebSocket from 'ws';
import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';

// Set the path to the ffmpeg executable
ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');

// --- 使用您提供的正确凭证 ---
const APPID = 'f030d98d';
const API_SECRET = 'ZDI3NDA2ZmQ0YzFmMDk5ODRhNjg1M2M3';
const API_KEY = '8e3f1eb56b34660533103f9792df1011';
// --------------------------------------------------------------------

function getAuthUrl() {
    const host = 'iat-api.xfyun.cn'; // Corrected host for IAT service
    const path = '/v2/iat';         // Corrected path for IAT service
    const date = new Date().toUTCString();
    
    console.log(`[Auth] Using Date for signature: ${date}`); // Log the date for debugging

    const signature_origin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
    const signature_sha = crypto.createHmac('sha256', API_SECRET).update(signature_origin).digest('binary');
    const signature = Buffer.from(signature_sha, 'binary').toString('base64');
    const authorization = `api_key=\"${API_KEY}\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"${signature}\"`;
    return `wss://${host}${path}?authorization=${Buffer.from(authorization).toString('base64')}&date=${encodeURIComponent(date)}&host=${host}`;
}

export const recognizeAudio = (req, res) => {
    console.log('\n\n--- [Recognize Start] ---');
    const audioBase64 = req.body.audio;
    if (!audioBase64) {
        return res.status(400).json({ error: 'No audio data provided' });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    console.log(`收到音频数据，大小: ${audioBuffer.length} bytes。开始使用 ffmpeg 转换格式...`);

    let fullResult = ''; // Use a simple string to accumulate results
    const url = getAuthUrl();
    const ws = new WebSocket(url);

    const convertAndStream = () => {
        try {
            const ffmpeg_process = ffmpeg(stream.PassThrough().end(audioBuffer))
                .format('s16le')
                .audioCodec('pcm_s16le')
                .audioChannels(1)
                .audioFrequency(16000)
                .on('start', (commandLine) => {
                    console.log('ffmpeg process started with command: ' + commandLine);
                })
                .on('error', (err, stdout, stderr) => {
                    console.error('ffmpeg 转换出错:', err.message);
                    console.error('ffmpeg stderr:', stderr);
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Failed to process audio with ffmpeg.', details: err.message });
                    }
                })
                .pipe();

            const FRAME_SIZE = 1280; // 每一帧的音频大小

            let frame_index = 0;

            ffmpeg_process.on('data', (chunk) => {
                const status = frame_index === 0 ? 0 : 1; // 第一帧为0，中间为1
                const audio_chunk = chunk;

                const message = {
                    common: { app_id: APPID },
                    business: {
                        language: 'zh_cn',
                        domain: 'iat',
                        accent: 'mandarin',
                        dwa: 'wpgs'
                    },
                    data: {
                        status: status,
                        format: 'audio/L16;rate=16000',
                        encoding: 'raw',
                        audio: audio_chunk.toString('base64')
                    }
                };
                ws.send(JSON.stringify(message));
                console.log(`[WebSocket] Sent audio chunk. Status: ${status}, Size: ${audio_chunk.length}`);
                frame_index++;
            });

            ffmpeg_process.on('end', () => {
                console.log('ffmpeg conversion finished. Sending end frame.');
                // 所有音频数据发送完毕后，发送结束帧
                const end_message = {
                    data: {
                        status: 2,
                        format: 'audio/L16;rate=16000',
                        encoding: 'raw',
                        audio: ''
                    }
                };
                ws.send(JSON.stringify(end_message));
                console.log('[WebSocket] Sent end frame (status: 2).');
            });

        } catch (e) {
            console.error('Error during ffmpeg setup:', e);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to initialize ffmpeg.', details: e.message });
            }
        }
    };


    ws.on('open', () => {
        console.log('[WebSocket] Connection opened. Starting audio conversion and streaming...');
        convertAndStream();
    });

    ws.on('message', (data) => {
        const response = JSON.parse(data);
        console.log('[WebSocket] Received message:', JSON.stringify(response, null, 2));

        if (response.code !== 0) {
            console.error(`[WebSocket] Error from iFlytek: ${response.message} (Code: ${response.code}, SID: ${response.sid})`);
            if (!res.headersSent) {
                res.status(500).json({ error: `iFlytek API Error: ${response.message}` });
            }
            ws.close();
            return;
        }

        if (response.data && response.data.result) {
            // Simplified text extraction
            const text = response.data.result.ws.map(i => i.cw.map(w => w.w).join('')).join('');
            if (text) {
                fullResult += text;
            }
        }

        if (response.data.status === 2) {
            console.log('[WebSocket] Recognition complete. Closing connection.');
            const finalResult = fullResult || '未能识别出任何内容。';
            console.log('最终识别结果:', finalResult);
            if (!res.headersSent) {
                // Send the final result back to the client
                res.json({ text: finalResult });
            }
            ws.close();
        }
    });

    ws.on('error', (err) => {
        console.error('[WebSocket] Error:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'WebSocket connection error.', details: err.message });
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`[WebSocket] Connection closed. Code: ${code}, Reason: ${reason.toString()}`);
        if (!res.headersSent) {
            // If the connection closes before completion, send what we have.
            const finalResult = fullResult || '未能识别出任何内容。';
            console.log('Connection closed unexpectedly, sending partial result:', finalResult);
            res.json({ text: finalResult });
        }
    });
};