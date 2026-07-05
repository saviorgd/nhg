# Product Requirement Document (PRD) - Nihongo N2 Journey (Version 11)

> **Changelog V11:**
> - Section 2.3 — เพิ่ม Import Validation Spec: ระบุ behavior เมื่อไฟล์ที่ import ไม่ถูกต้อง → แสดง error pop-up
> - Section 5.3 — เพิ่ม Invalid Hash Fallback Spec: ระบุ behavior เมื่อ `setting_last_tab` เก็บ hash ที่ไม่ valid → fallback ไป `#dashboard`

> **Changelog V9:**
> - Section 3.2 — แก้ Storage Key Pattern ตัวอย่าง ID จาก 3-digit (`v_n5_001`) เป็น 4-digit (`v_n5_0001`) ให้ตรงกับ data จริง
> - Section 3.3 — แก้ JSON Skeleton ตัวอย่าง ID จาก `v_n5_001` เป็น `v_n5_0001`
> - Section 3.3 — แก้ Field Reference table ตัวอย่าง ID จาก `v_n5_001` เป็น `v_n5_0001`
> - Section 3.3 — แก้ `category` field หมายเหตุ: ใช้ raw value (English snake_case) ใน MVP — mapping ไปเป็น Phase 2
> - Section 3.3 — แก้ `kanji` field: ระบุ render spec เมื่อค่าเป็น `null` ให้แสดงเป็น `-`
> - Section 3.2 — ย้าย Memory Level (Kana + Vocab) ออกจาก MVP ไปเป็น Phase 2 ทั้งหมด
> - Section 4.1 — ปรับ Progress Bar (Kana และ Vocab) ให้สอดคล้องกับการย้าย Memory Level ไป Phase 2
> - Section 4.2.1 — แก้ Stroke Order Fallback note: ลบการอ้างอิง Memory Level ออก
> - Section 4.5 — ปรับ Vocab Table: ลด column เป็น 4 คอลัมน์ (ตัดคอลัมน์ระดับความจำออก), ระบุ `category` แสดง raw value, ระบุ `kanji = null` แสดง `-`
> - Section 2.1 — เพิ่ม fetch path prefix `/data/` ให้ชัดเจน
> - Section 3.3 — เพิ่ม fetch path prefix `/data/` ใน Engineer note
> - Section 6 — เพิ่ม Section 6.7: Category Display Mapping และ Section 6.8: Memory Level System

> **Changelog V10:**
> - Section 3.3 — อัปเดต `vocab.json` skeleton ให้แสดงโครงสร้าง `variants` (dakuten/handakuten), collection `yoon`, และ `yoon_markers`
> - Section 3.4 (ใหม่) — เพิ่ม Kana Variant Schema: สถาปัตยกรรม Dakuten / Handakuten (nested) + Yoon (flat collection) + Yoon Markers พร้อม Field Reference และกฎ romaji ที่ derive ไม่ได้
> - Section 4.2 — เขียน Dynamic Modifier Checkboxes ใหม่: ใช้ presence-based detection (มี key = รองรับ), logic การ render 30% opacity, และการประกอบ/แสดง Yoon
> - Section 6.8 — เพิ่มหมายเหตุ: `variants[].id` รองรับ Memory Level Phase 2 (เช่น `memory_k_h_ga`)
> - หมายเหตุ: ค่า `thai_reading` ของ variant/yoon ทั้งหมด **ครูยืนยันแล้ว (confirmed)** — พร้อมใช้งานจริง

> **Changelog V8:**
> - Section 4.1 — เพิ่ม Cold Start Behavior: ระบุ behavior ของ Progress Bar เมื่อ `vocab_nX.json` ยังไม่ถูกโหลด
> - Section 4.3 — เพิ่ม Section 4.3.1 End of Deck State: ระบุ behavior เมื่อผ่านการ์ดครบทุกใบแล้ว
> - Section 4.2.1 — เพิ่ม Stroke Order Fallback: ระบุ behavior เมื่อ GIF ลำดับขีดโหลดไม่สำเร็จ

> **Changelog V7:**
> - Section 3.3 — แก้ไข JSON Skeleton ของ `vocab_nX.json`: เปลี่ยน `word_kana` → `kana`, เปลี่ยน `meaning` → `thai_meaning`
> - Section 3.3 — แก้ไข JSON Skeleton ของ `vocab_nX.json`: เปลี่ยน Answer Box ใน Section 4.4 ให้อ้างอิง field name ที่ถูกต้อง
> - Section 4.4 — อัปเดต Answer Box Content ให้ใช้ `thai_meaning` แทน `meaning`
> - Section 4.5 — อัปเดต Vocab Table ให้ใช้ `thai_meaning` แทน `meaning`
> - Section 4.6 (ใหม่) — เพิ่ม UI State Specification: Loading, Error, Empty, Pagination
> - Section 5.4 (ใหม่) — เพิ่ม CSS Architecture: Tailwind CSS
> - Section 6.7 — อัปเดต folder_structure เพิ่ม `vocab.js` module

---

## 1. ข้อมูลทั่วไปของผลิตภัณฑ์ (Product Overview)

### 1.1 วิสัยทัศน์ (Product Vision)

สร้างเว็บแอปพลิเคชันส่วนตัวในรูปแบบ Static Web เพื่อเป็นเครื่องมือช่วยเรียนภาษาญี่ปุ่นตั้งแต่ระดับพื้นฐาน (ศูนย์) จนถึงเป้าหมายสูงสุดคือการสอบผ่านระดับ **JLPT N2** โดยออกแบบระบบให้สอดคล้องกับพฤติกรรมและการจำของคนไทย เน้นการเรียนรู้เชิงรุก (Active Learning) การเชื่อมโยงความจำด้วยสิ่งที่เป็นความชอบส่วนตัว และการวางโครงสร้างระบบที่ยืดหยุ่นเพื่อรองรับการขยายฟีเจอร์ระดับสูงในอนาคตโดยไม่ต้องรื้อสถาปัตยกรรมโครงสร้างหลัก

### 1.2 กลุ่มเป้าหมาย (Target Audience)

- คนไทยที่เริ่มต้นเรียนภาษาญี่ปุ่นจากศูนย์ (Absolute Beginner)
- ผู้เรียนที่มีเป้าหมายชัดเจนในการสอบผ่าน JLPT N2 เพื่อวัตถุประสงค์ในการย้ายไปพำนัก ทำงาน หรือใช้ชีวิตที่ประเทศญี่ปุ่นอย่างถาวร
- ผู้เรียนที่ต้องการเครื่องมือปรับแต่งได้ (Personalized Tool) อิงจากความชอบส่วนบุคคล เช่น อาหารญี่ปุ่น ธรรมชาติ และสถานที่ท่องเที่ยว

### 1.3 แพลตฟอร์มและการติดตั้ง (Platform & Deployment)

- **Platform:** Web Application (Responsive Design รองรับทั้ง Mobile และ Desktop)
- **Deployment:** GitHub Pages (Static Web Hosting)
- **Architecture:** Client-side Only (ไม่มีระบบเซิร์ฟเวอร์แบ็กเอนด์ในเฟสแรก)

