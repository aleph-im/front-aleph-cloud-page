from __future__ import annotations

import argparse
import base64
import json
import os
import sys
from typing import Any, Dict

import requests
from nacl.signing import SigningKey


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Deploy request client")
    p.add_argument(
      "--cid",
      required=True,
      help="IPFS CID of the build tarball"
    )
    p.add_argument(
      "--app",
      required=True,
      help="Application name on the server"
    )
    p.add_argument(
        "--url",
        required=True,
        help="Deploy service URL",
    )
    p.add_argument(
        "--key",
        required=True,
        help="Base64-encoded Ed25519 private key",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    key_b64 = args.key

    try:
        signing_key = SigningKey(base64.b64decode(key_b64))
    except Exception as exc:
        print("Invalid private key (must be base64-encoded)", file=sys.stderr)
        raise SystemExit(1) from exc

    payload: Dict[str, Any] = {"cid": args.cid, "app": args.app}

    # Use separators to eliminate whitespace – the server verifies the raw bytes
    body: bytes = json.dumps(payload, separators=(",", ":")).encode()

    signature: bytes = signing_key.sign(body).signature
    headers = {
        "Content-Type": "application/json",
        "X-Signature-Ed25519": base64.b64encode(signature).decode(),
    }

    resp = requests.post(args.url, headers=headers, data=body, timeout=60)
    try:
        print(resp.json())
    except ValueError:
        print(resp.text)


if __name__ == "__main__":
    main()