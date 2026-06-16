# Technical Reference — 1701 Uniform Inventory

Synthesised from 17 books across Python programming, cybersecurity (Kali Linux),
network security (Linux Firewalls, IPCop, PF, Windows), intelligent computing,
and cloud computing. Intended for AI coding agents to prevent recurring mistakes.

---

## Table of Contents

1. [Python Language Fundamentals](#python-language-fundamentals)
2. [Python Standard Library](#python-standard-library)
3. [Database & SQL — Cross-Compatibility Rules](#database--sql)
4. [FastAPI & SQLAlchemy Patterns](#fastapi--sqlalchemy-patterns)
5. [Security — Attack Awareness & Defensive Coding](#security)
6. [Linux System Knowledge](#linux-system-knowledge)
7. [Firewall & Network Security](#firewall--network-security)
8. [Windows Development & PowerShell](#windows-development--powershell)
9. [Project-Specific Lessons Learned](#project-specific-lessons-learned)
10. [Architecture Checklist](#architecture-checklist)
11. [React & JavaScript Frontend Patterns](#react--javascript-frontend-patterns)
12. [Pydantic v2 Patterns](#pydantic-v2-patterns)
13. [JWT & Authentication Flows](#jwt--authentication-flows)
14. [REST API Conventions](#rest-api-conventions)
15. [Alembic & Schema Migrations](#alembic--schema-migrations)
16. [Python Async in FastAPI](#python-async-in-fastapi)
17. [Claude AI Prompting Patterns](#claude-ai-prompting-patterns)

---

## Python Language Fundamentals

### Variables and Types

Python is dynamically typed — assignment creates the variable.
Three primary types: `int`, `float`, `str`. Type checks: `type(x)`, `isinstance(x, int)`.

```python
x = 12          # int
pi = 3.14       # float
name = "John"   # str
a = b = c = 1   # multiple assignment
```

Variable naming: alphanumeric + underscore, cannot start with digit, no spaces,
cannot shadow Python keywords. Convention: `snake_case` for variables, `CamelCase` for classes.

### Data Structures

**Lists** — ordered, mutable, nestable. Index starts at 0. `+` concatenates, `*` repeats.

```python
items = ['apple', 'mango', 'banana']
items[0]        # 'apple'
items[1:3]      # ['mango', 'banana']
items.append('orange')
del items[0]
```

**Tuples** — ordered, immutable. Use when data must not change (faster than lists, hashable as dict keys).

**Dictionaries** — mutable, key-value, unordered. Keys must be unique and immutable.

```python
d = {'name': 'Alice', 'age': 30}
d['name']           # 'Alice'
d['email'] = 'a@b'  # add key
del d['age']        # remove key
d.get('missing', 'default')  # safe access, no KeyError
d.keys() / d.values() / d.items()
d.update({'x': 1})  # merge another dict
```

**Sets** — unordered, unique values. Supports union/intersection. No slicing.

### OOP and Classes

```python
class ComplexNumber:
    def __init__(self, r=0, i=0):   # constructor; self is always first param
        self.real = r
        self.imag = i

    def getData(self):
        print(f"{self.real}+{self.imag}j")

c1 = ComplexNumber(2, 3)
c1.getData()         # 2+3j
c1.attr = 10         # dynamic per-instance attribute creation is valid
del c1.imag          # removes attribute; calling getData() after raises AttributeError
del c1               # removes name binding; object GC'd when no references remain
```

**Access conventions** — Python has no `private` keyword:
- No prefix: public
- `_var`: protected by convention (not enforced)
- `__var`: name-mangled to `_ClassName__var` (harder to access externally, not impossible)

**Encapsulation pattern:**

```python
class Robot:
    def __init__(self):
        self.__version = 22

    def getVersion(self):
        return self.__version

    def setVersion(self, v):
        self.__version = v
```

**Custom exceptions** (inherit from `Exception`):

```python
class CustomException(Exception):
    def __init__(self, value):
        self.parameter = value
    def __str__(self):
        return repr(self.parameter)

try:
    raise CustomException("bad input")
except CustomException as ex:
    print("Caught:", ex.parameter)
```

### Exception Handling

```python
try:
    result = x / y
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(str(e))           # catch-all; always use str(e) to get message
finally:
    pass                    # always runs; use for cleanup (close files, release locks)
```

Always include an `else` or `finally` for cleanup. Never use bare `except:` in production —
it swallows `KeyboardInterrupt` and `SystemExit`.

### Loops

```python
# While — must include termination condition or it loops forever
counter = 1
while counter <= 3:
    counter += 1

# For — iterate over sequence; enumerate() gives (index, value)
for i, item in enumerate(['a', 'b', 'c']):
    print(i, item)

# Always ensure loops have a reachable exit condition
```

### Functions

Four argument types:
1. **Required** — must be provided in correct order
2. **Default** — `def f(x, y=10):` — used when no value passed at call
3. **Keyword** — passed by name at call site, order-independent
4. **Variable** — `*args` for arbitrary positional, `**kwargs` for arbitrary keyword

`if __name__ == '__main__':` guard — ensures code only runs when executed directly, not imported.

---

## Python Standard Library

### os Module

```python
import os

os.getcwd()                    # current working directory
os.mkdir('newDir')             # create directory
os.rename('old', 'new')        # rename
os.rmdir('dir')                # remove empty directory
os.path.exists('/some/path')   # check file/directory exists — always check before open()
os.listdir('.')                # list directory contents
```

Note: `pathlib` is the modern replacement for many `os.path` operations.

### sys Module

```python
import sys

sys.argv[0]         # script filename
sys.argv[1]         # first user argument
len(sys.argv)       # always guard: if len(sys.argv) > 1:
sys.exit(0)         # exit with code (0 = success, non-zero = error)
sys.stderr.write('error message\n')
sys.stdout.write('output\n')
```

### File Handling

```python
# Always use context manager — auto-closes even if exception occurs
with open('file.txt', 'r') as f:
    content = f.read()          # entire file as string
    # or
    for line in f:              # memory-efficient line-by-line iteration
        print(line, end='')

# Write
with open('output.txt', 'w') as f:
    f.write('line 1\n')

# Modes: 'r' (read), 'w' (write, truncates), 'a' (append), 'rb'/'wb' (binary)
```

### Threading

```python
import threading
from queue import Queue

print_lock = threading.Lock()

def worker_job(item):
    # do work
    with print_lock:            # context manager — auto-releases lock
        print(item)

def threader():
    while True:
        item = q.get()          # blocks until work available
        worker_job(item)
        q.task_done()           # signal item complete

q = Queue()
for _ in range(10):
    t = threading.Thread(target=threader)
    t.daemon = True             # dies when main thread exits
    t.start()

for item in work_items:
    q.put(item)

q.join()    # block until all items processed
```

### Sockets

```python
import socket

# Client — connect to server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # TCP/IPv4
s.connect(('hostname', 80))
s.send(b'GET / HTTP/1.1\n\n')    # Python 3: must send bytes, not str
data = s.recv(4096)              # receive up to 4096 bytes
print(data.decode('utf-8'))

# Server — listen for connections
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 5555))              # '' = all interfaces
s.listen(10)                    # queue up to 10 pending connections
conn, addr = s.accept()         # blocks; returns (connection, address)
```

**Critical Python 3 socket rule:** Always `.encode()` strings before sending, `.decode()` bytes after receiving.

### subprocess Module

```python
import subprocess

# Run shell command — shell=True allows built-ins (dir, echo)
subprocess.call('dir', shell=True)          # Windows
subprocess.call('ls -la', shell=True)       # Linux

# Capture output
result = subprocess.run(['ls', '-la'], capture_output=True, text=True)
print(result.stdout)
```

### Regular Expressions

```python
import re

# Identifiers: \d=digit, \D=non-digit, \s=whitespace, \w=word char, .=any char
# Modifiers: + (1+), * (0+), ? (0 or 1), {n} (exactly n), {n,m} (n to m)
# Anchors: ^ (start), $ (end), \b (word boundary)
# Groups: () captures, [] character class

ages = re.findall(r'\d{1,3}', "Alice is 25 and Bob is 30")
# ['25', '30']

names = re.findall(r'[A-Z][a-z]+', "Alice and Bob")
# ['Alice', 'Bob']

# Non-greedy: (.*?) matches minimal; (.*) greedy matches maximal
paragraphs = re.findall(r'<p>(.*?)</p>', html_string)
```

### urllib

```python
import urllib.request
import urllib.parse

# GET request
resp = urllib.request.urlopen('https://example.com/api')
data = resp.read()

# POST with form data
values = {'key': 'value'}
data = urllib.parse.urlencode(values).encode('utf-8')  # must be bytes
req = urllib.request.Request('https://example.com/', data)
resp = urllib.request.urlopen(req)
```

---

## Database & SQL

### CRITICAL: SQLite vs MySQL Dialect Differences

This project uses SQLite for local dev and MySQL for production. Raw SQL must be
dialect-neutral or use Python to fill the gaps.

#### Functions that DO NOT exist in SQLite

| MySQL function | SQLite equivalent | Best fix |
|---|---|---|
| `CONCAT(a, ' ', b)` | `(a \|\| ' ' \|\| b)` | Select columns separately, join in Python |
| `NOW()` | `datetime('now')` | Pass Python `datetime` as a bound parameter |
| `DATE_FORMAT(d, '%Y-%m')` | `strftime('%Y-%m', d)` | Use Python `strftime` in Python |
| `GROUP_CONCAT(x)` | `group_concat(x)` (lowercase) | Available but different defaults |
| `IFNULL(a, b)` | `COALESCE(a, b)` | Use `COALESCE` — works in both |
| `AUTO_INCREMENT` | `AUTOINCREMENT` | Use SQLAlchemy ORM instead |

#### Safe Cross-Dialect Pattern — No CONCAT

```python
# WRONG — MySQL only:
rows = db.execute(text("""
    SELECT CONCAT(u.forename, ' ', u.surname) as full_name FROM users u
""")).fetchall()

# CORRECT — works on both SQLite and MySQL:
rows = db.execute(text("""
    SELECT u.forename, u.surname FROM users u
""")).fetchall()

result = [
    {"full_name": f"{r.forename} {r.surname}"}
    for r in rows
]
```

#### Safe Cross-Dialect Pattern — No NOW()

```python
from datetime import datetime, timezone

# WRONG — MySQL only:
db.execute(text("UPDATE t SET replied_at = NOW() WHERE id = :id"), {"id": x})

# CORRECT — pass Python datetime as bound parameter:
now = datetime.now(timezone.utc).replace(tzinfo=None)
db.execute(text("UPDATE t SET replied_at = :now WHERE id = :id"), {"now": now, "id": x})
```

#### Raw SQL — Always Use Bound Parameters

Never concatenate user input into SQL strings — this is the #1 SQL injection vector.

```python
# WRONG — SQL injection vulnerable:
query = f"SELECT * FROM users WHERE username = '{username}'"

# CORRECT — parameterised:
row = db.execute(text("SELECT * FROM users WHERE username = :u"), {"u": username}).fetchone()

# CORRECT via ORM:
user = db.query(User).filter(User.username == username).first()
```

#### SQLite-Specific Connection Configuration

```python
# In database.py — required for SQLite to work with FastAPI's multi-thread model
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, future=True, connect_args=connect_args)
```

#### Hashing — Use stdlib, Not bcrypt/passlib on Python 3.13+

bcrypt 4.0+ rejects passwords >72 bytes in `detect_wrap_bug`. passlib's wrapper triggers
this on every hash/verify call. On Python 3.13/3.14 Windows this crashes at startup.

```python
# hashing.py — stdlib pbkdf2, works on all Python versions and platforms
import hashlib, hmac, secrets

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260_000)
    return f"pbkdf2$sha256${salt}${key.hex()}"

def verify_password(plain: str, hashed: str) -> bool:
    if not hashed or not hashed.startswith("pbkdf2$"):
        return False
    try:
        _, algo, salt, stored = hashed.split("$")
        key = hashlib.pbkdf2_hmac(algo, plain.encode(), salt.encode(), 260_000)
        return hmac.compare_digest(key.hex(), stored)  # constant-time comparison
    except Exception:
        return False
```

---

## FastAPI & SQLAlchemy Patterns

### Session Lifecycle

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Dependency Injection

```python
# Route dependency — db session + auth in every route
@router.get("/items")
def list_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Item).filter(Item.active == True).all()
```

### Row-Level Authorization (BOLA/IDOR Prevention)

Always filter by the authenticated user's ID — never trust client-supplied IDs alone:

```python
# WRONG — any authenticated user can see any order:
order = db.query(Order).filter(Order.id == order_id).first()

# CORRECT — user can only see their own orders:
order = db.query(Order).filter(
    Order.id == order_id,
    Order.user_id == current_user.id
).first()
if not order:
    raise HTTPException(status_code=404)  # 404 not 403 — don't reveal existence
```

### ORM vs Raw SQL — Decision Rule

- Use ORM (SQLAlchemy models) by default — dialect-neutral, type-safe
- Use `text()` with bound params only when the query is too complex for ORM
- Never use raw string concatenation in SQL

### Alembic / Schema Migrations

Always use migrations for schema changes in production. For demo/SQLite, `Base.metadata.create_all(engine)` is acceptable. Never run DDL against production tables without a migration plan.

---

## Security

### The Attacker's Workflow (Know What You're Defending Against)

**Phase 1 — Reconnaissance:** Attackers scan subdomains, enumerate API endpoints, check
version headers. Tools: Nmap, Nikto, Sublist3r, Google dorking.

**Defense:** Strip version info from response headers. In production, disable `/docs`,
`/redoc`, `/openapi.json`:
```python
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
```
Return generic `500 Internal Server Error` to clients; log full details server-side only.

**Phase 2 — Scanning:** Port scanning, banner grabbing, version detection.

**Defense:** Run behind a reverse proxy (nginx/Caddy). Expose only 80/443. Rate-limit all endpoints. Use `slowapi` or `fastapi-limiter` for FastAPI.

**Phase 3 — Gaining Access:** SQL injection, XSS, weak credentials, misconfigured endpoints.

**Phase 4 — Privilege Escalation:** Low-privilege account → admin via application bugs or exposed credentials.

**Phase 5 — Persistence:** Backdoors planted, log files deleted, lateral movement.

---

### SQL Injection

**How it works:** Attacker sends `' OR '1'='1` as a username. If the query is built by
string concatenation, the injected SQL executes.

**Mandatory rule: Always use parameterised queries** — see [Database section](#database--sql) above.

Additional defences:
- Database user should have only `SELECT/INSERT/UPDATE` on needed tables — no `DROP`, `CREATE`, file access
- Validate input types at the boundary (Pydantic does this automatically in FastAPI)
- Consider a WAF (Cloudflare) in front of production APIs

---

### Authentication Security

**Password hashing:** Use a slow-by-design algorithm. Argon2 is current best practice.
This project uses pbkdf2 (260,000 iterations) which is acceptable. Never use MD5, SHA-1,
or plain SHA-256 for passwords — they're too fast (can be brute-forced offline).

**Constant-time comparison:** Always use `hmac.compare_digest()` when comparing secrets.
Regular `==` comparison leaks timing information (timing attack).

```python
# CORRECT
import hmac
hmac.compare_digest(computed_hash, stored_hash)

# WRONG — vulnerable to timing attack
computed_hash == stored_hash
```

**Rate limiting on auth endpoints:** 5 failed attempts per 15 minutes per IP minimum.
Rate limit by user account too — not just IP (attacker can rotate IPs).

**Username enumeration:** Return identical responses for "user not found" and "wrong password".
Never reveal whether a username exists.

**JWT best practices:**
- Short access token expiry (15 minutes)
- Longer refresh tokens with rotation
- Sign with strong secret (HS256 minimum; RS256/ES256 for multi-service)
- Revoke tokens on logout (maintain blacklist in Redis, or use short expiry + refresh rotation)
- Never trust client-supplied role claims — read role from server-side session/token

**Multi-factor authentication:** Require MFA for all admin accounts. Microsoft Authenticator
push with number matching is the best UX. FIDO2 hardware keys (YubiKey) are phishing-resistant
and are the gold standard for privileged accounts. SMS/voice are weakest — vulnerable to
SIM-swapping and SS7 vulnerabilities.

**Windows Credential Guard:** On Windows, Credential Guard isolates NTLM hashes and Kerberos
tickets in a VBS (Virtualization-Based Security) container. Mimikatz and similar tools cannot
extract secrets even with SYSTEM access. Enable via Group Policy on all Windows servers running
sensitive services.

---

### Cross-Site Scripting (XSS)

FastAPI returns JSON by default — not vulnerable to traditional XSS in the API layer.
However, if the frontend renders any API-supplied content as HTML:

- Set `Content-Type: application/json` on all API responses (FastAPI does this automatically)
- Set security headers on every response:
  ```
  Content-Security-Policy: default-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  ```
- Store session tokens in `HttpOnly` cookies (JavaScript cannot read them even if XSS is achieved)
- Sanitize user-generated text server-side before storing; use a whitelist HTML sanitizer

---

### CSRF (Cross-Site Request Forgery)

**For APIs using Bearer tokens:** Custom `Authorization` headers cannot be sent cross-origin
by default — this is CSRF-safe without additional tokens.

**For cookie-based sessions:**
- Require a CSRF token in a custom header (`X-CSRF-Token`)
- Set `SameSite=Lax` or `SameSite=Strict` on session cookies
- Validate `Origin` header server-side for state-changing operations

---

### Privilege Escalation Prevention

- Implement RBAC (Role-Based Access Control) at every endpoint
- Check authorization on every database query — see [Row-Level Authorization](#row-level-authorization-bolaidor-prevention)
- Roles come from server-side JWT/session, never from request parameters
- Run application process as non-root with no write access to its own code directory
- Broken Object Level Authorization (BOLA) is the most common API vulnerability — filter by `user_id` on every query that returns user-specific data

---

### Network Attack Patterns

**Packet sniffing (Wireshark, Aircrack-ng):** On unencrypted networks, all traffic is readable.

**Defence:** Enforce HTTPS everywhere. HSTS header:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
Set `Secure` flag on all cookies. Use TLS 1.2 minimum (1.3 preferred). Disable SSLv3, TLS 1.0, TLS 1.1.

**Man-in-the-Middle:** Even on HTTPS, a rogue CA can intercept. For mobile apps, implement
certificate pinning. For server-to-server, use mutual TLS (mTLS).

**Port scanning (Nmap, Nikto):** Attackers scan all 65535 ports to find attack surface.

**Defence:** Close all ports at the firewall except 80/443. Run API behind reverse proxy.
Use psad (Port Scan Attack Detector) on Linux servers to detect and respond to scans.

---

### Information Leakage Prevention

- Remove `Server`, `X-Powered-By`, and framework version headers from responses
- Do not expose `.git` directory over HTTP (attackers can download your entire source code)
- Never commit `.env`, `config.py`, or credentials to version control
- Store secrets in environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Disable directory listing on web servers
- Keep backup files outside the web root
- Use immutable deployment artifacts (Docker images) — deployments replace files, not modify them

---

### Hacker Hierarchy (Threat Model)

Knowing who might attack helps prioritise defences:

| Level | Who | What they do |
|---|---|---|
| Script kiddies | Unskilled, use pre-built tools | Automated scans, exploit unpatched CVEs |
| Novice hackers | Learning, follow tutorials | Metasploit modules, wordlist attacks |
| Hacktivists | Motivated, some skill | Targeted attacks, DDoS, data leaks |
| Black hat | Professional criminals | Custom exploits, supply chain attacks |
| Criminal gangs | Organised, financially motivated | Ransomware, credential theft, fraud |
| State-sponsored | Unlimited resources | APTs, zero-days, long-term persistence |
| Automated bots | Software | Credential stuffing, vulnerability scanning |

For most web applications, defend against levels 1-3 first (covers >90% of real attacks).
Levels 4-7 require dedicated security teams.

---

### Malware Analysis Indicators (What to Look For in Your Logs)

From Kali Linux Malware Analysis 2024:
- Unexpected outbound connections to unfamiliar IPs (C2 communication)
- Processes spawning other processes unexpectedly
- Files appearing in unexpected locations (especially `%TEMP%`, `/tmp`)
- Registry modifications on Windows (persistence mechanisms)
- Encoded/obfuscated command strings (Base64, hex encoding in process args)
- Large volumes of DNS queries to unusual domains (DNS tunnelling)

Detection tools: Wireshark (network), Volatility (memory), strings/xxd (static analysis),
VirusTotal API (hash lookups).

---

### Security Tools Reference (Kali Linux)

| Tool | Purpose | What it finds |
|---|---|---|
| Nmap | Port scanning | Open ports, services, versions, OS |
| Nikto | Web server scanning | Misconfigurations, outdated software, exposed files |
| Sublist3r | Subdomain enumeration | Exposed staging/dev/admin subdomains |
| Burp Suite | HTTP proxy/interceptor | Hidden parameters, injection points, brute-force auth |
| Metasploit | Exploit framework | Tests known CVEs; payload delivery |
| Wireshark | Packet capture | Unencrypted credentials, network patterns |
| Aircrack-ng | WiFi attack | WEP/WPS keys, handshake capture |
| sqlmap | SQL injection auto | Automated SQLi detection and exploitation |
| Uniscan | Web vulnerability | RCE, RFI, SQLi, XSS detection |
| psad | Port scan detection | Analyses iptables logs for scan patterns |
| fwsnort | Snort rules → iptables | Translates IDS signatures to firewall rules |

---

## Linux System Knowledge

### Essential Commands

```bash
# User Management
useradd username          # create user
passwd username           # set password (stored in /etc/shadow)
usermod -m -d /new/home   # modify user home directory
userdel username          # delete user
groupadd groupname        # add group
groupdel groupname        # delete group
id                        # show current UID/GID
finger username           # show user info

# File Management
pwd                       # current directory
cd /path/to/dir           # change directory
ls -la                    # list files with permissions
touch file.txt            # create empty file
rm file.txt               # delete file
mv src dest               # move or rename
cp src dest               # copy file
mkdir dirname             # make directory
rmdir dirname             # remove empty directory
chmod +x file             # add execute permission
find / -name "*.py"       # search filesystem (slow, searches from root)
locate filename           # faster search (uses database; run updatedb first)
which python3             # find executable in PATH
cat file.txt              # display file
head -n 20 file.txt       # first 20 lines
tail -n 20 file.txt       # last 20 lines
gzip file                 # compress file
tar -czf archive.tar.gz . # create compressed archive

# Process Management
ps aux                    # list all processes
kill -9 PID               # force-kill process by PID
pkill processname         # kill by name
crontab -e                # edit cron jobs
service servicename start/stop/status  # manage services

# Permissions
# chmod categories: u=user, g=group, o=other
# permissions: r=read(4), w=write(2), x=execute(1)
chmod 755 file            # rwxr-xr-x
chmod 644 file            # rw-r--r--
chmod +x file             # add execute for all
```

### Linux Security Files

```
/etc/passwd    — user accounts (world-readable; no passwords)
/etc/shadow    — password hashes (root-only readable)
/etc/group     — group definitions
/etc/hosts     — local DNS overrides
/etc/crontab   — system cron jobs
/etc/skel      — template for new user home directories
```

### Shell Scripting

```bash
#!/bin/bash

# Variables
NAME="value"
echo $NAME

# Special variables
$0   # script name
$1   # first argument
$@   # all arguments
$?   # exit code of last command
$$   # current PID

# Conditionals
if [ "$NAME" = "admin" ]; then
    echo "admin found"
elif [ "$NAME" = "user" ]; then
    echo "user found"
else
    echo "unknown"
fi

# Loops
for item in a b c; do
    echo $item
done

# Functions
myFunction() {
    echo "arg: $1"
}
myFunction "hello"

# Aliases
alias ll='ls -la'

# Background jobs: command &
# Bring to foreground: fg
# List jobs: jobs
```

### Linux Kernel Architecture

The Linux kernel is monolithic — all functionality (hardware drivers, network stack,
filesystem) is compiled into the kernel. This differs from Minix (micro-kernel).
Modules can still be loaded/unloaded at runtime (`insmod`, `rmmod`, `modprobe`).

Linux distributions differ by: package manager (APT for Debian/Ubuntu/Kali;
RPM/yum for RedHat/CentOS/Fedora), desktop environment, and package repository depth.
Kali inherits from Debian via Ubuntu — uses APT (`apt-get`, `apt`).

---

## Firewall & Network Security

### Firewall Concepts

A firewall is the implementation of your network security policy. Two primary types:

- **Stateless (packet filter):** Inspects each packet independently based on source/dest IP,
  port, protocol. Fast but cannot track connection state.
- **Stateful:** Tracks connection state (TCP handshake, established, closing).
  Can distinguish legitimate response traffic from unsolicited incoming packets.

### iptables (Linux)

```bash
# List rules
iptables -L -n -v

# Default policy — DROP all incoming, ACCEPT all outgoing
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow established connections (stateful)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow SSH (port 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Log and drop everything else
iptables -A INPUT -j LOG --log-prefix "DROPPED: "
iptables -A INPUT -j DROP

# Save rules (Debian/Ubuntu)
iptables-save > /etc/iptables/rules.v4
```

### psad (Port Scan Attack Detector)

psad analyses iptables logs to detect and optionally block port scans.
It detects: TCP connect scans, SYN (half-open) scans, FIN/XMAS/NULL scans, UDP scans.

```
/etc/psad/psad.conf    — main config
/etc/psad/auto_dl      — auto-danger level rules
/etc/psad/signatures   — attack signatures (Snort format)
```

Active response: psad can automatically add iptables rules to block attacking IPs
(use `ENABLE_AUTO_IDS_EMAIL` and `AUTO_IDS_DANGER_LEVEL`). Trade-off: risk of
blocking legitimate traffic (false positives).

### Network Attack Types (What Firewalls Detect)

| Attack | Description | Detection |
|---|---|---|
| TCP SYN scan | Send SYN, don't complete handshake | Incomplete connections in firewall log |
| TCP FIN scan | Send FIN to closed ports | RST response pattern |
| UDP scan | Send UDP to all ports | ICMP port unreachable responses |
| LAND attack | Src IP = Dst IP (loops the packet) | Snort rule for TCP port 0 traffic |
| DDoS | Flood from multiple sources | Rate-based detection, traffic volume |
| ARP spoofing | Poison ARP cache for MITM | Monitor ARP tables |
| DNS poisoning | Corrupt DNS cache | Validate DNSSEC, monitor DNS responses |
| Buffer overflow | Overflow memory to execute code | Snort signatures, DEP/ASLR |

### DMZ Architecture

For web applications, the recommended network architecture is:

```
Internet → Firewall → DMZ (web servers) → Firewall → Internal network (database)
```

- Web servers in DMZ: accessible from internet, cannot access internal network
- Database servers in internal network: only accessible from DMZ web servers
- Admin access: VPN or port knocking — never expose admin interfaces to internet

### Port Knocking and Single Packet Authorization (SPA)

Port knocking: client sends packets to a specific sequence of ports. Firewall only opens
the real port (e.g., SSH) after detecting the correct knock sequence. fwknop implements SPA
(Single Packet Authorization) — more secure than port knocking:
- Single encrypted packet containing HMAC, timestamp, and destination port
- Firewall validates packet before opening port
- Replay attacks blocked by timestamp validation

### OpenBSD PF (Packet Filter)

PF is the firewall in OpenBSD and macOS. More readable syntax than iptables:

```
# /etc/pf.conf
ext_if = "em0"                          # external interface
block all                               # default deny
pass out on $ext_if from any to any     # allow all outbound
pass in on $ext_if proto tcp to port 22  # allow SSH
pass in on $ext_if proto tcp to port 80  # allow HTTP
```

### Windows Firewall

Windows Defender Firewall supports three profiles: Domain (enterprise), Private (home/work
network), Public (untrusted network). Configure via:
- GUI: `wf.msc` (Windows Firewall with Advanced Security)
- PowerShell: `New-NetFirewallRule`, `Get-NetFirewallRule`
- Group Policy for enterprise-wide deployment

Windows Credential Guard (enabled via Group Policy) isolates LSASS credentials in a
VBS container — prevents Mimikatz-style credential extraction even with SYSTEM access.

---

## Windows Development & PowerShell

### Environment Variables

```powershell
# PowerShell — set for current session only:
$env:DATABASE_URL = "sqlite:///./demo.db"
$env:SECRET_KEY = "mysecretkey"

# Verify it's set:
echo $env:DATABASE_URL

# Set permanently (current user):
[Environment]::SetEnvironmentVariable("DATABASE_URL", "sqlite:///./demo.db", "User")

# Set permanently (system-wide, requires admin):
[Environment]::SetEnvironmentVariable("DATABASE_URL", "value", "Machine")
```

**Critical:** Linux syntax `VAR=value python3 script.py` does NOT work in PowerShell.
Always use `$env:VAR = "value"` first, then run the command.

### Python with Multiple Installs

When Python 3.13 and 3.14 are both installed:

```powershell
# Use python -m pip instead of pip — ensures correct Python version
python -m pip install fastapi uvicorn sqlalchemy

# Check which python is active
python --version
where python   # shows all Python executables in PATH

# Explicitly target a version
py -3.13 -m pip install package   # Python Launcher syntax
```

### Running the Backend (Windows)

```powershell
# Navigate to backend directory first
cd C:\path\to\1701-uniform\backend

# Set SQLite for local dev
$env:DATABASE_URL = "sqlite:///./demo.db"

# Seed database (must be done after any schema changes)
python seed.py
python demo_seed.py

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000

# Confirm running: look for "Application startup complete."
# Frontend is on http://localhost:8080 (NOT 8000)
# API is on http://localhost:8000
```

### Port Conflicts

If `uvicorn` fails to bind to port 8000:

```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill process by PID (replace 1234)
taskkill /F /PID 1234
```

Alternatively, change port: `uvicorn main:app --port 8001`

### Windows Security Concepts

**BitLocker:** Full-disk encryption using TPM + PIN. Encrypts entire drive so stolen devices
cannot have their drives read externally. Enable via Settings > Privacy & Security > Device encryption.

**Windows Defender:** Built-in AV/EDR. Behavioural detection, cloud-based threat intelligence.
Real-time protection should always be enabled. Never disable for development convenience.

**Windows Hello:** Biometric authentication (face/fingerprint) backed by asymmetric keys
in TPM. Credentials never leave the device. Phishing-resistant.

**NTLM vs Kerberos:** Kerberos is the preferred domain authentication protocol.
NTLM is legacy — used when Kerberos fails (cross-domain, IP-based access). NTLM hashes
are the primary target for pass-the-hash attacks. Credential Guard prevents NTLM hash extraction.

### PowerShell XML Manipulation

PowerShell treats XML as first-class objects via the `[xml]` type accelerator:

```powershell
# Load XML from file
[xml]$config = Get-Content "config.xml"

# Navigate as object properties
$config.configuration.appSettings.add | Where-Object { $_.key -eq "LogLevel" }

# XPath queries via SelectNodes / SelectSingleNode
$errorLogs = $xml.SelectNodes("//log[@level='ERROR']")
$errorLogs | ForEach-Object { Write-Host "Error: $($_.message) at $($_.timestamp)" }

# Select-Xml cmdlet (namespace-aware)
$ns = @{ atom = "http://www.w3.org/2005/Atom" }
Select-Xml -Xml $xml -XPath "//atom:entry" -Namespace $ns | ForEach-Object { $_.Node }

# Modify and save
$config.configuration.appSettings.add |
    Where-Object { $_.key -eq "LogLevel" } |
    ForEach-Object { $_.value = "Debug" }
$config.Save("config.xml")
```

**Convert objects to/from XML:**
```powershell
# Serialize PowerShell objects to XML (round-trips perfectly)
Get-Process | Export-Clixml -Path "processes.xml"
$procs = Import-Clixml -Path "processes.xml"

# Convert single object to XML string
$obj = Get-Process | Select-Object -First 1
$xml = ConvertTo-Xml -InputObject $obj -As String
```

**Call REST APIs from PowerShell:**
```powershell
# GET JSON API
$response = Invoke-RestMethod -Uri "https://api.example.com/items" -Method Get
$response.items | ForEach-Object { Write-Host $_.name }

# POST with auth token
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
$body = @{ name = "test"; quantity = 5 } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.example.com/items" -Method Post -Headers $headers -Body $body
```

**Secure credentials — never store passwords as plain strings:**
```powershell
# SecureString (encrypted in memory)
$securePass = ConvertTo-SecureString "MyPassword" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("username", $securePass)

# Prompt interactively (best practice)
$cred = Get-Credential
```

**Error handling:**
```powershell
try {
    [xml]$xmlDoc = Get-Content "data.xml"
} catch [System.Xml.XmlException] {
    Write-Error "Failed to parse XML: $_"
}

# Large files — use streaming to avoid loading into memory
$reader = [System.Xml.XmlReader]::Create("large_file.xml")
while ($reader.Read()) { ... }
```

---

## Project-Specific Lessons Learned

These are hard-won lessons from building and running the 1701 Uniform Inventory app.
Every agent working on this project must read this section first.

### SQLite Compatibility (Most Common Bug Source)

1. **No `CONCAT()`** — select `forename` and `surname` as separate columns, join in Python:
   ```python
   full_name = f"{row.forename} {row.surname}"
   ```

2. **No `NOW()`** — pass a Python datetime as a bound parameter:
   ```python
   from datetime import datetime, timezone
   now = datetime.now(timezone.utc).replace(tzinfo=None)
   db.execute(text("UPDATE t SET ts = :now WHERE id = :id"), {"now": now, "id": x})
   ```

3. **`check_same_thread=False`** required for SQLite with FastAPI (multi-threaded):
   ```python
   connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
   ```

4. **SQLite type affinity is loose** — boolean columns stored as 0/1. Filter with:
   ```python
   .filter(Model.active == True)  # SQLAlchemy handles this correctly
   ```

### Hashing — Never Use bcrypt/passlib on Python 3.13+

See [`utils/hashing.py`](backend/utils/hashing.py) — uses stdlib `pbkdf2_hmac`.
Do not add `bcrypt` or `passlib` back to `requirements.txt`. The pbkdf2 implementation
is fully secure with 260,000 iterations.

### JavaScript — No Optional Chaining on Left Side of Assignment

```javascript
// WRONG — SyntaxError crashes entire script on load:
document.getElementById('btn')?.onclick = () => { };

// CORRECT — guard then assign:
const btn = document.getElementById('btn');
if (btn) btn.onclick = () => { };
```

### Frontend vs API Ports

- **Frontend (static files):** `http://localhost:8080`
- **API (uvicorn):** `http://localhost:8000`

The browser must be pointed at 8080. Navigating to 8000 shows raw API JSON, not the app.

### Database Rebuild After Schema Changes

After any change to `seed.py`, `demo_seed.py`, or `hashing.py`:

```powershell
del demo.db          # Windows
# rm demo.db         # Linux/Mac
python seed.py
python demo_seed.py
```

Then restart uvicorn. Old hashes in demo.db will not verify after hashing changes.

### Authentication Flow

1. `GET /auth/login` returns JWT token
2. Token stored in-memory (`_tokenCache`) in frontend
3. `sessionStorage` stores selected staff user (persists across refresh)
4. All subsequent calls include `Authorization: Bearer <token>` header
5. Staff identity sent as `X-Staff-Id: <user_id>` header (separate from JWT user)

If stats bar is empty on home screen, the auth flow is failing — check:
- uvicorn is running (Application startup complete in console)
- `demo.db` exists and was seeded after latest `hashing.py` changes
- No CORS errors in browser dev tools

### Demo Data Summary

After running both seed scripts:
- **Staff:** 5 users (Morrison/OC, Clarke/Adj, Reid/WO, Burns/FS, Stewart/CI) + admin
- **Cadets:** 25 active (flights A/B/C), 3 inactive leavers
- **Kit issues:** 256 lines (realistic gaps for new joiners)
- **Badges:** 22 types, 67 issued to senior cadets
- **Feedback:** 5 entries (mix of open/replied/closed)
- **Audit log:** 10 recent entries

---

## Architecture Checklist

### FastAPI Production Deployment

```python
# Disable docs in production:
app = FastAPI(
    title="1701 Uniform Inventory",
    docs_url=None,      # disable /docs
    redoc_url=None,     # disable /redoc
    openapi_url=None,   # disable /openapi.json
)
```

### Response Headers (nginx config)

```nginx
# Strip server info
server_tokens off;

# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### Dependency Security

```bash
# Check for known CVEs in installed packages
pip install pip-audit
pip-audit

# Pin all versions in requirements.txt — never use >= without an upper bound
# Review security advisories when upgrading
```

### Logging Best Practices

- Log to external append-only store (ELK, CloudWatch) — attackers cannot delete what they can't access
- Log: request method/path, user ID, IP, timestamp, response status
- Never log passwords, tokens, or PII in plaintext
- Correlate by user ID + session, not just IP (attackers rotate IPs)

### Rate Limiting

```python
# fastapi-limiter example
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import aioredis

@app.on_event("startup")
async def startup():
    redis = await aioredis.create_redis_pool("redis://localhost")
    await FastAPILimiter.init(redis)

@router.post("/auth/login")
@limiter.limit("5/15minutes")
def login(request: Request, ...):
    ...
```

### ML Pattern Reference (Intelligent Computing)

For recommendation or ranking features (future):

- **TOPSIS scoring:** Rank alternatives by distance to ideal/anti-ideal solution.
  RCC = distance_to_NIS / (distance_to_PIS + distance_to_NIS). Returns 0-1 score.
- **K-means without K:** Use DGA (Different-length Genetic Algorithm) — chromosome length
  encodes K implicitly. Outperforms K-means by 39% on fitness.
- **Recommendation engine:** GA-NMF (Genetic Algorithm + NMF matrix factorisation).
  Works at 40-55% data sparsity. Outperforms ALS/HALS/MU by 3-8x.
- **Feature selection:** Memetic Algorithm (GA + ReliefF filter). Use when ML pipeline
  has high-dimensional input — reduces dimensions while improving accuracy.
- **Evaluation metrics:** F-measure (balanced precision/recall), Silhouette score (clustering
  quality), RMSE (regression/factorisation quality), NMI (distribution similarity).

---

## Malware Analysis & Incident Response

### Static Analysis Tools

| Tool | Purpose | Key command |
|------|---------|-------------|
| `strings` | Extract human-readable strings from binary | `strings -n 8 malware.exe` |
| `file` | Identify file type by magic bytes | `file sample.bin` |
| `binwalk` | Detect embedded files/firmware in binary | `binwalk -e firmware.bin` |
| `PEiD` / `DIE` | Detect packers and compilers | GUI or `die malware.exe` |
| `objdump` | Disassemble ELF/PE objects | `objdump -d binary` |
| `IDA Pro` | Professional disassembler/decompiler, cross-platform | Proprietary, industry standard |
| `Ghidra` | NSA open-source reverse-engineering suite | `ghidraRun` — free alternative to IDA |
| `Radare2` | CLI disassembler/debugger | `r2 -A malware.exe` then `pdf @ main` |
| `YARA` | Pattern-matching rule engine for malware ID | `yara rules.yar target_dir/` |
| `CFF Explorer` | PE header viewer | GUI — inspect PE sections, imports, exports |

**Strings to look for:** IP addresses, URLs, registry keys, file paths, base64 blobs,
crypto constants (e.g., AES S-box `0x63`), mutex names.

### Dynamic Analysis Tools

| Tool | Purpose |
|------|---------|
| `Cuckoo Sandbox` | Automated malware sandbox — captures API calls, network, file ops |
| `Wireshark` | Network traffic capture and analysis |
| `Process Monitor (ProcMon)` | Sysinternals — file/registry/process/network events |
| `Regshot` | Before/after registry snapshot diff |
| `x64dbg` / `OllyDbg` | Windows user-mode debuggers |
| `Volatility` | Memory forensics — dump processes, network conns, injected code |

**Dynamic analysis workflow:**
1. Snapshot VM (clean state)
2. Start ProcMon + Regshot baseline + Wireshark
3. Execute sample in VM
4. Capture: Regshot after, ProcMon log, Wireshark pcap
5. Analyse: new registry keys, dropped files, C2 callbacks
6. Revert VM snapshot

### Anti-Analysis Techniques (and Mitigations)

| Technique | How it works | Mitigation |
|-----------|-------------|-----------|
| VM detection | Checks CPUID, registry keys (`VBOX`, `VMware`), timing | Use bare-metal or patch VM artefacts |
| Debugger detection | `IsDebuggerPresent()`, timing checks, NtQueryInfo | Patch API to return 0; use ScyllaHide plugin |
| Packing / encryption | UPX, custom packers obscure code | `upx -d packed.exe`; trace OEP in debugger |
| Sleep bombing | `Sleep(600000)` to evade sandboxes | Patch timeout; use Cuckoo's sleep skip option |
| Code injection | Process hollowing, DLL injection, shellcode | Monitor CreateRemoteThread, VirtualAllocEx calls |
| Anti-disassembly | Junk bytes, jump-over-data tricks | Use IDA's manual undefine/code creation |

### Persistence Mechanisms

**Windows:**
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
Task Scheduler:    schtasks /create /tn "Updater" /tr "malware.exe" /sc onlogon
Services:          sc create malservice binPath= "C:\malware.exe" start= auto
Startup folder:    %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\
```

**Linux:**
```bash
/etc/cron.d/             # system cron jobs (root)
~/.cron / crontab -e     # user cron
/etc/init.d/             # SysV init scripts
/etc/systemd/system/     # systemd unit files
~/.bashrc / ~/.profile   # user shell startup
/etc/rc.local            # run at startup (deprecated but still present)
```

**macOS:**
```
~/Library/LaunchAgents/          # per-user, run at login
/Library/LaunchDaemons/          # system-wide, run at boot (root)
/Library/StartupItems/           # legacy (pre-launchd)
```

### Ransomware Analysis

1. **Identify encryption** — look for CryptoAPI/BCrypt imports, AES key schedule constants,
   RSA public key embedded in binary
2. **Find key storage** — local file, registry, or C2 exfil of symmetric key
3. **Check for wipers** — `DeleteFile`, shadow copy deletion (`vssadmin delete shadows /all`)
4. **Network IOCs** — C2 check-in before encryption begins; onion URLs for payment
5. **Recovery path** — if key stored locally before deletion: memory forensics (Volatility),
   volume shadow copies (if not deleted), file carving (PhotoRec)

---

## OpenBSD PF — Advanced Rules Reference

### Rule Syntax Summary

```
action  [direction] [log] [quick] [on interface] [af] [proto protocol]
        [from src [port src]] [to dst [port dst]] [flags tcp_flags]
        [state options]
```

- `action`: `pass` | `block` | `match`
- `quick`: stop processing further rules (first match wins when `quick` is used)
- Without `quick`: last matching rule wins

### Tables and Macros

```pf
# Macros
ext_if = "em0"
int_if = "em1"
admin_hosts = "{ 10.0.0.1 10.0.0.2 }"

# Tables (dynamic, updateable at runtime with pfctl -t)
table <bruteforce> persist
table <trusted> persist file "/etc/pf.trusted"

# Use tables in rules
pass in on $ext_if from <trusted> to any
block in quick from <bruteforce>
```

### Brute-Force Protection (overload tables)

```pf
# Block after 3 failed SSH connections in 60 seconds
# max-src-conn: max simultaneous connections
# max-src-conn-rate: rate limit (connections/seconds)
# overload: add offending IP to table
pass in on $ext_if proto tcp to port 22 \
    flags S/SA keep state \
    (max-src-conn 15, max-src-conn-rate 3/60, overload <bruteforce> flush global)

# Expire bruteforce entries after 24 hours (run from cron):
# pfctl -t bruteforce -T expire 86400
```

### NAT and Redirection

```pf
# NAT outbound (masquerade internal network)
match out on $ext_if from 192.168.1.0/24 to any nat-to ($ext_if)

# Port redirection (DNAT)
match in on $ext_if proto tcp to port 80 rdr-to 192.168.1.10 port 8080
```

### Traffic Shaping (HFSC Queues)

```pf
# Define scheduler on interface
altq on $ext_if hfsc bandwidth 10Mb queue { q_bulk, q_interactive }

queue q_interactive bandwidth 20% priority 7 hfsc (realtime 10%)
queue q_bulk       bandwidth 80% hfsc (default)

# Assign traffic to queues
pass out proto tcp to port 22 queue q_interactive   # SSH gets priority
pass out proto tcp queue q_bulk                      # everything else bulk
```

### CARP / pfsync High Availability

```pf
# On primary firewall (advskew 0 = master)
ifconfig carp0 create
ifconfig carp0 vhid 1 carpdev em0 pass "shared_secret" advskew 0 10.0.0.1/24

# On backup (higher advskew = backup)
ifconfig carp0 vhid 1 carpdev em0 pass "shared_secret" advskew 100 10.0.0.1/24

# pfsync — synchronise state tables between firewalls
ifconfig pfsync0 syncdev em1
```

### pfctl Command Reference

```bash
pfctl -e                     # enable PF
pfctl -d                     # disable PF
pfctl -f /etc/pf.conf        # load ruleset
pfctl -nf /etc/pf.conf       # dry-run (syntax check, no load)
pfctl -s rules               # show current rules
pfctl -s state               # show state table
pfctl -s info                # show statistics
pfctl -t bruteforce -T show  # show table contents
pfctl -t bruteforce -T add 1.2.3.4   # add IP to table
pfctl -t bruteforce -T delete 1.2.3.4
pfctl -t bruteforce -T expire 86400  # remove entries older than 24h
pfctl -k 1.2.3.4             # kill all states for source IP
```

### Global PF Options

```pf
set skip on lo              # skip loopback
set block-policy drop       # default block silently drops (vs return: sends RST/ICMP)
set loginterface em0        # log interface statistics
set optimization aggressive # for high-traffic servers (faster state expiry)
set state-policy if-bound   # bind state to interface (prevents state hijack)
set syncookies adaptive (start 25%, end 50%)  # SYN flood protection
```

### Logging

```bash
# pflog is a pseudo-interface; capture with tcpdump
tcpdump -n -e -ttt -i pflog0

# Log specific rules (add 'log' keyword)
pass in log on $ext_if proto tcp to port 22
```

### spamd — SMTP Greylisting

```pf
# Redirect SMTP from unknown senders to spamd (greylist daemon)
table <spamd-white> persist
pass in on $ext_if proto tcp to port 25 rdr-to 127.0.0.1 port 8025
pass in on $ext_if proto tcp from <spamd-white> to port 25
```

---

## React & JavaScript Frontend Patterns

### This Project's App.jsx Architecture

`App.jsx` is a **single 3,200-line closure** — one React function component with all state
at the top and all sub-components as inner functions. This is intentional and must be preserved.

**Critical rules:**
- **No hooks inside sub-functions.** `renderXxx`, `HomeScreen`, `RMSheet`, etc. are closures,
  not React components. Calling `useState`/`useEffect` inside them violates the Rules of Hooks
  and will cause a runtime error. All state MUST be declared at the top of `App`.
- **Do not extract to separate files** unless explicitly asked.
- **State declaration order matters** — React hooks must not be called conditionally or in loops.

```
Navigation state:
  tab      = 'home' | 'approve' | 'audit' | 'mtd' | 'statements'
  workflow = null | 'closure' | 'biz' | 'mandate' | 'wages' | 'dormancy' | 'idcheck' | 'mtd-submit'
  step     = 0-based integer within the active workflow
  viewMode = 'mobile' | 'desktop'
```

### JavaScript Foot-Guns

**Optional chaining on the left side of assignment is a SyntaxError:**
```js
// WRONG — crashes at parse time
element?.onclick = handler

// RIGHT — guard then assign
if (element) element.onclick = handler
// or
const el = document.getElementById('foo')
if (el) el.addEventListener('click', handler)
```

**`==` vs `===`:**
```js
0 == false   // true  — type coercion
0 === false  // false — strict, no coercion
null == undefined   // true
null === undefined  // false
// Rule: always use === unless you specifically need loose equality
```

**`const` does not make objects immutable:**
```js
const obj = { x: 1 }
obj.x = 2   // valid — const prevents rebinding, not mutation
obj = {}    // TypeError — rebinding is prevented
```

**Truthiness traps:**
```js
// All falsy: false, 0, '', null, undefined, NaN
// Trap: empty array [] and empty object {} are TRUTHY
if ([]) console.log('truthy')  // prints
// Use .length check: if (arr.length)
```

**Array methods that return new arrays (don't mutate):**
```js
const b = arr.map(x => x * 2)    // new array
const c = arr.filter(x => x > 0) // new array
arr.sort()   // MUTATES in place — clone first if needed: [...arr].sort()
arr.splice() // MUTATES in place
```

### React Patterns

**Controlled inputs** — always use `value` + `onChange` together:
```jsx
<input value={name} onChange={e => setName(e.target.value)} />
// NOT: defaultValue (that's uncontrolled — React loses track of it)
```

**Key prop** — required on list items, must be stable and unique:
```jsx
items.map(item => <div key={item.id}>{item.name}</div>)
// NOT key={index} — causes bugs when list reorders
```

**useEffect dependency array:**
```jsx
useEffect(() => { /* runs once on mount */ }, [])
useEffect(() => { /* runs when dep changes */ }, [dep])
useEffect(() => { /* runs every render — usually a mistake */ })
```

**Stale closure trap** — functions inside useEffect capture the value at creation time:
```jsx
// WRONG: count never updates inside the interval
useEffect(() => {
    const id = setInterval(() => console.log(count), 1000)
    return () => clearInterval(id)
}, [])  // count not in deps

// RIGHT
}, [count])  // re-register when count changes
```

### Tailwind Conventions (this project)

- Brand red: `text-red-700` / `bg-red-700` maps to `#c8102e`
- Background: `bg-[#faf6ef]` (warm off-white — use the hex, no Tailwind equivalent)
- Monetary amounts: add `num-tab` CSS class for tabular figures alignment
- Custom animations (`anim-fade`, `anim-slide`, `shimmer`, `stagger-1` through `stagger-7`)
  are defined in the `css` template literal inside App.jsx — don't add them to Tailwind config

### JavaScript Design Patterns (Osmani)

Design patterns are reusable solutions to commonly occurring problems. Three categories:

- **Creational** — how objects are created (Constructor, Factory, Prototype, Singleton)
- **Structural** — how objects are composed (Facade, Decorator, Flyweight, Mixin)
- **Behavioural** — how objects communicate (Observer, Mediator, Command)

**Module Pattern** — encapsulates private state using closure; only the returned object is public:
```js
const counter = (() => {
    let count = 0                        // private
    return {
        increment: () => ++count,
        reset: () => { count = 0 },
        getCount: () => count,
    }
})()
counter.increment()
counter.getCount()   // 1
// count is inaccessible outside the IIFE
```

**Revealing Module** — define all functions privately, return only references. Cleaner than Module
because the public interface is declared in one place:
```js
const myModule = (() => {
    let name = 'default'
    const setName = n => { name = n }
    const getName = () => name
    return { setName, getName }    // reveal only what is public
})()
```

**Observer Pattern** — publish/subscribe without tight coupling. Subject maintains a list of
observers and notifies them on state change. Used heavily in React event systems and Redux:
```js
class EventEmitter {
    constructor() { this.events = {} }
    on(event, fn) {
        (this.events[event] ??= []).push(fn)
    }
    emit(event, data) {
        (this.events[event] || []).forEach(fn => fn(data))
    }
    off(event, fn) {
        this.events[event] = (this.events[event] || []).filter(f => f !== fn)
    }
}
```

**Factory Pattern** — create objects without specifying exact class. Useful when the type is
determined at runtime:
```js
function createAnimal(type) {
    if (type === 'dog') return { speak: () => 'Woof' }
    if (type === 'cat') return { speak: () => 'Meow' }
    throw new Error(`Unknown type: ${type}`)
}
```

**Facade Pattern** — simplified interface over a complex subsystem. Good for abstracting fetch/API:
```js
const API = {
    async get(path) {
        const res = await fetch(`/api${path}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
    }
}
// Callers use API.get('/items') — don't know about headers or error handling
```

**Singleton Pattern** — ensure only one instance exists. In JS, a module-level `const` is already
a singleton (module cache means it's only evaluated once):
```js
// db.js — the export IS the singleton
const db = new Database(config)
export default db    // same instance imported everywhere
```

**Decorator Pattern** — wrap a function/object to add behaviour without changing the original:
```js
function readonly(target, key, descriptor) {
    descriptor.writable = false
    return descriptor
}
// Or in plain JS:
function withLogging(fn) {
    return (...args) => {
        console.log(`Calling with`, args)
        return fn(...args)
    }
}
```

**ES Modules vs older formats:**

| Format | Syntax | Loads |
|--------|--------|-------|
| ES Modules (ESM) | `import` / `export` | Static, tree-shakeable — use this |
| CommonJS (CJS) | `require()` / `module.exports` | Dynamic — Node.js default, avoid in browser |
| AMD | `define([], fn)` | Async loader — legacy, don't use |

**Anti-patterns to avoid:**

- Polluting the global namespace (`window.myVar = ...`)
- Passing strings to `setTimeout`/`setInterval` (triggers `eval`)
- Modifying `Object.prototype` (breaks all `for...in` loops)
- Deeply nested callbacks ("callback hell") — use Promises / async-await

---

## Pydantic v2 Patterns

### v1 vs v2 — Breaking Changes

| v1 (old — DO NOT USE) | v2 (current) |
|----------------------|--------------|
| `@validator('field')` | `@field_validator('field')` |
| `@root_validator` | `@model_validator(mode='before'/'after')` |
| `class Config: orm_mode = True` | `model_config = ConfigDict(from_attributes=True)` |
| `schema_extra` in Config | `json_schema_extra` in ConfigDict |
| `.dict()` | `.model_dump()` |
| `.json()` | `.model_dump_json()` |
| `.parse_obj(data)` | `Model.model_validate(data)` |

### Field Validators

```python
from pydantic import BaseModel, field_validator

class IssueRequest(BaseModel):
    cadet_id: int
    quantity: int
    notes: Optional[str] = None

    @field_validator('quantity')
    @classmethod
    def quantity_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError('must be at least 1')
        return v

    @field_validator('notes')
    @classmethod
    def notes_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v
```

### Optional Fields

```python
from typing import Optional

# Optional[str] means str | None — field is not required AND can be None
notes: Optional[str] = None   # correct — has a default
notes: Optional[str]          # no default — field IS required but can be None (unusual)

# Pydantic v2 also accepts the union syntax:
notes: str | None = None
```

### Model Config for ORM

```python
from pydantic import BaseModel, ConfigDict

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # replaces orm_mode = True

    id: int
    forename: str
    surname: str
```

### Response Models and Exclusion

```python
# Exclude fields from response without removing from model
class UserOut(BaseModel):
    id: int
    forename: str
    surname: str
    # password_hash: str — just don't include it in the Out schema

# FastAPI uses response_model to filter output
@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user  # SQLAlchemy model — from_attributes=True handles conversion
```

---

## JWT & Authentication Flows

### JWT Structure

A JWT is three base64url-encoded parts separated by dots:
```
header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.SflKxw...
```

- **Header:** algorithm (`alg: HS256`) and type (`typ: JWT`)
- **Payload (claims):** `sub` (subject/user ID), `exp` (expiry Unix timestamp), `iat` (issued at), custom claims
- **Signature:** HMAC-SHA256 of header+payload using the secret key — proves authenticity

**The signature prevents tampering but the payload is NOT encrypted — never put passwords or PII in JWT claims.**

### FastAPI JWT Pattern

```python
import jwt  # pip install PyJWT
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.getenv("SECRET_KEY")   # must be long, random, from env — never hardcoded
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(user_id: int, is_admin: bool) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "is_admin": is_admin, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Dependency Chain (this project)

```python
# utils/auth_dependencies.py pattern:

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    user = db.query(User).filter(User.id == int(payload["sub"]), User.active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user

def get_audit_user_id(
    current_user: User = Depends(get_current_user),
    x_staff_id: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> int:
    # Admins can act-as another user by passing X-Staff-Id header
    if x_staff_id and current_user.is_admin:
        staff = db.query(User).filter(User.id == int(x_staff_id), User.active == True).first()
        if staff:
            return staff.id
    return current_user.id
```

### Security Rules

- Store JWT in `httpOnly` cookie (not `localStorage`) — prevents XSS theft
- Always validate `exp` claim — PyJWT does this automatically with `jwt.decode()`
- Use a minimum 256-bit (32-byte) secret key: `secrets.token_hex(32)`
- Rotate secret key = invalidates all existing tokens (no blocklist needed for short-lived tokens)
- For token revocation before expiry: maintain a Redis blocklist of invalidated JTIs (`jti` claim)
- Never return `401 Unauthorized` and `403 Forbidden` interchangeably:
  - `401` = not authenticated (no token / bad token)
  - `403` = authenticated but not authorised (wrong role/ownership)

---

## REST API Conventions

### HTTP Status Codes

| Code | Meaning | When to use |
|------|---------|-------------|
| `200 OK` | Success | GET, PATCH, DELETE that returns body |
| `201 Created` | Resource created | POST that creates a record |
| `204 No Content` | Success, no body | DELETE with no response body |
| `400 Bad Request` | Client sent invalid data | Business logic validation failures |
| `401 Unauthorized` | Not authenticated | Missing/invalid/expired token |
| `403 Forbidden` | Not authorised | Valid token but wrong role/ownership |
| `404 Not Found` | Resource doesn't exist | Query returned nothing |
| `409 Conflict` | State conflict | Duplicate unique key, already returned item |
| `422 Unprocessable Entity` | Schema validation failed | FastAPI uses this automatically for Pydantic errors |
| `500 Internal Server Error` | Unhandled exception | Never return intentionally — fix the bug |

**Rule:** `400` is for business logic rejections you handle explicitly. `422` is for malformed
request bodies that Pydantic rejects automatically — don't catch Pydantic errors and re-raise
as `400` unless you're simplifying the error message for the client.

### Error Response Shape

FastAPI's default `HTTPException` format:
```json
{"detail": "Item not found"}
```

For field validation errors (422), FastAPI returns:
```json
{
  "detail": [
    {"loc": ["body", "quantity"], "msg": "must be at least 1", "type": "value_error"}
  ]
}
```

Stick to this default — don't invent a custom error envelope unless the frontend specifically needs it.

### Idempotency

| Method | Idempotent | Safe (no side effects) |
|--------|-----------|----------------------|
| GET | Yes | Yes |
| PUT | Yes | No |
| DELETE | Yes | No |
| POST | No | No |
| PATCH | No (usually) | No |

**Idempotent** = calling it multiple times has the same effect as calling it once.
Design endpoints to respect this: DELETE on an already-deleted record should return `404`,
not `500`.

### URL Naming Conventions

```
GET    /items              → list all items
GET    /items/{id}         → get one item
POST   /items              → create item
PATCH  /items/{id}         → partial update
PUT    /items/{id}         → full replace
DELETE /items/{id}         → delete

# Sub-resources:
GET    /cadets/{id}/items  → items belonging to a cadet

# Actions (when CRUD doesn't fit):
POST   /transactions/issue    → issue an item (verb is fine for actions)
POST   /transactions/return   → return an item
PATCH  /badges/return/{id}    → mark badge returned
```

Use plural nouns for collections (`/items`, not `/item`). Use kebab-case for multi-word
paths (`/issued-summary`, not `/issuedSummary`).

### Django REST Framework — Key Concepts (translates to FastAPI)

Django REST Framework (DRF) is the canonical Python REST framework alongside FastAPI. Its
patterns are widely documented and translate directly to FastAPI concepts:

| DRF | FastAPI equivalent |
|-----|--------------------|
| `Serializer` | Pydantic `BaseModel` (request/response schema) |
| `ModelViewSet` | Router with CRUD endpoints |
| `APIView` | Individual `@router.get/post/patch/delete` functions |
| `Permission class` | `Depends(get_current_user)` / `Depends(get_current_admin)` |
| `Throttle class` | `fastapi-limiter` rate limiting dependency |
| `Pagination class` | Manual `limit`/`offset` query params + total count |
| `Router.register()` | `app.include_router()` |

**ModelViewSet provides these actions automatically:**

| Action | HTTP | URL |
|--------|------|-----|
| `list` | GET | `/items/` |
| `create` | POST | `/items/` |
| `retrieve` | GET | `/items/{id}/` |
| `update` | PUT | `/items/{id}/` |
| `partial_update` | PATCH | `/items/{id}/` |
| `destroy` | DELETE | `/items/{id}/` |

**APIView method dispatch** — in FastAPI this is per-decorator, but the logic is the same:
```python
# DRF style (illustrative — don't use DRF in this project):
class BookView(APIView):
    def get(self, request):   ...   # handles GET
    def post(self, request):  ...   # handles POST

# FastAPI equivalent:
@router.get("/books")
def list_books(...): ...
@router.post("/books", status_code=201)
def create_book(...): ...
```

**Token auth header** (used for testing APIs):
```
Authorization: Token <token_value>   # DRF token auth
Authorization: Bearer <jwt_value>    # JWT (this project)
```

---

## Alembic & Schema Migrations

### SQLite ALTER TABLE Limitations

SQLite supports only a tiny subset of `ALTER TABLE`:
```sql
ALTER TABLE t RENAME TO new_name;   -- supported
ALTER TABLE t ADD COLUMN col TEXT;  -- supported (with restrictions)
ALTER TABLE t DROP COLUMN col;      -- supported only in SQLite 3.35+ (2021)
ALTER TABLE t RENAME COLUMN old TO new;  -- supported only in SQLite 3.25+ (2018)

-- NOT supported in any SQLite version:
ALTER TABLE t ALTER COLUMN col TYPE INT;
ALTER TABLE t ADD CONSTRAINT ...;
```

**Safe migration pattern for complex changes (rename, change type, add constraint):**
```sql
-- 1. Create new table with correct schema
CREATE TABLE items_new (...);
-- 2. Copy data
INSERT INTO items_new SELECT ... FROM items;
-- 3. Drop old table
DROP TABLE items;
-- 4. Rename new table
ALTER TABLE items_new RENAME TO items;
```

### Alembic Setup

```bash
pip install alembic
alembic init alembic          # creates alembic/ dir and alembic.ini
```

In `alembic/env.py`:
```python
from database import Base, DATABASE_URL
config.set_main_option("sqlalchemy.url", DATABASE_URL)
target_metadata = Base.metadata
```

In `alembic.ini`:
```ini
sqlalchemy.url = %(DATABASE_URL)s  # override with env var
```

### SQLite + Alembic: batch mode

Alembic's `batch_alter_table` works around SQLite's limitations by doing the
create-copy-drop-rename dance automatically:

```python
# In migration file (alembic/versions/xxxx_add_column.py):

def upgrade():
    with op.batch_alter_table('items') as batch_op:
        batch_op.add_column(sa.Column('short_name', sa.String(50), nullable=True))
        batch_op.alter_column('name', new_column_name='full_name')

def downgrade():
    with op.batch_alter_table('items') as batch_op:
        batch_op.drop_column('short_name')
        batch_op.alter_column('full_name', new_column_name='name')
```

Enable batch mode by default in `env.py`:
```python
context.configure(..., render_as_batch=True)  # safe for both SQLite and MySQL
```

### Common Alembic Commands

```bash
alembic revision --autogenerate -m "add short_name to items"  # generate migration
alembic upgrade head       # apply all pending migrations
alembic downgrade -1       # roll back one migration
alembic current            # show current revision
alembic history            # list all revisions
alembic check              # check if models match DB (no migration needed?)
```

**Never edit a migration that has already been applied to production.** Create a new one.

---

## Python Async in FastAPI

### sync def vs async def — The Rule

| Route type | DB/IO pattern | Use |
|------------|--------------|-----|
| SQLAlchemy (sync) | Blocking DB calls | `def` (not async) |
| httpx / aiohttp / asyncpg | Async IO | `async def` |
| CPU-bound work | No IO | `def` (FastAPI runs it in a thread pool) |

**FastAPI runs `def` routes in a thread pool automatically — they don't block the event loop.**
**`async def` routes run on the event loop — blocking calls inside them WILL freeze the server.**

```python
# CORRECT — SQLAlchemy is sync; use plain def
@router.get("/items")
def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

# WRONG — SQLAlchemy blocks the event loop inside async def
@router.get("/items")
async def list_items(db: Session = Depends(get_db)):
    return db.query(Item).all()  # blocks event loop during query

# CORRECT — truly async operation
@router.get("/external")
async def fetch_external():
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://api.example.com/data")
    return resp.json()
```

### await Rules

- `await` can only appear inside `async def` functions
- You cannot `await` a non-coroutine — it will raise `TypeError`
- `async for` and `async with` require an async iterator/context manager

### Background Tasks

FastAPI has a built-in `BackgroundTasks` for fire-and-forget work (e.g. sending email
after a response is returned):

```python
from fastapi import BackgroundTasks

def send_notification(email: str, message: str):
    # runs after response is sent — can be sync or async
    ...

@router.post("/issue", status_code=201)
def issue(
    request: IssueRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    result = issue_item(db, ...)
    background_tasks.add_task(send_notification, email="...", message="Item issued")
    return result
```

### Startup / Shutdown Events

```python
# Modern FastAPI uses lifespan context manager (not deprecated @app.on_event)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    print("Starting up")
    yield
    # shutdown
    print("Shutting down")

app = FastAPI(lifespan=lifespan)
```

### asyncio Patterns (Mastering Async Network Programming — Jones)

**Run a coroutine** — entry point for all asyncio programs:
```python
import asyncio

async def main():
    await asyncio.sleep(1)
    print("done")

asyncio.run(main())   # creates event loop, runs coroutine, closes loop
```

**Concurrent tasks with `gather`** — run multiple coroutines at the same time:
```python
async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.text()

async def main():
    urls = ["https://api.example.com/a", "https://api.example.com/b"]
    results = await asyncio.gather(*[fetch(u) for u in urls])
    # All fetches run concurrently; gather returns list of results in order
```

**`create_task` vs `gather`** — prefer `gather` for a known set; `create_task` for fire-and-forget:
```python
task = asyncio.create_task(some_coroutine())   # starts immediately, runs in background
# ... do other work ...
result = await task   # await it later when you need the result
```

**Timeout:**
```python
try:
    result = await asyncio.wait_for(fetch(url), timeout=5.0)
except asyncio.TimeoutError:
    print("Request timed out")
```

**Semaphore — limit concurrency** (prevent hammering an API):
```python
sem = asyncio.Semaphore(10)   # max 10 concurrent

async def fetch_limited(url):
    async with sem:
        return await fetch(url)

await asyncio.gather(*[fetch_limited(u) for u in many_urls])
```

**asyncio.Queue — producer/consumer pattern:**
```python
queue = asyncio.Queue()

async def producer():
    for item in items:
        await queue.put(item)

async def consumer():
    while True:
        item = await queue.get()
        await process(item)
        queue.task_done()

await asyncio.gather(producer(), consumer())
```

**StreamReader/StreamWriter — raw async TCP:**
```python
reader, writer = await asyncio.open_connection("host", 8080)
writer.write(b"GET / HTTP/1.0\r\n\r\n")
await writer.drain()
data = await reader.read(1024)
writer.close()
await writer.wait_closed()
```

**aiohttp client — the async alternative to `requests`:**
```python
import aiohttp

async def get_json(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            resp.raise_for_status()   # raises ClientResponseError on 4xx/5xx
            return await resp.json()
```

**Common pitfalls:**
- Forgetting `await` — returns a coroutine object, not the result (no error raised)
- Using `requests` inside `async def` — blocks the event loop; use `aiohttp` instead
- Sharing a `ClientSession` across requests is efficient; creating one per call is wasteful but works
- `asyncio.run()` cannot be called inside an already-running event loop (e.g. Jupyter) — use `await` directly

---

## Claude AI Prompting Patterns

### Why XML Structure Works

Claude's parser processes XML tags as semantic boundaries, allowing it to
distinguish instructions from data from context. Unstructured prompts under high
token load cause constraint drift — later instructions override earlier ones. XML
prevents this by making hierarchy explicit.

```xml
<system_instructions>
  Act as a senior Python engineer. Prefer explicit error handling over
  bare exceptions. Always include type hints.
</system_instructions>
<context>
  <codebase>FastAPI + SQLAlchemy + SQLite/MySQL dual-dialect</codebase>
  <constraint>No bcrypt/passlib — use stdlib pbkdf2_hmac</constraint>
</context>
<task>
  Refactor the password hashing in utils/hashing.py
</task>
<output_format>
  Single Python file, no markdown fences, no explanatory comments.
</output_format>
```

### The Systemic Anchor

For long sessions, wrap the system context in a persistent variable block so Claude
can re-reference it throughout the conversation rather than re-reading the full history:

```xml
<persistent_context id="project_rules">
  - SQLite + MySQL: never use CONCAT() or NOW() — use Python f-strings and datetime
  - No bcrypt/passlib — pbkdf2_hmac only
  - Single-file App.jsx — no hooks inside closures
  - Branch: claude/add-claude-documentation-eaPc5
</persistent_context>
```

Start subsequent messages with: `Referencing <persistent_context id="project_rules">...`

### Structural Prompt Elements

| Tag | Purpose |
|-----|---------|
| `<system_instructions>` | Role and high-level behaviour |
| `<context>` | Background facts the model needs |
| `<task>` | The specific thing to do |
| `<constraints>` | Hard limits (don't do X) |
| `<examples>` | Few-shot demonstrations |
| `<output_format>` | How to structure the response |
| `<reasoning_loop>` | Step-by-step thinking instructions |

### Prompting Principles

- **Specificity beats length** — "Return only the modified function, no prose" is better
  than a paragraph asking for conciseness
- **Role anchoring** — "Act as a senior security engineer reviewing for OWASP Top 10"
  produces more targeted output than no role
- **Explicit output format** — if you want JSON, say `output valid JSON only, no markdown`
- **Constraint positioning** — put hard constraints (things to avoid) near the top, not
  buried at the end — constraint drift means late constraints get lower weight
- **Few-shot examples** — for format-sensitive tasks, show one input/output pair rather than
  describing the format in prose
- **Chain of thought** — for complex reasoning, add `<reasoning_loop>Think step by step
  before answering</reasoning_loop>` — improves accuracy on multi-step problems
- **Temperature** — lower temperature (more deterministic) for code generation; higher for
  creative writing. Claude Code uses deterministic settings by default.

### Constitutional Alignment

Claude is trained with Constitutional AI — it prioritises:
1. Helpful (complete the task)
2. Harmless (don't cause harm)
3. Honest (don't fabricate)

When a prompt conflicts with these, Claude will refuse or hedge. To avoid false refusals
on legitimate security/technical work: provide context (`"for a CTF challenge"`,
`"defensive audit of our own system"`, `"authorized penetration test"`). This is not
a bypass — it is the intended usage pattern.

---

*Generated from 23 books: Python Crash Course (James Deep), Python Made Simple (James Young),
Hacking with Kali Linux (Darwin Growth), Learning Kali Linux (Ric Messier),
Fundamentals/Malware Analysis/Advanced Functions/Ethical Hacking of KALI LINUX 2024 (Diego Rodrigues),
Configuring IPCop Firewalls (Barrie Dempster), Linux Firewalls (Michael Rash),
The Book of PF (Peter Hansteen), Fire Brigades to Firewalls (John Kuforiji),
Windows System Protection (Rozale Jax), Computer Programming (Coding Hood),
Advanced Lambda Practices in Java (NOB TREX), Advances in Intelligent Computing (Mandal et al.),
Advances in Cloud Computing (Ranjan et al.),
Learning JavaScript Design Patterns 2nd Ed (Addy Osmani),
Build a Backend REST API with Python & Django (Asadullah Alam),
Mastering PowerShell and XML (Laszlo Bocso),
Mastering Async Network Programming with Python (Andrew M. Jones),
99 Claude Secret Commands (Abdelbasset Daly).*
