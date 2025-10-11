const readline = require("readline");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function clearScreen() {
  process.stdout.write("\x1bc");
}

function printHeader(title = "Tiktok Stalk CLI") {
  console.log("\x1b[37m", "=".repeat(50)); // putih
  if (title === "Hasil Stalk") {
    console.log("\x1b[31m", "Tiktok Stalk CLI - " + title); // merah
  } else {
    console.log("\x1b[31m", "Tiktok Stalk CLI - " + title); // merah
  }
  console.log("\x1b[37m", "=".repeat(50)); // putih
}

function printFooter() {
  console.log("\x1b[37m", "=".repeat(50)); // putih
  console.log("\x1b[31m", "Thanks for using !!!"); // merah
  console.log("\x1b[37m", "=".repeat(50)); // putih
}

function generateRandomIP() {
  return (
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255)
  );
}

async function fetchTiktokUser(username) {
  const url = `https://www.tiktok.com/@${username}`;
  const randomIP = generateRandomIP();
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    DNT: "1",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Cache-Control": "max-age=0",
    "X-Forwarded-For": randomIP,
    "X-Real-IP": randomIP,
  };

  try {
    const response = await axios.get(url, { headers, timeout: 10000 });
    const html = response.data;
    if (!html) {
      console.log("[ERROR]", "Tidak ada data HTML yang didapat.");
      return null;
    }

    const match = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s
    );
    if (!match) {
      console.log("[ERROR]", "Tidak menemukan data user di halaman.");
      return null;
    }

    const jsonData = JSON.parse(match[1]);
    let userData = {};

    if (
      jsonData["__DEFAULT_SCOPE__"] &&
      jsonData["__DEFAULT_SCOPE__"]["webapp.user-detail"]?.userInfo
    ) {
      userData =
        jsonData["__DEFAULT_SCOPE__"]["webapp.user-detail"].userInfo || {};
    } else {
      // fallback jika struktur berubah
      for (const key in jsonData) {
        if (key.includes("user-detail") || key.includes("userDetail")) {
          userData = jsonData[key]?.userInfo || {};
          if (Object.keys(userData).length > 0) break;
        }
      }
    }

    const user = userData.user || {};
    const stats = userData.stats || {};
    const statsV2 = userData.statsV2 || {};

    if (Object.keys(user).length === 0) {
      console.log("[ERROR]", "Data user tidak ditemukan.");
      return null;
    }

    let signature = user.signature?.trim() || "";
    if (!signature) signature = "-";

    function formatDate(timestamp) {
      if (!timestamp) return "-";
      try {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
      } catch {
        return String(timestamp);
      }
    }

    return {
      id: user.id,
      shortId: user.shortId,
      uniqueId: user.uniqueId,
      nickname: user.nickname,
      nickNameModifyTime: formatDate(user.nickNameModifyTime),
      signature: signature,
      createTime: formatDate(user.createTime),
      verified: user.verified,
      privateAccount: user.privateAccount,
      region: user.region,
      language: user.language,
      secUid: user.secUid,
      avatarLarger: user.avatarLarger,
      avatarMedium: user.avatarMedium,
      avatarThumb: user.avatarThumb,
      stats: {
        followerCount: stats.followerCount,
        followingCount: stats.followingCount,
        heart: stats.heart,
        heartCount: stats.heartCount,
        videoCount: stats.videoCount,
        diggCount: stats.diggCount,
        friendCount: stats.friendCount,
      },
      statsV2: {
        followerCount: statsV2.followerCount,
        followingCount: statsV2.followingCount,
        heart: statsV2.heart,
        heartCount: statsV2.heartCount,
        videoCount: statsV2.videoCount,
        diggCount: statsV2.diggCount,
        friendCount: statsV2.friendCount,
      },
    };
  } catch (err) {
    if (err.response && err.response.status > 400) {
      console.log("[ERROR]", `User ${username} tidak ditemukan (404/403).`);
    } else {
      console.log("[ERROR]", "Terjadi error:", err.message);
    }
    return null;
  }
}

function displayUserDetails(user) {
  console.log("=".repeat(50));
  console.log(`ID: ${user.id}`);
  console.log(`Short ID: ${user.shortId}`);
  console.log(`Unique ID: ${user.uniqueId}`);
  console.log(`Nickname: ${user.nickname}`);
  console.log(`Signature: ${user.signature}`);
  console.log(`Verified: ${user.verified ? "Ya" : "Tidak"}`);
  console.log(`Private Account: ${user.privateAccount ? "Ya" : "Tidak"}`);
  console.log(`Region: ${user.region}`);
  console.log(`Language: ${user.language}`);
  console.log(`SecUid: ${user.secUid}`);
  console.log(`Avatar Larger: ${user.avatarLarger}`);
  console.log(`Avatar Medium: ${user.avatarMedium}`);
  console.log(`Avatar Thumb: ${user.avatarThumb}`);
  console.log(`Create Time: ${user.createTime}`);
  console.log("=".repeat(50));
  console.log("Stats:");
  console.log(`Follower Count: ${user.stats.followerCount}`);
  console.log(`Following Count: ${user.stats.followingCount}`);
  console.log(`Heart: ${user.stats.heart}`);
  console.log(`Heart Count: ${user.stats.heartCount}`);
  console.log(`Video Count: ${user.stats.videoCount}`);
  console.log(`Digg Count: ${user.stats.diggCount}`);
  console.log(`Friend Count: ${user.stats.friendCount}`);
  console.log("=".repeat(50));
}

async function mainInteractive() {
  clearScreen();
  printHeader("Tiktok Stalk CLI");
  while (true) {
    try {
      const username = await askQuestion(
        "\x1b[37mMasukkan username Tiktok (tanpa @): \x1b[0m"
      );
      if (username.trim().toLowerCase() === "exit") {
        printFooter();
        rl.close();
        return;
      }
      if (!username.trim()) {
        console.log("[ERROR]", "Username tidak boleh kosong!");
        continue;
      }
      clearScreen();
      printHeader("Hasil Stalk");
      console.log(`Mencari data untuk: ${username}`);
      const userData = await fetchTiktokUser(username.trim());
      if (userData) {
        displayUserDetails(userData);
      } else {
        console.log(
          "[ERROR]",
          "User tidak ditemukan atau gagal mengambil data."
        );
      }
      const lanjut = await askQuestion(
        "\x1b[31mLanjut stalk user lain? (y/n): \x1b[0m"
      ); // merah
      if (
        lanjut.trim().toLowerCase() === "n" ||
        lanjut.trim().toLowerCase() === "tidak"
      ) {
        printFooter();
        rl.close();
        break;
      }
      clearScreen();
      printHeader("Tiktok Stalk CLI");
    } catch (err) {
      console.log("[ERROR]", "Terjadi error:", err.message);
      rl.close();
      break;
    }
  }
}

async function main() {
  const usernameArg = process.argv[2];
  if (usernameArg) {
    clearScreen();
    printHeader("Tiktok Stalk CLI");
    const userData = await fetchTiktokUser(usernameArg.trim());
    if (userData) {
      displayUserDetails(userData);
    } else {
      console.log("[ERROR]", "User tidak ditemukan atau gagal mengambil data.");
    }
    printFooter();
    rl.close();
  } else {
    await mainInteractive();
  }
}

main();
