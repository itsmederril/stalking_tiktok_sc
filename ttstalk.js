const readline = require("readline");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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

// Fitur baru: Export data ke file
function exportToJSON(data, filename = null) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const defaultFilename = `tiktok_data_${timestamp}.json`;
    const filepath = filename || defaultFilename;

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(
      `\x1b[32m[SUCCESS]\x1b[0m Data berhasil diekspor ke: ${filepath}`
    );
    return filepath;
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal mengexport data: ${error.message}`
    );
    return null;
  }
}

function exportToCSV(data, filename = null) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const defaultFilename = `tiktok_data_${timestamp}.csv`;
    const filepath = filename || defaultFilename;

    let csv = "Field,Value\n";
    csv += `ID,${data.id || ""}\n`;
    csv += `Short ID,${data.shortId || ""}\n`;
    csv += `Unique ID,${data.uniqueId || ""}\n`;
    csv += `Nickname,${data.nickname || ""}\n`;
    csv += `Signature,${data.signature || ""}\n`;
    csv += `Verified,${data.verified ? "Yes" : "No"}\n`;
    csv += `Private Account,${data.privateAccount ? "Yes" : "No"}\n`;
    csv += `Region,${data.region || ""}\n`;
    csv += `Language,${data.language || ""}\n`;
    csv += `Create Time,${data.createTime || ""}\n`;
    csv += `Follower Count,${data.stats.followerCount || 0}\n`;
    csv += `Following Count,${data.stats.followingCount || 0}\n`;
    csv += `Heart Count,${data.stats.heartCount || 0}\n`;
    csv += `Video Count,${data.stats.videoCount || 0}\n`;
    csv += `Digg Count,${data.stats.diggCount || 0}\n`;
    csv += `Friend Count,${data.stats.friendCount || 0}\n`;

    fs.writeFileSync(filepath, csv);
    console.log(
      `\x1b[32m[SUCCESS]\x1b[0m Data berhasil diekspor ke CSV: ${filepath}`
    );
    return filepath;
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal mengexport ke CSV: ${error.message}`
    );
    return null;
  }
}

