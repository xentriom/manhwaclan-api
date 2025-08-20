# Toonga - Manga Scraping API

A fast and efficient API for scraping manga data from manhwaclan.com built with Hono and TypeScript.

## API Endpoints

### Get Manga Details

```http
GET /manga/{slug}
```

**Example:**

```http
GET /manga/solo-leveling
```

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Solo Leveling",
    "summary": "10 years ago, after “the Gate” that connected the real world with the monster world opened, some of the ordinary, everyday people received the power to hunt monsters within the Gate. They are known as “Hunters“. However, not all Hunters are powerful. My name is Sung Jin-Woo, an E-rank Hunter. I’m someone who has to risk his life in the lowliest of dungeons, the “World’s Weakest“. Having no skills whatsoever to display, I barely earned the required money by fighting in low-leveled dungeons… at least until I found a hidden dungeon with the hardest difficulty within the D-rank dungeons! In the end, as I was accepting death, I suddenly received a strange power, a quest log that only I could see, a secret to leveling up that only I know about! If I trained in accordance with my quests and hunted monsters, my level would rise. Changing from the weakest Hunter to the strongest S-rank Hunter!",
    "coverImage": "https://manhwaclan.com/wp-content/uploads/2023/01/Solo-Leveling-cover-193x278.jpg",
    "type": "manhwa",
    "status": "OnGoing",
    "releaseYear": "",
    "rating": "4.8",
    "rank": "6th, it has 83.5K monthly views",
    "alternativeTitles": "",
    "authors": [
      {
        "name": "Jang Sung-Lak",
        "url": "https://manhwaclan.com/manga-author/jang-sung-lak/"
      }
    ],
    "genres": ["Action", "Adventure", "Manhua", "Manhwa", "Shounen"],
    "chapterCount": 202
  }
}
```

### Get Manga Chapters

```http
GET /manga/{slug}/chapters
```

**Example:**

```http
GET /manga/solo-leveling/chapters
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "name": "Chapter 1",
      "number": 1,
      "url": "https://manhwaclan.com/manga/solo-leveling/chapter-1/",
      "releaseDate": "January 20, 2023"
    },
    {
      "name": "Chapter 2",
      "number": 2,
      "url": "https://manhwaclan.com/manga/solo-leveling/chapter-2/",
      "releaseDate": "January 20, 2023"
    }
    // Etc.
  ]
}
```

### Get Chapter Images

```http
GET /manga/{slug}/chapters/{chapter}
```

**Example:**

```http
GET /manga/solo-leveling/chapters/200
```

**Response:**

```json
{
  "success": true,
  "data": {
    "images": [
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/03.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/04.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/05.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/06.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/07.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/08.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/09.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/10.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/11.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/12.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/13.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/14.jpg",
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/15.jpg"
    ]
  }
}
```

### Search Manga

```http
GET /search?q={query}&page={page}
```

**Example:**

```http
GET /search?q=solo&page=1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Solo Leveling",
        "url": "https://manhwaclan.com/manga/solo-leveling/",
        "slug": "solo-leveling"
      },
      {
        "title": "Solo Max Level Newbie",
        "url": "https://manhwaclan.com/manga/solo-max-level-newbie/",
        "slug": "solo-max-level-newbie"
      }
    ],
    "pagination": {
      "page": 1,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Error Responses

```json
{
  "success": false,
  "error": "Manga not found"
}
```

## Disclaimer

This API is for educational purposes only. Please respect the terms of service of manhwaclan.com and use responsibly.
