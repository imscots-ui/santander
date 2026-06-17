# Technical Reference — 1701 Uniform Inventory

Synthesised from 33 books across Python, JavaScript, SQL, HTTP, security, Docker,
Git, authentication, and AI prompting. Intended for AI coding agents to prevent
recurring mistakes and encode hard-won patterns.

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
17. [Python Testing with pytest](#python-testing-with-pytest)
18. [Docker & Containerisation](#docker--containerisation)
19. [Git — Version Control](#git--version-control)
20. [Claude AI Prompting Patterns](#claude-ai-prompting-patterns)
21. [HTTP Fundamentals](#http-fundamentals)
22. [SQL Performance & Indexing](#sql-performance--indexing)

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

### SQL Antipatterns (Karwin) — What Not To Do

**1. Jaywalking** — storing multiple values in one column as a comma-separated string:
```sql
-- WRONG: can't index, can't join, can't enforce FK
SELECT * FROM items WHERE tags LIKE '%uniform%';

-- RIGHT: intersection table
CREATE TABLE item_tags (item_id INT, tag_id INT, PRIMARY KEY (item_id, tag_id));
```

**2. Naive Trees** — adjacency list (parent_id column) breaks on deep queries:
```sql
-- WRONG: requires recursive CTE or app-side recursion for depth > 1
SELECT * FROM categories WHERE parent_id = 5;

-- RIGHT: closure table stores all ancestor/descendant pairs
CREATE TABLE category_paths (ancestor INT, descendant INT, depth INT);
-- Query all descendants: SELECT descendant FROM category_paths WHERE ancestor = 5
```

**3. Entity-Attribute-Value (EAV)** — generic attribute table avoids schema but breaks everything:
```sql
-- WRONG: can't type-check, can't index, can't enforce NOT NULL, nightmarish joins
CREATE TABLE attributes (entity_id INT, attr_name VARCHAR, attr_value VARCHAR);

-- RIGHT: model subtypes with their own tables or use JSONB (Postgres) / JSON (MySQL 5.7+)
```

**4. Polymorphic Associations** — one FK column that points to different tables based on a type column:
```sql
-- WRONG: can't enforce referential integrity
CREATE TABLE comments (id INT, entity_type VARCHAR, entity_id INT, body TEXT);
-- entity_type = 'issue' | 'cadet' | 'item' — no FK possible

-- RIGHT: explicit FK per parent type, or a shared parent supertype table
CREATE TABLE commentable (id INT PRIMARY KEY);  -- issues, cadets, items all get a row here
ALTER TABLE comments ADD FOREIGN KEY (entity_id) REFERENCES commentable(id);
```

**5. Multicolumn Attributes** — `tag1`, `tag2`, `tag3` columns instead of a dependent table:
```sql
-- WRONG: fixed limit, sparse, can't query easily
ALTER TABLE items ADD COLUMN tag1 VARCHAR, ADD COLUMN tag2 VARCHAR, ADD COLUMN tag3 VARCHAR;

-- RIGHT: dependent table (same fix as Jaywalking)
```

**6. SELECT \*** — implicit column list breaks when schema changes:
```sql
-- WRONG: fragile, fetches unnecessary data, breaks INSERT INTO ... SELECT
SELECT * FROM items;

-- RIGHT: always name columns explicitly
SELECT id, name, short_name, size_id, quantity FROM items;
```

**7. Poor Man's Search Engine** — LIKE with leading wildcard disables indexes:
```sql
-- WRONG: full table scan every time, slow on large tables
SELECT * FROM items WHERE name LIKE '%jacket%';

-- RIGHT options: full-text index (MySQL FULLTEXT / SQLite FTS5), or dedicated search (Elasticsearch)
-- MySQL: CREATE FULLTEXT INDEX idx_name ON items(name); MATCH(name) AGAINST('jacket')
-- SQLite FTS5: CREATE VIRTUAL TABLE items_fts USING fts5(name, content='items');
```

**8. Index Shotgun** — either no indexes or indexes on every column:
- Use the MENTOR guide: **M**easure first (EXPLAIN / EXPLAIN ANALYZE), **E**xplain the query
  plan, **N**ominate candidate columns (WHERE, JOIN, ORDER BY), **T**est with realistic data,
  **O**ptimize and repeat, **R**ebuild/reorganise periodically
- Index columns used in WHERE, JOIN ON, ORDER BY, GROUP BY
- Don't index columns with low cardinality (boolean, status with 3 values)
- Composite index column order matters: put the most selective column first

**9. Readable Passwords** — never store plaintext:
```sql
-- WRONG: storing plaintext or fast hashes (MD5, SHA1)
INSERT INTO users (password) VALUES ('mypassword');

-- RIGHT: slow hash in application layer (pbkdf2_hmac, bcrypt, argon2)
-- Store only the hash; never store the original
```

**10. NULL handling traps:**
```sql
-- NULL comparisons always return NULL (not TRUE/FALSE)
SELECT * FROM items WHERE notes = NULL;    -- WRONG: returns nothing
SELECT * FROM items WHERE notes IS NULL;   -- RIGHT

-- NULL in aggregates: COUNT(*) counts rows, COUNT(col) skips NULLs
SELECT COUNT(*) FROM items;          -- total rows
SELECT COUNT(notes) FROM items;      -- rows where notes IS NOT NULL

-- COALESCE returns first non-NULL value
SELECT COALESCE(notes, 'No notes') FROM items;
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

### OAuth 2.0 — Delegated Authorisation (Richer & Sanso)

OAuth 2.0 lets a user grant a third-party application limited access to their resources
**without sharing their password**. The user authorises the client; the client gets a token;
the token is used at the resource server.

**Four actors:**

| Actor | Role |
|-------|------|
| **Resource Owner** | The user who owns the data |
| **Client** | The application that wants access |
| **Authorization Server** | Issues tokens after the user consents |
| **Resource Server** | Hosts the protected API; validates tokens |

**Two channels:**
- **Back channel** — direct HTTPS between client and authorization server (no browser). Secure.
- **Front channel** — via browser redirects. Tokens/codes pass through the URL. Less secure.

---

#### Grant Type 1: Authorization Code (Web Apps — use this)

The only grant type that should be used for web apps and most scenarios.
Code travels via browser redirect; token exchange happens back-channel.

```
1. Client → Browser → Authorization Server:
   GET /authorize?response_type=code
                  &client_id=my-app
                  &redirect_uri=https://app.example.com/callback
                  &scope=read:items
                  &state=RANDOM_STRING     ← CSRF protection

2. User logs in and consents at Authorization Server

3. Authorization Server → Browser → Client:
   GET https://app.example.com/callback?code=AUTH_CODE&state=RANDOM_STRING

4. Client verifies state matches, then back-channel:
   POST /token
   Authorization: Basic base64(client_id:client_secret)
   grant_type=authorization_code
   &code=AUTH_CODE
   &redirect_uri=https://app.example.com/callback

5. Authorization Server returns:
   { "access_token": "...", "token_type": "Bearer",
     "expires_in": 3600, "refresh_token": "..." }
```

**The `state` parameter is mandatory** — verify it matches on callback or reject the request.
Without it, an attacker can CSRF the authorization flow and bind their code to your session.

---

#### Grant Type 2: Authorization Code + PKCE (Mobile/SPA — always use this)

PKCE (Proof Key for Code Exchange) protects public clients that cannot store a `client_secret`.
Required for mobile apps, single-page apps, and any client where the secret would be exposed.

```python
import hashlib, base64, os, re

# Step 1: Generate code_verifier (43-128 random chars)
code_verifier = base64.urlsafe_b64encode(os.urandom(32)).rstrip(b'=').decode()

# Step 2: Compute code_challenge = BASE64URL(SHA256(code_verifier))
digest = hashlib.sha256(code_verifier.encode()).digest()
code_challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()

# Step 3: Authorization request includes:
# &code_challenge=<code_challenge>
# &code_challenge_method=S256    ← always use S256, never plain

# Step 4: Token exchange includes:
# &code_verifier=<code_verifier>
# Authorization server re-derives the challenge and verifies it matches
# An attacker who intercepts the code cannot exchange it without the verifier
```

---

#### Grant Type 3: Client Credentials (Machine-to-Machine — no user involved)

Service-to-service calls where there is no human user. Client authenticates with its own
credentials and gets a token scoped to its own permissions.

```
POST /token
Authorization: Basic base64(client_id:client_secret)
grant_type=client_credentials
&scope=internal:read

Response: { "access_token": "...", "expires_in": 3600 }
# No refresh_token — just re-request when expired
```

---

#### Grant Type 4: Resource Owner Password Credentials (Legacy — avoid)

Client collects username + password directly and exchanges them for a token.
**Defeats the purpose of OAuth** — the client sees the password. Only acceptable when
the client is owned by the same organisation as the authorization server (first-party app).
Deprecated in OAuth 2.1.

---

#### Refresh Tokens

```
POST /token
Authorization: Basic base64(client_id:client_secret)
grant_type=refresh_token
&refresh_token=<refresh_token>

Response: new access_token (and often a new refresh_token — rotate on use)
```

- Access tokens: short-lived (15 min – 1 hr). Sent on every API call.
- Refresh tokens: long-lived. Stored securely. Used only to get new access tokens.
- **Rotate refresh tokens** on every use — if a stolen refresh token is used, the
  legitimate client's next use will fail, alerting to the compromise.

---

#### OpenID Connect (OIDC) — Authentication on Top of OAuth 2

OAuth 2.0 is **authorisation** (what can the client do?).
OIDC adds **authentication** (who is the user?).

```
GET /authorize?response_type=code
              &scope=openid profile email   ← 'openid' scope triggers OIDC
              &nonce=RANDOM_STRING          ← replay attack prevention

Token endpoint response adds:
{
  "access_token": "...",
  "id_token": "eyJhbG..."    ← JWT containing user identity claims
}
```

**ID token claims:**

| Claim | Meaning |
|-------|---------|
| `sub` | Subject — unique user identifier (stable, use this as your user ID) |
| `iss` | Issuer — URL of the authorization server |
| `aud` | Audience — must equal your `client_id` |
| `exp` | Expiry — Unix timestamp; reject if in the past |
| `iat` | Issued at — Unix timestamp |
| `nonce` | Must match what you sent; prevents replay attacks |
| `email` | User's email (if requested) |
| `name` | User's full name (if requested) |

**UserInfo endpoint** — fetch additional user claims with the access token:
```
GET /userinfo
Authorization: Bearer <access_token>

Response: { "sub": "12345", "email": "user@example.com", "name": "James Kirk" }
```

**OIDC Discovery** — authorization servers publish their configuration at:
`https://auth.example.com/.well-known/openid-configuration`
This returns all endpoint URLs, supported scopes, and the JWKS URI for token validation.

---

#### JWT Signing: HS256 vs RS256

| | HS256 (symmetric) | RS256 (asymmetric) |
|-|-------------------|--------------------|
| Algorithm | HMAC-SHA256 | RSA-SHA256 |
| Key | Single shared secret | Private key signs, public key verifies |
| Who can verify | Only parties with the secret | Anyone with the public key (published at JWKS URI) |
| Use when | Auth server and resource server are the same service | Microservices, third-party APIs |
| Risk | Secret compromise → forge any token | Private key compromise only |

**Validating a JWT (resource server must do all of these):**
1. Decode and verify signature (using secret/public key)
2. Check `exp` — reject if expired
3. Check `iss` — must match your known issuer
4. Check `aud` — must include your client_id / service identifier
5. Check `nonce` (OIDC) — must match what was sent

---

#### Token Security Rules

**Storage:**
- **Web apps** — `httpOnly` cookie (inaccessible to JavaScript → XSS-safe)
- **Never** `localStorage` or `sessionStorage` — XSS attack reads it trivially
- **Mobile** — platform secure storage (iOS Keychain, Android Keystore)
- **Backend/CLI** — environment variable or secrets manager; never hardcode

**Transmission:**
- Always HTTPS — tokens in transit must be TLS-protected
- Bearer token in `Authorization` header: `Authorization: Bearer <token>`
- Never in URL query parameters — logged in server logs, referrer headers, browser history

**Common vulnerabilities (Richer & Sanso, chapters 7-9):**

| Attack | Defence |
|--------|---------|
| CSRF on authorization flow | `state` parameter — verify on callback |
| Authorization code interception | PKCE |
| Redirect URI hijacking | Exact-match URI validation — no open redirectors |
| Token theft via XSS | `httpOnly` cookie, strict CSP |
| Token replay | Short expiry + token introspection to check revocation |
| Client impersonation | `client_secret` or PKCE; don't accept `client_id` alone |
| Open redirector | Never redirect to arbitrary URLs after login |

---

#### Token Introspection and Revocation

**Introspection** — resource server asks authorization server if a token is still valid:
```
POST /introspect
Authorization: Basic base64(resource_server_id:resource_server_secret)
token=<access_token>

Response: { "active": true, "scope": "read:items", "sub": "12345", "exp": 1735000000 }
# active: false if expired, revoked, or unknown
```

**Revocation** — client tells authorization server to invalidate a token:
```
POST /revoke
Authorization: Basic base64(client_id:client_secret)
token=<refresh_token>
# Use on logout — revoke the refresh token to prevent further access token issuance
```

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

## Python Testing with pytest

### Test Discovery Rules

pytest finds tests automatically — no registration needed:
- Files matching `test_*.py` or `*_test.py`
- Functions named `test_*` inside those files
- Classes named `Test*` (no `__init__`) with methods named `test_*`

```bash
pytest                        # run all tests in current directory tree
pytest tests/test_items.py    # run one file
pytest tests/test_items.py::test_issue   # run one function
pytest -v                     # verbose: show each test name
pytest -x                     # stop on first failure
pytest -k "issue or return"   # run tests whose name matches expression
pytest --tb=short             # shorter tracebacks (default is long)
```

### Basic Test Structure

```python
# test_items.py
def test_issue_decrements_stock():
    # Arrange
    initial_qty = 10
    # Act
    result = deduct_stock(initial_qty, qty=1)
    # Assert
    assert result == 9

def test_issue_raises_on_insufficient_stock():
    with pytest.raises(ValueError, match="Insufficient stock"):
        deduct_stock(current_qty=0, qty=1)
```

**assert** — use plain assert; pytest rewrites it to show meaningful diffs on failure:
```python
assert result == expected          # equality
assert item in collection          # membership
assert response.status_code == 201 # any expression
assert "error" not in response.json()
```

### Fixtures

Fixtures replace setup/teardown. They are injected by name into test functions:

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base

@pytest.fixture()
def db_session():
    """Fresh in-memory SQLite DB per test."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session          # test runs here
    session.close()        # teardown after yield
    Base.metadata.drop_all(engine)

def test_create_cadet(db_session):
    cadet = Cadet(forename="James", surname="Kirk")
    db_session.add(cadet)
    db_session.commit()
    assert db_session.query(Cadet).count() == 1
```

**Fixture scope** — controls how often the fixture is created:

| Scope | Created once per... |
|-------|-------------------|
| `function` (default) | each test function |
| `class` | each test class |
| `module` | each test file |
| `session` | entire test run |

```python
@pytest.fixture(scope="module")
def shared_db():
    # expensive setup runs once per file
    ...
```

**conftest.py** — fixtures defined here are available to all tests in the same directory and below without importing:
```
tests/
├── conftest.py       ← fixtures here are shared automatically
├── test_items.py
└── test_cadets.py
```

**autouse** — runs a fixture for every test without explicit request:
```python
@pytest.fixture(autouse=True)
def reset_db(db_session):
    yield
    db_session.rollback()   # auto-cleanup after every test
```

### Built-in Fixtures

```python
def test_writes_file(tmp_path):
    # tmp_path is a pathlib.Path to a unique temp dir per test
    f = tmp_path / "output.txt"
    f.write_text("hello")
    assert f.read_text() == "hello"

def test_prints(capsys):
    print("hello")
    captured = capsys.readouterr()
    assert captured.out == "hello\n"

def test_env_var(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    # monkeypatch.setattr(module, "function_name", mock_fn)
    # monkeypatch.delenv("SECRET_KEY", raising=False)
```

### Parametrize — One Test, Many Inputs

```python
@pytest.mark.parametrize("qty, expected", [
    (1, 9),
    (5, 5),
    (10, 0),
])
def test_deduct_stock(qty, expected):
    assert deduct_stock(initial_qty=10, qty=qty) == expected
# Generates 3 separate test cases shown individually in output
```

### Markers

```python
@pytest.mark.skip(reason="not implemented yet")
def test_future_feature(): ...

@pytest.mark.skipif(sys.platform == "win32", reason="Linux only")
def test_linux_path(): ...

@pytest.mark.xfail(reason="known bug #123")
def test_known_failure(): ...   # counted as xfail, not failure
```

### FastAPI TestClient

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_list_items_requires_auth():
    response = client.get("/items")
    assert response.status_code == 401

def test_issue_item(db_session, auth_headers):
    response = client.post(
        "/transactions/issue",
        json={"cadet_id": 1, "item_id": 1, "size_id": 1, "quantity": 1},
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["quantity"] == 1
```

Override a dependency for testing (e.g. use test DB instead of real DB):
```python
from database import get_db

def override_get_db():
    yield test_session   # inject test DB session

app.dependency_overrides[get_db] = override_get_db
```

### Coverage

```bash
pip install pytest-cov

pytest --cov=backend --cov-report=term-missing   # show uncovered lines
pytest --cov=backend --cov-report=html            # open htmlcov/index.html
```

Add to `pyproject.toml` or `pytest.ini` to always run coverage:
```toml
[tool.pytest.ini_options]
addopts = "--cov=backend --cov-report=term-missing"
```

### Configuration (pyproject.toml)

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]            # where to find tests
addopts = "-v --tb=short"       # default flags
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
]
```

---

## Docker & Containerisation

### Core Concepts

- **Image** — read-only template built from a Dockerfile. Stored in a registry.
- **Container** — running instance of an image. Ephemeral by default (data lost on stop).
- **Layer** — each Dockerfile instruction creates a cached layer. Unchanged layers are reused on rebuild.
- **Registry** — image store. Docker Hub is the default. Self-hosted: `registry:2`.

### Dockerfile Reference

```dockerfile
# Base image — always pin a specific version, never use :latest in production
FROM python:3.13-slim

# Build-time variable (not available at runtime unless also set with ENV)
ARG APP_VERSION=1.0.0

# Metadata
LABEL maintainer="ops@example.com" version=$APP_VERSION

# Runtime environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_HOME=/app

# Set working directory — creates it if it doesn't exist
WORKDIR $APP_HOME

# Copy dependency files first (layer cache: only reinstalls if these change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (after deps — cache-friendly)
COPY . .

# Run as non-root user (security best practice)
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Document which port the app listens on (informational — doesn't publish it)
EXPOSE 8000

# CMD = default command, overridable at runtime
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# ENTRYPOINT = fixed executable; CMD becomes its default arguments
# ENTRYPOINT ["uvicorn"]
# CMD ["main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Multi-Stage Builds — Keep Images Small

```dockerfile
# Stage 1: builder (has all build tools)
FROM python:3.13 AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# Stage 2: runtime (minimal image, only copies installed packages)
FROM python:3.13-slim
COPY --from=builder /install /usr/local
WORKDIR /app
COPY . .
USER nobody
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# Result: much smaller image — build tools not included
```

### .dockerignore

Always create `.dockerignore` alongside `Dockerfile` to exclude files from the build context:
```
.git
__pycache__
*.pyc
*.egg-info
.env
.venv
venv/
*.db           # don't copy demo.db into image
node_modules/
dist/
.pytest_cache/
htmlcov/
```

### Essential Commands

```bash
# Build
docker build -t myapp:1.0 .                  # build image, tag as myapp:1.0
docker build -t myapp:1.0 --no-cache .        # force rebuild all layers

# Run
docker run --rm myapp:1.0                     # run and delete container on exit
docker run -d -p 8000:8000 myapp:1.0          # detached, publish port
docker run -d -p 8000:8000 \
  -e DATABASE_URL=sqlite:///./data/demo.db \  # pass env vars
  -v $(pwd)/data:/app/data \                  # mount volume for persistence
  myapp:1.0

# Inspect
docker ps                                     # running containers
docker ps -a                                  # all containers including stopped
docker logs <container_id>                    # stdout/stderr
docker exec -it <container_id> /bin/sh        # shell into running container
docker inspect <container_id>                 # full metadata as JSON

# Images
docker images                                 # list local images
docker rmi myapp:1.0                          # remove image
docker pull python:3.13-slim                  # pull from registry
docker push myregistry.io/myapp:1.0           # push to registry

# Cleanup
docker system prune                           # remove stopped containers, unused images
docker volume prune                           # remove unused volumes
```

### Docker Compose — Multi-Container Apps

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./data/demo.db
      - SECRET_KEY=${SECRET_KEY}   # reads from .env file or shell env
    volumes:
      - db_data:/app/data
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: uniform_inventory
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  db_data:
  mysql_data:
```

```bash
docker compose up -d          # start all services in background
docker compose down           # stop and remove containers
docker compose down -v        # also remove volumes (destroys data)
docker compose logs -f api    # follow logs for one service
docker compose exec api /bin/sh  # shell into running service
docker compose build          # rebuild images
```

### Volumes — Persisting Data

Containers are ephemeral — everything written inside is lost when the container stops.
Use volumes for any data that must survive restarts:

```bash
# Named volume (managed by Docker — survives container deletion)
docker run -v db_data:/app/data myapp:1.0

# Bind mount (maps a host directory — useful for development)
docker run -v $(pwd)/data:/app/data myapp:1.0

# Read-only bind mount (prevents container writing to host path)
docker run -v $(pwd)/config:/app/config:ro myapp:1.0
```

### Security Best Practices

- **Never run as root** — add `USER appuser` in Dockerfile (see example above)
- **Never put secrets in ENV** — they appear in `docker inspect` and image layers.
  Use Docker secrets, environment injection at runtime, or a secrets manager.
- **Pin base image versions** — `FROM python:3.13.0-slim` not `FROM python:latest`
- **Scan images** — `docker scout cves myapp:1.0` or `trivy image myapp:1.0`
- **Read-only filesystem** — `docker run --read-only` with tmpfs for writable paths:
  ```bash
  docker run --read-only --tmpfs /tmp myapp:1.0
  ```
- **No new privileges** — `docker run --security-opt=no-new-privileges myapp:1.0`
- **.dockerignore** — always exclude `.env`, credentials, and `.git`

### FastAPI + SQLite Dockerfile (This Project)

```dockerfile
FROM python:3.13-slim

WORKDIR /app

COPY 1701-uniform/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY 1701-uniform/backend/ .

RUN adduser --disabled-password appuser
USER appuser

# Volume for SQLite database file persistence
VOLUME ["/app/data"]

ENV DATABASE_URL=sqlite:///./data/demo.db

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
# Note: SQLite + multiple workers = write conflicts. Keep workers=1 with SQLite.
```

---

## Git — Version Control (Pro Git)

### The Three Areas

```
Working Directory  →  git add  →  Staging Area (Index)  →  git commit  →  Repository (.git)
                   ←  git restore            ←  git restore --staged
```

- **Working Directory** — files on disk you can see and edit
- **Staging Area (Index)** — snapshot prepared for the next commit; `git add` moves changes here
- **Repository** — permanent history of all commits; stored in `.git/`

### Daily Workflow

```bash
git status                         # what's changed / staged / untracked
git status -s                      # short format: M=modified A=added ?=untracked

git diff                           # unstaged changes (working dir vs index)
git diff --staged                  # staged changes (index vs last commit)

git add file.py                    # stage one file
git add .                          # stage all changes in current dir (use with care)
git add -p                         # interactive: stage specific hunks, not whole files

git commit -m "message"            # commit what's staged
git commit -am "message"           # stage all tracked files and commit (skips git add)
git commit --amend                 # redo last commit (message or add forgotten file)
                                   # NEVER amend a commit that has been pushed
```

### Branching

```bash
git branch                         # list local branches
git branch -a                      # list local + remote branches
git branch feature/login           # create branch (stays on current branch)
git checkout -b feature/login      # create AND switch (classic)
git switch -c feature/login        # create AND switch (modern, Git 2.23+)
git switch main                    # switch branches
git branch -d feature/login        # delete merged branch
git branch -D feature/login        # force delete (even if unmerged)
git branch -m old-name new-name    # rename branch
```

### Merging

```bash
git checkout main
git merge feature/login            # merge feature into main

# Fast-forward: if main has no new commits, pointer just advances — no merge commit
# Three-way merge: if main has diverged, creates a merge commit

git merge --no-ff feature/login    # always create merge commit (shows branch history)
git merge --abort                  # abandon a merge with conflicts
```

**Resolving conflicts** — git marks them in the file:
```
<<<<<<< HEAD
code from current branch
=======
code from branch being merged
>>>>>>> feature/login
```
Edit the file to the desired final state, remove the markers, then:
```bash
git add conflicted_file.py
git commit                         # complete the merge
```

### Rebasing

```bash
# Replay feature branch commits on top of main (linear history)
git checkout feature/login
git rebase main

# Interactive rebase — rewrite last N commits
git rebase -i HEAD~3               # opens editor with last 3 commits
# pick   = keep as-is
# squash = combine with previous commit
# reword = keep changes, edit message
# drop   = remove commit entirely

# RULE: Never rebase commits that have been pushed to a shared branch
# Rebasing rewrites history — force-push would be needed, breaking teammates
```

### Undoing Things

| Situation | Command | Safe? |
|-----------|---------|-------|
| Unstage a file | `git restore --staged file.py` | Yes |
| Discard working dir changes | `git restore file.py` | Yes (destructive locally) |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` | Yes (local only) |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` | Yes (local only) |
| Undo last commit, discard changes | `git reset --hard HEAD~1` | Destructive |
| Undo a pushed commit (safe) | `git revert <hash>` | Yes — creates new commit |
| Amend last commit | `git commit --amend` | Yes (local only) |

**`git reset` modes:**
```bash
git reset --soft HEAD~1    # moves HEAD back; staged area keeps changes ready to re-commit
git reset HEAD~1           # (default --mixed) unstages changes; working dir unchanged
git reset --hard HEAD~1    # discards everything — working dir matches the commit
```

**`git revert`** — the safe way to undo a pushed commit:
```bash
git revert abc1234         # creates a new commit that inverts abc1234
git revert HEAD            # revert the last commit
# Never use reset --hard on shared branches
```

### Stashing

```bash
git stash                          # save dirty working dir, restore clean state
git stash push -m "wip: login form"  # stash with a label
git stash list                     # show all stashes
git stash pop                      # apply most recent stash and delete it
git stash apply stash@{2}          # apply a specific stash (keep it in list)
git stash drop stash@{0}           # delete a stash
git stash branch feature/wip       # create branch from stash (cleanest recovery)
```

### Remote Operations

```bash
git remote -v                      # list remotes (name + URL)
git remote add origin <url>        # add a remote
git remote set-url origin <url>    # change URL

git fetch origin                   # download remote changes, don't merge
git fetch origin main              # fetch specific branch only

git pull origin main               # fetch + merge (equivalent to fetch then merge)
git pull --rebase origin main      # fetch + rebase (cleaner history, preferred)

git push -u origin feature/login   # push and set upstream tracking
git push                           # push to tracked remote branch
git push --force-with-lease        # safer force push: fails if remote has new commits
                                   # (prefer this over git push --force)
```

### Log and History

```bash
git log                            # full commit history
git log --oneline                  # one line per commit
git log --oneline --graph --all    # visual branch graph
git log --oneline -10              # last 10 commits
git log --author="James"           # filter by author
git log --since="2 weeks ago"      # filter by date
git log --grep="fix"               # search commit messages
git log -- path/to/file.py         # commits that touched a specific file
git log main..feature              # commits in feature not yet in main

git show abc1234                   # show a specific commit's diff
git show HEAD~2                    # show 2 commits ago
git diff main..feature             # diff between branches
git diff HEAD~3 HEAD               # diff over last 3 commits

git blame file.py                  # who wrote each line, and in which commit
git log -S "function_name"         # find when a string was added/removed (pickaxe)
```

### Tags

```bash
git tag v1.0.0                     # lightweight tag (just a pointer)
git tag -a v1.0.0 -m "Release"    # annotated tag (has metadata — use this for releases)
git tag                            # list all tags
git push origin v1.0.0             # tags are NOT pushed automatically
git push origin --tags             # push all tags
git checkout v1.0.0                # check out tag (puts you in detached HEAD)
```

### Recovery with Reflog

`reflog` records every time HEAD moves — your safety net when things go wrong:

```bash
git reflog                         # show HEAD movement history
# Output:
# abc1234 HEAD@{0}: commit: add login endpoint
# def5678 HEAD@{1}: reset: moving to HEAD~1
# ghi9012 HEAD@{2}: commit: initial auth setup

git checkout HEAD@{2}             # recover to any previous state
git branch recovered HEAD@{2}     # create branch at a lost commit
# Even commits deleted with reset --hard survive in reflog for ~90 days
```

### Debugging

```bash
git bisect start                   # begin binary search for a bug
git bisect bad                     # current commit is broken
git bisect good v1.0.0             # last known good commit
# git checks out the midpoint — test it, then:
git bisect good                    # or: git bisect bad
# repeat until git identifies the first bad commit
git bisect reset                   # done, return to original branch

git cherry-pick abc1234            # apply a single commit from another branch
git cherry-pick abc1234..def5678   # apply a range of commits
```

### .gitignore Patterns

```gitignore
# Ignore by extension
*.pyc
*.log

# Ignore directory
__pycache__/
.venv/
node_modules/

# Ignore specific file
.env

# Negate (track even if parent pattern ignores it)
!important.log

# Only ignore at root level (not subdirectories)
/TODO

# Ignore in any subdirectory
**/temp/
```

**Check why a file is ignored:**
```bash
git check-ignore -v path/to/file.py
```

### Configuration

```bash
git config --global user.name "James Kirk"
git config --global user.email "jkirk@example.com"
git config --global core.editor "vim"
git config --global init.defaultBranch main

git config --list                  # show all config
git config user.name               # show one value
```

Config precedence (highest wins): `.git/config` → `~/.gitconfig` → `/etc/gitconfig`

### This Project's Git Rules

- **Branch:** always develop on `claude/add-claude-documentation-eaPc5`
- **Push:** `git push -u origin <branch-name>` — always set upstream
- **No force push** to main/master — ever
- **No `--no-verify`** — hooks exist for a reason; fix the underlying issue
- **New commits, not amends** — after a hook failure, fix + stage + new commit
- **Commit messages:** concise summary line (≤72 chars), blank line, then detail paragraph

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

### Anthropic Python SDK — API Integration

**Install and basic call:**
```python
pip install anthropic python-dotenv
```

```python
import os
from anthropic import Anthropic

# SDK automatically reads ANTHROPIC_API_KEY from environment
client = Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-6",       # use current model IDs, not old ones
    max_tokens=1024,
    temperature=0.0,                 # 0.0 = deterministic; 1.0 = creative
    system="You are a senior Python engineer. Always include type hints.",
    messages=[
        {"role": "user", "content": "Explain async/await in 3 sentences."}
    ]
)
print(message.content[0].text)
print(f"Tokens used: {message.usage.input_tokens} in / {message.usage.output_tokens} out")
```

**Key parameters:**

| Parameter | Purpose | Values |
|-----------|---------|--------|
| `model` | Which Claude model | See model IDs in system prompt |
| `max_tokens` | Max response length | 1–200k depending on model |
| `temperature` | Randomness | 0.0 (deterministic) – 1.0 (creative) |
| `system` | System prompt / persona | String |
| `stop_sequences` | Stop generation early | List of strings |
| `stream` | Streaming mode | `True` / `False` |

**Temperature guide:**
- `0.0–0.3` — code generation, data extraction, factual Q&A (consistent, predictable)
- `0.4–0.7` — analysis, summarisation, editing (balanced)
- `0.8–1.0` — creative writing, brainstorming, ideation (diverse, surprising)

**Streaming response (reduces perceived latency):**
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short story."}]
) as stream:
    for text_chunk in stream.text_stream:
        print(text_chunk, end="", flush=True)
print()   # newline at end
```

**Multi-turn conversation — maintain history manually:**
```python
history = []

def chat(user_message: str) -> str:
    history.append({"role": "user", "content": user_message})
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=history,
    )
    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})
    return reply

# The API is stateless — you must send the full history every call
# Trim history when approaching context window limits
```

**Chained prompts — pass output of one call as input to next:**
```python
def summarise(text: str) -> str:
    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",   # cheap model for simple tasks
        max_tokens=300, temperature=0.3,
        messages=[{"role": "user", "content": f"Summarise concisely:\n\n{text}"}]
    )
    return msg.content[0].text.strip()

def extract_keywords(summary: str) -> str:
    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=100, temperature=0.0,
        messages=[{"role": "user", "content": f"Extract keywords (comma-separated):\n\n{summary}"}]
    )
    return msg.content[0].text.strip()

summary = summarise(long_document)
keywords = extract_keywords(summary)   # output of step 1 → input to step 2
```

**Recommended project structure for Claude integrations:**
```
your_claude_project/
├── .env                  # ANTHROPIC_API_KEY=sk-ant-...
├── requirements.txt      # anthropic, python-dotenv
├── src/
│   ├── claude_client.py  # Anthropic() init, shared client
│   ├── prompt_manager.py # Prompt templates as functions
│   ├── utils.py          # Token counting, retry logic
│   └── main.py           # Application logic
```

**Error handling and retries:**
```python
import time
from anthropic import APIStatusError, APIConnectionError

def call_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=messages,
            )
        except APIConnectionError:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)   # exponential backoff
            else:
                raise
        except APIStatusError as e:
            if e.status_code == 429:       # rate limit
                time.sleep(60)
                continue
            raise
```

### Eight Golden Rules of a Perfect Prompt (AI Strategy 2025)

1. **Be precise and specific** — the clearer and more detailed, the better the AI understands
2. **Define the target audience** — describe who the content is for so the AI adjusts tone
3. **Use a clear instruction verb** — start with "Create...", "Write...", "Describe...", "List..."
4. **Set the desired tone and style** — formal, casual, informative, humorous — state it explicitly
5. **Avoid ambiguities** — remove vague terms and jargon that could confuse the model
6. **Focus on the essentials** — limit information to key points; don't overwhelm with irrelevant detail
7. **Use positive phrasing** — "Use short sentences" is clearer than "Avoid long sentences"
8. **Add context** — mention the platform, format, or downstream use (email, Slack, blog post, API response)

### Claude's Limitations — Know Before You Prompt (Claude for Beginners)

- **Knowledge cutoff** — Claude has no knowledge of events after its training cutoff. Don't ask for current prices, recent news, or live data. Provide the data yourself if needed.
- **Hallucination** — Claude can generate plausible-sounding but incorrect information, especially for specific facts, citations, statistics, and code APIs. Always verify important claims from another source.
- **Confident when wrong** — tone gives no signal of uncertainty. A wrong answer reads identically to a right one. For anything consequential, verify.
- **No memory between conversations** — each new conversation starts completely fresh unless you use Projects with instructions. If context from a previous session is needed, paste it in.
- **Stateless API** — the `/messages` endpoint has no session state. Every call must include the full conversation history you want the model to see.
- **Iterating beats one-shot prompting** — the first response is rarely the best. Push back, ask for revisions, add constraints. The conversation builds.

---

## HTTP Fundamentals

*Source: HTTP: The Definitive Guide (David Gourley & Brian Totty, O'Reilly)*

### The HTTP Request/Response Model

HTTP is a stateless request/response protocol layered over TCP/IP. Every transaction:

```
Client → TCP connection → Server
Client sends:  METHOD /path HTTP/1.1\r\nHeaders\r\n\r\n[body]
Server sends:  HTTP/1.1 STATUS Reason\r\nHeaders\r\n\r\n[body]
```

**HTTP versions:**
- HTTP/1.0 — new TCP connection per request
- HTTP/1.1 — persistent connections (keep-alive) by default, pipelining
- HTTP/2 — multiplexed streams over a single TCP connection, header compression
- HTTPS — HTTP over TLS (TLS/SSL layer sits between HTTP and TCP)

### Methods

| Method | Safe | Idempotent | Body | Purpose |
|--------|------|-----------|------|---------|
| GET | Yes | Yes | No | Retrieve resource |
| HEAD | Yes | Yes | No | GET without body (check existence/headers) |
| POST | No | No | Yes | Create resource, submit data |
| PUT | No | Yes | Yes | Replace resource entirely |
| PATCH | No | No | Yes | Partial update |
| DELETE | No | Yes | No | Delete resource |
| OPTIONS | Yes | Yes | No | Discover allowed methods (used for CORS preflight) |
| TRACE | Yes | Yes | No | Echo request (diagnostic) |

**Safe** = does not modify server state.
**Idempotent** = calling N times has same effect as calling once.

### Status Codes

| Range | Class | Common codes |
|-------|-------|-------------|
| 1xx | Informational | 100 Continue |
| 2xx | Success | 200 OK, 201 Created, 204 No Content, 206 Partial Content |
| 3xx | Redirect | 301 Moved Permanently, 302 Found, 303 See Other, 304 Not Modified, 307 Temporary Redirect |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 410 Gone, 413 Payload Too Large, 429 Too Many Requests |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

**301 vs 302 vs 307:**
- 301 — permanent redirect; browser and search engines update the URL
- 302 — temporary redirect (browser may change POST to GET on redirect — old behaviour)
- 307 — temporary redirect; method and body are preserved (POST stays POST)
- 303 — redirect after POST; browser changes to GET for the new URL (Post/Redirect/Get pattern)

**401 vs 403:**
- 401 Unauthorized — unauthenticated (no credentials provided or invalid credentials)
- 403 Forbidden — authenticated but not authorised (correct credentials, wrong permissions)

### Key Headers

**Request headers:**

```http
Host: api.example.com                    # Required in HTTP/1.1
Authorization: Bearer <token>            # Auth credential
Content-Type: application/json           # Body format (POST/PUT/PATCH)
Content-Length: 245                      # Body byte count
Accept: application/json, text/html      # Acceptable response types
Accept-Encoding: gzip, deflate, br       # Acceptable content encodings
Accept-Language: en-GB, en;q=0.9        # Language preference
If-None-Match: "abc123"                  # Conditional GET (ETag)
If-Modified-Since: Mon, 01 Jan 2024 ... # Conditional GET (date)
Cookie: session=xyz; user_id=42          # Cookies sent to server
User-Agent: Mozilla/5.0 ...              # Client identifier
Referer: https://example.com/page       # Previous page URL
Origin: https://app.example.com         # CORS: request origin
```

**Response headers:**

```http
Content-Type: application/json; charset=utf-8
Content-Length: 512
Content-Encoding: gzip                   # Body is compressed
Cache-Control: max-age=3600, public      # Caching directives
ETag: "abc123def"                        # Resource version identifier
Last-Modified: Fri, 01 Jan 2025 12:00:00 GMT
Location: /api/resources/42             # Redirect target or new resource URL
Set-Cookie: session=xyz; HttpOnly; Secure; SameSite=Strict
WWW-Authenticate: Bearer realm="api"    # Challenges client for credentials (401)
Vary: Accept, Accept-Encoding           # Cache key varies by these request headers
Allow: GET, POST, OPTIONS               # Methods allowed on resource (405 response)
Retry-After: 30                         # Seconds until retry (429/503)
```

### Caching

HTTP caching reduces latency and server load by storing responses.

**Cache-Control directives (response):**

```http
Cache-Control: max-age=3600              # Cache for 3600 seconds
Cache-Control: no-cache                 # Must revalidate before using cached copy
Cache-Control: no-store                 # Never cache (sensitive data)
Cache-Control: public                   # Any cache (CDN, browser) can store
Cache-Control: private                  # Only the user's browser may cache
Cache-Control: must-revalidate          # Must check origin once stale
Cache-Control: s-maxage=86400           # Overrides max-age for shared (CDN) caches
Cache-Control: immutable                # Resource will never change (use with hashed filenames)
```

**ETag-based validation (conditional requests):**

```
Server sends:  ETag: "v1.0-abc123"
Client sends:  If-None-Match: "v1.0-abc123"
Server reply:  304 Not Modified  (if unchanged) — no body, saves bandwidth
               200 OK + new body (if changed, with new ETag)
```

**Last-Modified-based validation:**

```
Server sends:  Last-Modified: Mon, 01 Jan 2024 12:00:00 GMT
Client sends:  If-Modified-Since: Mon, 01 Jan 2024 12:00:00 GMT
Server reply:  304 Not Modified  (if unchanged)
               200 OK            (if modified)
```

**Cache hierarchy:** Browser cache → Shared proxy cache / CDN → Origin server

**For API responses:** Use `Cache-Control: no-store` on auth endpoints. Use `Cache-Control: private, max-age=0, must-revalidate` for personalised data.

### Cookies

Cookies are server-set name/value pairs stored by the browser and sent back on matching requests.

```http
# Server sets cookie:
Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: prefs=dark_mode; Path=/; SameSite=Strict; Max-Age=31536000

# Browser sends back:
Cookie: session_id=abc123; prefs=dark_mode
```

**Cookie attributes:**

| Attribute | Effect |
|-----------|--------|
| `HttpOnly` | Cookie invisible to JavaScript (`document.cookie`) — prevents XSS theft |
| `Secure` | Only sent over HTTPS connections |
| `SameSite=Strict` | Never sent on cross-site requests (strongest CSRF protection) |
| `SameSite=Lax` | Sent on top-level navigations (clicks) but not subresource requests |
| `SameSite=None; Secure` | Sent on all cross-site requests (required for cross-site integrations) |
| `Domain=example.com` | Cookie available to subdomains |
| `Path=/api` | Cookie only sent for URLs under `/api` |
| `Max-Age=3600` | Expires in 3600 seconds (preferred over `Expires`) |
| `Expires=...` | Absolute expiry date (session cookie if omitted) |

**Security rule:** Always set `HttpOnly; Secure; SameSite=Lax` on session cookies as a minimum.

### CORS (Cross-Origin Resource Sharing)

The browser blocks cross-origin requests by default. CORS headers allow the server to grant permission.

**Simple request** (GET/POST with simple content types): browser sends `Origin` header; server must reply with `Access-Control-Allow-Origin`.

**Preflight** (OPTIONS request): sent automatically for non-simple methods (PUT, DELETE, PATCH) or custom headers. Server must respond to OPTIONS before the real request proceeds.

```http
# Browser preflight request:
OPTIONS /api/users HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization, Content-Type

# Server must respond:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400              # Cache preflight for 24h
Access-Control-Allow-Credentials: true    # Required if sending cookies
```

```python
# FastAPI CORS middleware:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],  # never "*" with credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Never use `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`** — browsers reject this combination.

### Connection Management

**HTTP/1.1 persistent connections (keep-alive):**

```http
Connection: keep-alive     # Reuse TCP connection for multiple requests
Connection: close          # Close after this response
```

TCP connection setup (SYN → SYN-ACK → ACK) costs a round-trip time. Persistent connections eliminate this overhead for subsequent requests. Use connection pooling in production applications.

**Chunked transfer encoding:**

```http
Transfer-Encoding: chunked
```

Allows response body to be sent in pieces without knowing the total `Content-Length` upfront. Used for streaming responses and server-sent events.

**Content negotiation:**

```http
Accept: application/json, text/xml;q=0.9, */*;q=0.8
Content-Type: application/json; charset=utf-8
```

Server picks the best representation and echoes back `Content-Type`. `q` values (0–1) indicate preference; default is 1.0.

### Authentication Headers

```http
# Challenge (401 response):
WWW-Authenticate: Bearer realm="api", error="invalid_token"
WWW-Authenticate: Basic realm="Admin Area"

# Client credential (subsequent request):
Authorization: Bearer eyJhbGc...                    # JWT / OAuth token
Authorization: Basic dXNlcjpwYXNz                   # base64(user:password)
Authorization: Digest username="...", ...            # Digest auth
```

### Proxies and Forwarding

```http
X-Forwarded-For: 203.0.113.1, 10.0.0.1    # Real client IP (added by proxy)
X-Forwarded-Proto: https                    # Original protocol before proxy
X-Real-IP: 203.0.113.1                     # Single real IP (nginx)
Forwarded: for=203.0.113.1; proto=https    # RFC 7239 standardised version
```

**Trust `X-Forwarded-For` only from known trusted proxies** — clients can spoof it.

In FastAPI behind a reverse proxy, configure trusted hosts:

```python
from fastapi import Request

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host
```

### HTTPS / TLS

HTTPS inserts TLS between HTTP and TCP:

```
Client → TLS Handshake → Server
         (certificate exchange, cipher negotiation, session key)
         ↓
         Encrypted HTTP over the established TLS channel
```

**TLS handshake steps (simplified TLS 1.3):**
1. Client Hello — supported cipher suites, TLS version
2. Server Hello — chosen cipher, certificate (contains public key)
3. Client verifies certificate against trusted CA
4. Key exchange — session key derived; all further traffic encrypted

**In production:** HTTPS is non-negotiable. Use `Strict-Transport-Security` (HSTS) to force HTTPS:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Common HTTP Antipatterns to Avoid

- Using GET for state-changing operations (not idempotent, cacheable)
- Using POST instead of PUT/PATCH for updates (loses idempotency guarantee)
- Returning 200 with `{"error": "..."}` instead of the correct 4xx/5xx code
- Returning 401 when you mean 403 (confused about auth vs authz)
- Caching sensitive data without `Cache-Control: private, no-store`
- Forgetting `Content-Type` header on POST/PUT bodies
- Using cookies without `HttpOnly` and `Secure` flags
- Not handling CORS preflight (OPTIONS) requests in your API router

---

## SQL Performance & Indexing

*Source: SQL Performance Explained (Markus Winand)*

### The B-Tree Index — How It Works

Every database index (unless otherwise specified) is a **B-tree** — a balanced search tree where all leaf nodes are at the same depth.

**Two-layer structure:**

1. **Leaf nodes** — ordered index entries (indexed column value + ROWID/pointer to table row), connected by a doubly linked list so the database can traverse forward or backward
2. **Branch nodes / Root** — each branch stores the maximum value from a child node, enabling O(log n) tree traversal to find the right leaf page

**Three-step index lookup:**
1. **Tree traversal** — traverse root → branch → leaf (bounded by tree depth, typically 4–5 levels even for millions of rows)
2. **Leaf node chain** — follow the doubly linked list to find all matching entries
3. **Table access** — fetch actual row data via ROWID

Steps 2 and 3 are where performance degrades — an INDEX RANGE SCAN accessing many rows means many random table reads.

**Key insight:** A B-tree can answer range queries efficiently (e.g., `WHERE age BETWEEN 25 AND 35`) because matching entries are consecutive in the leaf node chain.

### Execution Plan Basics

Always check the execution plan (EXPLAIN) to verify index usage:

```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM employees WHERE last_name = 'Smith';

-- MySQL
EXPLAIN SELECT * FROM employees WHERE last_name = 'Smith';

-- Oracle
EXPLAIN PLAN FOR SELECT ...;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

**Oracle operation types:**

| Operation | Meaning |
|-----------|---------|
| `INDEX UNIQUE SCAN` | Tree traversal only; primary key or unique constraint — at most 1 row |
| `INDEX RANGE SCAN` | Tree traversal + leaf chain — multiple rows possible; performance varies |
| `TABLE ACCESS BY INDEX ROWID` | Row fetch from table after index lookup |
| `TABLE ACCESS FULL` | Full table scan — reads every row; may be faster than index for large result sets |

### Composite (Concatenated) Indexes

A composite index on `(col_a, col_b)` is usable as an access predicate **only if the leftmost column is in the WHERE clause**.

```sql
CREATE INDEX emp_name ON employees (last_name, first_name);

-- Uses index (access predicate on last_name):
SELECT * FROM employees WHERE last_name = 'Smith';
SELECT * FROM employees WHERE last_name = 'Smith' AND first_name = 'John';

-- Does NOT use the index efficiently (first_name alone skips left column):
SELECT * FROM employees WHERE first_name = 'John';
```

**Column order rule:** Put the equality column first, then the range column. For a query `WHERE status = ? AND created_at > ?`, create `(status, created_at)` — not `(created_at, status)`.

### Function-Based Indexes

When you wrap a column in a function in the WHERE clause, the plain column index is useless — the database treats the function as a black box.

```sql
-- This CANNOT use an index on last_name:
SELECT * FROM employees WHERE UPPER(last_name) = 'SMITH';

-- Solution: create a function-based index
CREATE INDEX emp_upper_name ON employees (UPPER(last_name));

-- Now this query uses the index:
SELECT * FROM employees WHERE UPPER(last_name) = 'SMITH';
```

**ORM warning:** Hibernate uses `LOWER()` for case-insensitive queries. Without a function-based index on `LOWER(column)`, every such query does a full table scan.

**Deterministic requirement:** Only deterministic functions (same output for same input, always) can be indexed. `UPPER()`, `LOWER()`, and expressions like `col_a + col_b` are deterministic. `NOW()`, `SYSDATE`, random functions, and functions reading external state are not.

### Index Invalidation Antipatterns

**Wrapping the column in a function (black box problem):**

```sql
-- BAD: index on sale_date is unusable
WHERE TRUNC(sale_date) = TRUNC(SYSDATE - 1)

-- GOOD: convert the search term instead; keep the column bare
WHERE sale_date >= DATE '2024-01-01'
  AND sale_date <  DATE '2024-01-02'
```

**Implicit type conversion:**

```sql
-- BAD: numeric_string column gets CAST to number (index lost)
WHERE numeric_string = 42       -- missing quotes forces conversion on column

-- GOOD: convert the literal instead
WHERE numeric_string = '42'
```

**Applying arithmetic to the column:**

```sql
-- BAD: index on price is unusable
WHERE price * 1.2 > 100

-- GOOD: rearrange the maths to the literal side
WHERE price > 100 / 1.2
```

**Rule:** Never apply functions or arithmetic to the indexed column in a WHERE clause. Always apply transformations to the literal/parameter side of the comparison.

### Partial Indexes

A partial index covers only rows satisfying a condition — smaller, faster, more selective:

```sql
-- PostgreSQL native partial index:
CREATE INDEX idx_messages_unread
ON messages (receiver_id)
WHERE processed = FALSE;

-- Only works for queries that include the same WHERE condition:
SELECT * FROM messages WHERE receiver_id = 42 AND processed = FALSE;
```

PostgreSQL and SQL Server support native partial indexes. Oracle emulates them using function-based indexing with NULL returns.

### Covering Indexes

A **covering index** includes all columns needed by the query in the index itself, avoiding table row access entirely.

```sql
-- Query needs: first_name, last_name (WHERE on employee_id)
-- Covering index:
CREATE INDEX idx_emp_covering ON employees (employee_id, first_name, last_name);

-- Execution plan shows no TABLE ACCESS — index only scan
```

Covering indexes trade write overhead (index must be maintained on every DML) for dramatically faster reads when the indexed columns satisfy the full SELECT column list.

### The N+1 Query Problem

**N+1** occurs when ORM code issues one query for parent records, then N separate queries for each parent's children — instead of a single JOIN.

```python
# BAD — N+1 with SQLAlchemy (lazy loading):
employees = session.query(Employee).filter(...).all()
for emp in employees:
    sales = emp.sales  # triggers a SELECT per employee!

# GOOD — eager load with JOIN:
employees = (
    session.query(Employee)
    .options(joinedload(Employee.sales))
    .filter(...)
    .all()
)
```

**Enable SQL logging during development** to spot N+1 patterns:

```python
# SQLAlchemy echo:
engine = create_engine(DATABASE_URL, echo=True)
```

**Diagnosis:** If you see the same query repeated N times with different parameter values, you have an N+1 problem.

### Index Strategy for Join Types

**Nested loops join** (small driving result set):
- Index the join predicate columns on the inner table
- Index the independent WHERE predicates on the outer table

```sql
-- Nested loops: index join columns on inner table
CREATE INDEX sales_emp ON sales (subsidiary_id, employee_id);

-- Plus independent predicate index:
CREATE INDEX emp_upper_name ON employees (UPPER(last_name));
```

**Hash join** (large result sets):
- Joining columns do NOT need indexes — hash table eliminates the need
- Only independent WHERE predicates benefit from indexing
- Reduce hash table size: select fewer columns, add more filter conditions

```sql
-- Hash join: index the independent WHERE predicate only
CREATE INDEX sales_date ON sales (sale_date);
```

### Query Planner and Bind Parameters

**Use bind parameters** (parameterised queries) for two reasons:

1. **SQL injection prevention** — values never become SQL syntax
2. **Execution plan reuse** — the database caches and reuses the plan for identical SQL text

```python
# Good — bind parameter:
cursor.execute("SELECT * FROM employees WHERE subsidiary_id = %s", (subsidiary_id,))

# Bad — string interpolation defeats plan caching and risks injection:
cursor.execute(f"SELECT * FROM employees WHERE subsidiary_id = {subsidiary_id}")
```

**Exception:** When the optimal execution plan genuinely varies by parameter value (e.g., a large subsidiary vs small one), the database may need a literal to generate the right plan. Histograms help the optimizer decide.

### Slow Query Identification

Steps to diagnose a slow query:

1. **Enable slow query log** (MySQL: `slow_query_log`, PostgreSQL: `log_min_duration_statement`)
2. **Run EXPLAIN ANALYZE** — look for `TABLE ACCESS FULL` on large tables, high estimated row counts
3. **Check cardinality** — if `INDEX RANGE SCAN` returns thousands of rows all requiring table lookups, adding a covering index or refining the predicate may help
4. **Look at statistics freshness** — stale statistics mislead the optimizer; run `ANALYZE TABLE` / `VACUUM ANALYZE` after bulk loads
5. **Check for missing indexes** — `WHERE` columns not indexed, or function-wrapped columns with no FBI

### Indexing Summary Checklist

- [ ] Every foreign key column has an index (prevents table scans on joins)
- [ ] Composite index columns are ordered: equality columns first, range column last
- [ ] No function wrapped around indexed columns in WHERE clauses
- [ ] Date range queries use explicit `>=` / `<` bounds, not `TRUNC(date)`
- [ ] Case-insensitive searches use function-based indexes (`UPPER`/`LOWER`)
- [ ] ORM queries use eager loading (joinedload) where N+1 is possible
- [ ] Bind parameters used everywhere (no f-string SQL)
- [ ] EXPLAIN checked for full table scans on production-scale queries
- [ ] Table statistics up to date after bulk imports

---

*Generated from 33 books: Python Crash Course (James Deep), Python Made Simple (James Young),
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
99 Claude Secret Commands (Abdelbasset Daly),
Mastering Claude 4 (Riadh Daly),
AI Strategy 2025 for Marketing Teams (Henrik Roth),
Claude AI for Beginners (Marcus Archer),
Python Testing with pytest (Brian Okken),
SQL Antipatterns (Bill Karwin),
Docker: Up and Running (Sean P. Kane & Karl Matthias),
Pro Git (Scott Chacon & Ben Straub),
OAuth 2 in Action (Justin Richer & Antonio Sanso),
HTTP: The Definitive Guide (David Gourley & Brian Totty),
SQL Performance Explained (Markus Winand).*
