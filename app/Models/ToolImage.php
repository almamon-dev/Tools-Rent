<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolImage extends Model
{
    protected $table = 'tool_images';

    protected $fillable = [
        'tool_id', 'image_name', 'image_path', 'image_extension', 'image_size',
    ];

    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        // Jodi image_path null hoy ba empty hoy
        if (! $this->image_path) {
            return null;
        }
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        return asset('storage/'.$this->image_path);
    }
}
