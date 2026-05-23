<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('public/about/index', [
            'title' => 'Tentang Kami',
            'isSimulation' => true,
        ]);
    }
}
