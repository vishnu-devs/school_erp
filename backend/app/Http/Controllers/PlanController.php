<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        return response()->json(Plan::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_students' => 'nullable|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $plan = Plan::create($request->all());

        return response()->json(['message' => 'Plan created successfully', 'plan' => $plan]);
    }

    public function update(Request $request, Plan $plan)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_days' => 'sometimes|required|integer|min:1',
            'max_students' => 'nullable|integer|min:1',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $plan->update($request->all());

        return response()->json(['message' => 'Plan updated successfully', 'plan' => $plan]);
    }

    public function destroy(Plan $plan)
    {
        // Typically plans shouldn't be hard deleted if they have subscriptions
        // Instead we can just make them inactive.
        $plan->update(['is_active' => false]);
        return response()->json(['message' => 'Plan deactivated successfully']);
    }
}
