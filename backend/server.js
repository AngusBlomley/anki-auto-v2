import express from "express"
import cors from "cors"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

const JISHO_API = "https://jisho.org/api/v1/search/words?keyword"
const TATOEBA_API = "https://api.tatoeba.org/"

// Tatoeba example Api
// 
// https://api.tatoeba.org/v1/sentences?q=バナナ&lang=jpn&sort=relevance&showtrans:lang=eng&include=transcriptions
// https://api.tatoeba.org/v1/sentences?q=元気&lang=jpn&sort=relevance&showtrans:lang=eng&include=transcriptions
// 
// Response: (array of objects)
// 
//      [{
//       "text": "お前はバナナ人だ。",
//       "translations": [
//         {
//           "text": "You are a banana.",
//         }
//       ],
//       "transcriptions": [
//         {
//           "text": "お[前|まえ]はバナナ[人|じん]だ。",
//         }
//       ],
//     }]

// we only use one post request to fetch data from 3 api's (Jisho dict, open api sentence, google tts)
app.post('/getData', async (req, res) => {
  try {
    const jishoRes = await fetch(`${JISHO_API}=${req.body.word}`)
    const jishoParsed = await jishoRes.json()
    res.json(jishoParsed)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
  try {
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'something went wrong' })
  }
})

app.listen(port, () => {})