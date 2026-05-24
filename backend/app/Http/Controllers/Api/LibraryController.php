<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LibraryBook;
use App\Models\BookIssue;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    // ---- Books ----
    public function index(Request $request)
    {
        $query = LibraryBook::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('book_name', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_name' => 'required|string|max:255',
            'author'    => 'required|string|max:255',
            'isbn'      => 'nullable|string|max:50',
            'category'  => 'nullable|string|max:100',
            'quantity'  => 'required|integer|min:1',
        ]);

        $data = $request->all();
        $data['school_id'] = $request->user()->school_id;
        $data['available_quantity'] = $data['quantity'];

        $book = LibraryBook::create($data);
        return response()->json($book, 201);
    }

    public function show(LibraryBook $library)
    {
        return response()->json($library->load('issues.student.user'));
    }

    public function update(Request $request, LibraryBook $library)
    {
        $request->validate([
            'book_name' => 'sometimes|string|max:255',
            'author'    => 'sometimes|string|max:255',
            'quantity'  => 'sometimes|integer|min:0',
        ]);

        $library->update($request->all());
        return response()->json($library);
    }

    public function destroy(LibraryBook $library)
    {
        $library->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }

    // ---- Book Issues ----
    public function issues(Request $request)
    {
        $query = BookIssue::with(['book', 'student.user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('issue_date', 'desc')->paginate(20));
    }

    public function issueBook(Request $request)
    {
        $request->validate([
            'book_id'     => 'required|exists:library_books,id',
            'student_id'  => 'required|exists:students,id',
            'issue_date'  => 'required|date',
            'return_date' => 'required|date|after:issue_date',
        ]);

        $book = LibraryBook::findOrFail($request->book_id);

        if ($book->available_quantity <= 0) {
            return response()->json(['message' => 'Book not available'], 422);
        }

        $issue = BookIssue::create($request->all());
        $book->decrement('available_quantity');

        return response()->json($issue->load(['book', 'student.user']), 201);
    }

    public function returnBook(Request $request, BookIssue $bookIssue)
    {
        $request->validate([
            'fine' => 'nullable|numeric|min:0',
        ]);

        $bookIssue->update([
            'status'             => 'Returned',
            'actual_return_date' => now()->toDateString(),
            'fine'               => $request->fine ?? 0,
        ]);

        $bookIssue->book->increment('available_quantity');

        return response()->json(['message' => 'Book returned successfully', 'issue' => $bookIssue]);
    }
}
