<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportRoute;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    public function index()
    {
        return response()->json(TransportRoute::withCount('students')->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'route_name'     => 'required|string|max:255',
            'vehicle_number' => 'required|string|max:100',
            'driver_name'    => 'required|string|max:255',
            'driver_phone'   => 'required|string|max:20',
            'pickup_points'  => 'nullable|array',
        ]);

        $data = $request->all();
        $data['school_id'] = $request->user()->school_id;
        $route = TransportRoute::create($data);

        return response()->json($route, 201);
    }

    public function show(TransportRoute $transport)
    {
        return response()->json($transport->load('students.user'));
    }

    public function update(Request $request, TransportRoute $transport)
    {
        $request->validate([
            'route_name'     => 'sometimes|string|max:255',
            'vehicle_number' => 'sometimes|string|max:100',
            'driver_name'    => 'sometimes|string|max:255',
            'driver_phone'   => 'sometimes|string|max:20',
            'pickup_points'  => 'nullable|array',
        ]);

        $transport->update($request->all());
        return response()->json($transport);
    }

    public function destroy(TransportRoute $transport)
    {
        $transport->delete();
        return response()->json(['message' => 'Route deleted successfully']);
    }
}