---

## 2. การจัดการสถาปัตยกรรมข้อมูล (Data & Architecture Specification)

### 2.1 แหล่งเก็บข้อมูลตั้งต้น (Initial Data Source)

ระบบใช้ไฟล์ JSON แยกตามประเภทข้อมูลดังนี้:

| ไฟล์ | Fetch Path | เนื้อหา | โหลดเมื่อ |
|------|-----------|---------|----------|
| `vocab.json` | `/data/vocab.json` | `kana` (ตัวอักษร) + `inspirations` (ข้อความให้กำลังใจ) | โหลดทันทีตอนเปิดแอป (Eager) |
| `vocab_n5.json` | `/data/vocab_n5.json` | คำศัพท์ระดับ N5 ทั้งหมด | Lazy — โหลดเมื่อผู้ใช้เลือกระดับ N5 |
| `vocab_n4.json` | `/data/vocab_n4.json` | คำศัพท์ระดับ N4 ทั้งหมด | Lazy — โหลดเมื่อผู้ใช้เลือกระดับ N4 |
| `vocab_n3.json` | `/data/vocab_n3.json` | คำศัพท์ระดับ N3 ทั้งหมด | Lazy — โหลดเมื่อผู้ใช้เลือกระดับ N3 |
| `vocab_n2.json` | `/data/vocab_n2.json` | คำศัพท์ระดับ N2 ทั้งหมด | Lazy — โหลดเมื่อผู้ใช้เลือกระดับ N2 |

> **หมายเหตุสำหรับ Engineer:** ไฟล์ `vocab_nX.json` แต่ละไฟล์อาจมีขนาดใหญ่ ให้ cache ผลลัพธ์หลังโหลดครั้งแรกไว้ใน memory (ไม่ต้อง fetch ซ้ำในการใช้งานครั้งต่อ ๆ ไปในรอบ session เดียวกัน)

### 2.2 การจัดการสถานะและการบันทึกข้อมูล (State & Storage Management)

- **Primary Storage:** ใช้ระบบ **LocalStorage** ของเบราว์เซอร์ผู้ใช้งานในการบันทึก Progress และ Settings ทั้งหมด
- **Data Synchronization:** เมื่อผู้ใช้งานเปิดหน้าเว็บ (Init State) ระบบจะทำกระบวนการผสานข้อมูล (Merge) ระหว่างโครงสร้างฐานข้อมูลตั้งต้นจากไฟล์ JSON กับค่าความก้าวหน้าล่าสุดที่อ่านได้จาก LocalStorage
- **Data Retention:** ยอมรับข้อจำกัดที่ข้อมูลความก้าวหน้าจะสูญหายหากผู้ใช้งานทำการล้างแคชเบราว์เซอร์ (Clear Browser Cache) ในเฟสแรกนี้

#### LocalStorage Key Reference

| Key | Type | Default | ความหมาย |
|-----|------|---------|---------|
| `memory_{id}` | Integer (0-2) | `0` | ระดับความจำของ Kana หรือ Vocab แต่ละตัว |
| `setting_romaji_visible` | Boolean | `true` | สถานะ Toggle Romaji เปิด/ปิด |
| `setting_last_tab` | String | `#dashboard` | Tab ล่าสุดที่ผู้ใช้เปิดอยู่ |
| `setting_vocab_levels` | JSON Array | `["N5"]` | ระดับ JLPT ที่เลือกสำหรับ Vocab Flashcard |

### 2.3 ระบบสำรองข้อมูลทางเลือก (Backup & Recovery System)

เพื่อป้องกันปัญหาความก้าวหน้าสูญหายจากการล้างแคช ระบบต้องมีกลไกแมนนวลดังนี้:

- **Export Progress Button:** ปุ่มสำหรับแปลงข้อมูลความก้าวหน้าทั้งหมดใน LocalStorage ออกมาเป็นไฟล์รูปแบบ `.json` และดาวน์โหลดเก็บไว้ในเครื่องคอมพิวเตอร์หรือสมาร์ทโฟนของผู้ใช้งานอัตโนมัติ
- **Import Progress Button:** ปุ่มสำหรับอัปโหลดไฟล์ `.json` ที่เคยสำรองไว้กลับเข้าสู่ LocalStorage เพื่อกู้คืนสถานะการเรียนเดิมทั้งหมด 100%

#### Import Validation Spec

เมื่อผู้ใช้เลือกไฟล์เพื่อ Import ระบบต้องตรวจสอบความถูกต้องก่อน write ลง LocalStorage ทุกครั้ง:

| เงื่อนไขที่ตรวจสอบ | Behavior เมื่อผิดพลาด |
|-------------------|--------------------|
| ไฟล์ไม่ใช่ JSON ที่ parse ได้ (SyntaxError) | แสดง error pop-up |
| ไฟล์เป็น JSON แต่ไม่มี key ที่คาดหวัง (structure ไม่ตรง) | แสดง error pop-up |

- **Error Pop-up Message:** `"ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ที่ export จากแอปนี้เท่านั้น"`
- **ปุ่มใน Pop-up:** `"ตกลง"` — ปิด pop-up และไม่มีการเปลี่ยนแปลง LocalStorage ใดๆ
- **Success Case:** หากผ่านการตรวจสอบทั้งหมด ให้ merge ข้อมูลลง LocalStorage และแสดง success pop-up: `"กู้คืนข้อมูลสำเร็จ!"` พร้อม reload หน้าเว็บอัตโนมัติ

> **หมายเหตุสำหรับ Engineer:** วิธีตรวจ structure เบื้องต้น — ให้ตรวจว่า parsed object มี key ใดๆ ที่ขึ้นต้นด้วย `memory_` หรือ `setting_` อย่างน้อย 1 key; หากไม่มีเลยให้ถือว่าไฟล์ไม่ถูกต้อง

---

## 3. โครงสร้างข้อมูลคลังคำศัพท์ (Data & Schema Requirements)

### 3.1 ข้อกำหนดเกี่ยวกับฟิลด์ Romaji

- เพิ่มฟิลด์ `romaji` เข้าไปในอ็อบเจกต์ `example_sentence` เพื่อรองรับผู้เรียนระดับเริ่มต้น
- **เงื่อนไขข้อมูล (Data Constraint):** การสะกด Romaji ในประโยคตัวอย่าง จะต้อง **"เว้นวรรคแยกตามคำ/คำช่วย"** เสมอ (เช่น `watashi wa ie de...`) ห้ามเขียนติดกันเป็นปูพืด
- **การแสดงผล:** ขึ้นอยู่กับสถานะ `setting_romaji_visible` ใน LocalStorage — ดู Section 5.1

### 3.2 ข้อกำหนดฟิลด์ระดับความจำ (Memory Level Field) — **Phase 2**

> **⚠️ Phase 2 Feature:** ระบบ Memory Level (ทั้ง Kana และ Vocab) ถูกย้ายออกจาก MVP ไปเป็น Phase 2 ทั้งหมด — ใน MVP ไม่มี UI ให้ผู้ใช้กด และไม่มีการคำนวณ Progress จาก memory level

