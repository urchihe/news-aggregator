<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Technology', 'Sports', 'Health', 'Politics', 'Entertainment',
            'Business', 'Science', 'Travel', 'World News', 'Education',
            'Lifestyle', 'Environment', 'Fashion', 'Food', 'Art',
            'Automobile', 'History', 'Music', 'Real Estate', 'Social Media',
            'Startups', 'Gaming', 'Books', 'Culture', 'Finance',
            'Weather', 'Crime', 'Religion', 'Economy', 'Opinion',
            'Law', 'Military', 'Space', 'Parenting', 'Wildlife',
            'Fitness', 'Medicine', 'Television', 'Theater', 'Photography',
            'DIY', 'Career', 'Philosophy', 'Relationships', 'Hobbies',
            'Celebrities', 'Local News', 'Investigative Journalism'
        ];

        // Loop through and create each category
        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category]);
        }
    }
}
