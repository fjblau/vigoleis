# Technical Specification: Understanding Existing WordPress Content Export

## Difficulty Assessment
**Medium** - The task involves parsing a well-structured WordPress XML export, extracting and organizing content by sections (categories), and potentially transforming it for future use. Moderate complexity due to XML parsing, HTML content handling, and data organization requirements.

## Technical Context

### Source Data
- **File**: `vigoleis_wordpress.xml` (9,884 lines)
- **Format**: WordPress eXtended RSS (WXR) v1.2
- **Website**: vigoleis.de (Albert Vigoleis Thelen literary website)
- **Language**: German (de-DE)
- **Export Date**: January 13, 2026

### Content Statistics
- **Total Items**: 139
  - **Posts**: 72 (news/blog entries)
  - **Pages**: 67 (static content)
- **Status**: All 139 items are published
- **Categories**: 5 main sections
  1. News (news)
  2. Der Autor (autor)
  3. Shop (shop)
  4. Wörterbuch (woerterbuch)
  5. Kontakt (kontakt)

### Data Structure
Each item contains:
- `<title>` - Post/page title
- `<link>` - Original URL
- `<pubDate>` - Publication date
- `<content:encoded>` - HTML content in CDATA
- `<wp:post_type>` - Type (post/page)
- `<wp:post_id>` - Unique ID
- `<wp:status>` - Publication status
- `<category>` - Category assignments
- Various metadata (dates, author, comment status, etc.)

### Content Characteristics
- HTML markup within CDATA sections
- Mixed formatting (paragraphs, lists, line breaks)
- German language text
- Dates spanning 2004-2026
- Shop items with pricing information
- Literary/biographical content

## Implementation Approach

### Technology Stack
- **Language**: Python (recommended for XML/HTML parsing)
- **Dependencies**:
  - `xml.etree.ElementTree` or `lxml` - XML parsing
  - `BeautifulSoup4` - HTML content cleaning
  - `json` - Data output/storage
  - Optional: `pandas` - Data analysis/organization

### Processing Strategy: Section-by-Section

The user wants to process content "one section at a time", which maps to the 5 WordPress categories:

1. **News** (72 posts) - News articles and updates
2. **Der Autor** (subset of pages) - Author biography/information
3. **Shop** (subset of pages) - Books, merchandise, artwork listings
4. **Wörterbuch** (subset of pages) - Dictionary/glossary entries
5. **Kontakt** (subset of pages) - Contact information

### Core Functionality

#### Phase 1: XML Parsing & Extraction
- Parse WordPress XML export
- Extract all items with metadata
- Organize items by category and type
- Handle CDATA sections properly

#### Phase 2: Content Organization
- Group content by category (section)
- Sort by date, relevance, or hierarchy
- Extract clean text from HTML
- Preserve important metadata (dates, IDs, URLs)

#### Phase 3: Output Generation
- Create structured data files per section
- Generate summary reports
- Maintain original content structure
- Enable section-by-section review

## Source Code Structure

### Files to Create

```
/
├── vigoleis_wordpress.xml          (existing - source data)
├── parse_wordpress.py              (main parser script)
├── requirements.txt                (Python dependencies)
├── output/                         (generated data directory)
│   ├── sections/
│   │   ├── news.json
│   │   ├── autor.json
│   │   ├── shop.json
│   │   ├── woerterbuch.json
│   │   └── kontakt.json
│   ├── summary.json                (content statistics)
│   └── all_content.json            (complete export)
└── .gitignore                      (ignore output directory)
```

### Key Components

#### 1. `parse_wordpress.py`
Main parser script with functions:
- `parse_wordpress_xml(file_path)` - Parse WXR file
- `extract_item_data(item_element)` - Extract item metadata
- `clean_html_content(html)` - Strip/clean HTML tags
- `organize_by_category()` - Group items by section
- `export_section(section_name, items)` - Write section to JSON
- `generate_summary()` - Create content statistics

#### 2. `requirements.txt`
```
lxml>=4.9.0
beautifulsoup4>=4.11.0
```

## Data Model

### Section Data Structure (JSON)
```json
{
  "section": "news",
  "total_items": 72,
  "date_range": {
    "earliest": "2004-06-15",
    "latest": "2025-12-30"
  },
  "items": [
    {
      "id": 1,
      "title": "Post title",
      "date": "2025-12-30",
      "type": "post",
      "category": "news",
      "url": "https://vigoleis.de/...",
      "content_html": "<p>Original HTML content</p>",
      "content_text": "Clean text content",
      "word_count": 245
    }
  ]
}
```

### Summary Data Structure
```json
{
  "total_items": 139,
  "posts": 72,
  "pages": 67,
  "sections": {
    "news": {"count": 72, "type": "post"},
    "autor": {"count": 15, "type": "page"},
    "shop": {"count": 35, "type": "page"},
    "woerterbuch": {"count": 10, "type": "page"},
    "kontakt": {"count": 7, "type": "page"}
  },
  "date_range": "2004-06-15 to 2026-01-13",
  "language": "de-DE"
}
```

## Verification Approach

### Testing Strategy
1. **XML Parsing Validation**
   - Verify all 139 items are extracted
   - Check namespace handling for WordPress elements
   - Validate CDATA content extraction

2. **Content Integrity**
   - Compare item counts per category
   - Verify HTML content is preserved
   - Check metadata completeness

3. **Section Organization**
   - Confirm all 5 sections are created
   - Verify item categorization accuracy
   - Check for orphaned/uncategorized items

4. **Output Quality**
   - Validate JSON structure
   - Check file encoding (UTF-8 for German text)
   - Verify data completeness

### Manual Verification Steps
1. Run parser: `python parse_wordpress.py`
2. Check output files exist in `output/sections/`
3. Review `output/summary.json` for statistics
4. Spot-check 2-3 items per section for accuracy
5. Verify German characters (ä, ö, ü, ß) render correctly

### Success Criteria
- ✅ All 139 items successfully parsed
- ✅ 5 section files created with correct item counts
- ✅ Summary statistics match source data
- ✅ HTML and text content properly extracted
- ✅ German text encoding preserved
- ✅ No data loss during parsing

## Next Steps

After specification approval, the implementation will:
1. Set up Python environment with dependencies
2. Create parsing script with section-by-section extraction
3. Generate output files for each section
4. Provide summary report of processed content
5. Enable user to review one section at a time
6. Prepare for potential content migration/transformation

## Questions for Clarification

1. **Output Format**: Is JSON acceptable, or would you prefer CSV, Markdown, or another format?
2. **HTML Content**: Should HTML be preserved, converted to Markdown, or extracted as plain text?
3. **Section Priority**: Which section should be processed/reviewed first?
4. **Future Use**: Will this data be imported into a new CMS, static site generator, or other platform?
5. **Content Filtering**: Should draft/unpublished content be excluded? (All items are currently published)