**สำหรับ Engineer:** ไม่ต้องทำ LocalStorage key `memory_{id}` ในเฟสนี้ — เว้นที่ไว้สำหรับ Phase 2 เท่านั้น

**Enum mapping (สำหรับอ้างอิงใน Phase 2):**

| ค่า (Value) | Label แสดงผล | ไอคอนดาว | สีแสดงผล (แนะนำ) |
|------------|-------------|---------|----------------|
| `0` | ไม่รู้ | — | แดง / ไม่มีสี |
| `1` | พอรู้ | ⭐ | เหลือง |
| `2` | จำได้ | ⭐⭐⭐ | เขียว |

- **Storage Key Pattern (Phase 2):** `memory_{id}` ใน LocalStorage เช่น `memory_v_n5_0001 = 1`
- **Interaction (Phase 2):** ผู้เรียนคลิกวนระหว่าง `0 → 1 → 2 → 0` และบันทึกลง LocalStorage ทันที

### 3.3 โครงสร้างโมเดลตัวอย่าง (JSON Skeleton)

#### vocab.json (ไม่มี vocabulary — มีเฉพาะ kana และ inspirations)

```json
{
  "inspirations": [
    {
      "text": "การเรียนภาษาไม่ใช่การท่องจำ แต่คือการสร้างความคุ้นเคย",
      "author": "เซนเซ"
    }
  ],
  "kana": [
    {
      "id": "k_h_ha",
      "type": "hiragana",
      "row_group": "ha",
      "character": "は",
      "romaji": "ha",
      "thai_reading": "ฮะ",
      "thai_trick": "ฝั่งซ้ายเป็นเสา ฝั่งขวามีห่วงกลมๆ ...",
      "stroke_order_path": "assets/strokes/h_ha.gif",
      "variants": {
        "dakuten":    { "id": "k_h_ba", "character": "ば", "romaji": "ba", "thai_reading": "บะ", "stroke_order_path": "assets/strokes/h_ba.gif" },
        "handakuten": { "id": "k_h_pa", "character": "ぱ", "romaji": "pa", "thai_reading": "ปะ", "stroke_order_path": "assets/strokes/h_pa.gif" }
      }
    }
  ],
  "yoon": [
    { "id": "y_h_kya", "type": "hiragana", "character": "きゃ", "romaji": "kya", "thai_reading": "เคียะ", "base_id": "k_h_ki",  "marker": "ya", "voicing": "plain" },
    { "id": "y_h_gya", "type": "hiragana", "character": "ぎゃ", "romaji": "gya", "thai_reading": "เกียะ", "base_id": "k_h_ki",  "marker": "ya", "voicing": "dakuten" },
    { "id": "y_h_ja",  "type": "hiragana", "character": "じゃ", "romaji": "ja",  "thai_reading": "จะ",    "base_id": "k_h_shi", "marker": "ya", "voicing": "dakuten" },
    { "id": "y_h_pya", "type": "hiragana", "character": "ぴゃ", "romaji": "pya", "thai_reading": "เปียะ", "base_id": "k_h_hi",  "marker": "ya", "voicing": "handakuten" }
  ],
  "yoon_markers": [
    { "id": "k_h_ya_small", "type": "hiragana", "character": "ゃ", "romaji": "ya", "thai_reading": "ยะ (เล็ก)", "is_small": true }
  ]
}
```

> **หมายเหตุ:** ตัวอย่างด้านบนตัดมาบางส่วน — โครงสร้างเต็มดู Section 3.4 (ตัวฐานที่ไม่รองรับ modifier ใดจะ **ไม่มี** key นั้นใน `variants` เลย เช่น `あ` ไม่มี `variants`)

#### vocab_nX.json (ตัวอย่าง — โครงสร้างเดียวกันทุกไฟล์ N5/N4/N3/N2)

```json
[
  {
    "id": "v_n5_0001",
    "kana": "ねこ",
    "kanji": "猫",
    "romaji": "neko",
    "thai_reading": "เนโกะ",
    "thai_meaning": "แมว",
    "category": "noun_animal",
    "jlpt_level": "N5",
    "context_tag": "ชีวิตประจำวันทั่วไป",
    "linked_grammar": ["て-form", "〜ている"],
    "example_sentence": {
      "japanese": "私は家で白い猫を飼っています。",
      "romaji": "watashi wa ie de shiroi neko wo katte imasu",
      "thai": "ฉันเลี้ยงแมวสีขาวไว้ที่บ้านครับ"
    }
  }
]
```

> **Field Reference — vocab_nX.json:**
>
> | Field | Type | หมายเหตุ |
> |-------|------|---------|
> | `id` | String | unique key เช่น `v_n5_0001` (4-digit suffix) |
> | `kana` | String | การอ่านภาษาญี่ปุ่น (ฮิรางานะ/คาตากานะ) |
> | `kanji` | String \| null | คันจิ — หากไม่มีคันจิให้ใช้ `null`; render เป็น `-` ในทุก UI ที่แสดง kanji |
> | `romaji` | String | เสียงอ่านโรมาจิของคำศัพท์ |
> | `thai_reading` | String | คำอ่านภาษาไทย |
> | `thai_meaning` | String | ความหมายภาษาไทย |
> | `category` | String | หมวดหมู่คำศัพท์ ใช้ English snake_case (เช่น `noun_time`, `noun_animal`) — **MVP แสดง raw value ตรงๆ** ไม่แปลงเป็น Thai label; mapping table จะกำหนดใน Phase 2 (ดู Section 6.7) |
> | `jlpt_level` | String | `"N5"` / `"N4"` / `"N3"` / `"N2"` |
> | `context_tag` | String | บริบทการใช้งาน (เผื่อไว้สำหรับ Section 6.1) |
> | `linked_grammar` | Array | ไวยากรณ์ที่เกี่ยวข้อง (เผื่อไว้สำหรับ Section 6.5 — **ไม่ต้องแสดงผลในเฟส MVP**) |
> | `example_sentence.japanese` | String | ประโยคตัวอย่างภาษาญี่ปุ่น |
> | `example_sentence.romaji` | String | โรมาจิของประโยคตัวอย่าง เว้นวรรคแยกตามคำ |
> | `example_sentence.thai` | String | คำแปลประโยคตัวอย่างภาษาไทย |

> **หมายเหตุสำหรับ Engineer:**
> - **Fetch path:** ไฟล์ทุกไฟล์อยู่ใน `/data/` เสมอ เช่น `fetch('/data/vocab.json')`, `fetch('/data/vocab_n5.json')`
> - ไฟล์ `vocab_nX.json` ต้องเป็น **JSON Array `[]` ตรงๆ** (ไม่ใช่ Object ห่อ) เพื่อให้ concat ข้ามไฟล์ได้สะดวกเมื่อผู้ใช้เลือกหลายระดับพร้อมกัน
> - `memory_level` เป็น Phase 2 feature — ไม่อยู่ใน JSON และไม่ต้อง implement ใน MVP
> - `linked_grammar` เผื่อไว้สำหรับ Grammar Module ในอนาคต (Section 6.5) — ในเฟส MVP ไม่ต้องแสดงผล field นี้

