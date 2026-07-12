<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the broadcast channels your application
| supports. The given channel authorization callbacks are used to check
| if an authenticated user can listen to the channel.
|
*/

/**
 * Public channel for disaster reports
 * Anyone can subscribe to receive new report notifications
 */
Broadcast::channel('laporan', function () {
    return true;
});

/**
 * Admin-only channel for real-time report management
 * Only authenticated admins can receive these updates
 */
Broadcast::channel('admin.laporan', function ($user) {
    return $user && $user->is_admin;
});

/**
 * Private channel for tracking individual reports
 * Allows reporters to receive status updates for their specific report
 */
Broadcast::channel('laporan.{id}', function ($user, $id) {
    // Public can access their own report tracking
    // For more security, implement token-based authentication
    return true;
});

/**
 * Channel for real-time statistics updates
 * Public channel for dashboard statistics
 */
Broadcast::channel('statistics', function () {
    return true;
});
