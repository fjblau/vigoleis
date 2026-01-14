#!/usr/bin/env python3
"""
WordPress XML to Sanity NDJSON Converter
Converts WordPress export to Sanity-compatible NDJSON format
"""

import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import hashlib


class WordPressToSanity:
    """Convert WordPress XML export to Sanity NDJSON format"""
    
    WP_NS = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }
    
    def __init__(self, xml_file: str, output_dir: str = "output"):
        self.xml_file = xml_file
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.categories = {}
        self.authors = {}
        
    def generate_id(self, type_name: str, identifier: str) -> str:
        """Generate a deterministic Sanity document ID"""
        hash_obj = hashlib.md5(f"{type_name}-{identifier}".encode())
        return hash_obj.hexdigest()[:24]
    
    def html_to_portable_text(self, html: str, title: str = '') -> List[Dict[str, Any]]:
        """Convert HTML to Sanity Portable Text format"""
        if not html or not html.strip():
            return []
        
        soup = BeautifulSoup(html, 'html5lib')
        
        text = soup.get_text('\n')
        lines = text.split('\n')
        
        content_start = 0
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            if line_stripped.startswith('·') and title and title in line_stripped:
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                if j < len(lines) and re.match(r'\d{2}\.\d{2}\.\d{4}', lines[j].strip()):
                    content_start = j + 1
                    while content_start < len(lines) and not lines[content_start].strip():
                        content_start += 1
                    break
        
        if content_start == 0:
            content_start = 0
        
        content_lines = lines[content_start:]
        
        paragraphs = []
        current_para = []
        
        for line in content_lines:
            line = line.strip()
            
            if not line:
                if current_para:
                    para_text = ' '.join(current_para)
                    if para_text and not self._is_navigation_text(para_text):
                        paragraphs.append(para_text)
                    current_para = []
            elif not self._is_navigation_text(line):
                current_para.append(line)
        
        if current_para:
            para_text = ' '.join(current_para)
            if para_text and not self._is_navigation_text(para_text):
                paragraphs.append(para_text)
        
        blocks = []
        for para in paragraphs:
            if para:
                blocks.append(self._create_text_block(para))
        
        return blocks if blocks else [self._create_text_block("")]
    
    def _is_navigation_text(self, text: str) -> bool:
        """Check if text is navigation/pagination content"""
        text = text.strip()
        
        if not text or len(text) > 500:
            return False
        
        if text in ['•', '·', '›', '»', '«', '‹']:
            return True
        
        if re.match(r'^[\d\s›»«‹\[\]]+$', text):
            return True
        
        if text.startswith('Mehr:') or text.startswith('[') and text.endswith(']'):
            return True
        
        if re.match(r'^\d{2}\.\d{2}\.\d{4}$', text):
            return True
        
        return False
    
    def _create_text_block(self, text: str, style: str = 'normal') -> Dict[str, Any]:
        """Create a standard text block"""
        return {
            '_type': 'block',
            '_key': self._generate_key(),
            'style': style,
            'markDefs': [],
            'children': [
                {
                    '_type': 'span',
                    '_key': self._generate_key(),
                    'text': text,
                    'marks': []
                }
            ]
        }
    
    def _create_heading_block(self, text: str, level: int) -> Dict[str, Any]:
        """Create a heading block"""
        style = f'h{level}'
        return self._create_text_block(text, style)
    
    def _create_list_blocks(self, items: List[str], list_type: str) -> List[Dict[str, Any]]:
        """Create list item blocks"""
        blocks = []
        for item in items:
            block = {
                '_type': 'block',
                '_key': self._generate_key(),
                'style': 'normal',
                'listItem': list_type,
                'markDefs': [],
                'children': [
                    {
                        '_type': 'span',
                        '_key': self._generate_key(),
                        'text': item,
                        'marks': []
                    }
                ],
                'level': 1
            }
            blocks.append(block)
        return blocks
    
    def _generate_key(self) -> str:
        """Generate a random key for Portable Text elements"""
        import random
        import string
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
    
    def create_slug(self, title: str, post_id: str) -> str:
        """Create a URL-friendly slug"""
        slug = title.lower()
        slug = re.sub(r'[äÄ]', 'ae', slug)
        slug = re.sub(r'[öÖ]', 'oe', slug)
        slug = re.sub(r'[üÜ]', 'ue', slug)
        slug = re.sub(r'ß', 'ss', slug)
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        
        if not slug:
            slug = f'post-{post_id}'
        
        return slug[:96]
    
    def parse_date(self, date_str: str) -> Optional[str]:
        """Parse WordPress date to ISO format"""
        try:
            dt = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
            return dt.isoformat() + 'Z'
        except:
            return None
    
    def create_category_document(self, name: str, slug: str) -> Dict[str, Any]:
        """Create a Sanity category document"""
        cat_id = self.generate_id('category', slug)
        
        return {
            '_id': cat_id,
            '_type': 'category',
            'title': name,
            'slug': {
                'current': slug,
                '_type': 'slug'
            },
            'description': ''
        }
    
    def create_author_document(self, name: str) -> Dict[str, Any]:
        """Create a Sanity author document"""
        author_id = self.generate_id('author', name)
        
        return {
            '_id': author_id,
            '_type': 'author',
            'name': name
        }
    
    def parse_item(self, item: ET.Element) -> Optional[Dict[str, Any]]:
        """Parse a WordPress item and convert to Sanity post"""
        
        title = item.find('title').text if item.find('title') is not None else 'Untitled'
        post_type = item.find('wp:post_type', self.WP_NS)
        post_id = item.find('wp:post_id', self.WP_NS)
        
        if post_type is None or post_id is None:
            return None
        
        if post_type.text != 'post':
            return None
        
        status = item.find('wp:status', self.WP_NS)
        if status is None or status.text != 'publish':
            return None
        
        category_elem = item.find('category[@domain="category"]')
        if category_elem is None:
            return None
        
        category_name = category_elem.text
        category_slug = category_elem.get('nicename', '')
        
        content_elem = item.find('content:encoded', self.WP_NS)
        content_html = content_elem.text if content_elem is not None and content_elem.text else ''
        
        date_elem = item.find('wp:post_date', self.WP_NS)
        date_str = date_elem.text if date_elem is not None else None
        
        author_elem = item.find('dc:creator', self.WP_NS)
        author_name = author_elem.text if author_elem is not None else 'Unknown'
        
        slug = self.create_slug(title, post_id.text)
        
        if category_slug not in self.categories:
            self.categories[category_slug] = self.create_category_document(category_name, category_slug)
        
        if author_name not in self.authors:
            self.authors[author_name] = self.create_author_document(author_name)
        
        content_blocks = self.html_to_portable_text(content_html, title)
        
        excerpt_elem = item.find('excerpt:encoded', self.WP_NS)
        excerpt = excerpt_elem.text if excerpt_elem is not None and excerpt_elem.text else ''
        if not excerpt and content_blocks:
            first_block = content_blocks[0]
            if first_block.get('children'):
                excerpt = first_block['children'][0].get('text', '')[:200]
        
        post_doc = {
            '_id': self.generate_id('post', post_id.text),
            '_type': 'post',
            'title': title,
            'slug': {
                'current': slug,
                '_type': 'slug'
            },
            'content': content_blocks,
            'excerpt': excerpt,
            'category': {
                '_type': 'reference',
                '_ref': self.categories[category_slug]['_id']
            },
            'author': {
                '_type': 'reference',
                '_ref': self.authors[author_name]['_id']
            }
        }
        
        if date_str:
            parsed_date = self.parse_date(date_str)
            if parsed_date:
                post_doc['date'] = parsed_date
        
        return post_doc
    
    def parse_wordpress_xml(self, category_filter: str = 'news') -> List[Dict[str, Any]]:
        """Parse WordPress XML and extract items from specified category"""
        
        tree = ET.parse(self.xml_file)
        root = tree.getroot()
        
        channel = root.find('channel')
        if channel is None:
            raise ValueError("Invalid WordPress export: no channel element")
        
        posts_by_title = {}
        duplicates_removed = 0
        
        for item in channel.findall('item'):
            category_elem = item.find('category[@domain="category"]')
            if category_elem is not None:
                category_slug = category_elem.get('nicename', '')
                
                if category_filter and category_slug != category_filter:
                    continue
                
                post = self.parse_item(item)
                if post:
                    title = post['title']
                    
                    if title in posts_by_title:
                        existing_content_len = len(str(posts_by_title[title].get('content', '')))
                        new_content_len = len(str(post.get('content', '')))
                        
                        if new_content_len > existing_content_len:
                            posts_by_title[title] = post
                        duplicates_removed += 1
                    else:
                        posts_by_title[title] = post
        
        if duplicates_removed > 0:
            print(f"Removed {duplicates_removed} duplicate posts (keeping longest version of each)")
        
        return list(posts_by_title.values())
    
    def export_to_ndjson(self, documents: List[Dict[str, Any]], filename: str):
        """Export documents to NDJSON format"""
        filepath = self.output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            for doc in documents:
                f.write(json.dumps(doc, ensure_ascii=False) + '\n')
        
        print(f"Exported {len(documents)} documents to {filepath}")
        return filepath
    
    def convert(self, category_filter: str = 'news'):
        """Main conversion process"""
        
        print(f"Parsing WordPress XML: {self.xml_file}")
        print(f"Filtering category: {category_filter}")
        
        posts = self.parse_wordpress_xml(category_filter)
        
        print(f"\nFound {len(posts)} posts")
        print(f"Found {len(self.categories)} categories")
        print(f"Found {len(self.authors)} authors")
        
        all_documents = []
        
        all_documents.extend(self.categories.values())
        all_documents.extend(self.authors.values())
        all_documents.extend(posts)
        
        output_file = self.export_to_ndjson(all_documents, f'{category_filter}_import.ndjson')
        
        summary = {
            'total_documents': len(all_documents),
            'categories': len(self.categories),
            'authors': len(self.authors),
            'posts': len(posts),
            'category_filter': category_filter,
            'output_file': str(output_file)
        }
        
        summary_file = self.output_dir / f'{category_filter}_summary.json'
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\nSummary saved to {summary_file}")
        print(f"\n✓ Conversion complete!")
        print(f"\nTo import into Sanity, run:")
        print(f"  sanity dataset import {output_file} production --replace")
        
        return summary


if __name__ == '__main__':
    converter = WordPressToSanity('vigoleis_wordpress.xml')
    converter.convert(category_filter='news')
