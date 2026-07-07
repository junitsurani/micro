import { Buffer } from "node:buffer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");
const outputDir = path.join(appRoot, "public", "micro-generated");

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const dryRun = argv.includes("--dry-run");
const onlyArg = argv.find((arg) => arg.startsWith("--only="));
const limitArg = argv.find((arg) => arg.startsWith("--limit="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((item) => item.trim())) : null;
const limit = limitArg ? Number.parseInt(limitArg.slice("--limit=".length), 10) : undefined;

const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
const quality = process.env.OPENAI_IMAGE_QUALITY ?? "medium";

const style = [
  "MICRO by The Fix wellness studio campaign image.",
  "Mood: quiet luxury, Chelsea wellness space, sensory strength, regulated stillness, premium Lagree and recovery environment.",
  "Visual language: smoked burgundy glass, warm amber slit lighting, limewash plaster, stone texture, soft shadow, deep charcoal, cream, oxblood, tactile minimalism.",
  "Camera: editorial architectural photography, shallow atmospheric depth, cinematic but clean, premium brand campaign.",
  "Avoid: text, typography, logos, watermarks, UI, people, faces, hands, medical imagery, clutter, cheap spa cliches, generic gym equipment.",
].join(" ");

const assets = [
  {
    slug: "about-hero-interior",
    size: "1536x1024",
    prompt: "Wide hero view of a calm sensory strength studio threshold, smoked oxblood glass on one side, textured plaster wall on the other, a precise amber light line cutting vertically through the scene, spacious negative space for headline overlay.",
  },
  {
    slug: "about-intro-material",
    size: "1536x1024",
    prompt: "Close architectural material study for a wellness studio: curved plaster, brushed stone, warm red-brown reflection, soft grazing light, tactile surface detail, abstract enough to support copy beside it.",
  },
  {
    slug: "about-story-threshold",
    size: "1024x1024",
    prompt: "Square moody arrival threshold in a boutique wellness studio, dark plaster corridor, thin amber light from a hidden doorway, burgundy glass reflection, no black letterbox, centered composition.",
  },
  {
    slug: "contact-access",
    size: "1024x1536",
    prompt: "Portrait image for founding access waitlist: quiet reception alcove, sculptural stone bench, warm side light, smoked glass reflection, intimate premium studio atmosphere, no people.",
  },
  {
    slug: "showroom-chelsea",
    size: "1536x1024",
    prompt: "Wide cinematic Chelsea wellness studio exterior-interior transition, dark entry curtain, warm glow beyond, polished stone floor, sensory recovery atmosphere, no signage.",
  },
  {
    slug: "dual-strength-room",
    size: "1024x1536",
    prompt: "Portrait interior detail suggesting Lagree microformer strength without showing branded equipment: low sculptural platform silhouette, warm amber floor light, burgundy glass, controlled precision mood.",
  },
  {
    slug: "dual-sensory-material",
    size: "1024x1536",
    prompt: "Portrait tactile sensory recovery material detail: curved plaster, ribbed glass, oxblood reflection, soft cream highlight, quiet luxury spa-studio mood, abstract composition.",
  },
  {
    slug: "footer-left-texture",
    size: "1024x1024",
    prompt: "Square dark material texture for footer collage, smoky burgundy glass and charcoal plaster, subtle warm reflection, quiet atmospheric gradient, no objects.",
  },
  {
    slug: "footer-right-texture",
    size: "1024x1024",
    prompt: "Square warm stone and plaster detail for footer collage, cream taupe surface, amber glow at one edge, soft shadow, premium wellness material palette.",
  },
  {
    slug: "og-micro-studio",
    size: "1536x1024",
    prompt: "Open graph campaign visual for MICRO by The Fix: abstract warm sensory strength studio, smoky dark left side, cream light right side, amber center glow, enough negative space, no text.",
  },
  {
    slug: "premium-microformer-training",
    size: "1024x1536",
    prompt: "Portrait premium pathway image for controlled Microformer training: sculptural low platform silhouette, precise floor light, burgundy glass panels, disciplined strength and stillness.",
  },
  {
    slug: "premium-recovery-rituals",
    size: "1024x1536",
    prompt: "Portrait premium pathway image for recovery rituals: dim recovery room, warm amber slit light, textured plaster, soft sound and breathwork atmosphere, abstract calm.",
  },
  {
    slug: "premium-founding-memberships",
    size: "1024x1536",
    prompt: "Portrait premium pathway image for founding memberships: intimate member lounge threshold, warm glow, sculptural bench, tactile plaster, exclusive first-access mood.",
  },
  {
    slug: "category-lagree-microformer",
    size: "1024x1536",
    prompt: "Tall category image for Lagree Microformer: controlled strength studio detail, low equipment-inspired silhouette without branding, clean linear light, oxblood and stone palette.",
  },
  {
    slug: "category-regulation-rituals",
    size: "1024x1536",
    prompt: "Tall category image for regulation rituals: soft dark recovery space, curved plaster wall, quiet amber light halo, sensory calm and breath-led atmosphere.",
  },
  {
    slug: "category-founding-memberships",
    size: "1024x1536",
    prompt: "Tall category image for founding memberships: premium arrival corner, burgundy smoked glass, warm stone, hidden doorway light, exclusive and quiet.",
  },
  {
    slug: "featured-the-studio",
    size: "1024x1536",
    prompt: "Portrait member pathway image called The Studio: refined boutique strength room, tactile plaster, warm light edge, minimal sculptural form, no people.",
  },
  {
    slug: "featured-the-method",
    size: "1024x1536",
    prompt: "Portrait member pathway image called The Method: abstract layered surfaces showing precision, nervous-system calm, burgundy glass, amber line, stone texture.",
  },
  {
    slug: "featured-the-community",
    size: "1024x1536",
    prompt: "Portrait member pathway image called The Community: warm empty lounge niche, paired low seating silhouettes, intimate glow, premium material palette, no people.",
  },
  {
    slug: "featured-digital-layer",
    size: "1024x1536",
    prompt: "Portrait member pathway image called The Digital Layer: abstract light grid reflected on smoked glass and plaster, subtle technology mood, still tactile and warm.",
  },
  ...[
    ["service-lagree-microformer", "Lagree Microformer", "a precise low-impact strength studio with a sculptural carriage-like platform silhouette, warm floor light, quiet intensity"],
    ["service-regulation-rituals", "Regulation Rituals", "a calm ritual room with curved plaster, soft amber glow, smoky glass, meditative sensory atmosphere"],
    ["service-founding-access", "Founding Access", "an exclusive studio threshold with warm light beyond a dark doorway, tactile stone floor, first-access anticipation"],
    ["service-low-impact-strength", "Low-Impact Strength", "minimal strength zone with low horizontal forms, burgundy reflection, controlled low-impact movement suggested without people"],
    ["service-sensory-recovery", "Sensory Recovery", "soft recovery alcove with textured walls, amber wash, shadow gradient, quiet nervous-system reset mood"],
    ["service-sound-breathwork", "Sound and Breathwork", "abstract sound room with ribbed glass, subtle circular acoustic forms, warm low light, deep calm"],
    ["service-nourishment-rituals", "Nourishment Rituals", "small stone counter detail with warm cup-like silhouette, plaster texture, burgundy shadow, refined wellness hospitality"],
    ["service-infrared-recovery", "Infrared Recovery", "deep red infrared glow through smoked glass and stone, atmospheric recovery chamber, premium not clinical"],
    ["service-microformer-foundations", "Microformer Foundations", "foundation class environment with clean linear floor markings, sculptural platform detail, amber precision light"],
    ["service-controlled-activation", "Controlled Activation", "focused activation room with dramatic side light, textured wall, low equipment silhouette, tension and calm"],
    ["service-mobility-reset", "Mobility Reset", "quiet mobility mat zone implied by a soft rectangular platform, plaster wall, warm grazing light, spacious calm"],
    ["service-recovery-flow", "Recovery Flow", "flowing shadows over curved plaster and smoked burgundy glass, recovery rhythm, warm materiality"],
    ["service-community-sessions", "Community Sessions", "empty intimate gathering nook with two sculptural benches, warm glow, no people, exclusive community mood"],
    ["service-private-onboarding", "Private Onboarding", "private consultation alcove, stone ledge, concealed amber light, tactile walls, calm premium privacy"],
    ["service-digital-membership", "Digital Membership", "abstract digital reflection on smoked glass, soft grid of warm light, tactile plaster background, human but no devices"],
    ["service-founding-circle", "Founding Circle", "subtle circular light pattern on stone and glass, founding circle mood, warm exclusive atmosphere"],
    ["service-studio-events", "Studio Events", "empty evening studio setting with a warm central glow, sculptural shadows, event-ready but quiet"],
    ["service-nervous-system-reset", "Nervous System Reset", "dark-to-warm gradient over textured plaster, calming light pulse, sensory regulation visual"],
    ["service-full-micro-method", "The Full Micro Method", "composed overview of glass, stone, light, and sculptural platform cues, complete ecosystem mood"],
    ["service-orientation", "Orientation", "welcoming arrival detail with floor line leading toward warm light, soft stone, clear first-step atmosphere"],
    ["service-recovery-protocol", "Recovery Protocol", "structured recovery room detail, amber vertical light, ribbed glass, calm protocol precision"],
    ["service-member-care", "Member Care", "warm member-care corner with folded towel-like stone form, soft plaster, intimate hospitality mood"],
  ].map(([slug, title, description]) => ({
    slug,
    size: "1024x1536",
    prompt: `Unique portrait card image for ${title}: ${description}.`,
  })),
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value.replace(/\\n/g, "\n");
  }
}