---

### 3.4 โครงสร้าง Kana Variant — Dakuten / Handakuten / Yoon

ระบบใช้สถาปัตยกรรม 2 รูปแบบ ตามธรรมชาติของ modifier แต่ละชนิด:

| Modifier | ธรรมชาติ | จำนวน/script | เก็บที่ไหน |
|----------|----------|--------------|-----------|
| Dakuten (゛) | เครื่องหมายกำกับ "ในตัว" kana เดิม (1 ตัว → 1 ตัว) เช่น か→が | 20 | **nested** ใน `kana[].variants.dakuten` |
| Handakuten (゜) | เครื่องหมายกำกับในตัว (เฉพาะวรรค は) เช่น は→ぱ | 5 | **nested** ใน `kana[].variants.handakuten` |
| Yoon (拗音) | **ประกอบ kana 2 ตัว** (ฐานเสียง i + ตัวเล็ก ゃゅょ) เป็นหน่วยใหม่ เช่น き+ゃ→きゃ | 33 | **flat collection** `yoon[]` แยกออกมา |

> **เหตุผลเชิงการสอน:** ผู้เรียนท่อง "ตารางทับเสียง" เป็นหน่วยเดียว (อ่าน きゃ รวด ไม่ได้คิดว่า き+dakuten+ゃ) — โครงสร้าง flat ตรงกับตารางในตำรา (Genki / Minna) มากที่สุด ส่วน dakuten/handakuten เป็นแค่ตัวฐานที่ถูก "แต้มจุด" จึง nest ในตัวฐานเป็นธรรมชาติกว่า

> **ขอบเขต:** ตัด ぢゃ / ぢゅ / ぢょ (yoon ของ ぢ) ออก — ชุด Yoon จึงเหลือ **33 รูป/script** ตรงตามตารางมาตรฐาน

#### Single Source of Truth = presence ของ key
- มี key `variants.dakuten` = ตัวนั้นรองรับ Dakuten; ไม่มี key = ไม่รองรับ → render **30% opacity** (ดู Section 4.2)
- มี key `variants.handakuten` = รองรับ Handakuten; ไม่มี = ไม่รองรับ
- **ไม่ต้อง** เก็บ boolean flag ซ้ำ (เช่น `has_dakuten: false`) เพื่อกัน data drift

#### Field Reference — `kana[].variants.{dakuten|handakuten}`

| Field | Type | หมายเหตุ |
|-------|------|---------|
| `id` | String | unique key ของรูปแปลง เช่น `k_h_ga`, `k_h_pa` — รองรับ Memory Level Phase 2 (`memory_{id}`) |
| `character` | String | ตัวอักษรรูปแปลง เช่น `が`, `ぱ` |
| `romaji` | String | **เก็บค่าจริง ห้าม derive** — มีข้อยกเว้น เช่น し→じ = `ji` (ไม่ใช่ `zi`), つ→づ = `zu` |
| `thai_reading` | String | คำอ่านไทย (ครูยืนยันแล้ว) |
| `stroke_order_path` | String | GIF ลำดับขีดของ glyph รูปแปลง (が มีลำดับขีดต่างจาก か) — ใช้ Stroke Order Fallback เดิม (Section 4.2.1) หากไฟล์ยังไม่มี |
| `rare` | Boolean (optional) | `true` เฉพาะ ぢ / づ ซึ่งเป็นเสียงหายาก — UI อาจเลือก de-emphasize หรือซ่อนได้ |

#### Field Reference — `yoon[]` (flat collection)

| Field | Type | หมายเหตุ |
|-------|------|---------|
| `id` | String | เช่น `y_h_kya` (hira), `y_k_kya` (kata) |
| `type` | String | `"hiragana"` / `"katakana"` |
| `character` | String | รูปประกอบเสร็จแล้ว เช่น `きゃ` — render ตรงๆ ไม่ต้อง concat |
| `romaji` | String | **เก็บค่าจริง ห้าม derive** — し系/ち系/じ系 ผิดสูตร เช่น しゃ=`sha`, ちゃ=`cha`, じゃ=`ja` |
| `thai_reading` | String | คำอ่านไทย (ครูยืนยันแล้ว) |
| `base_id` | String | ชี้กลับตัวฐาน gojūon (เช่น ぎゃ → `k_h_ki`) สำหรับ query "ติ๊ก base ตัวนี้แล้วได้ yoon อะไร" |
| `marker` | String | `"ya"` / `"yu"` / `"yo"` — ใช้จัดเรียงคอลัมน์ตาราง Yoon |
| `voicing` | String | `"plain"` / `"dakuten"` / `"handakuten"` — ใช้จัดเรียงแถว (plain ก่อน ตามด้วยเสียงก้อง) |

> **กฎ romaji ที่ derive ไม่ได้ (ต้องเก็บค่าจริงทุกตัว):**
> - し → sha / shu / sho (ไม่ใช่ shya)
> - ち → cha / chu / cho (ไม่ใช่ chya)
> - じ → ja / ju / jo (ไม่ใช่ jya)
> - ส่วน き/に/ひ/み/り/ぎ/び/ぴ เป็นไปตามสูตรปกติ (kya, nya, gya, pya ...)

#### Field Reference — `yoon_markers[]` (ตัวเล็ก ゃゅょ)

| Field | Type | หมายเหตุ |
|-------|------|---------|
| `id` | String | เช่น `k_h_ya_small` |
| `character` | String | `ゃ` / `ゅ` / `ょ` (เวอร์ชันตัวเล็ก) |
| `romaji`, `thai_reading` | String | สำหรับแสดงตัวเล็กโดดๆ ในตาราง |
| `is_small` | Boolean | `true` เสมอ — บอก UI ว่าเป็น small kana |

> **หมายเหตุสำหรับ Engineer:**
> - **โจทย์ "แสดง Yoon โดดๆ"** → ใช้ `yoon[]` entry (มี character/romaji/thai_reading ครบ) ส่วนตัวเล็กล้วนๆ ใช้ `yoon_markers[]`
> - **โจทย์ "ต่อท้ายอักษรอื่น"** → `yoon[].character` เป็นรูปประกอบเสร็จแล้ว แสดงได้ทันที; ถ้าต้องการ animate แบบ "ฐาน + ตัวเล็ก" ให้หยิบ `yoon_markers[].character` มาต่อ string ได้ แต่ **คำอ่านที่ถูกต้องต้องดึงจาก `yoon[]` เสมอ** (อย่า derive)
> - **Audio:** Web Speech API อ่าน `character` ที่ประกอบแล้ว (`が`, `きゃ`) ได้ตรงๆ ไม่ต้องเก็บข้อมูลเสียงเพิ่ม
> - **Yoon เสียงก้อง/handakuten** (ぎゃ じゃ びゃ ぴゃ) ตัวฐานที่อ้างจะมี `variants[voicing]` นั้นจริงเสมอ — ใช้ assert ตรวจ data integrity ได้


