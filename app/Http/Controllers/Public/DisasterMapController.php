<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DisasterMapController extends Controller
{
    public function index()
    {
        return Inertia::render('public/disaster-map/index', [
            'title' => 'Peta Bencana',
            'isSimulation' => true,
        ]);
    }
}
