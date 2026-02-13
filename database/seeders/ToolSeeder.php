<?php

namespace Database\Seeders;

use App\Models\Tool;
use App\Models\ToolImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        ToolImage::truncate();
        Tool::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        
        $users = User::where('is_admin', false)->pluck('id')->toArray();
        if (empty($users)) {
            $users = [User::first()->id];
        }

        $toolNames = [
            'Power Drill', 'Electric Saw', 'Jackhammer', 'Concrete Mixer', 'Lawn Mower',
            'Pressure Washer', 'Air Compressor', 'Generator 5KW', 'Extension Ladder', 'Paint Sprayer',
            'Rotary Hammer', 'Angle Grinder', 'Circular Saw', 'Mitre Saw', 'Table Saw',
            'Oscillating Multi-Tool', 'Belt Sander', 'Orbital Sander', 'Router', 'Planer',
            'Tile Cutter', 'Demolition Hammer', 'Drain Snake', 'Welding Machine', 'Floor Buffer',
            'Carpet Cleaner', 'Industrial Vacuum', 'Dehumidifier', 'Portable AC', 'Chain Saw',
            'Hedge Trimmer', 'Leaf Blower', 'Earth Auger', 'Trench Digger', 'Plate Compactor',
            'Submersible Pump', 'Laser Level', 'Theodolite', 'Infrared Camera', 'Metal Detector',
            'Concrete Vibrator', 'Pipe Threader', 'Bolt Cutter', 'Hydraulic Jack', 'Engine Hoist',
            'Torque Wrench', 'Stud Finder', 'Moisture Meter', 'Sound Level Meter', 'Electric Tiller'
        ];

        $categories = ['Tools & Hardware', 'Home & Lifestyle', 'Electronics', 'Sports & Outdoors', 'Automotive', 'Garden & Patio'];

        foreach ($toolNames as $index => $name) {
            $tool = Tool::create([
                'user_id' => $users[array_rand($users)],
                'name' => $name,
                'slug' => Str::slug($name) . '-' . time() . '-' . $index,
                'category' => $categories[array_rand($categories)],
                'description' => 'This is a high-quality ' . $name . ' available for rent. Perfect for your DIY projects or professional construction needs.',
                'price_per_day' => rand(15, 120),
                'user_earning' => 0,
                'quantity' => rand(1, 5),
                'available_from' => now(),
                'available_to' => now()->addMonths(6),
                'location_address' => 'Dhaka, Bangladesh',
                'lat' => 23.8103 + (rand(-100, 100) / 1000),
                'lng' => 90.4125 + (rand(-100, 100) / 1000),
                'status' => 'active',
            ]);

            $tool->user_earning = $tool->calculateEarning($tool->price_per_day);
            $tool->save();

            // Use LoremFlickr with a unique lock for better image variety
            $keywords = strtolower(str_replace(' ', ',', $name));
            $imageUrl = "https://loremflickr.com/800/600/tools,{$keywords}?lock=" . $index;
            
            ToolImage::create([
                'tool_id' => $tool->id,
                'image_path' => $imageUrl,
                'image_name' => $name,
                'image_extension' => 'jpg',
                'image_size' => '500KB',
            ]);

            // Add a second variations image
            if (rand(0, 1)) {
                ToolImage::create([
                    'tool_id' => $tool->id,
                    'image_path' => "https://loremflickr.com/800/600/construction,equipment?lock=" . rand(1, 1000),
                    'image_name' => $name . ' - Detail',
                    'image_extension' => 'jpg',
                    'image_size' => '500KB',
                ]);
            }
        }
    }
}