loadEnvFile(path.join(appRoot, ".env.local"));
loadEnvFile(path.join(appRoot, ".env"));
loadEnvFile(path.join(repoRoot, "micro-fe", ".env"));

const apiKey = process.env.OPENAI_API_KEY;
const selectedAssets = assets
  .filter((asset) => !only || only.has(asset.slug))
  .slice(0, Number.isFinite(limit) ? limit : undefined);

if (dryRun) {
  console.log(JSON.stringify(selectedAssets, null, 2));
  process.exit(0);
}

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY. Set it in the environment or in micro-fe/.env.");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const manifest = [];

for (const asset of selectedAssets) {
  const filename = `${asset.slug}.png`;
  const outputPath = path.join(outputDir, filename);
  const publicPath = `/micro-generated/${filename}`;
  const prompt = `${style} ${asset.prompt}`;

  if (existsSync(outputPath) && !force) {
    console.log(`skip ${asset.slug}: already exists`);
    manifest.push({ ...asset, path: publicPath, skipped: true });
    continue;
  }

  console.log(`generate ${asset.slug} (${asset.size})`);
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      size: asset.size,
      quality,
      n: 1,
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(`failed ${asset.slug}:`, JSON.stringify(body, null, 2));
    process.exit(1);
  }

  const image = body?.data?.[0];
  if (image?.b64_json) {
    writeFileSync(outputPath, Buffer.from(image.b64_json, "base64"));
  } else if (image?.url) {
    const imageResponse = await fetch(image.url);
    if (!imageResponse.ok) {
      console.error(`failed to download ${asset.slug}: ${imageResponse.status}`);
      process.exit(1);
    }
    writeFileSync(outputPath, Buffer.from(await imageResponse.arrayBuffer()));
  } else {
    console.error(`no image returned for ${asset.slug}:`, JSON.stringify(body, null, 2));
    process.exit(1);
  }

  manifest.push({ ...asset, path: publicPath });
}

writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
writeFileSync(path.join(outputDir, "prompts.json"), JSON.stringify(assets, null, 2));
console.log(`wrote ${manifest.length} image records to ${path.relative(appRoot, outputDir)}`);
