"""
Seed script — run once to populate items, sizes, stock records, and the standard kit list.
Usage: python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models
from models import Item, Size, Stock, KitListItem, User, Gender
from utils.hashing import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ============================================================
# UNIFORM ITEMS + SIZES
# ============================================================

ITEMS = [
    {
        "name": "TROUSERS, MANS. Royal Air Force, No2 Dress",
        "short_name": "No2 Trousers (M)",
        "category": "Trousers",
        "allows_multiples": False,
        "sizes": [
            "66/68/76","69/72/84","72/72/88","72/76/92","72/80/96","72/84/100","72/88/104",
            "75/72/88","75/76/92","75/80/96","75/84/100","75/88/104","75/92/108",
            "80/72/88","80/76/92","80/80/96","80/84/100","80/88/104","80/92/108","80/96/112","80/100/116","80/104/120",
            "85/76/92","85/80/96","85/84/100","85/88/104","85/92/108","85/96/112","85/100/116","85/104/120","85/108/124",
            "OUTSIZE",
        ],
    },
    {
        "name": "SHIRT, MANS. Blue, Long Sleeve (No2 Dress / Wedgewood)",
        "short_name": "Wedgewood Shirt (M)",
        "category": "Shirts",
        "allows_multiples": True,
        "sizes": [
            "31","32","33","34","35","36","37","38","39","40",
            "41","42","43","44","45","46","47","48","OUTSIZE",
        ],
    },
    {
        "name": "SHIRT MANS, Extra Long Sleeve, Blue (No2 Dress / Wedgewood)",
        "short_name": "Wedgewood Shirt Extra Long (M)",
        "category": "Shirts",
        "allows_multiples": True,
        "sizes": [
            "37","38","39","40","41","42","43","44","45","46","47","48",
        ],
    },
    {
        "name": "SHIRT, MANS. Mid Blue, Long Sleeve, Work Type (Dark Blue)",
        "short_name": "Dark Blue Shirt (M)",
        "category": "Shirts",
        "allows_multiples": True,
        "sizes": [
            "31","32/34","35/37","38/40","41/43","44/46","47/48","OUTSIZE",
        ],
    },
    {
        "name": "SHIRT, WOMANS. Blue, Long Sleeve (No2 Dress / Wedgewood)",
        "short_name": "Wedgewood Shirt (W)",
        "category": "Shirts",
        "allows_multiples": True,
        "sizes": [
            "32/88","33/88","34/88","34/92","35/92","35/96","36/96","36/100",
            "37/100","37/104","38/104","38/108","39/108","39/112","40/112","41/112","OUTSIZE",
        ],
    },
    {
        "name": "SKIRT, WOMANS. Royal Air Force, No2 Dress",
        "short_name": "No2 Skirt (W)",
        "category": "Trousers",
        "allows_multiples": False,
        "sizes": [
            "67/64/92","67/68/96","67/72/100","67/76/104","67/80/108","67/84/108","67/88/112","67/92/116","67/96/120",
            "71/64/92","71/68/96","71/72/100","71/76/104","71/80/108","71/84/108","71/88/112","71/92/116","71/96/120","71/100/124","71/104/128",
            "75/68/96","75/72/100","75/76/104","75/80/108","75/84/108","75/88/112","75/92/116","75/96/120","75/100/124","75/104/128",
            "OUTSIZE",
        ],
    },
    {
        "name": "SLACKS, WOMANS. Royal Air Force, No2 Dress",
        "short_name": "No2 Slacks (W)",
        "category": "Trousers",
        "allows_multiples": False,
        "sizes": [
            "72/64/92","72/68/96","72/72/100","72/76/104","72/80/108","72/84/108","72/88/112","72/92/116","72/96/120",
            "77/64/92","77/68/96","77/72/100","77/76/104","77/80/108","77/84/108","77/88/112","77/92/116","77/96/120",
            "82/68/96","82/72/100","82/76/104","82/80/108","82/84/108","82/88/112","82/92/116","82/96/120",
            "OUTSIZE",
        ],
    },
    {
        "name": "BERET. Royal Air Force, All Ranks",
        "short_name": "Beret",
        "category": "Headwear",
        "allows_multiples": False,
        "sizes": [
            "48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","OUTSIZE",
        ],
    },
    {
        "name": "JUMPER, UTILITY. Blue Grey, V-Neck",
        "short_name": "Utility Jumper",
        "category": "Knitwear",
        "allows_multiples": False,
        "sizes": [
            "74","82","88","94","100","106","112","118","124","130","136","OUTSIZE",
        ],
    },
    {
        "name": "JACKET, WET WEATHER. RAF Blue",
        "short_name": "Wet Weather Jacket",
        "category": "Outerwear",
        "allows_multiples": False,
        "sizes": [
            "160/88","170/96","170/104","170/112","180/96","180/104","180/112","190/120","OUTSIZE",
        ],
    },
    {
        "name": "COVERALLS, MANS. Olive Drab",
        "short_name": "Coveralls",
        "category": "Outerwear",
        "allows_multiples": False,
        "sizes": [
            "160/84","160/92","160/100",
            "170/92","170/100","170/108",
            "180/92","180/100","180/108",
            "190/100","190/108","190/116",
            "OUTSIZE",
        ],
    },
    {
        "name": "NECKTIE, Royal Air Force",
        "short_name": "Black Tie",
        "category": "Accessories",
        "allows_multiples": False,
        "sizes": ["STANDARD"],
    },
    {
        "name": "BELT, WAIST. Royal Air Force",
        "short_name": "RAF Belt",
        "category": "Accessories",
        "allows_multiples": False,
        "sizes": ["64-114cm"],
    },
    {
        "name": "BRASSARD, Air Cadet",
        "short_name": "Brassard",
        "category": "Accessories",
        "allows_multiples": False,
        "sizes": ["STANDARD"],
    },
    {
        "name": "GLOVES, MENS. Tri-Service Black",
        "short_name": "Gloves (M)",
        "category": "Accessories",
        "allows_multiples": False,
        "sizes": ["6½","7","7½","8","8½","9","9½","10"],
    },
    {
        "name": "GLOVES, WOMANS. Tri-Service Black",
        "short_name": "Gloves (W)",
        "category": "Accessories",
        "allows_multiples": False,
        "sizes": ["6½","7","7½","8","8½","9"],
    },
    {
        "name": "SOCKS, Black, Mid Calf Length (Thin)",
        "short_name": "Socks (Thin)",
        "category": "Socks",
        "allows_multiples": True,
        "sizes": ["3-6","7-10","11-14"],
    },
    {
        "name": "SOCKS, Black, Mens (Thick)",
        "short_name": "Socks (Thick)",
        "category": "Socks",
        "allows_multiples": True,
        "sizes": ["3-6","7-10","11-14"],
    },
]

print("Seeding items and sizes...")
item_records = {}

for item_data in ITEMS:
    existing = db.query(Item).filter(Item.short_name == item_data["short_name"]).first()
    if existing:
        print(f"  Skipping (exists): {item_data['short_name']}")
        item_records[item_data["short_name"]] = existing
        continue

    item = Item(
        name=item_data["name"],
        short_name=item_data["short_name"],
        category=item_data["category"],
        allows_multiples=item_data["allows_multiples"],
    )
    db.add(item)
    db.flush()

    for size_label in item_data["sizes"]:
        size = Size(item_id=item.id, size_label=size_label)
        db.add(size)
        db.flush()
        # Create a stock record at 0
        stock = Stock(item_id=item.id, size_id=size.id, quantity=0)
        db.add(stock)

    item_records[item_data["short_name"]] = item
    print(f"  Added: {item_data['short_name']} ({len(item_data['sizes'])} sizes)")

db.commit()


# ============================================================
# STANDARD KIT LIST
# ============================================================
# Only set up if kit list is empty
if db.query(KitListItem).count() == 0:
    print("\nSeeding standard kit list...")

    def kit_item_id(short_name):
        return item_records[short_name].id

    kit_entries = [
        # Universal items (all cadets)
        KitListItem(item_id=kit_item_id("Beret"),             display_label="Beret"),
        KitListItem(item_id=kit_item_id("Black Tie"),          display_label="Black Tie"),
        KitListItem(item_id=kit_item_id("RAF Belt"),           display_label="Belt"),
        KitListItem(item_id=kit_item_id("Brassard"),           display_label="Brassard"),
        KitListItem(item_id=kit_item_id("Utility Jumper"),     display_label="Utility Jumper"),
        KitListItem(item_id=kit_item_id("Wet Weather Jacket"), display_label="Wet Weather Jacket"),

        # Wedgewood shirt — male gets men's long sleeve
        KitListItem(
            item_id=kit_item_id("Wedgewood Shirt (M)"),
            gender_restriction=Gender.male,
            display_label="Wedgewood Shirt",
            group_key="wedgewood_male",
        ),
        KitListItem(
            item_id=kit_item_id("Wedgewood Shirt Extra Long (M)"),
            gender_restriction=Gender.male,
            display_label="Wedgewood Shirt",
            group_key="wedgewood_male",
        ),
        # Wedgewood shirt — female
        KitListItem(
            item_id=kit_item_id("Wedgewood Shirt (W)"),
            gender_restriction=Gender.female,
            display_label="Wedgewood Shirt",
            group_key="wedgewood_female",
        ),

        # Dark blue shirt — male
        KitListItem(
            item_id=kit_item_id("Dark Blue Shirt (M)"),
            gender_restriction=Gender.male,
            display_label="Dark Blue Shirt",
        ),
        # Dark blue shirt — female (using men's work shirt, as per your list — adjust if needed)
        KitListItem(
            item_id=kit_item_id("Dark Blue Shirt (M)"),
            gender_restriction=Gender.female,
            display_label="Dark Blue Shirt",
        ),

        # Bottom garment — males: trousers only
        KitListItem(
            item_id=kit_item_id("No2 Trousers (M)"),
            gender_restriction=Gender.male,
            display_label="No2 Trousers",
        ),

        # Bottom garment — females: skirt OR slacks (either satisfies)
        KitListItem(
            item_id=kit_item_id("No2 Skirt (W)"),
            gender_restriction=Gender.female,
            display_label="Bottom Garment (Skirt or Slacks)",
            group_key="bottom_female",
        ),
        KitListItem(
            item_id=kit_item_id("No2 Slacks (W)"),
            gender_restriction=Gender.female,
            display_label="Bottom Garment (Skirt or Slacks)",
            group_key="bottom_female",
        ),
    ]

    for entry in kit_entries:
        db.add(entry)

    db.commit()
    print(f"  Added {len(kit_entries)} kit list entries")
else:
    print("\nKit list already exists, skipping.")


# ============================================================
# DEFAULT ADMIN USER
# ============================================================
if not db.query(User).filter(User.username == "admin").first():
    print("\nCreating default admin user...")
    admin = User(
        username="admin",
        forename="Admin",
        surname="User",
        password_hash=hash_password("Password1!"),
        is_admin=True,
    )
    db.add(admin)
    db.commit()
    print("  Created admin / Password1! — CHANGE THIS IMMEDIATELY")
else:
    print("\nAdmin user already exists, skipping.")

db.close()
print("\nSeed complete.")
