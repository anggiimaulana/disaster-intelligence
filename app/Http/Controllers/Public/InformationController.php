<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\EarlyWarning;
use App\Models\Faq;
use App\Models\Kesiapsiagaan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InformationController extends Controller
{
    public function index()
    {
        return Inertia::render('public/information/index', [
            'title' => 'Informasi Bencana',
        ]);
    }

    public function alerts()
    {
        $alerts = EarlyWarning::with('jenisBencana')->orderBy('created_at', 'desc')->get()->map(function ($alert) {
            $disasterName = $alert->jenisBencana?->nama ?? 'LAINNYA';

            return [
                'id' => $alert->id,
                'title' => 'Peringatan Dini: '.$disasterName,
                'disasterType' => strtoupper($disasterName),
                'riskLevel' => strtoupper($alert->level_warning),
                'status' => strtoupper($alert->status),
                'district' => $alert->wilayah ?? '-',
                'village' => '',
                'latitude' => 0,
                'longitude' => 0,
                'summary' => $alert->pesan ?? '',
                'issuedAt' => $alert->created_at->toIso8601String(),
                'updatedAt' => $alert->updated_at->toIso8601String(),
                'isSimulation' => false,
                'recommendedAction' => 'Tetap waspada dan ikuti arahan petugas setempat.',
            ];
        });

        return Inertia::render('public/information/alerts', [
            'title' => 'Peringatan Dini',
            'alerts' => $alerts,
        ]);
    }

    public function news()
    {
        $news = Berita::orderBy('created_at', 'desc')->get()->map(function ($n) {
            return [
                'id' => $n->id,
                'slug' => $n->slug ?? \Str::slug($n->judul ?? $n->title),
                'category' => $n->kategori ?? 'news',
                'title' => $n->judul ?? $n->title,
                'excerpt' => strip_tags(substr($n->konten ?? $n->content, 0, 150)).'...',
                'imageUrl' => $n->thumbnail ?? 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=600&q=80',
                'publishedAt' => $n->published_at ? $n->published_at->toIso8601String() : $n->created_at->toIso8601String(),
                'tags' => $n->seo_keywords ? explode(',', $n->seo_keywords) : ['informasi'],
            ];
        });

        return Inertia::render('public/information/news', [
            'title' => 'Berita & Informasi',
            'articles' => $news,
        ]);
    }

    public function newsShow(string $slug)
    {
        // Try to match slug, or if missing fallback to something
        $n = Berita::where('slug', $slug)->firstOrFail();

        $article = [
            'id' => $n->id,
            'slug' => $n->slug,
            'category' => $n->kategori ?? 'news',
            'title' => $n->judul ?? $n->title,
            'content' => $n->konten ?? $n->content,
            'imageUrl' => $n->thumbnail ?? 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=600&q=80',
            'publishedAt' => $n->published_at ? $n->published_at->toIso8601String() : $n->created_at->toIso8601String(),
            'tags' => $n->seo_keywords ? explode(',', $n->seo_keywords) : ['informasi'],
        ];

        $relatedNews = Berita::where('id', '!=', $n->id)->orderBy('created_at', 'desc')->take(3)->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'slug' => $r->slug,
                'category' => $r->kategori ?? 'news',
                'title' => $r->judul ?? $r->title,
                'excerpt' => strip_tags(substr($r->konten ?? $r->content, 0, 150)).'...',
                'imageUrl' => $r->thumbnail ?? 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=600&q=80',
                'publishedAt' => $r->published_at ? $r->published_at->toIso8601String() : $r->created_at->toIso8601String(),
            ];
        });

        return Inertia::render('public/information/news-show', [
            'title' => 'Detail Berita',
            'article' => $article,
            'relatedArticles' => $relatedNews,
        ]);
    }

    public function preparedness()
    {
        $guides = Kesiapsiagaan::orderBy('created_at', 'desc')->get()->map(function ($g) {
            return [
                'id' => $g->id,
                'slug' => $g->slug ?? \Str::slug($g->judul ?? $g->title),
                'title' => $g->judul ?? $g->title,
                'description' => strip_tags(substr($g->konten ?? $g->content, 0, 150)),
                'content' => $g->konten ?? $g->content,
                'icon' => 'AlertTriangle',
                'accent' => 'blue',
            ];
        });

        return Inertia::render('public/information/preparedness', [
            'title' => 'Kesiapsiagaan',
            'guides' => $guides,
        ]);
    }

    public function faq()
    {
        $faqsQuery = Faq::query();
        if (\Schema::hasColumn('faqs', 'is_active')) {
            $faqsQuery->where('is_active', true);
        }
        if (\Schema::hasColumn('faqs', 'sort_order')) {
            $faqsQuery->orderBy('sort_order', 'asc');
        } else {
            $faqsQuery->orderBy('created_at', 'asc');
        }

        $faqs = $faqsQuery->get()->map(function ($f) {
            return [
                'id' => $f->id,
                'question' => $f->pertanyaan ?? $f->question,
                'answer' => $f->jawaban ?? $f->answer,
                'category' => $f->kategori ?? 'umum',
            ];
        });

        return Inertia::render('public/information/faq', [
            'title' => 'FAQ',
            'faqs' => $faqs,
        ]);
    }
}
