Tatoeba example Api

https://api.tatoeba.org/v1/sentences?q=バナナ&lang=jpn&sort=relevance&showtrans:lang=eng&include=transcriptions

Response: (array of objects)

     [{
      "text": "お前はバナナ人だ。",
      "translations": [
        {
          "text": "You are a banana.",
        }
      ],
      "transcriptions": [
        {
          "text": "お[前|まえ]はバナナ[人|じん]だ。",
        }
      ],
    }]