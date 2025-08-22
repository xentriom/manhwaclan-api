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
  "data": {
    "chapters": [
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
    ],
    "chapterCount": 202
  }
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
      "https://c1.clancd.com/manga_638098507637077977/fb7f2a41dfa80e8c454ab160802b0086/04.jpg"
      // Etc.
    ]
  }
}
```

### Search Manga by Title

```http
GET /search?q={query}&page={page}
GET /search?query={query}&page={page}
```

**Parameters:**

- `q` or `query` (required): Search term
- `page` (optional): Page number (default: 1)

**Example:**

```http
GET /search?q=solo
GET /search?query=solo&page=1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Solo Leveling: Arise",
        "url": "https://manhwaclan.com/manga/solo-leveling-arise/",
        "slug": "solo-leveling-arise",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2025/06/Solo-Leveling-Arise-193x278.jpg",
        "rating": "2.8",
        "lastUpdated": {
          "chapter": "18",
          "time": "June 13, 2025"
        }
      },
      {
        "title": "Emperor of Solo Play",
        "url": "https://manhwaclan.com/manga/emperor-of-solo-play/",
        "slug": "emperor-of-solo-play",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2025/04/Emperor-of-Solo-Play-193x278.webp",
        "rating": "4.3",
        "lastUpdated": {
          "chapter": "28",
          "time": "August 17, 2025"
        }
      }
      // Etc.
    ],
    "pagination": {
      "page": 1,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Search Manga by Genre

```http
GET /search/genre/{genre}?page={page}&order_by={sort}
```

**Parameters:**

- `genre` (required): Genre to filter by
- `page` (optional): Page number (default: 1)
- `order_by` (optional): Sort order (default: "latest")

**Available Genres:**

- `action`, `adaptation`, `adult`, `adventure`, `comedy`, `cooking`, `demon`, `drama`, `fantasy`, `harem`, `historical`, `isekai`, `josei`, `magic`, `magical`, `manga`, `manhua`, `manhwa`, `martial-arts`, `mature`, `mystery`, `reincarnation`, `romance`, `school-life`, `shoujo`, `shounen`, `slice-of-life`, `smut`, `supernatural`, `time-travel`, `vampire`, `villainess`, `webtoon`

**Available Sort Options:**

- `alphabetical` - Sort alphabetically
- `trending` - Sort by trending
- `new` - Sort by recently added
- `latest` - Sort by recently updated (default)
- `popular` - Sort by popularity
- `rating` - Sort by rating

**Example:**

```http
GET /search/genre/action
GET /search/genre/action?page=1&order_by=latest
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Overtime Elite",
        "url": "https://manhwaclan.com/manga/overtime-elite/",
        "slug": "overtime-elite",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2024/10/Overtime-Elite-175x238.webp",
        "rating": "4.4",
        "lastUpdated": {
          "chapter": "49",
          "time": "7 hours ago"
        }
      },
      {
        "title": "After Reincarnation, My Enemy Made Me Invincible with Money",
        "url": "https://manhwaclan.com/manga/after-reincarnation-my-enemy-made-me-invincible-with-money/",
        "slug": "after-reincarnation-my-enemy-made-me-invincible-with-money",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2025/08/After-Reincarnation-My-Enemy-Made-Me-Invincible-with-Money-175x238.jpg",
        "rating": "2.8",
        "lastUpdated": {
          "chapter": "14",
          "time": "7 hours ago"
        }
      }
      // Etc.
    ],
    "pagination": {
      "page": 1,
      "totalPages": 120,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Search Manga by Sort

```http
GET /search/sort/{sort}?page={page}
```

**Parameters:**

- `sort` (required): Sort order
- `page` (optional): Page number (default: 1)

**Available Sort Options:**

- `alphabetical` - Sort alphabetically
- `trending` - Sort by trending
- `new` - Sort by recently added
- `latest` - Sort by recently updated
- `popular` - Sort by popularity
- `rating` - Sort by rating

**Example:**

```http
GET /search/sort/popular
GET /search/sort/popular?page=1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Tears on a Withered Flower",
        "url": "https://manhwaclan.com/manga/tears-on-a-withered-flower/",
        "slug": "tears-on-a-withered-flower",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2024/09/Tears-on-a-Withered-Flower-175x238.jpeg",
        "rating": "4.7",
        "lastUpdated": {
          "chapter": "65",
          "time": "August 16, 2025"
        }
      },
      {
        "title": "Death Is The Only Ending For The Villainess",
        "url": "https://manhwaclan.com/manga/death-is-the-only-ending-for-the-villainess/",
        "slug": "death-is-the-only-ending-for-the-villainess",
        "coverImage": "https://manhwaclan.com/wp-content/uploads/2022/05/Death-Is-The-Only-Ending-For-The-Villainess-OK-COVER-175x238.jpg",
        "rating": "4.8",
        "lastUpdated": {
          "chapter": "183",
          "time": "August 15, 2025"
        }
      }
      // Etc.
    ],
    "pagination": {
      "page": 1,
      "totalPages": 494,
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
