"""Builds press/procession-engine-press-kit.zip from the files press.html offers for download.

  python3 tools/build_press_kit.py

The zip holds exactly the files that press.html links with a download button under #art, each under its own
folder (logo/, key-art/, icon/). Entries carry a fixed timestamp, so the same files always give the same zip.
The script stops if a linked file is missing or if a file in press/ is not linked from the page.
"""
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "press.html")
ZIP_PATH = os.path.join(ROOT, "press", "procession-engine-press-kit.zip")
FIXED_TIME = (2026, 11, 21, 0, 0, 0)
KIT_FOLDERS = ("logo", "key-art", "icon")


def kit_links():
    html = open(PAGE, encoding="utf-8").read()
    start = html.index('id="art"')
    end = html.index("</section>", start)
    hrefs = re.findall(r'<a class="btn btn-sm" href="([^"?#]+)[^"]*" download>', html[start:end])
    return list(dict.fromkeys(hrefs))


def entry_name(href):
    parts = href.split("/")
    if parts[0] == "press" and parts[1] in KIT_FOLDERS:
        return "/".join(parts[1:])
    if href == "assets/keyart_gate_5120.png":
        return "key-art/procession-engine-key-art-wide-5120x2160.png"
    sys.exit(f"no zip folder for {href}")


def main():
    hrefs = kit_links()
    if not hrefs:
        sys.exit("no download links found under #art")
    missing = [h for h in hrefs if not os.path.isfile(os.path.join(ROOT, h))]
    if missing:
        sys.exit("missing: " + ", ".join(missing))
    on_disk = {f"press/{d}/{f}" for d in KIT_FOLDERS for f in os.listdir(os.path.join(ROOT, "press", d))}
    unlinked = sorted(on_disk - set(hrefs))
    if unlinked:
        sys.exit("in press/ but not on the page: " + ", ".join(unlinked))

    tmp = ZIP_PATH + ".tmp"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_STORED) as z:
        for href in hrefs:
            info = zipfile.ZipInfo(entry_name(href), FIXED_TIME)
            info.external_attr = 0o644 << 16
            with open(os.path.join(ROOT, href), "rb") as f:
                z.writestr(info, f.read())
    os.replace(tmp, ZIP_PATH)
    print(f"{os.path.relpath(ZIP_PATH, ROOT)}: {len(hrefs)} files, {os.path.getsize(ZIP_PATH) / 1e6:.1f} MB")
    for href in hrefs:
        print("  " + entry_name(href))


if __name__ == "__main__":
    main()