## 4. ข้อมูลจำเพาะฟีเจอร์หลัก (Core Feature Specifications - MVP)

### 4.1 ระบบ Dashboard หน้าหลัก (Dashboard & Progress Tracking)

- **Roadmap Indicator:** แสดงลำดับขั้นของการไต่ระดับภาษาญี่ปุ่นอย่างชัดเจน: `[Absolute Beginner] ➔ [N5] ➔ [N4] ➔ [N3] ➔ [N2 (Goal)]`
- **Inspiration Widget:** วิดเจ็ตสุ่มแสดงข้อความให้กำลังใจจาก array `inspirations` ใน `vocab.json` ทุกครั้งที่มีการรีโหลดหน้าเว็บ

#### Progress Bar ส่วนที่ 1 — Kana Progress — **Phase 2**

> **⚠️ Phase 2 Feature:** Progress Bar ของ Kana ขึ้นอยู่กับ Memory Level system ซึ่งถูกย้ายไป Phase 2 แล้ว — **ใน MVP ไม่ต้องแสดง Kana Progress Bar**

#### Progress Bar ส่วนที่ 2 — JLPT Vocab Progress — **Phase 2**

> **⚠️ Phase 2 Feature:** Progress Bar ของ Vocab ขึ้นอยู่กับ Memory Level system ซึ่งถูกย้ายไป Phase 2 แล้ว — **ใน MVP ไม่ต้องแสดง JLPT Vocab Progress Bar**

#### Cold Start Behavior — **Phase 2**

> **⚠️ Phase 2 Feature:** Cold Start Behavior เป็นส่วนหนึ่งของ Vocab Progress Bar — ย้ายไป Phase 2 พร้อมกัน

#### Dashboard MVP Content

ใน MVP Dashboard แสดงเฉพาะ:

- **Roadmap Indicator:** แสดงลำดับขั้นของการไต่ระดับภาษาญี่ปุ่นอย่างชัดเจน: `[Absolute Beginner] ➔ [N5] ➔ [N4] ➔ [N3] ➔ [N2 (Goal)]`
- **Inspiration Widget:** วิดเจ็ตสุ่มแสดงข้อความให้กำลังใจจาก array `inspirations` ใน `/data/vocab.json` ทุกครั้งที่มีการรีโหลดหน้าเว็บ
- **Export / Import Progress:** ปุ่ม Export และ Import ตาม Section 2.3

### 4.2 มอดูลตารางอักษรแปลงร่าง (Dynamic Kana Master Table)

- **Responsive Layout Rules:** จัดกลุ่มตัวอักษรแยกตามวรรคมาตรฐานภาษาญี่ปุ่น หากเปิดบนหน้าจอมือถือ ต้องตัดบรรทัดลงมาด้านล่างได้ แต่ **"ห้ามเกิดการเลื่อนหน้าจอในแนวนอน (No Horizontal Scroll)"** เมื่อขึ้นวรรคใหม่ ระบบต้องขึ้นแถวใหม่ (New Row) เสมอ
- **Dynamic Modifier Checkboxes:** มี Checkbox 3 ตัว: **Dakuten (゛)**, **Handakuten (゜)**, **Yoon / เสียงควบ (ゃ ゅ ょ)** — เป็น filter/transform ของตารางอักษร โดยใช้ข้อมูลจาก Section 3.4 ตามนี้:
  - **Detection (presence-based):** ตัวฐานใดมี key `variants.dakuten` → รองรับ Dakuten; มี `variants.handakuten` → รองรับ Handakuten; การรองรับ Yoon ตรวจจาก `base_id` ใน collection `yoon[]` (แนะนำสร้าง `Set` ครั้งเดียวตอน init: `new Set(yoon.map(y => y.base_id))` แล้วเช็ค `.has(char.id)`)
  - **Disabled State:** ตัวฐานที่ไม่รองรับ modifier ที่ติ๊กอยู่ ต้องแสดงเป็น **Opacity 30%** (อ้างอิง presence ของ key — ห้าม hardcode รายชื่อตัวอักษร)
  - **Dakuten/Handakuten ON:** แทนที่ตัวฐานด้วย `variants.dakuten.character` / `variants.handakuten.character` (รวม romaji + thai_reading ของรูปแปลง)
  - **Yoon ON:** แสดงตาราง Yoon จาก `yoon[]` จัดเรียงด้วย `voicing` (plain → dakuten → handakuten) แล้ว `marker` (ya → yu → yo); หาก Dakuten ถูกติ๊กพร้อมกัน อาจ filter เหลือ `voicing !== "plain"` ได้ตามดีไซน์
  - **`rare` glyph:** ぢ / づ (มี `rare: true`) — UI อาจ de-emphasize หรือซ่อนได้ ไม่บังคับแสดง
  - **Stroke order:** Dakuten/Handakuten มี `stroke_order_path` (ใช้ Fallback เดิมหากไฟล์ยังไม่มี); **Yoon ไม่มี** stroke order
- **Interactive Controls & Sokuon Switch:** คลิกเพื่อฟังเสียงและดูแอนิเมชันลำดับขีด พร้อมปุ่มเปิด/ปิดเสียงกัก (っ) เพื่อเทียบคำศัพท์

#### 4.2.1 ข้อกำหนดระบบเสียง (Audio Specification)

- **Engine:** ใช้ Web Speech API (`window.speechSynthesis`) เท่านั้นในเฟสแรก — ไม่มีไฟล์เสียง .mp3/.ogg ในโปรเจกต์
- **Language Code:** ตั้งค่า `lang = "ja-JP"` เสมอเมื่อสร้าง `SpeechSynthesisUtterance`
- **Trigger:** เล่นเสียงทันทีเมื่อผู้ใช้คลิกที่ตัวอักษร (ไม่มี delay)
- **Fallback:** หากเบราว์เซอร์ไม่รองรับ Web Speech API (`!window.speechSynthesis`) ให้แสดง Error Popup แจ้งผู้ใช้ว่า "เบราว์เซอร์นี้ไม่รองรับการออกเสียงอัตโนมัติ กรุณาใช้ Chrome หรือ Safari"
- **Stroke Order Fallback:** หาก `stroke_order_path` โหลดไม่สำเร็จ (404 หรือ network error) ให้ **ซ่อน element แสดงลำดับขีดเงียบๆ** (`hidden`) โดยไม่แสดง error ใดๆ ต่อผู้ใช้ — ฟีเจอร์อื่นในตารางอักษร (คลิกฟังเสียง, แสดงคำอ่าน) ต้องยังทำงานได้ปกติ

> **หมายเหตุสำหรับ Engineer:** Web Speech API มีข้อจำกัดบน iOS Safari ในบางเวอร์ชัน ให้ตรวจสอบ `speechSynthesis.getVoices()` ว่ามี voice `ja-JP` หรือไม่ก่อน play เสมอ

### 4.3 มอดูลแฟลชการ์ดสุ่มอัจฉริยะ — Kana (Smart Kana Flashcard)

