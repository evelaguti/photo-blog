<?php

namespace App\Services\Rss\Contracts;

use Lib\Rss\Contracts\Builder;

/**
 * @package App\Services\Rss\Contracts
 */
interface RssBuilder
{
    /**
     * Build the RSS feed.
     *
     * @return Builder
     */
    public function build(): Builder;
}
