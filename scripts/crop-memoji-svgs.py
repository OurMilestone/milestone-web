from pathlib import Path
import re

crops = {
	"hero-avatar-1.svg": "0 45 56 56",
	"hero-avatar-2.svg": "1 47 55 55",
}
base = Path("public/assets/svgs/memojis")
for name, vb in crops.items():
	p = base / name
	text = p.read_text(encoding="utf-8")
	text2, n = re.subn(r'viewBox="[^"]+"', f'viewBox="{vb}"', text, count=1)
	text2 = re.sub(r'width="[^"]+"', 'width="56"', text2, count=1)
	text2 = re.sub(r'height="[^"]+"', 'height="56"', text2, count=1)
	p.write_text(text2, encoding="utf-8")
	print(name, "updated", n)
