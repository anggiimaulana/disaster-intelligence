<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('public/home/index', [
            'title' => 'Beranda',
            'isSimulation' => true,
        ]);
    }
}