- **Scope:** แสดงเฉพาะ **Kana เท่านั้น** (Hiragana + Katakana)
- **Default State:** ซ่อนคำอ่านและกล่องเฉลยไว้ทั้งหมดเป็นค่าเริ่มต้น
- **Filter & Logic Shuffle System:** กรองอักษรและสุ่มแบบไม่ซ้ำซ้อนในรอบนั้น ๆ หากเปลี่ยน Filter ให้รีเซ็ตกองการ์ดใหม่ทั้งหมด
- **Reset Button (🔁):** ปุ่มสำหรับสุ่มกองการ์ดใหม่ทั้งหมดโดยไม่เปลี่ยน Filter ที่ตั้งไว้
- **Card Navigation:** แตะ/คลิกที่การ์ด (Tap to Next) เพื่อไปการ์ดถัดไป
- **Show Answer Button:** ปุ่มแยกต่างหากสำหรับเปิดกล่องเฉลย — ไม่ผูกกับการ Tap ไปการ์ดถัดไป
- **Answer Box Content:** แสดงครบ 2 ส่วน: (1) คำอ่านภาษาไทย (`thai_reading`) + Romaji (`romaji`) และ (2) `thai_trick` ทริกช่วยจำจากเซนเซ
- **Romaji ในกล่องเฉลย:** อยู่ภายใต้ Toggle Romaji — หาก `setting_romaji_visible = false` ให้ซ่อน Romaji ด้วย
- **Audio:** ใช้ Web Speech API (`ja-JP`) เล่นเสียงทันทีเมื่อกดปุ่ม 🔊 เพื่อฝึก Shadowing
- **Future Space (Hidden):** เตรียม placeholder HTML element สำหรับปุ่ม Audio Recording ซ่อนด้วย `hidden` class ของ Tailwind

#### 4.3.1 End of Deck State

เมื่อผู้ใช้ผ่านการ์ดครบทุกใบในรอบนั้นแล้ว ให้แสดงหน้า Summary แทนที่การ์ด ประกอบด้วย:

- ข้อความแจ้งว่าผ่านครบรอบแล้ว เช่น `"ครบรอบแล้ว! X ใบ"`
- ปุ่ม **"เล่นอีกรอบ"** — สุ่ม deck ใหม่โดยไม่เปลี่ยน Filter ที่ตั้งไว้ (behavior เดียวกับ Reset Button 🔁)

> **ห้าม** loop กลับไปการ์ดแรกอัตโนมัติโดยไม่แจ้ง เพราะผู้ใช้จะไม่รู้ว่าจบรอบแล้ว

### 4.4 มอดูลแฟลชการ์ดสุ่มอัจฉริยะ — Vocab (Smart Vocab Flashcard)

- **Scope:** แสดงคำศัพท์จากไฟล์ `vocab_nX.json` ตามระดับที่ผู้ใช้เลือก
- **โจทย์หน้าการ์ด:** แสดง `kana` / `kanji` — ผู้เรียนทาย `thai_meaning` (ความหมายภาษาไทย)
- **Default State:** ซ่อนกล่องเฉลยไว้เป็นค่าเริ่มต้น
- **Shuffle System:** สุ่มแบบไม่ซ้ำซ้อนในรอบนั้น ๆ จาก pool ของทุกระดับที่เลือกรวมกัน
- **Reset Button (🔁):** สุ่มกองการ์ดใหม่โดยไม่เปลี่ยน Level ที่เลือกไว้
- **Card Navigation:** แตะ/คลิกที่การ์ด (Tap to Next) เพื่อไปการ์ดถัดไป
- **Show Answer Button:** ปุ่มแยกต่างหากสำหรับเปิดกล่องเฉลย
- **Answer Box Content:** แสดงครบตามโครงสร้าง JSON ดังนี้:
  - `thai_meaning` — ความหมายภาษาไทย (แสดงเสมอ)
  - `thai_reading` — คำอ่านภาษาไทย (แสดงเสมอ)
  - `romaji` — เสียงอ่านโรมาจิ (แสดง/ซ่อนตาม Toggle Romaji)
  - `example_sentence.japanese` — ประโยคตัวอย่างภาษาญี่ปุ่น ตัวหนา ขนาดใหญ่ (แสดงเสมอ)
  - `example_sentence.romaji` — โรมาจิของประโยค สีเทา (แสดง/ซ่อนตาม Toggle Romaji)
  - `example_sentence.thai` — คำแปลประโยคภาษาไทย (แสดงเสมอ)
- **Audio:** ใช้ Web Speech API (`ja-JP`) เล่นเสียงทันทีเมื่อกดปุ่ม 🔊

#### 4.4.1 Level Selector Specification

- **Multi-select:** เลือกได้หลายระดับพร้อมกัน เช่น N5 + N4 + N3
- **Storage Key:** `setting_vocab_levels` (JSON Array) ใน LocalStorage เช่น `["N5","N4"]`
- **Default:** `["N5"]` สำหรับผู้ใช้ใหม่
- **Lazy Loading Trigger:** เมื่อผู้ใช้เลือกระดับใด ให้ fetch `vocab_nX.json` ของระดับนั้นทันที (หากยังไม่ได้โหลด)
- **UI Placement:** วางเป็น Collapsed Panel ที่ต้องกดขยายเพื่อเปิด — ไม่แสดงตลอดเวลาเพื่อไม่รบกวน UI การ์ดหลัก แสดงเพียง summary เช่น `"กำลังสุ่มจาก: N5, N4 (230 คำ)"` แทน

### 4.5 คลังคำศัพท์ส่วนตัว (Personalized Vocab Database)

- **Data Source:** ดึงข้อมูลจากไฟล์ `/data/vocab_nX.json` ทุกไฟล์ที่โหลดมาแล้ว
- **UI Structure:** ตาราง 4 คอลัมน์ได้แก่ อักษรญี่ปุ่น, คำอ่าน ไทย/โรมาจิ, ความหมาย, หมวดหมู่
- **Dynamic Search:** ค้นหา Real-time รองรับทั้งไทย, โรมาจิ, คานะ, และคันจิ — ค้นหาจาก field `kana`, `kanji`, `romaji`, `thai_meaning`, `thai_reading`
- **Kanji Null Render:** หาก `kanji = null` ให้แสดง `-` ในคอลัมน์อักษรญี่ปุ่น แทนที่จะแสดงว่างเปล่า
- **Category Display:** แสดง raw value จาก field `category` ตรงๆ (เช่น `noun_time`) — ไม่แปลงเป็น Thai label ใน MVP (mapping table จะกำหนดใน Phase 2 ดู Section 6.7)
- **Memory Level:** — **Phase 2** — ไม่มีคอลัมน์ระดับความจำใน MVP
- **Example Sentence:** แสดงประโยคตัวอย่างตาม Section 5.1 โดยอยู่ภายใต้ Toggle Romaji
- **Pagination:** ดู Section 4.6.4

### 4.6 UI State Specification

กำหนด state ที่ต้องรองรับในทุก module ที่มีการ fetch ข้อมูล

#### 4.6.1 Loading State

