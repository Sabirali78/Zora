<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'latest-news' => ['en' => 'Latest News', 'ur' => 'تازہ ترین خبریں'],
            'pakistan' => ['en' => 'Pakistan', 'ur' => 'پاکستان'],
            'sports' => ['en' => 'Sports', 'ur' => 'کھیل'],
            'weather' => ['en' => 'Weather', 'ur' => 'موسم'],
            'politics' => ['en' => 'Politics', 'ur' => 'سیاست'],
            'technology' => ['en' => 'Technology', 'ur' => 'ٹیکنالوجی'],
            'health' => ['en' => 'Health', 'ur' => 'صحت'],
            'business' => ['en' => 'Business', 'ur' => 'کاروبار'],
            'science' => ['en' => 'Science', 'ur' => 'سائنس'],
            'entertainment' => ['en' => 'Entertainment', 'ur' => 'تفریح'],
            'environment' => ['en' => 'Environment', 'ur' => 'ماحولیات'],
            'education' => ['en' => 'Education', 'ur' => 'تعلیم'],
            'lifestyle' => ['en' => 'Lifestyle', 'ur' => 'طرز زندگی'],
            'arts-culture' => ['en' => 'Arts & Culture', 'ur' => 'فن و ثقافت'],
            'food' => ['en' => 'Food', 'ur' => 'کھانا'],
            'travel' => ['en' => 'Travel', 'ur' => 'سفر'],
            'fashion' => ['en' => 'Fashion', 'ur' => 'فیشن']
        ];

        foreach ($categories as $categoryKey => $categoryNames) {
            // Create English articles
            for ($i = 1; $i <= 4; $i++) {
                Article::create([
                    'title' => "English {$categoryNames['en']} Article {$i}",
                    'summary' => "This is a sample English article about {$categoryNames['en']}. Article number {$i} with interesting content.",
                    'content' => "This is the full content of English {$categoryNames['en']} Article {$i}. It contains detailed information about the topic and provides comprehensive coverage of the subject matter. The article is well-researched and provides valuable insights for readers interested in this category.",
                    'title_urdu' => null,
                    'summary_urdu' => null,
                    'content_urdu' => null,
                    'language' => 'en',
                    'category' => $categoryKey,
                    'region' => 'asia',
                    'country' => 'pakistan',
                    'type' => 'news',
                    'tags' => $categoryKey . ', english, sample',
                    'author' => 'Admin',
                    'is_featured' => $i === 1,
                    'is_trending' => $categoryKey === 'latest-news' && $i === 1,
                    'slug' => "english-{$categoryKey}-article-{$i}"
                ]);
            }

            // Create Urdu articles (only for some categories to test hiding functionality)
            if (in_array($categoryKey, ['pakistan', 'sports', 'weather', 'politics', 'latest-news'])) {
                for ($i = 1; $i <= 4; $i++) {
                    Article::create([
                        'title' => null,
                        'summary' => null,
                        'content' => null,
                        'title_urdu' => "اردو {$categoryNames['ur']} مضمون {$i}",
                        'summary_urdu' => "یہ {$categoryNames['ur']} کے بارے میں ایک نمونہ اردو مضمون ہے۔ مضمون نمبر {$i} دلچسپ مواد کے ساتھ۔",
                        'content_urdu' => "یہ اردو {$categoryNames['ur']} مضمون {$i} کا مکمل مواد ہے۔ اس میں موضوع کے بارے میں تفصیلی معلومات شامل ہیں اور موضوع کی جامع کوریج فراہم کرتا ہے۔ مضمون اچھی طرح تحقیق شدہ ہے اور اس زمرے میں دلچسپی رکھنے والے قارئین کے لیے قیمتی بصیرت فراہم کرتا ہے۔",
                        'language' => 'ur',
                        'category' => $categoryKey,
                        'region' => 'asia',
                        'country' => 'pakistan',
                        'type' => 'news',
                        'tags' => $categoryKey . ', urdu, sample',
                        'author' => 'Admin',
                        'is_featured' => $i === 1,
                        'is_trending' => $categoryKey === 'latest-news' && $i === 1,
                        'slug' => "urdu-{$categoryKey}-article-{$i}"
                    ]);
                }
            }
        }

        // Create some multi-language articles
        Article::create([
            'title' => 'Multi-language Technology Breakthrough',
            'summary' => 'A major breakthrough in technology that affects everyone.',
            'content' => 'This is a comprehensive article about a major technology breakthrough that has implications for everyone. The technology promises to revolutionize how we interact with digital devices.',
            'title_urdu' => 'ملٹی لینگویج ٹیکنالوجی میں اہم پیش رفت',
            'summary_urdu' => 'ٹیکنالوجی میں ایک بڑی پیش رفت جو سب کو متاثر کرتی ہے۔',
            'content_urdu' => 'یہ ایک جامع مضمون ہے جو ایک بڑی ٹیکنالوجی پیش رفت کے بارے میں ہے جس کے سب پر اثرات ہیں۔ یہ ٹیکنالوجی وعدہ کرتی ہے کہ یہ انقلاب لائے گی کہ ہم ڈیجیٹل آلات کے ساتھ کیسے تعامل کرتے ہیں۔',
            'language' => 'multi',
            'category' => 'technology',
            'region' => 'global',
            'country' => 'international',
            'type' => 'breaking',
            'tags' => 'technology, breakthrough, multi-language',
            'author' => 'Admin',
            'is_featured' => true,
            'is_trending' => false,
            'slug' => 'multi-language-technology-breakthrough'
        ]);
    }
} 