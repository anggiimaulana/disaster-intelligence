<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('public/contact/index', [
            'title' => 'Hubungi Kami',
            'isSimulation' => true,
        ]);
    }
}
