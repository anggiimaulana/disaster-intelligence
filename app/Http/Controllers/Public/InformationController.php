<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class InformationController extends Controller
{
    public function index()
    {
        return Inertia::render('public/information/index', [
            'title' => 'Informasi Bencana',
            'isSimulation' => true,
        ]);
    }

    public function alerts()
    {
        return Inertia::render('public/information/alerts', [
            'title' => 'Peringatan Dini',
            'isSimulation' => true,
        ]);
    }

    public function news()
    {
        return Inertia::render('public/information/news', [
            'title' => 'Berita & Informasi',
            'isSimulation' => true,
        ]);
    }

    public function newsShow(string $slug)
    {
        return Inertia::render('public/information/news-show', [
            'title' => 'Detail Berita',
            'isSimulation' => true,
            'slug' => $slug,
        ]);
    }

    public function preparedness()
    {
        return Inertia::render('public/information/preparedness', [
            'title' => 'Kesiapsiagaan',
            'isSimulation' => true,
        ]);
    }

    public function faq()
    {
        return Inertia::render('public/information/faq', [
            'title' => 'FAQ',
            'isSimulation' => true,
        ]);
    }
}
