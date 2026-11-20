"""Run the ```python blocks of a module's readingMarkdown (in one shared namespace, in order)
and then its lab solutionCode, printing everything they print.

Usage:  python -X utf8 scripts/run-reading-code.py content/modules/<slug>.json [...]

This is an authoring aid, not a gate: read the output and compare it with every number
quoted in the chapter's prose, tables, and recall answers.
"""
import json
import re
import subprocess
import sys
import tempfile
import os

FENCE = re.compile(r"^```python\n(.*?)^```", re.S | re.M)


def run(code, label):
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, encoding="utf-8") as handle:
        handle.write(code)
        path = handle.name
    try:
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONUTF8="1", NO_COLOR="1")
        result = subprocess.run([sys.executable, "-X", "utf8", path], capture_output=True,
                                text=True, encoding="utf-8", timeout=30, env=env)
        print(f"--- {label} (exit {result.returncode})")
        print(result.stdout.rstrip())
        if result.returncode != 0:
            print("STDERR:", result.stderr.rstrip()[-1500:])
    finally:
        os.unlink(path)


for module_path in sys.argv[1:]:
    with open(module_path, encoding="utf-8") as handle:
        module = json.load(handle)
    print(f"===== {module['moduleId']} {module['title']}")
    blocks = FENCE.findall(module["readingMarkdown"])
    print(f"{len(blocks)} python block(s) in the reading")
    run("\n\n".join(blocks), "reading blocks, concatenated")
    run(module["interactiveLab"]["solutionCode"], "lab solution")
    reading = module["readingMarkdown"]
    outside = re.sub(r"```.*?```", "", reading, flags=re.S)
    outside = re.sub(r"`[^`\n]*`", "", outside)
    stray = [m.group(0) for m in re.finditer(r"<(?!/?(details|summary)\b)[a-zA-Z][^>\n]{0,20}>", outside)]
    if stray:
        print("WARNING html-like tokens outside code:", stray[:10])
    print("dollar signs outside code:", outside.count("$"), "| details blocks:", reading.count("<details>"),
          "closed:", reading.count("</details>"))
