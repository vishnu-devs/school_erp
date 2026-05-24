<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeCategory;
use Illuminate\Http\Request;

class FeeCategoryController extends Controller
{
    public function index()
    {
        return response()->json(FeeCategory::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'amount'        => 'required|numeric|min:0',
            'frequency'     => 'required|in:Monthly,Yearly',
        ]);

        $category = FeeCategory::create($request->all());
        return response()->json($category, 201);
    }

    public function show(FeeCategory $feeCategory)
    {
        return response()->json($feeCategory);
    }

    public function update(Request $request, FeeCategory $feeCategory)
    {
        $request->validate([
            'category_name' => 'sometimes|string|max:255',
            'amount'        => 'sometimes|numeric|min:0',
            'frequency'     => 'sometimes|in:Monthly,Yearly',
        ]);

        $feeCategory->update($request->all());
        return response()->json($feeCategory);
    }

    public function destroy(FeeCategory $feeCategory)
    {
        $feeCategory->delete();
        return response()->json(['message' => 'Fee category deleted']);
    }
}
