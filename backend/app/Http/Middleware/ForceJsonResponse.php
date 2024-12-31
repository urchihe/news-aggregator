<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ensure response is a JSON response if not already
        if (!$response->headers->contains('Content-Type', 'application/json')) {
            // Handle View responses
            if ($response instanceof \Illuminate\View\View) {
                $response = response()->json($response->getData());
            }
            // Handle string responses (e.g., plain text or other formats)
            elseif (is_string($response->getContent())) {
                $response = $this->convertStringToJson($response);
            }
            // Handle other response types
            else {
                $response = response()->json($response->getContent());
            }

            // Set the content type to JSON
            $response->headers->set('Content-Type', 'application/json');
        }

        return $response;
    }


    private function convertStringToJson(Response $response): JsonResponse
    {
        try {
            $decodedContent = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);
            return response()->json($decodedContent);
        } catch (\JsonException $e) {
            return response()->json(['message' => $response->getContent()]);
        }
    }
}
