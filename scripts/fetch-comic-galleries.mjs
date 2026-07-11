import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "public/images/illustration";
const MAX_EDGE = 2400;

const galleries = {
  "masks-cover": [
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663586304-7M7C8C85WYI8MD9WRG7V/1.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663587141-MOYWQ7SEAQHZFF3NJL3E/2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663592020-QTBZOS2WC5AMJRFXJ1I6/3.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663592199-CYPZ1C73SMBDJW35F220/4.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663598367-B76LECMEXQLKU4W4BNE1/5.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663598712-4IJTP4TKNB1YGBRWDX1G/6.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663601381-TEYFXJSO9ZUH843H9YKZ/7%2B8.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663605018-CAQJVS8M0CJ03C0VFLQV/9.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663608914-OYAMH4IR8HJY3M8627DK/10.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593810249657-D753C0LC8ERW0ZBO9BEN/11.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663616574-LSX0Y0PCH1VVYCOE752B/12.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663618617-DQM93Y6HIKF90Z9220Z3/13.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663623065-6SYCIR04XHVTC22XVSZ7/14.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663624335-71DRA5AZSGK7ZDU7TCBW/15.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663630056-Y9XDMK4CX5QN2SL1Y46R/16.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663631180-ILJURWUHHI24FLIKWNDD/17.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663636958-MQXOBX9EXG37FAGE46S1/18.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663638028-N4SC06Z1AN17EW7CO3VP/19.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663643285-7IWDPK8TTR8EAUBG6LF5/20.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663644953-ME8N6HEQS8RN95E67S0V/21.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663650543-MCVJJXT5TLG640NWB2ST/22.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663651684-3X5OSSN8PG2AZ6KLKE47/23.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663657793-8UZ8RKSEOVYLQQ43MVTR/24.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663661053-FWVQT56WXOIFYNBQ4HYY/25.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663665038-ULD3DADQXQSVN6BBK4GS/26.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663666911-NP1LM1W7MS7C7788O61X/27.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663671433-DINW52U66LB8K4ZLUESO/28.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1593663673139-7ZAYVSQVD4GHNY3JV49S/29.jpg"
  ],
  walo: [
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919440297-BO7103P4URJWDZ1ZLUHU/Dustin_Garcia_Walo_v4_v4_1_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919441776-6AZP2RAQJSNOXJI01LQY/Dustin_Garcia_Walo_v4_v4_2_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919442324-LIHJ381G0FMKHCM2ABI1/Dustin_Garcia_Walo_v4_v4_3_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919443056-QWUNVKOOO9N514SVVZH9/Dustin_Garcia_Walo_v4_v4_4_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919443899-AYPZ6WLTM6D4GY4UD3J7/Dustin_Garcia_Walo_v4_v4_5_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919444408-2G4AQJIRGWKMKQL1RPTY/Dustin_Garcia_Walo_v4_v4_6_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919444997-AVMYSVYH87SQJNMEUFO0/Dustin_Garcia_Walo_v4_v4_7_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919445601-WOR67APNJTAG5YVGFR2V/Dustin_Garcia_Walo_v4_v4_8_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919446190-KQH1WUQQ3HFY9R23JHA6/Dustin_Garcia_Walo_v4_v4_9_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919446932-NYX5R7FYT8LCH4P6GSC8/Dustin_Garcia_Walo_v4_v4_10_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919424586-1KGFGGYG3V88Y7FGJ023/Dustin_Garcia_Walo_v4_v4_16_v2.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919425424-HMRD9Z15LEVGGJUGHJJU/Dustin_Garcia_Walo_v4_v4_17_v1.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919426682-P88W267XDXRXCAGZ8NSF/Dustin_Garcia_Walo_v4_v4_18_v1.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919426992-SD5XIVZ39CKBFKV0CG/Dustin_Garcia_Walo_v4_v4_19_v1.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919428613-MZLMA11I1D90ICBXYUJW/Dustin_Garcia_Walo_v4_v4_21_v1.jpg",
    "https://images.squarespace-cdn.com/content/v1/5b216fd1a2772c6905e18b24/1650919429054-BFDHH0T0M5LJ0F2WLZD1/Dustin_Garcia_Walo_v4_v4_22_v1.jpg"
  ]
};

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const [slug, urls] of Object.entries(galleries)) {
  const outDir = path.join(OUT_DIR, slug, "pages");
  await mkdir(outDir, { recursive: true });

  let i = 1;
  for (const url of urls) {
    const outPath = path.join(outDir, `page-${String(i).padStart(2, "0")}.webp`);
    try {
      const buf = await downloadBuffer(url);
      await sharp(buf)
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outPath);
    } catch (err) {
      console.error(`FAILED ${slug} #${i}: ${err.message}`);
    }
    i += 1;
  }
  console.log(`${slug}: ${urls.length} pages done`);
}

console.log("Done.");
