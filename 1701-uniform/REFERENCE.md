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

*Generated from 17 books: Python Crash Course (James Deep), Python Made Simple (James Young),
Hacking with Kali Linux (Darwin Growth), Learning Kali Linux (Ric Messier),
Fundamentals/Malware Analysis/Advanced Functions/Ethical Hacking of KALI LINUX 2024 (Diego Rodrigues),
Configuring IPCop Firewalls (Barrie Dempster), Linux Firewalls (Michael Rash),
The Book of PF (Peter Hansteen), Fire Brigades to Firewalls (John Kuforiji),
Windows System Protection (Rozale Jax), Computer Programming (Coding Hood),
Advanced Lambda Practices in Java (NOB TREX), Advances in Intelligent Computing (Mandal et al.),
Advances in Cloud Computing (Ranjan et al.).* Python Crash Course (James Deep), Python Made Simple (James Young),
Hacking with Kali Linux (Darwin Growth), Learning Kali Linux (Ric Messier),
Fundamentals/Malware Analysis/Advanced Functions/Ethical Hacking of KALI LINUX 2024 (Diego Rodrigues),
Configuring IPCop Firewalls (Barrie Dempster), Linux Firewalls (Michael Rash),
The Book of PF (Peter Hansteen), Fire Brigades to Firewalls (John Kuforiji),
Windows System Protection (Rozale Jax), Computer Programming (Coding Hood),
Advanced Lambda Practices in Java (NOB TREX), Advances in Intelligent Computing (Mandal et al.),
Advances in Cloud Computing (Ranjan et al.).*
