from docling.document_converter import DocumentConverter
import hashlib
import os
import re
from tqdm import tqdm


def slugify(text):
    # Basic slugifier with hash to avoid collisions
    base = re.sub(r"[^\w\- ]", "", text).strip().lower().replace(" ", "-")
    suffix = hashlib.md5(text.encode()).hexdigest()[:6]
    return f"{base}-{suffix}"


def download_resource(url: str, root: str = "resources/") -> str:
    converter = DocumentConverter()
    result = converter.convert(url)
    markdown = result.document.export_to_markdown()
    header = markdown.split("\n")[0].replace("# ", "")
    name = slugify(header)
    resource_path = os.path.join(root, name)
    os.makedirs(resource_path, exist_ok=True)
    with open(f"{resource_path}/content.md", "w") as f:
        f.write(result.document.export_to_markdown())
    return name


def list_resources(root: str = "resources/"):
    resources = []
    for name in os.listdir(root):
        with open(f"{root}{name}/content.md", "r") as f:
            title = f.readline().replace("# ", "").replace("#", "")
        resources.append({
            "name": name,
            "title": title[:25] + "..." if len(title) > 25 else title
        })
    return resources


def get_resource_contents(name: str):
    with open(f"resources/{name}/content.md", "r") as f:
        return f.read()


def get_notes(name: str):
    print("name", name)
    path = f"resources/{name}/notes.md"
    if os.path.exists(path):
        with open(path) as f:
            return f.read()
    return ""


def create_chunks(text: str) -> list[str]:
    words = text.split(" ")
    chunk_size = 8192
    chunks = [" ".join(words[i : i + chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks


def parse_outline_to_tree(lines, level=0):
    tree = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        indent = len(line) - len(line.lstrip())
        if indent // 2 != level:
            return tree, i
        header = line.lstrip("- ").strip()
        node = {"header": header}
        subsections, consumed = parse_outline_to_tree(lines[i+1:], level + 1)
        if len(subsections):
            node["subsections"] = subsections
        tree.append(node)
        i += consumed + 1
    return tree, i


def convert_outline_to_json(text):
    lines = text.strip().splitlines()
    tree, _ = parse_outline_to_tree(lines)
    return tree


def flatten_tree(node, prefix=""):
    if "subsections" not in node:
        return [prefix + " > " + node["header"]]
    lines = []
    for subsection in node["subsections"]:
        lines.extend(flatten_tree(subsection, prefix + " > " + node["header"]))
    return lines