// Fitur baru: Download avatar
async function downloadAvatar(userData, outputDir = "./avatars") {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const username = userData.uniqueId || userData.nickname || "unknown";
    const avatarUrl =
      userData.avatarLarger || userData.avatarMedium || userData.avatarThumb;

    if (!avatarUrl) {
      console.log(
        `\x1b[33m[WARNING]\x1b[0m Avatar tidak tersedia untuk user ${username}`
      );
      return null;
    }

    const response = await axios.get(avatarUrl, { responseType: "stream" });
    const extension = path.extname(avatarUrl) || ".jpg";
    const filename = `${username}_avatar${extension}`;
    const filepath = path.join(outputDir, filename);

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(
          `\x1b[32m[SUCCESS]\x1b[0m Avatar berhasil didownload: ${filepath}`
        );
        resolve(filepath);
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal download avatar: ${error.message}`
    );
    return null;
  }
}

// Fitur baru: History management
const HISTORY_FILE = "./tiktok_stalk_history.json";

function saveToHistory(userData) {
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf8");
      history = JSON.parse(data);
    }

    const historyEntry = {
      timestamp: new Date().toISOString(),
      username: userData.uniqueId,
      nickname: userData.nickname,
      followerCount: userData.stats.followerCount,
      followingCount: userData.stats.followingCount,
      videoCount: userData.stats.videoCount,
      verified: userData.verified,
    };

    history.unshift(historyEntry);
    if (history.length > 100) history = history.slice(0, 100); // Batasi 100 entri

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`\x1b[36m[INFO]\x1b[0m Data tersimpan di history`);
  } catch (error) {
    console.log(
      `\x1b[33m[WARNING]\x1b[0m Gagal menyimpan history: ${error.message}`
    );
  }
}

function showHistory(filterQuery = null) {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      console.log(`\x1b[33m[INFO]\x1b[0m Belum ada history stalk`);
      return;
    }

    const data = fs.readFileSync(HISTORY_FILE, "utf8");
    let history = JSON.parse(data);

    if (filterQuery && filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase();
      history = history.filter(
        (h) =>
          (h.username && h.username.toLowerCase().includes(q)) ||
          (h.nickname && String(h.nickname).toLowerCase().includes(q))
      );
    }

    console.log(
      `\x1b[36m[INFO]\x1b[0m History Stalk (${history.length} entri):`
    );
    console.log("=".repeat(80));
    console.log(
      "No | Username | Nickname | Followers | Following | Videos | Verified | Time"
    );
    console.log("-".repeat(80));

    history.slice(0, 10).forEach((entry, index) => {
      const time = new Date(entry.timestamp).toLocaleString();
      console.log(
        `${(index + 1).toString().padStart(2)} | ${entry.username.padEnd(
          15
        )} | ${entry.nickname.padEnd(20)} | ${entry.followerCount
          .toString()
          .padStart(9)} | ${entry.followingCount
          .toString()
          .padStart(9)} | ${entry.videoCount.toString().padStart(6)} | ${
          entry.verified ? "Yes" : "No".padEnd(8)
        } | ${time}`
      );
    });

    if (history.length > 10) {
      console.log(`... dan ${history.length - 10} entri lainnya`);
    }
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal membaca history: ${error.message}`
    );
  }
}

function clearHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      fs.unlinkSync(HISTORY_FILE);
      console.log("\x1b[32m[SUCCESS]\x1b[0m History berhasil dihapus");
    } else {
      console.log("\x1b[33m[INFO]\x1b[0m Tidak ada file history untuk dihapus");
    }
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal menghapus history: ${error.message}`
    );
  }
}

// Fitur baru: Batch stalk multiple users
async function batchStalk(usernames, delayMs = 2000) {
  console.log(
    `\x1b[36m[INFO]\x1b[0m Memulai batch stalk untuk ${usernames.length} users...`
  );
  const results = [];

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    console.log(
      `\x1b[36m[${i + 1}/${usernames.length}]\x1b[0m Stalking: ${username}`
    );

    const userData = await fetchTiktokUser(username);
    if (userData) {
      results.push(userData);
      saveToHistory(userData);
    } else {
      console.log(`\x1b[31m[ERROR]\x1b[0m Gagal stalk user: ${username}`);
    }

    // Delay untuk menghindari rate limit
    if (i < usernames.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, Number(delayMs)));
    }
  }

  return results;
}

// Fitur baru: Analytics dan perbandingan
function showAnalytics(users) {
  if (users.length === 0) return;

  console.log("\x1b[36m[ANALYTICS]\x1b[0m Analisis Data:");
  console.log("=".repeat(50));

  const totalFollowers = users.reduce(
    (sum, user) => sum + (user.stats.followerCount || 0),
    0
  );
  const totalFollowing = users.reduce(
    (sum, user) => sum + (user.stats.followingCount || 0),
    0
  );
  const totalVideos = users.reduce(
    (sum, user) => sum + (user.stats.videoCount || 0),
    0
  );
  const verifiedCount = users.filter((user) => user.verified).length;

  console.log(`Total Users: ${users.length}`);
  console.log(`Total Followers: ${totalFollowers.toLocaleString()}`);
  console.log(`Total Following: ${totalFollowing.toLocaleString()}`);
  console.log(`Total Videos: ${totalVideos.toLocaleString()}`);
  console.log(
    `Verified Users: ${verifiedCount}/${users.length} (${(
      (verifiedCount / users.length) *
      100
    ).toFixed(1)}%)`
  );

  // Top user berdasarkan followers
  const topUser = users.reduce((max, user) =>
    (user.stats.followerCount || 0) > (max.stats.followerCount || 0)
      ? user
      : max
  );

  console.log(
    `\nTop User (Followers): ${
      topUser.uniqueId
    } (${topUser.stats.followerCount.toLocaleString()} followers)`
  );
}

// Fitur baru: Loading animation
function showLoading(message = "Loading...") {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r\x1b[36m${frames[i]} ${message}\x1b[0m`);
    i = (i + 1) % frames.length;
  }, 100);

  return () => {
    clearInterval(interval);
    process.stdout.write("\r\x1b[0K"); // Clear line
  };
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

async function displayUserDetails(user, showOptions = true) {
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

  if (showOptions) {
    console.log("\x1b[36m[OPTIONS]\x1b[0m Pilihan tambahan:");
    console.log("1. Export ke JSON");
    console.log("2. Export ke CSV");
    console.log("3. Download Avatar");
    console.log("4. Skip (tidak ada aksi)");

    const choice = await askQuestion("\x1b[37mPilih opsi (1-4): \x1b[0m");

    switch (choice.trim()) {
      case "1":
        exportToJSON(user);
        break;
      case "2":
        exportToCSV(user);
        break;
      case "3":
        await downloadAvatar(user);
        break;
      case "4":
      default:
        console.log("\x1b[33m[INFO]\x1b[0m Tidak ada aksi yang dipilih");
        break;
    }
  }
}

async function mainInteractive() {
  clearScreen();
  printHeader("Tiktok Stalk CLI");

  while (true) {
    try {
      console.log("\x1b[36m[MAIN MENU]\x1b[0m Pilih mode:");
      console.log("1. Stalk Single User");
      console.log("2. Batch Stalk Multiple Users");
      console.log("3. Lihat History");
      console.log("4. Analytics dari History");
      console.log("5. Exit");

      const mode = await askQuestion("\x1b[37mPilih mode (1-5): \x1b[0m");

      switch (mode.trim()) {
        case "1":
          await singleUserMode();
          break;
        case "2":
          await batchUserMode();
          break;
        case "3":
          showHistory();
          break;
        case "4":
          await analyticsMode();
          break;
        case "5":
        case "exit":
          printFooter();
          rl.close();
          return;
        default:
          console.log("\x1b[31m[ERROR]\x1b[0m Pilihan tidak valid!");
          continue;
      }

      const lanjut = await askQuestion(
        "\x1b[31mKembali ke menu utama? (y/n): \x1b[0m"
      );
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
      console.log("\x1b[31m[ERROR]\x1b[0m Terjadi error:", err.message);
      rl.close();
      break;
    }
  }
}

async function singleUserMode() {
  const username = await askQuestion(
    "\x1b[37mMasukkan username Tiktok (tanpa @): \x1b[0m"
  );
  if (!username.trim()) {
    console.log("\x1b[31m[ERROR]\x1b[0m Username tidak boleh kosong!");
    return;
  }

  clearScreen();
  printHeader("Hasil Stalk");
  console.log(`Mencari data untuk: ${username}`);

  const stopLoading = showLoading("Mengambil data user...");
  const userData = await fetchTiktokUser(username.trim());
  stopLoading();

  if (userData) {
    saveToHistory(userData);
    await displayUserDetails(userData);
  } else {
    console.log(
      "\x1b[31m[ERROR]\x1b[0m User tidak ditemukan atau gagal mengambil data."
    );
  }
}

async function batchUserMode() {
  console.log(
    "\x1b[36m[INFO]\x1b[0m Masukkan username (pisahkan dengan koma):"
  );
  const input = await askQuestion("\x1b[37mContoh: user1,user2,user3: \x1b[0m");

  if (!input.trim()) {
    console.log("\x1b[31m[ERROR]\x1b[0m Input tidak boleh kosong!");
    return;
  }

  const usernames = input
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u);
  if (usernames.length === 0) {
    console.log("\x1b[31m[ERROR]\x1b[0m Tidak ada username yang valid!");
    return;
  }

  clearScreen();
  printHeader("Batch Stalk Results");

  const delayInput = await askQuestion(
    "\x1b[37mDelay antar request (ms, default 2000): \x1b[0m"
  );
  const delayMs = Number(delayInput) > 0 ? Number(delayInput) : 2000;
  const results = await batchStalk(usernames, delayMs);

  if (results.length > 0) {
    console.log(
      `\n\x1b[32m[SUCCESS]\x1b[0m Berhasil stalk ${results.length} dari ${usernames.length} users`
    );

    // Tampilkan ringkasan
    results.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.uniqueId} (@${user.nickname})`);
      console.log(`   Followers: ${user.stats.followerCount.toLocaleString()}`);
      console.log(
        `   Following: ${user.stats.followingCount.toLocaleString()}`
      );
      console.log(`   Videos: ${user.stats.videoCount.toLocaleString()}`);
    });

    // Tampilkan analytics
    showAnalytics(results);

    // Opsi export batch
    const exportChoice = await askQuestion(
      "\n\x1b[37mExport semua data? (json/csv/n): \x1b[0m"
    );
    if (exportChoice.toLowerCase() === "json") {
      exportToJSON(results, `batch_tiktok_data_${Date.now()}.json`);
    } else if (exportChoice.toLowerCase() === "csv") {
      // Export ke CSV dengan format yang berbeda untuk batch
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filepath = `batch_tiktok_data_${timestamp}.csv`;
      let csv = "Username,Nickname,Followers,Following,Videos,Verified\n";
      results.forEach((user) => {
        csv += `${user.uniqueId},${user.nickname},${user.stats.followerCount},${
          user.stats.followingCount
        },${user.stats.videoCount},${user.verified ? "Yes" : "No"}\n`;
      });
      fs.writeFileSync(filepath, csv);
      console.log(
        `\x1b[32m[SUCCESS]\x1b[0m Batch data berhasil diekspor ke: ${filepath}`
      );
    }
  } else {
    console.log("\x1b[31m[ERROR]\x1b[0m Tidak ada data yang berhasil diambil!");
  }
}

async function analyticsMode() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      console.log("\x1b[33m[INFO]\x1b[0m Belum ada history stalk");
      return;
    }

    const data = fs.readFileSync(HISTORY_FILE, "utf8");
    const history = JSON.parse(data);

    if (history.length === 0) {
      console.log("\x1b[33m[INFO]\x1b[0m History kosong");
      return;
    }

    console.log("\x1b[36m[ANALYTICS]\x1b[0m Analisis dari History:");
    console.log("=".repeat(60));

    const totalUsers = history.length;
    const totalFollowers = history.reduce(
      (sum, entry) => sum + (entry.followerCount || 0),
      0
    );
    const totalFollowing = history.reduce(
      (sum, entry) => sum + (entry.followingCount || 0),
      0
    );
    const totalVideos = history.reduce(
      (sum, entry) => sum + (entry.videoCount || 0),
      0
    );
    const verifiedCount = history.filter((entry) => entry.verified).length;

    console.log(`Total Users di History: ${totalUsers}`);
    console.log(`Total Followers: ${totalFollowers.toLocaleString()}`);
    console.log(`Total Following: ${totalFollowing.toLocaleString()}`);
    console.log(`Total Videos: ${totalVideos.toLocaleString()}`);
    console.log(
      `Verified Users: ${verifiedCount}/${totalUsers} (${(
        (verifiedCount / totalUsers) *
        100
      ).toFixed(1)}%)`
    );

    // Top 5 users berdasarkan followers
    const sortedByFollowers = history.sort(
      (a, b) => (b.followerCount || 0) - (a.followerCount || 0)
    );
    console.log("\n\x1b[36m[TOP 5 USERS]\x1b[0m Berdasarkan Followers:");
    console.log("-".repeat(60));
    sortedByFollowers.slice(0, 5).forEach((entry, index) => {
      console.log(
        `${index + 1}. ${
          entry.username
        } - ${entry.followerCount.toLocaleString()} followers`
      );
    });

    // Export analytics
    const exportChoice = await askQuestion(
      "\n\x1b[37mExport analytics ke JSON? (y/n): \x1b[0m"
    );
    if (
      exportChoice.toLowerCase() === "y" ||
      exportChoice.toLowerCase() === "yes"
    ) {
      const analyticsData = {
        summary: {
          totalUsers,
          totalFollowers,
          totalFollowing,
          totalVideos,
          verifiedCount,
          verifiedPercentage: ((verifiedCount / totalUsers) * 100).toFixed(1),
        },
        topUsers: sortedByFollowers.slice(0, 10),
        fullHistory: history,
      };
      exportToJSON(analyticsData, `analytics_${Date.now()}.json`);
    }
  } catch (error) {
    console.log(
      `\x1b[31m[ERROR]\x1b[0m Gagal membaca analytics: ${error.message}`
    );
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    const command = args[0].toLowerCase();

    switch (command) {
      case "--help":
      case "-h":
        showHelp();
        rl.close();
        return;

      case "--version":
      case "-v":
        console.log("TikTok Stalk CLI v2.0.0");
        rl.close();
        return;

      case "--history":
        // dukung --history-search "query"
        if (args[1] === "--history-search" && args[2]) {
          showHistory(args.slice(2).join(" "));
        } else {
          showHistory();
        }
        rl.close();
        return;

      case "--history-search":
        showHistory(args.slice(1).join(" "));
        rl.close();
        return;

      case "--clear-history":
        clearHistory();
        rl.close();
        return;

      case "--batch":
        if (args.length < 2) {
          console.log(
            "\x1b[31m[ERROR]\x1b[0m Gunakan: node ttstalk.js --batch user1,user2,user3"
          );
          rl.close();
          return;
        }
        const usernames = args[1]
          .split(",")
          .map((u) => u.trim())
          .filter((u) => u);
        // optional: --delay 3000
        let delayMs = 2000;
        const delayIdx = args.findIndex((a) => a === "--delay");
        if (delayIdx !== -1 && args[delayIdx + 1]) {
          const parsed = Number(args[delayIdx + 1]);
          if (!Number.isNaN(parsed) && parsed > 0) delayMs = parsed;
        }
        clearScreen();
        printHeader("Batch Stalk Results");
        const results = await batchStalk(usernames, delayMs);
        if (results.length > 0) {
          showAnalytics(results);
        }
        rl.close();
        return;

      default:
        // Mode single user dengan argumen
        clearScreen();
        printHeader("Tiktok Stalk CLI");
        console.log(`Mencari data untuk: ${args[0]}`);

        const stopLoading = showLoading("Mengambil data user...");
        const userData = await fetchTiktokUser(args[0].trim());
        stopLoading();

        if (userData) {
          saveToHistory(userData);
          // dukung flags: --export json|csv, --avatar, --output <dir>
          const outIdx = args.findIndex((a) => a === "--output");
          const outDir =
            outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : null;
          if (outDir) {
            try {
              if (!fs.existsSync(outDir))
                fs.mkdirSync(outDir, { recursive: true });
            } catch {}
          }

          const expIdx = args.findIndex((a) => a === "--export");
          if (expIdx !== -1 && args[expIdx + 1]) {
            const fmt = String(args[expIdx + 1]).toLowerCase();
            if (fmt === "json") {
              const fname = outDir
                ? path.join(
                    outDir,
                    `tiktok_${userData.uniqueId}_${Date.now()}.json`
                  )
                : null;
              exportToJSON(userData, fname);
            } else if (fmt === "csv") {
              const fname = outDir
                ? path.join(
                    outDir,
                    `tiktok_${userData.uniqueId}_${Date.now()}.csv`
                  )
                : null;
              exportToCSV(userData, fname);
            }
          }

          if (args.includes("--avatar")) {
            const avatarDir = outDir
              ? path.join(outDir, "avatars")
              : "./avatars";
            await downloadAvatar(userData, avatarDir);
          }

          await displayUserDetails(userData, false); // Tidak tampilkan opsi untuk mode argumen
        } else {
          console.log(
            "\x1b[31m[ERROR]\x1b[0m User tidak ditemukan atau gagal mengambil data."
          );
        }
        printFooter();
        rl.close();
        return;
    }
  } else {
    await mainInteractive();
  }
}

function showHelp() {
  console.log("\x1b[36m[TikTok Stalk CLI v2.0.0]\x1b[0m");
  console.log("=".repeat(50));
  console.log("Cara penggunaan:");
  console.log("");
  console.log("1. Mode Interaktif:");
  console.log("   node ttstalk.js");
  console.log("");
  console.log("2. Stalk Single User:");
  console.log(
    "   node ttstalk.js username [--export json|csv] [--avatar] [--output ./dir]"
  );
  console.log("");
  console.log("3. Batch Stalk Multiple Users:");
  console.log("   node ttstalk.js --batch user1,user2,user3 [--delay 3000]");
  console.log("");
  console.log("4. Lihat History:");
  console.log(
    '   node ttstalk.js --history | --history-search "query" | --clear-history'
  );
  console.log("");
  console.log("5. Bantuan:");
  console.log("   node ttstalk.js --help");
  console.log("");
  console.log("6. Versi:");
  console.log("   node ttstalk.js --version");
  console.log("");
  console.log("\x1b[36m[FITUR BARU]\x1b[0m");
  console.log("• Export data ke JSON/CSV");
  console.log("• Download avatar user");
  console.log("• History stalk otomatis");
  console.log("• Batch stalk multiple users");
  console.log("• Analytics dan perbandingan");
  console.log("• Loading animation");
  console.log("• Menu interaktif yang lebih baik");
}

main();
