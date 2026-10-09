# Chapter artwork and videos

The homepage is a scroll story. Each chapter has a full-screen background "world" that
`ScrollStage` paints behind the page. A world can be:

- **a still picture** (what the site uses now): it slowly zooms and pans as you scroll, or
- **a short video**: it plays **frame by frame as the visitor scrolls**, forwards and
  backwards, and is shown on top of the picture once it has loaded.

Chapter settings (picture, video, crop point, text colour) live in `src/lib/chapters.ts`.

## Pictures

| File | Chapter |
|---|---|
| `hero.jpg` | Opening — "We Build Intelligent …" |
| `service.jpg` | What we build |
| `process.jpg` | How we work |
| `number.jpg` | By the numbers |
| `why-us.jpg` | Why Yubhian |
| `cta.jpg` | Finale — "Ready to build something great?" |

Service card pictures live in `public/cards`.

**After adding or replacing any picture, run:**

```bash
node scripts/optimize-images.mjs
```

It writes small WebP copies to `opt/` folders (the site loads those, not the originals).

## Videos — turn the pictures into clips

Use a free **image-to-video** tool (Kling, Hailuo/MiniMax, Meta AI): upload the
picture, paste its prompt, generate a **5–10 second** clip, download it, and save it in
this folder with the name shown. Keep the motion slow — the visitor's scroll drives
playback, so calm, continuous movement looks best. No cuts, no text.

| Save as | Upload | Prompt |
|---|---|---|
| `hero.mp4` | `hero.jpg` | Slow camera push-in towards the golden neural network in the sky. The network gently pulses with light, tiny lights travel along its lines, stars twinkle, palm leaves sway slightly, soft ripples move across the lake reflecting the golden glow. Calm, cinematic, continuous. |
| `services.mp4` | `service.jpg` | Slow drifting camera through the pastel clouds. The glass laptops, phone and servers float gently up and down, thin lines of light flow between them like data, clouds drift slowly, warm sunrise light shifts softly. Dreamy, smooth, continuous. |
| `process.mp4` | `process.jpg` | Slow camera rise along the floating glass steps from the lightbulb to the shield. The bulb glows brighter, the blueprint flutters, code scrolls on the laptop, the rocket's flame flickers, morning mist drifts over the still lake. Calm and continuous. |
| `numbers.mp4` | `number.jpg` | Slow push-in towards the laptop on the wooden desk. The holographic bar charts grow upward one by one, golden particles float up, steam rises from the coffee cup, the plant leaves move slightly in a breeze. Warm, calm, continuous. |
| `why-us.mp4` | `why-us.jpg` | Slow forward glide over the paddy field towards the glowing glass office. Rice plants sway in the wind, fireflies drift and blink, the sun flare shifts slowly, palm trees move gently, warm light glows from the office windows. Peaceful, continuous. |
| `cta.mp4` | `cta.jpg` | Slow push-in towards the laptop on the wooden jetty. The rocket on the screen lifts off with glowing exhaust, pelicans glide across the sky, gentle waves ripple across the lake, clouds drift and the sunset light deepens. Calm and continuous. |

Then tell Claude (or a developer) which clips you added — each needs one line,
`video: "/chapters/hero.mp4"`, in `src/lib/chapters.ts`.

### Encode for smooth scrubbing (important)

Scroll-scrubbing jumps around the timeline, so the clip needs a keyframe every few
frames or it will stutter. Run each downloaded clip through ffmpeg
(<https://ffmpeg.org/download.html>):

```bash
ffmpeg -i input.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -preset slow -crf 24 \
  -g 6 -bf 0 -pix_fmt yuv420p -movflags +faststart hero.mp4
```

Aim for under ~6 MB per clip. Audio is removed (`-an`); the videos are always muted.
