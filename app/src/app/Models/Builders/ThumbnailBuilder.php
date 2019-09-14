<?php

namespace App\Models\Builders;

use Illuminate\Database\Eloquent\Builder;

/**
 * @package App\Models\Builders
 */
class ThumbnailBuilder extends Builder
{
    /**
     * @return $this
     */
    public function whereHasNoPhotos()
    {
        return $this->doesntHave('photos');
    }
}
