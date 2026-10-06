// usage: node scripts/img.mjs  -> converts src-images/*.{jpg,png} into public/images/<name>-{800,1400}.webp
import sharp from 'sharp'
import fs from 'node:fs'
const src = 'src-images', out = 'public/images'
fs.mkdirSync(out, { recursive: true })
for (const f of fs.readdirSync(src)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue
  const n = f.replace(/\.\w+$/, '')
  for (const w of [640, 1200]) {
    await sharp(`${src}/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 700 ? 72 : 68 }).toFile(`${out}/${n}-${w}.webp`)
  }
}
console.log(fs.readdirSync(out).map(f => `${f} ${(fs.statSync(`${out}/${f}`).size / 1024).toFixed(0)}KB`).join('\n'))
