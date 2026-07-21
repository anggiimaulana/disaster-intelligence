<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $users = User::with('roles')->orderBy('name')->get();
        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'users' => $users,
            'permissions' => $permissions,
        ]);
    }

    public function storeRole(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return back()->with('success', 'Role berhasil dibuat.');
    }

    public function updateRole(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,'.$role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return back()->with('success', 'Role berhasil diperbarui.');
    }

    public function destroyRole(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role berhasil dihapus.');
    }

    public function assignRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->syncRoles([$request->role]);

        return back()->with('success', 'Role berhasil di-assign ke user.');
    }

    public function removeRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->syncRoles([]);

        return back()->with('success', 'Role berhasil dihapus dari user.');
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            'role' => 'nullable|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => true,
        ]);

        if (! empty($validated['role'])) {
            $user->assignRole($validated['role']);
        }

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function destroyUser(User $user)
    {
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
