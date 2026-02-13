<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Tool extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'name',
        'slug',
        'description',
        'price_per_day',
        'user_earning',
        'quantity',
        'available_from',
        'available_to',
        'location_address',
        'lat',
        'lng',
        'status',
    ];

    /**
     * Data Casting
     */
    protected $casts = [
        'price_per_day' => 'decimal:2',
        'user_earning' => 'decimal:2',
        'quantity' => 'integer',
        'available_from' => 'date',
        'available_to' => 'date',
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
    ];

    /**
     * Boot Logic for Slug
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($tool) {
            $tool->slug = Str::slug($tool->name).'-'.time();
        });
    }

    protected $appends = ['first_image_url'];

    public function images(): HasMany
    {
        return $this->hasMany(ToolImage::class);
    }

    // Accessor: tool.first_image_url return
    public function getFirstImageUrlAttribute()
    {
        $image = $this->images->first();

        if ($image) {
            return $image->url;
        }

        return 'https://images.unsplash.com/photo-1592323860163-000c28340d04?q=80&w=600';
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // --- Relationships ---

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(Specification::class);
    }

    public function guidelines(): HasMany
    {
        return $this->hasMany(Guideline::class);
    }

    public function calculateEarning($price)
    {
        return $price * 0.92;
    }

    // --- Scopes (Query Helpers) ---

    public function scopeAvailable($query)
    {
        return $query->where('available_to', '>=', now());
    }
}