- **Trigger:** เริ่มทันทีเมื่อมีการเรียก `fetch()` สำหรับ `vocab_nX.json` แบบ Lazy
- **UI:** แสดง loading indicator (spinner หรือ skeleton) แทนที่ content จนกว่าจะโหลดเสร็จ
- **Scope:** ครอบคลุม Vocab Flashcard (Section 4.4) และ Vocab Table (Section 4.5)

#### 4.6.2 Error State

- **Trigger:** เมื่อ `fetch()` ล้มเหลว (network error, 404, timeout)
- **UI:** แสดง error pop-up พร้อมข้อความแจ้งผู้ใช้ เช่น "ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต" พร้อมปุ่ม "ลองใหม่อีกครั้ง"
- **Scope:** ครอบคลุมทุก module ที่มีการ fetch ข้อมูล

#### 4.6.3 Empty State

- **Trigger:** เมื่อผลการ Search ใน Vocab Table ไม่พบรายการใดเลย
- **UI:** แสดงข้อความ เช่น "ไม่พบคำศัพท์ที่ค้นหา" พร้อม icon หรือ illustration เล็กๆ
- **Scope:** Vocab Table (Section 4.5) เท่านั้น

#### 4.6.4 Pagination — Vocab Table

- **เกณฑ์:** แบ่ง page เมื่อรายการ **มากกว่า 50 items**
- **Items per page:** 50 items ต่อ page
- **UI Controls:** ปุ่ม Previous / Next และแสดงเลข page ปัจจุบัน เช่น `หน้า 2 / 14`
- **Search Reset:** เมื่อผู้ใช้พิมพ์ค้นหา ให้ reset กลับ page 1 อัตโนมัติ
- **Implementation:** Client-side ทั้งหมด — slice จาก array ที่โหลดไว้ใน memory ไม่มี server request เพิ่ม

---

## 5. การแสดงผลและการจัดวางหน้าจอ (UI/UX & Functional Requirements)

### 5.1 ข้อกำหนดการแสดงผลประโยคตัวอย่าง (Example Sentence Rendering)

ในส่วนจัดแสดงประโยคตัวอย่างของคำศัพท์แต่ละคำ ต้องจัดเรียงลำดับการแสดงผลแบบแนวดิ่ง (Vertical Stack) จากบนลงล่างอย่างเคร่งครัดดังนี้:

- **ประโยคภาษาญี่ปุ่น (`example_sentence.japanese`):** แสดงผลเสมอ เป็น **ตัวหนา (Bold)** ขนาดใหญ่เด่นชัดที่สุด
- **เสียงอ่าน Romaji (`example_sentence.romaji`):** แสดง/ซ่อนตามสถานะ `setting_romaji_visible` — หากเปิด แสดงใต้ประโยคภาษาญี่ปุ่นด้วยฟอนต์เล็ก **สีเทา (Muted/Gray)**
- **คำแปลภาษาไทย (`example_sentence.thai`):** แสดงผลเสมอ อยู่ล่างสุด

#### Toggle Romaji Specification

- **ตำแหน่งปุ่ม:** แสดงในตำแหน่งที่เข้าถึงได้ง่าย (แนะนำ: มุมบนของ Section หรือใน Navigation Bar)
- **Scope:** ครอบคลุมทุกจุดที่แสดง Romaji ในแอปทั้งหมด ได้แก่ ประโยคตัวอย่างใน Vocab, กล่องเฉลยใน Kana Flashcard และ Vocab Flashcard
- **Storage Key:** `setting_romaji_visible` (Boolean) ใน LocalStorage
- **Default:** `true` (เปิด) สำหรับผู้ใช้ใหม่
- **Persistence:** อ่านค่าจาก LocalStorage ทุกครั้งที่โหลดแอป ไม่ reset กลับ default

### 5.2 การรองรับหน้าจอแบบยืดหยุ่น (Responsive Design)

ต้องรองรับการแสดงผลที่สวยงาม ไม่ล้นจอ และอ่านง่ายทั้งบน Desktop และ Mobile บนหน้าจอมือถือ ข้อความ Romaji ที่เว้นวรรคจะต้องขึ้นบรรทัดใหม่อย่างเป็นธรรมชาติหากความยาวเกินขนาดความกว้างของหน้าจอ โดยไม่ทำให้กรอบ UI เบี้ยว

### 5.3 โครงสร้าง Navigation (Navigation Structure)

แอปพลิเคชันใช้ **Global Navigation** ที่ปรับตัวตามขนาดหน้าจอ ประกอบด้วย **5 Tab หลัก**:

```
[Logo: Nihongo N2]  🏠 หน้าหลัก  🔤 ตารางอักษร  ⚡ การ์ดสุ่ม  📖 ศัพท์สุ่ม  🍣 คลังศัพท์
```

| ลำดับ | Icon | Label | Hash | เนื้อหาหลัก |
|------|------|-------|------|------------|
| 1 | 🏠 | หน้าหลัก (Dashboard) | `#dashboard` | Progress Bar, Roadmap, Inspiration Widget, Export/Import |
| 2 | 🔤 | ตารางอักษร (Kana Master) | `#kana` | ตาราง Kana + Modifier Checkboxes + Sokuon Switch |
| 3 | ⚡ | การ์ดสุ่ม (Kana Flashcard) | `#flashcard` | Kana Flashcard |
| 4 | 📖 | ศัพท์สุ่ม (Vocab Flashcard) | `#vocab-flashcard` | Vocab Flashcard + Level Selector |
| 5 | 🍣 | คลังศัพท์ (Vocab) | `#vocab` | ตาราง Vocab + Search + Pagination |

**Desktop:** Top Navigation Bar แนวนอน Logo อยู่ซ้ายสุด เมนูอยู่ขวา

**Mobile:** Hamburger Menu (☰) Logo อยู่ซ้าย ปุ่ม ☰ อยู่ขวา กดแล้วเปิด Dropdown หรือ Side Drawer

**Routing:**
- **Method:** Hash-based Routing (`window.location.hash`) — ห้ามใช้ Path-based Routing เพราะ GitHub Pages จะ 404
- **Default:** เปิดแอปครั้งแรกแสดง `#dashboard` เสมอ
- **State Persistence:** จำ Hash ล่าสุดเป็น `setting_last_tab` ใน LocalStorage เพื่อ restore เมื่อ reload
- **Invalid Hash Fallback:** หาก `setting_last_tab` ที่อ่านได้จาก LocalStorage ไม่ตรงกับ hash ที่รู้จัก (ได้แก่ `#dashboard`, `#kana`, `#flashcard`, `#vocab-flashcard`, `#vocab`) ให้ fallback ไป `#dashboard` เสมอ — ห้าม render หน้าว่างหรือ throw error

### 5.4 CSS Architecture

