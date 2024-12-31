<?php

return [
    "news_api" => [
        'url' => env("NEWS_API_URL"),
        'key' => env("NEWS_API_KEY")
    ],
    "bbc" => [
        'url' => env("BBC_API_URL"),
        'key' => env("BBC_API_KEY")
    ],
    "new_york_times" => [
        'url' => env("NEW_YORK_API_URL"),
        'key' => env("NEW_YORK_API_KEY")
    ],
    "the_guardian" => [
        'url' => env("THE_GUARDIAN_API_URL"),
        'key' => env("THE_GUARDIAN_API_KEY"),
        'keys' => [
            env("THE_GUARDIAN_API_KEY_2"),
            env("THE_GUARDIAN_API_KEY_3"),
            env("THE_GUARDIAN_API_KEY_4")
        ]
    ]
];
