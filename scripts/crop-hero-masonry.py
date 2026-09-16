from PIL import Image
from pathlib import Path

src = Path(
    r"C:\Users\MY LAPTOP\.cursor\projects\c-Users-MY-LAPTOP-milestone-web\assets\c__Users_MY_LAPTOP_AppData_Roaming_Cursor_User_workspaceStorage_757134224eab79cddea4190479bcec5a_images_image-e585c05b-d6f0-45cd-9f08-73173616d222.png"
)
out = Path(r"C:\Users\MY LAPTOP\milestone-web\public\assets\images\hero-masonry")
out.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGB")

# Aggressive interiors — cut past rounded corners and gutters
crops = {
    "01-dog.jpg": (568, 135, 720, 255),
    "02-chair.jpg": (568, 300, 720, 435),
    "03-cream.jpg": (568, 480, 720, 550),
    "04-metal.jpg": (792, 128, 965, 175),
    "05-woman.jpg": (792, 215, 965, 410),
    "06-clock.jpg": (792, 455, 965, 545),
}

for name, box in crops.items():
    tile = im.crop(box)
    scale = max(4, 1000 // tile.width)
    tile = tile.resize(
        (tile.width * scale, tile.height * scale), Image.Resampling.LANCZOS
    )
    tile.save(out / name, quality=95)
    print(name, tile.size)

print("done")