- **Framework:** ใช้ **Tailwind CSS** via CDN (`<script src="https://cdn.tailwindcss.com">`) เพื่อความเรียบง่ายในการ deploy บน GitHub Pages
- **ข้อกำหนด:** ห้ามสร้าง custom `.css` file แยกต่างหาก — ให้ใช้ Tailwind utility classes ทั้งหมดโดยตรงใน HTML
- **เหตุผล:** Utility-first classes อยู่ติดกับ HTML ทำให้ AI และ Engineer อ่าน context ได้ครบในที่เดียว ง่ายต่อการแก้ไขในอนาคต
- **Custom config (ถ้าจำเป็น):** ใช้ `tailwind.config` inline ใน `<script>` tag ใน `index.html` เท่านั้น

---

## 6. โซนแผนงานในอนาคต (Future Backlog Features Zone)

*(สถาปัตยกรรมข้อมูล โครงสร้างฐานข้อมูลฟิลด์ และการจัดเลย์เอาต์หน้าเว็บในเฟส MVP จะต้องออกแบบเผื่อไว้เพื่อรองรับส่วนนี้โดยไม่ต้องรื้อระบบใหม่ภายหลัง)*

### 6.1 N2 Context Layer Schema

เตรียมฟิลด์ `context_tag` ในโมเดลคำศัพท์ไว้แล้วตั้งแต่วันแรก สำหรับการเรียนรู้บริบทการใช้คำศัพท์ระดับ N2 ในอนาคต

### 6.2 Audio Recording UX Space

ในส่วน Interface ของ Flashcard ทั้ง 2 โมดูล จัดวางปุ่ม HTML ซ่อนด้วย Tailwind class `hidden` รอฟีเจอร์ MediaRecorder API เพื่อให้ผู้เรียนอัดเสียงตัวเองเปรียบเทียบกับเสียงต้นฉบับ

### 6.3 SRS (Spaced Repetition System) Metadata Fields

เตรียม field `next_review_date` และ `interval_days` รอรับไว้ตั้งแต่วันแรก เพื่อให้สามารถเชื่อมอัลกอริทึม SRS เข้ามาได้ทันทีในเฟสถัดไปโดยไม่ต้องแก้ Schema เดิม

### 6.4 Premium Audio Engine

Web Speech API เหมาะสำหรับเฟสแรก แต่อาจทำให้สำเนียงผู้เรียนเพี้ยนในระดับ N2 ขึ้นไป ในอนาคตควรพิจารณา: คลังเสียงมนุษย์จริง, Google Cloud TTS, หรือ OpenAI Audio API

> **ข้อกำหนดสำหรับ Engineer:** ออกแบบ Audio Module แบบ Pluggable ตั้งแต่เฟสแรกเพื่อให้ swap engine ได้โดยไม่ต้องแก้ส่วนอื่น

### 6.5 Grammar Notes / Sentence Patterns Module

ฟิลด์ `linked_grammar` ในทุก vocab object เตรียมไว้แล้ว (Section 3.3) สำหรับโมดูล Grammar Notes ที่จะเพิ่มในอนาคต ครอบคลุม Sentence Patterns และโครงสร้างประโยคระดับ N2 โดยไม่ต้องแก้ Schema เดิม

### 6.6 Session Score & Statistics

เนื่องจาก `jlpt_level` คงไว้ใน vocab object ทุกไฟล์ ในอนาคตสามารถต่อยอดเป็นระบบสถิติรายรอบได้ทันที เช่น:

- นับจำนวนการ์ดที่ตอบถูก/ผิดในแต่ละ Session
- คะแนนสนุก ๆ รายรอบแยกตาม JLPT Level
- สถิติส่วนตัวว่าระดับไหนยังอ่อนอยู่

### 6.7 Category Display Mapping (Phase 2)

ใน MVP ค่า `category` จะแสดง raw value เช่น `noun_time` ตรงๆ ใน Vocab Table

ใน Phase 2 จะเพิ่ม configuration file แยก (เช่น `categories.json`) เพื่อ mapping raw value → Thai display label ตัวอย่างเช่น:

```json
{
  "noun_time": "คำนาม — เวลา",
  "noun_animal": "คำนาม — สัตว์",
  "verb_motion": "คำกริยา — การเคลื่อนไหว"
}
```

Engineer ควรออกแบบ Category column ให้ผ่าน mapping function ตั้งแต่แรก โดยใน MVP ให้ fallback เป็น raw value เมื่อไม่พบ mapping

### 6.8 Memory Level System (Phase 2)

ระบบ Memory Level ทั้ง Kana และ Vocab ถูกย้ายมาเป็น Phase 2 ทั้งหมด ประกอบด้วย:

- **Kana Memory Level UI:** ปุ่มกดใน Kana Master Table และ/หรือ Kana Flashcard เพื่อให้ user อัปเดต memory level ของแต่ละตัวอักษร
- **Vocab Memory Level UI:** คอลัมน์ระดับความจำใน Vocab Table พร้อม interaction คลิกวน `0 → 1 → 2 → 0`
- **Dashboard Progress Bars:** Kana Progress Bar และ JLPT Vocab Progress Bar ที่คำนวณจาก `memory_level = 2`
- **Cold Start Behavior:** การจัดการ Progress Bar ของ vocab ระดับที่ยังไม่ได้โหลดไฟล์
- **LocalStorage Key:** `memory_{id}` เช่น `memory_v_n5_0001 = 1`, `memory_k_h_a = 2`
- **รองรับ Variant แล้ว:** ทุก variant (dakuten/handakuten) และ yoon มี `id` ของตัวเอง (เช่น `memory_k_h_ga`, `memory_y_h_kya`) จึงต่อ Memory Level ได้ทันทีโดยไม่ต้องแก้ schema (ดู Section 3.4)

Enum mapping อ้างอิง Section 3.2

---

## 7. โครงสร้างไฟล์ (Folder & File Structure)

```
nihongo-n2-journey/
│
├── index.html                  # Entry point, Tailwind CDN, routing, nav bar
│
├── data/                       # ข้อมูล JSON ทั้งหมด
│   ├── vocab.json              # kana + inspirations (Eager load)
│   ├── vocab_n5.json           # คำศัพท์ N5 ~800 คำ (Lazy load)
│   ├── vocab_n4.json           # คำศัพท์ N4 ~600 คำ (Lazy load)
│   ├── vocab_n3.json           # คำศัพท์ N3 ~3000 คำ (Lazy load)
│   └── vocab_n2.json           # คำศัพท์ N2 ~1700 คำ (Lazy load)
│
├── assets/                     # ไฟล์ static
│   ├── strokes/                # GIF ลำดับขีด Kana แต่ละตัว
│   │   ├── h_a.gif
│   │   ├── h_i.gif
│   │   └── ...
│   └── favicon.ico
│
└── js/                         # JavaScript modules
    ├── app.js                  # Router, init, LocalStorage merge
    ├── audio.js                # Pluggable audio module (Web Speech API)
    ├── dashboard.js            # Progress bar, inspiration widget
    ├── kana.js                 # Kana table, modifier filter
    ├── flashcard.js            # Kana + Vocab flashcard, shuffle
    └── vocab.js                # Vocab table, search, pagination
```

> **หมายเหตุสำหรับ Engineer:** ไม่มี `css/` directory — ใช้ Tailwind CSS utility classes ทั้งหมดโดยตรงใน HTML (ดู Section 5.4)
