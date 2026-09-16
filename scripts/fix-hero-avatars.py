from PIL import Image
from pathlib import Path

out = Path("public/assets/images")


def content_bbox(im: Image.Image, alpha_thresh: int = 20):
	"""Bounding box of non-transparent, non-near-black pixels."""
	px = im.load()
	w, h = im.size
	min_x, min_y, max_x, max_y = w, h, 0, 0
	found = False
	for y in range(h):
		for x in range(w):
			r, g, b, a = px[x, y]
			if a < alpha_thresh:
				continue
			# skip near-black outer canvas
			if r < 18 and g < 18 and b < 18:
				continue
			found = True
			min_x = min(min_x, x)
			min_y = min(min_y, y)
			max_x = max(max_x, x)
			max_y = max(max_y, y)
	if not found:
		return (0, 0, w, h)
	return (min_x, min_y, max_x + 1, max_y + 1)


def square_face_crop(im: Image.Image, size: int = 160) -> Image.Image:
	"""Crop a face-centered square from a tall memoji and place on its bg color."""
	bbox = content_bbox(im)
	x0, y0, x1, y1 = bbox
	cw, ch = x1 - x0, y1 - y0
	# Bias toward upper portion of content (heads sit high in memoji art)
	face_cx = x0 + cw / 2
	face_cy = y0 + ch * 0.38
	side = int(max(cw, ch * 0.72))
	# pad a bit
	side = int(side * 1.05)
	left = int(face_cx - side / 2)
	top = int(face_cy - side / 2)
	right = left + side
	bottom = top + side

	# Sample background near top of content
	bg = im.getpixel((min(im.width - 1, max(0, int(face_cx))), min(im.height - 1, max(0, y0 + 2))))

	canvas = Image.new("RGBA", (side, side), bg)
	# Paste source aligned so desired region maps to canvas
	canvas.paste(im, (-left, -top), im)
	return canvas.resize((size, size), Image.Resampling.LANCZOS)


for n in (3, 4):
	src = Image.open(out / f"hero-avatar-{n}.png").convert("RGBA")
	result = square_face_crop(src)
	result.save(out / f"hero-avatar-{n}.png")
	print(f"saved {n}", result.size, "bbox", content_bbox(src))

# Normalize 1 & 2: tight square around circular content, remove extra canvas
for n in (1, 2):
	src = Image.open(out / f"hero-avatar-{n}.png").convert("RGBA")
	bbox = content_bbox(src)
	x0, y0, x1, y1 = bbox
	# Prefer square covering the circular body (ignore bubble tail below if present)
	cx = (x0 + x1) / 2
	# Use width of content as side, center on upper circle
	side = max(x1 - x0, int((y1 - y0) * 0.85))
	cy = y0 + side / 2
	left = int(cx - side / 2)
	top = int(cy - side / 2)
	bg = src.getpixel((min(src.width - 1, max(0, int(cx))), min(src.height - 1, max(0, y0 + 2))))
	canvas = Image.new("RGBA", (side, side), bg)
	canvas.paste(src, (-left, -top), src)
	canvas = canvas.resize((160, 160), Image.Resampling.LANCZOS)
	canvas.save(out / f"hero-avatar-{n}.png")
	print(f"saved {n}", canvas.size)
