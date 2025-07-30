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
    p.add_argument("--cid", required=True, help="IPFS CID")
    p.add_argument("--app", required=True, help="Application name on the server")
    p.add_argument("--url", required=True, help="Deploy service URL")
    p.add_argument("--key", required=True, help="Base64-encoded Ed25519 private key")
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    try:
        signing_key = SigningKey(base64.b64decode(args.key))
    except Exception as exc:
        print("Invalid private key (must be base64-encoded)", file=sys.stderr)
        sys.exit(1)

    payload: Dict[str, Any] = {"cid": args.cid, "app": args.app}
    body: bytes = json.dumps(payload, separators=(",", ":")).encode()

    signature: bytes = signing_key.sign(body).signature
    headers = {
        "Content-Type": "application/json",
        "X-Signature-Ed25519": base64.b64encode(signature).decode(),
    }

    resp = requests.post(args.url, headers=headers, data=body, timeout=60)

    # Fail the workflow on HTTP error codes
    if not resp.ok:
        print(f"HTTP {resp.status_code}: {resp.text}", file=syzs.stderr)
        sys.exit(1)

    try:
        # JSON body
        print(json.dumps(resp.json(), indent=2))
        return
    except ValueError:
        # Plain-text body
        print(resp.text)
        return


if __name__ == "__main__":
    main()