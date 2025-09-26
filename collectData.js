// collectData.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // npm install node-fetch
const cheerio = require("cheerio");  // npm install cheerio

const DATA_PATH = path.join(__dirname, "data", "restaurants.json");

// ✅ 기존 데이터 불러오기
function loadRestaurants() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error("❌ restaurants.json 파일이 존재하지 않습니다.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

// ✅ 별미평점 계산
function calculateByeolmi(ratings) {
  let totalScore = 0;
  let totalReviews = 0;

  for (let platform in ratings) {
    const data = ratings[platform];
    if (data?.score && data?.count) {
      totalScore += data.score * data.count;
      totalReviews += data.count;
    }
  }

  return totalReviews > 0 ? (totalScore / totalReviews).toFixed(2) : null;
}

// ✅ 네이버 블로그 검색 → 상위 2개 URL 가져오기
async function fetchBlogReviews(restaurantName) {
  const query = encodeURIComponent(`${restaurantName} 리뷰`);
  const url = `https://search.naver.com/search.naver?where=blog&sm=tab_jum&query=${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0" // 크롤링 탐지 회피
      }
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const blogs = [];
    $("a[href*='blog.naver.com']").each((i, el) => {
      if (i < 2) { // 상위 2개만
        blogs.push({
          title: $(el).text().trim() || `${restaurantName} 블로그 후기`,
          author: "네이버 블로거",
          url: $(el).attr("href"),
          imageUrl: "img/sample.png" // 실제 썸네일은 추가 파싱 필요
        });
      }
    });

    return blogs.length > 0 ? blogs : [{
      title: `${restaurantName} 블로그 후기 (데이터 없음)`,
      author: "별미",
      url: "#",
      imageUrl: "img/sample.png"
    }];
  } catch (err) {
    console.error("❌ 블로그 크롤링 실패:", err.message);
    return [{
      title: `${restaurantName} 블로그 데이터 오류`,
      author: "별미",
      url: "#",
      imageUrl: "img/sample.png"
    }];
  }
}

// ✅ 메인 실행
async function updateData() {
  let restaurants = loadRestaurants();

  for (let r of restaurants) {
    console.log(`▶ ${r.name} 데이터 업데이트 중...`);

    // 별미평점 갱신
    if (r.ratings) {
      r.byeolmi = { rating: calculateByeolmi(r.ratings) };
    }

    // 블로그 리뷰 크롤링
    r.blog = await fetchBlogReviews(r.name);
  }

  // JSON 저장
  fs.writeFileSync(DATA_PATH, JSON.stringify(restaurants, null, 2), "utf8");
  console.log("✅ restaurants.json 업데이트 완료!");
}

// 실행
updateData();
