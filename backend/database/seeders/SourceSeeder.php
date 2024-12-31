<?php

namespace Database\Seeders;

use App\Models\Source;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = config('news_source');

        // Iterate and insert into the database
        foreach ($sources as $name => $details) {
            Source::updateOrCreate(
                ['name' => ucfirst(str_replace('_', ' ', $name))],
                ['api_url' => $details['url']]
            );
        }
    }
}
