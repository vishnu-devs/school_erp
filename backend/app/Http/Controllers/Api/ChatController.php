<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get unique conversation partners
        $partnerIds = ChatMessage::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->map(function ($msg) use ($userId) {
                return $msg->sender_id === $userId ? $msg->receiver_id : $msg->sender_id;
            })
            ->unique()
            ->values();

        $partners = User::whereIn('id', $partnerIds)
            ->select('id', 'name', 'email', 'profile_image')
            ->get()
            ->map(function ($partner) use ($userId) {
                $partner->last_message = ChatMessage::where(function ($q) use ($userId, $partner) {
                    $q->where('sender_id', $userId)->where('receiver_id', $partner->id);
                })->orWhere(function ($q) use ($userId, $partner) {
                    $q->where('sender_id', $partner->id)->where('receiver_id', $userId);
                })->orderBy('created_at', 'desc')->first();

                $partner->unread_count = ChatMessage::where('sender_id', $partner->id)
                    ->where('receiver_id', $userId)
                    ->where('is_read', 0)
                    ->count();

                return $partner;
            });

        return response()->json($partners);
    }

    public function messages(Request $request, $partnerId)
    {
        $userId = $request->user()->id;

        $messages = ChatMessage::where(function ($q) use ($userId, $partnerId) {
            $q->where('sender_id', $userId)->where('receiver_id', $partnerId);
        })->orWhere(function ($q) use ($userId, $partnerId) {
            $q->where('sender_id', $partnerId)->where('receiver_id', $userId);
        })->orderBy('created_at', 'asc')->paginate(50);

        // Mark received messages as read
        ChatMessage::where('sender_id', $partnerId)
            ->where('receiver_id', $userId)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'required_without:attachment|string',
            'attachment'   => 'nullable|file|max:5120|mimes:jpg,png,pdf,docx',
        ]);

        $data = [
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message'     => $request->message ?? '',
        ];

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')->store('chat', 'public');
        }

        $message = ChatMessage::create($data);
        return response()->json($message->load(['sender', 'receiver']), 201);
    }
}
